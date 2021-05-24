const axios = require('axios')
const WORKFLOW_MAPPINGS = require('../shared/clubhouse-workflow-ids')

module.exports = function () {
  return async function getAndProcessReleaseNotes (env, event) {
    const READY_FOR_RELEASE_IDS = WORKFLOW_MAPPINGS.filter(workflow => workflow.state === 'Ready for Prod').map(workflow => workflow.id)
    event.features = []
    event.bugs = []
    event.chores = []
    const registry = env.bootedServices.registry

    const { data } = await axios.get(
      `https://api.clubhouse.io/api/v3/iterations/${event.iterationId}/stories`,
      {
        headers: {
          'Clubhouse-Token': registry.get('system_clubhouseToken'),
          organization: 'wmfs'
        },
        params: {
          includes_description: true
        }
      }
    )

    data.forEach(story => {
      if (story.description && story.description.includes('<!-- Release Note -->')) story.releaseNote = `${story.description.split('<!-- Release Note -->')[1]} [ch${story.id}]`
      else story.releaseNote = `${story.name} [ch${story.id}]`
      if (READY_FOR_RELEASE_IDS.includes(story.workflow_state_id) && story.story_type === 'feature') event.features.push(story.releaseNote)
      else if (READY_FOR_RELEASE_IDS.includes(story.workflow_state_id) && story.story_type === 'bug') event.bugs.push(story.releaseNote)
      else if (READY_FOR_RELEASE_IDS.includes(story.workflow_state_id) && story.story_type === 'chore') event.chores.push(story.releaseNote)
    })

    return event
  }
}
