const getExecutions = require('./get-executions')()

module.exports = function () {
  return async function userExecutionsInitData (env, event) {
    event.executions = {
      loading: false,
      pagination: {
        limit: 10,
        offset: 0,
        page: 1,
        totalPages: 0
      },
      params: {
        date: null,
        executionName: null,
        status: null,
        userId: event.userId,
        view: 'FILTER'
      },
      results: [],
      summary: {
        totalHits: 0
      }
    }

    const { results, totalHits } = await getExecutions(env, {
      view: 'FILTER',
      userId: event.userId,
      offset: 0,
      limit: 10
    })

    event.executions.results = results
    event.executions.summary.totalHits = totalHits

    return event
  }
}
