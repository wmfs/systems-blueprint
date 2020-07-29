module.exports = function () {
  return async function (event, env) {
    const { offset = 0, limit = 10, status, createdBy, createdAt } = event

    const client = env.bootedServices.storage.client

    const whereParts = []

    if (['SUCCEEDED', 'FAILED'].includes(status)) {
      whereParts.push(`status = '${status}'`)
    }

    if (createdBy && createdBy.trim().length > 0) {
      whereParts.push(`upper(_created_by) = upper('${createdBy}')`)
    }

    if (createdAt) {
      whereParts.push(`_created >= '${createdAt.split('T')[0]}'::date AND _created < ('${createdAt.split('T')[0]}'::date + '1 day'::interval)`)
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : ''

    const totalHitsRes = await client.query(`SELECT COUNT(*) FROM os_places.address_lookup_receipts ${whereClause};`)
    const res = await client.query(`SELECT * FROM os_places.address_lookup_receipts ${whereClause} ORDER BY _modified DESC LIMIT ${limit} OFFSET ${offset};`)

    const results = []

    for (const row of res.rows) {
      row.launches = [{
        title: 'View',
        stateMachineName: 'system_viewOsAddressLookup_1_0',
        input: { id: row.id }
      }]

      results.push(row)
    }

    return { results, totalHits: totalHitsRes.rows[0].count }
  }
}
