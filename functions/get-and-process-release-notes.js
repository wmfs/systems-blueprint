const { getStoriesByIteration, getEpics } = require('../shared/clubhouse-api')
const WORKFLOW_MAPPINGS = require('../shared/clubhouse-workflow-ids')

module.exports = function () {
  return async function getAndProcessReleaseNotes (env, event) {
    const registry = env.bootedServices.registry
    const token = registry.get('system_clubhouseToken')

    const READY_FOR_RELEASE_IDS = WORKFLOW_MAPPINGS
      .filter(workflow => workflow.state === 'Ready for Prod')
      .map(workflow => workflow.id)

    const epics = await getEpics(token)
    const stories = await getStoriesByIteration(token, event.iterationId)

    event.stories = stories
      .filter(story => READY_FOR_RELEASE_IDS.includes(story.workflow_state_id))
      .map(story => {
        const {
          id,
          name,
          description,
          story_type: storyType,
          epic_id: epicId,
          labels
        } = story

        const labelNames = labels.map(r => r.name)
        const epic = epics.find(e => e.id === epicId)

        let releaseNote = ''

        if (epic && epic.name) releaseNote += `${epic.name}: `

        releaseNote += description && description.includes('<!-- Release Note -->')
          ? `${description.split('<!-- Release Note -->')[1]} `
          : `${name} `

        releaseNote += `[ch${id}]`

        return { releaseNote, labelNames, storyType }
      })

    return event
  }
}
