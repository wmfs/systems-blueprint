const WORKFLOW_MAPPINGS = require('../shared/clubhouse-workflow-ids')

module.exports = function () {
  return async function getAndProcessReleaseNotes (env, event) {
    const clubhouseApi = env.bootedServices.clubhouseApi

    const READY_FOR_RELEASE_IDS = WORKFLOW_MAPPINGS
      .filter(workflow => workflow.state === 'Ready for Prod')
      .map(workflow => workflow.id)

    const epics = await clubhouseApi.getEpics()
    const stories = await clubhouseApi.getIterationStories(event.iterationId)

    event.features = []
    event.bugs = []
    event.chores = []

    stories.forEach(story => {
      const {
        id,
        name,
        description,
        workflow_state_id: workflowStateId,
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

      if (READY_FOR_RELEASE_IDS.includes(workflowStateId)) {
        if (storyType === 'feature') event.features.push({ releaseNote, labelNames })
        else if (storyType === 'bug') event.bugs.push({ releaseNote, labelNames })
        else if (storyType === 'chore') event.chores.push({ releaseNote, labelNames })
      }
    })

    return event
  }
}
