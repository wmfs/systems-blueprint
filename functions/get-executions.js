module.exports = function () {
  return async function (env, event) {
    const client = env.bootedServices.storage.client

    const {
      offset = 0,
      limit = 10,
      view,
      executionName,
      date,
      userId,
      status,
      stateMachineName
    } = event

    const columns = [
      'state_machine_name',
      'execution_name',
      'current_state_name',
      'status',
      '_created_by',
      '_modified_by',
      '_modified'
    ]

    const select = `select ${columns.join(', ')} from tymly.execution`
    const selectCount = 'select count(*) from tymly.execution'
    const end = `order by _created desc limit ${limit} offset ${offset}`

    let results = []
    let totalHits = 0
    let query
    let totalHitsQuery

    if (view === 'ALL') {
      query = `${select} ${end};`
      totalHitsQuery = `${selectCount};`
    } else if (view === 'EXECUTION') {
      if (executionName) {
        query = `${select} where execution_name = '${executionName}' ${end};`
        totalHitsQuery = `${selectCount} where execution_name = '${executionName}';`
      }
    } else {
      const whereParts = []

      if (date) whereParts.push(`_created::date = '${date}'`)
      if (userId) whereParts.push(`execution_options::jsonb->>'userId' = '${userId}'`)
      if (status) whereParts.push(`status = '${status}'`)
      if (stateMachineName) whereParts.push(`state_machine_name = '${stateMachineName}'`)

      const where = `${whereParts.length > 0 ? 'WHERE ' : ''}${whereParts.join(' AND ')}`

      query = `${select} ${where} ${end};`
      totalHitsQuery = `${selectCount} ${where};`
    }

    if (query && totalHitsQuery) {
      const queryResult = await client.query(query)
      results = queryResult.rows.map(r => {
        r.launches = [{
          stateMachineName: 'system_viewExecution_1_0',
          title: 'View Execution',
          input: { execName: r.execution_name }
        }]
        return r
      })

      const totalHitsRes = await client.query(totalHitsQuery)
      totalHits = totalHitsRes.rows[0].count
    }

    return { results, totalHits }
  }
}
