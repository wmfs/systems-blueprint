const axios = require('axios')
const API_BASE_URL = 'https://api.clubhouse.io/api/v3/'

async function getEpics (token) {
  const { data } = await axios.get(
    `${API_BASE_URL}epics`,
    {
      headers: {
        'Clubhouse-Token': token,
        organization: 'wmfs'
      }
    }
  )

  return data
}

async function getIterations (token) {
  const { data } = await axios.get(
    `${API_BASE_URL}iterations`,
    {
      headers: {
        'Clubhouse-Token': token,
        organization: 'wmfs'
      }
    }
  )

  return data
}

async function getStoriesByIteration (token, iterationId) {
  const { data } = await axios.get(
    `${API_BASE_URL}iterations/${iterationId}/stories`,
    {
      headers: {
        'Clubhouse-Token': token,
        organization: 'wmfs'
      },
      params: {
        includes_description: true
      }
    }
  )

  return data
}

module.exports = {
  getEpics,
  getIterations,
  getStoriesByIteration
}
