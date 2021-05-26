module.exports = function () {
  return async function getIterations (env, event) {
    const clubhouseApi = env.bootedServices.clubhouseApi

    const iterations = await clubhouseApi.getIterations()

    for (const iteration of iterations) {
      iteration.launches = [
        {
          title: 'View release notes',
          stateMachineName: 'system_releaseNotesGenerate_1_0',
          input: {
            iterationId: iteration.id,
            name: iteration.name,
            endDate: iteration.end_date
          }
        },
        {
          title: 'View progressed stories',
          stateMachineName: 'system_viewProgressedStories_1_0',
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
