const axios = require('axios')

module.exports = function () {
  return async function getAndProcessReleaseNotes(event) {
    console.log('Checking @ ', `https://api.clubhouse.io/api/v3/iterations/${event.iterationId}/stories`)

    const { data } = await axios.get(
      `https://api.clubhouse.io/api/v3/iterations/${event.iterationId}/stories`,
      {
        headers: {
          'Clubhouse-Token': process.env.CLUBHOUSE_TOKEN,
          'organization': 'wmfs'
        }
      }
    )

    event.stories = data

    return event
  }
}
