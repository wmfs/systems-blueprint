module.exports = function getClientMetaDataStats () {
  return async function (env, event) {
    const client = env.bootedServices.storage.client

    const { rows } = await client.query(`select
    count(*) as count,
    platform->>'name' as name,
    platform->>'versionNumber' as version,
    platform->>'desktop' as desktop
    from tymly.client_meta_data
    group by name, version, desktop
    order by count(*) desc`)

    event.clientMetaData = rows
    return event
  }
}
