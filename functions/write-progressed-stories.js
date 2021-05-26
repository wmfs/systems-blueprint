const path = require('path')
const fs = require('fs')

module.exports = function () {
  return async function writeProgressedStories (event, env) {
    const { exportDirectory, storiesByOwner } = event

    const now = env.bootedServices.timestamp.now()

    event.exportFilename = `progressed-stories-${now.format('YYYYMMDD-HHmm')}.html`

    generateHtml(path.join(exportDirectory, event.exportFilename), storiesByOwner)

    return event
  }
}

function generateHtml (filePath, storiesByOwner) {
  let html = '<!doctype html><html><head>'
  html += '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">'
  html += '<style>'
  html += 'body { padding: 50px; }'
  html += '</style>'
  html += '</head><body>'
  html += '<div class="card">'
  html += '<h5 class="card-header">Stories progressed this sprint</h5>'
  html += '<div class="card-body">'

  for (const owner of Object.keys(storiesByOwner)) {
    html += `<h5 class="card-title">${owner}</h5>`
    html += '<ul class="list-group list-group-flush" style="margin-bottom: 28px;">'
    for (const { epic, storyId, storyTitle } of storiesByOwner[owner].stories) {
      html += '<li class="list-group-item d-flex justify-content-between align-items-start">'
      html += '<div class="ms-2 me-auto">'
      html += `<div>${storyTitle}</div>`
      html += `<small>${epic}</small>`
      html += '</div>'
      html += `<span class="badge rounded-pill bg-primary">ch${storyId}</span>`
      html += '</li>'
    }
    html += '</ul>'
  }

  html += '</div>'
  html += '</div>'
  html += '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>'
  html += '</body></html>'

  fs.writeFileSync(filePath, html)
}
