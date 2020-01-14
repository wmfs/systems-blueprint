module.exports = function () {
  return async function (event, env) {
    if (!event.offset) event.offset = 0 // todo: fix this, why is it null?

    const { offset, limit } = event

    const client = env.bootedServices.storage.client

    const res = await client.query(`SELECT * FROM tymly.gov_uk_notifications ORDER BY _modified DESC LIMIT ${limit} OFFSET ${offset};`)

    const results = []

    for (const row of res.rows) {
      row.launches = [{
        title: 'View',
        stateMachineName: 'system_viewGovUkNotification_1_0',
        input: { id: row.id }
      }]

      results.push(row)
    }

    return { results }
  }
}
