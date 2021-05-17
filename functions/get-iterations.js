const axios = require('axios')

module.exports = function () {
  return async function getIterations (event) {
    const { data } = await axios.get(
      'https://api.clubhouse.io/api/v3/iterations',
      {
        headers: {
          'Clubhouse-Token': process.env.CLUBHOUSE_TOKEN,
          organization: 'wmfs'
        }
      }
    )

    for (const iteration of data) {
      iteration.launches = [
        {
          title: 'Release Notes',
          stateMachineName: 'system_releaseNotesGenerate_1_0',
          input: {
            iterationId: iteration.id
          }
        }
      ]
    }

    // TODO: sort data by date
    event.iterations = data

    return event
  }
}
