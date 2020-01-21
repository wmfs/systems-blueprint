module.exports = function () {
  return async function (event, env) {
    if (!event.offset) event.offset = 0 // todo: fix this, why is it null?

    const { offset, limit, blueprint, template, createdBy, createdAt } = event

    const client = env.bootedServices.storage.client

    const whereParts = []

    if (blueprint && blueprint.trim().length > 0) {
      whereParts.push(`blueprint = '${blueprint}'`)

      if (template && template.trim().length > 0) {
        whereParts.push(`template_name = '${template}'`)
      }
    }

    if (createdBy && createdBy.trim().length > 0) {
      whereParts.push(`upper(_created_by) = upper('${createdBy}')`)
    }

    if (createdAt) {
      whereParts.push(`_created >= '${createdAt.split('T')[0]}'::date AND _created < ('${createdAt.split('T')[0]}'::date + '1 day'::interval)`)
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : ''

    const totalHitsRes = await client.query(`SELECT COUNT(*) FROM tymly.gov_uk_notifications ${whereClause};`)
    const res = await client.query(`SELECT * FROM tymly.gov_uk_notifications ${whereClause} ORDER BY _modified DESC LIMIT ${limit} OFFSET ${offset};`)

    const results = []

    for (const row of res.rows) {
      row.launches = [{
        title: 'View',
        stateMachineName: 'system_viewGovUkNotification_1_0',
        input: { id: row.id }
      }]

      results.push(row)
    }

    return { results, totalHits: totalHitsRes.rows[0].count }
  }
}
