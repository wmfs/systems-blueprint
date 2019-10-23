module.exports = function () {
  return async function (env, event) {
    const client = env.bootedServices.storage.client

    const select = `select state_machine_name, execution_name, current_state_name, status, _modified_by, _modified from tymly.execution`

    const queries = {
      'MOST_RECENT': `${select} order by _created desc limit 30`,
      'USER': `${select} where execution_options::jsonb->>'userId' = '${event.userId}' order by _created desc limit 50`,
      'DATE': `${select} where _created::date = '${event.date}' order by _created desc`,
      'STATUS': `${select} where status = '${event.status}' order by _created desc limit 50`,
      'EXECUTION': `${select} where execution_name = '${event.executionName}'`
    }

    let results = []

    if (hasParams(event)) {
      const query = queries[event.view]
      const queryResult = await client.query(query)
      results = queryResult.rows.map(r => {
        r.launches = [{
          stateMachineName: 'system_viewExecution_1_0',
          title: 'View Execution',
          input: { execName: r.execution_name }
        }]
        return r
      })
    }

    return { results }
  }
}

function hasParams (event) {
  if (event.view === 'MOST_RECENT') return true
  if (event.view === 'USER') return !!event.userId
  if (event.view === 'DATE') return !!event.date
  if (event.view === 'STATUS') return !!event.status
  if (event.view === 'EXECUTION') return !!event.executionName
}
