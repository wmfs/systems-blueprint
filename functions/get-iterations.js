const { getIterations: getClubhouseIterations } = require('../shared/clubhouse-api')

module.exports = function () {
  return async function getIterations (env, event) {
    const registry = env.bootedServices.registry

    const iterations = await getClubhouseIterations(registry.get('system_clubhouseToken'))

    for (const iteration of iterations) {
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

    event.iterations = iterations.sort((a, b) => new Date(b.end_date) - new Date(a.end_date))

    return event
  }
}
