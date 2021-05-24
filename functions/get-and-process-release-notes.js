const { getStoriesByIteration } = require('../shared/clubhouse-api')
const WORKFLOW_MAPPINGS = require('../shared/clubhouse-workflow-ids')

module.exports = function () {
  return async function getAndProcessReleaseNotes (env, event) {
    const registry = env.bootedServices.registry

    const READY_FOR_RELEASE_IDS = WORKFLOW_MAPPINGS
      .filter(workflow => workflow.state === 'Ready for Prod')
      .map(workflow => workflow.id)

    const data = await getStoriesByIteration(registry.get('system_clubhouseToken'), event.iterationId)

    event.features = []
    event.bugs = []
    event.chores = []

    data.forEach(story => {
      const {
        id,
        name,
        description,
        workflow_state_id: workflowStateId,
        story_type: storyType
      } = story

      const releaseNote = description && description.includes('<!-- Release Note -->')
        ? `${description.split('<!-- Release Note -->')[1]} [ch${id}]`
        : `${name} [ch${id}]`

      if (READY_FOR_RELEASE_IDS.includes(workflowStateId)) {
        if (storyType === 'feature') event.features.push(releaseNote)
        else if (storyType === 'bug') event.bugs.push(releaseNote)
        else if (storyType === 'chore') event.chores.push(releaseNote)
      }
    })

    return event
  }
}
