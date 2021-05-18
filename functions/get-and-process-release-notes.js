const axios = require('axios')
const WORKFLOW_MAPPINGS = require('../shared/clubhouse-workflow-ids')

module.exports = function () {
  return async function getAndProcessReleaseNotes (event) {
    const READY_FOR_RELEASE_IDS = WORKFLOW_MAPPINGS.filter(workflow => workflow.state === 'In UAT' || workflow.state === 'Ready for Prod').map(workflow => workflow.id)

    const { data } = await axios.get(
      `https://api.clubhouse.io/api/v3/iterations/${event.iterationId}/stories`,
      {
        headers: {
          'Clubhouse-Token': process.env.CLUBHOUSE_TOKEN,
          organization: 'wmfs'
        }
      }
    )

    const stories = data.filter(story => READY_FOR_RELEASE_IDS.includes(story.workflow_state_id))

    event.stories = stories

    return event
  }
}
