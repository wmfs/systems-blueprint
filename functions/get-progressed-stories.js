const workflowIds = require('../shared/clubhouse-workflow-ids')
const inProgressStates = ['In Dev', 'Code Review', 'In UAT', 'Ready for Prod', 'Done']

module.exports = function () {
  return async function getProgressedStories (env, event) {
    const ch = env.bootedServices.clubhouseApi

    const { iterationId } = event
    const stories = await ch.getIterationStories(iterationId)

    const progressedStories = stories
      .filter(s => {
        const workflowState = workflowIds.find(w => w.id === s.workflow_state_id)
        return workflowState && inProgressStates.includes(workflowState.state)
      })

    const formattedStories = []

    for (const story of progressedStories) {
      const {
        id: storyId,
        epic_id: epicId,
        owner_ids: ownerIds,
        name: storyTitle
      } = story

      const owners = []

      for (const ownerId of ownerIds) {
        const owner = await ch.getMemberById(ownerId)

        if (owner && owner.profile && owner.profile.name) {
          owners.push(owner.profile.name)
        }
      }

      const wholeEpic = await ch.getEpic(epicId)
      const epic = wholeEpic && wholeEpic.name

      formattedStories.push({ storyId, epic, storyTitle, owners })
    }

    const storiesByOwner = {}

    for (const story of formattedStories) {
      const { storyId, epic, storyTitle, owners } = story

      for (const o of owners) {
        if (!storiesByOwner[o]) storiesByOwner[o] = { storyCount: 0, stories: [] }

        storiesByOwner[o].storyCount++
        storiesByOwner[o].stories.push({ storyId, epic, storyTitle })
      }
    }

    event.storiesByOwner = storiesByOwner
    event.formattedStories = formattedStories

    return event
  }
}
