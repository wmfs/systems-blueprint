const { getIterations: getClubhouseIterations } = require('../shared/clubhouse-api')

module.exports = function () {
  return async function getIterations (env, event) {
    const registry = env.bootedServices.registry

    const data = await getClubhouseIterations(registry.get('system_clubhouseToken'))

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
