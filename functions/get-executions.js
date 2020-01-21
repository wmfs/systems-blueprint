module.exports = function () {
  return async function (env, event) {
    const client = env.bootedServices.storage.client

    const offset = event.offset || 0
    const limit = event.limit || 10

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
    const end = `order by _created desc limit ${limit} offset ${offset}`

    const wheres = {
      'ALL': ``,
      'USER': `where execution_options::jsonb->>'userId' = '${event.userId}'`,
      'DATE': `where _created::date = '${event.date}'`,
      'STATUS': `where status = '${event.status}'`,
      'EXECUTION': `where execution_name = '${event.executionName}'`
    }

    let results = []
    let totalHits = 0

    if (hasParams(event)) {
      const query = `${select} ${wheres[event.view]} ${end};`

      const queryResult = await client.query(query)
      results = queryResult.rows.map(r => {
        r.launches = [{
          stateMachineName: 'system_viewExecution_1_0',
          title: 'View Execution',
          input: { execName: r.execution_name }
        }]
        return r
      })

      const totalHitsRes = await client.query(`select count(*) from tymly.execution ${wheres[event.view]};`)
      totalHits = totalHitsRes.rows[0].count
    }

    return { results, totalHits }
  }
}

function hasParams (event) {
  if (event.view === 'ALL') return true
  if (event.view === 'USER') return !!event.userId
  if (event.view === 'DATE') return !!event.date
  if (event.view === 'STATUS') return !!event.status
  if (event.view === 'EXECUTION') return !!event.executionName
}
