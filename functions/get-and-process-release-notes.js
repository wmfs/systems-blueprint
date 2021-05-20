const axios = require('axios')
const WORKFLOW_MAPPINGS = require('../shared/clubhouse-workflow-ids')

module.exports = function () {
  return async function getAndProcessReleaseNotes (event) {
    const READY_FOR_RELEASE_IDS = WORKFLOW_MAPPINGS.filter(workflow => workflow.state === 'Ready for Prod').map(workflow => workflow.id)
    event.features = []
    event.bugs = []
    event.chores = []

    const { data } = await axios.get(
      `https://api.clubhouse.io/api/v3/iterations/${event.iterationId}/stories`,
      {
        headers: {
          'Clubhouse-Token': process.env.CLUBHOUSE_TOKEN,
          organization: 'wmfs'
        }
      }
    )

    data.forEach(story => {
      if (READY_FOR_RELEASE_IDS.includes(story.workflow_state_id) && story.story_type === 'feature') event.features.push(`${story.name} [ch${story.id}]`)
      else if (READY_FOR_RELEASE_IDS.includes(story.workflow_state_id) && story.story_type === 'bug') event.bugs.push(`${story.name} [ch${story.id}]`)
      else if (READY_FOR_RELEASE_IDS.includes(story.workflow_state_id) && story.story_type === 'chore') event.chores.push(`${story.name} [ch${story.id}]`)
    })

    return event
  }
}
