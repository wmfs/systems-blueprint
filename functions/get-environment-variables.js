const TYMLY_VARS = [
  'TYMLY_CERTIFICATE_PATH',
  'TYMLY_AUTH_AUDIENCE',
  'TYMLY_SERVER_PORT',
  'TYMLY_PLUGINS_PATH',
  'TYMLY_BLUEPRINTS_PATH',
  'SOLR_PORT',
  'SOLR_PATH',
  'TYMLY_ADMIN_USERID',
  'TYMLY_ADMIN_ROLES',
  'SOLR_HOST',
  'SOLR_URL',
  'TYMLY_NIC_AUTH0_DOMAIN',
  'TYMLY_NIC_AUTH0_CLIENT_ID',
  'TYMLY_NIC_AUTH0_CLIENT_SECRET',
  'PG_CONNECTION_STRING',
  'SHAREPOINT_URL',
  'SHAREPOINT_USERNAME',
  'SHAREPOINT_PASSWORD',
  'GOV_UK_NOTIFY_API_KEY_SAFE_AND_WELL',
  'TYMLY_EXCLUDED_PLUGIN_NAMES',
  'VISION_EXPORT_DIRECTORY',
  'GOV_UK_NOTIFY_API_KEY_TEXT_MESSAGING',
  'DW_PG_CONNECTION_STRING',
  'OS_PLACES_API_KEY'
].sort()

module.exports = function () {
  return async function getEnvironmentVariables (event) {
    event.envVars = Object
      .entries(process.env)
      .filter(([title]) => TYMLY_VARS.includes(title))
      .map(([title, value]) => { return { title, value } })
    return event
  }
}
