module.exports = function () {
  return async function (env, event) {
    const columns = [
      'current_state_name',
      '_modified_by',
      '_modified',
      'execution_name',
      'current_resource',
      'state_machine_name',
      'status',
      'ctx::text',
      'execution_options::text'
    ]
    const client = env.bootedServices.storage.client
    const res = await client.query(`select ${columns.join(', ')} from tymly.execution where execution_name = '${event.execName}'`)
    event.execution = res.rows[0]
    return event
  }
}
