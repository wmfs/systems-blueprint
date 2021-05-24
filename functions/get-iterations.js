const axios = require('axios')

module.exports = function () {
  return async function getIterations (env, event) {
    const registry = env.bootedServices.registry

    const { data } = await axios.get(
      'https://api.clubhouse.io/api/v3/iterations',
      {
        headers: {
          'Clubhouse-Token': registry.get('system_clubhouseToken'),
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
            iterationId: iteration.id,
            name: iteration.name,
            endDate: iteration.end_date
          }
        }
      ]
    }

    // TODO: sort data by date
    event.iterations = data

    return event
  }
}
