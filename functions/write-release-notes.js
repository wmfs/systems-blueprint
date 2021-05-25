const path = require('path')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const Headers = { features: 'Features', bugs: 'Bugs', chores: 'Chores' }

module.exports = function () {
  return async function writeReleaseNotes (event, env) {
    const { exportType, stories } = event

    event.features = stories.filter(r => r.storyType === 'feature')
    event.bugs = stories.filter(r => r.storyType === 'bug')
    event.chores = stories.filter(r => r.storyType === 'chore')

    const now = env.bootedServices.timestamp.now()

    if (exportType === 'PDF') {
      event.exportFilename = await generatePdf(event, now)
    } else if (exportType === 'HTML') {
      event.exportFilename = await generateHtml(event, now)
    }

    return event
  }
}

function generatePdf (event, now) {
  return new Promise((resolve, reject) => {
    const { bugs, features, chores, endDate, exportDirectory } = event

    const exportFilename = `release-notes-${now.format('YYYYMMDD-HHmm')}.pdf`

    const doc = new PDFDocument({ compress: false })

    const stream = fs.createWriteStream(path.join(exportDirectory, exportFilename))

    doc.pipe(stream)

    doc.image(
      path.join(__dirname, '..', 'shared', 'Tymly-Logo.png'),
      {
        fit: [250, 300],
        align: 'top',
        valign: 'left'
      }
    )

    doc
      .moveTo(75, 150)
      .lineTo(500, 150)
      .fillAndStroke('#878787')

    doc
      .moveTo(75, 175)
      .lineTo(500, 175)
      .fillAndStroke('#878787')

    doc
      .fontSize(10)
      .text(`Release notes - Tymly release on ${endDate}`, 80, 160)

    for (const [key, section] of Object.entries({ features, bugs, chores })) {
      if (section.length > 0) {
        doc.moveDown(2)

        doc
          .fontSize(12)
          .text(`${Headers[key]}:`)

        doc
          .list(section.map(s => s.releaseNote))
      }
    }

    doc.end()

    stream
      .on('finish', () => resolve(exportFilename))
      .on('error', err => reject(err))
  })
} // generatePdf

function generateHtml (event, now) {
  return new Promise((resolve, reject) => {
    const { bugs, features, chores, exportDirectory } = event

    const exportFilename = `release-notes-${now.format('YYYYMMDD-HHmm')}.html`

    let html = `<html lang="en"><head><meta charset="UTF-8"><title>${exportFilename}</title></head><body><h3>Release Notes:</h3><br>`

    for (const [key, section] of Object.entries({ features, bugs, chores })) {
      if (section.length > 0) {
        html += `<h3>${Headers[key]}:</h3><ul>`
        section.forEach(story => {
          html += `<li>${story.releaseNote}</li>`
        })
        html += '</ul>'
      }
    }

    html += '</body></html>'

    fs.writeFile(
      path.join(exportDirectory, exportFilename),
      html,
      err => {
        if (err) reject(err)
        else resolve(exportFilename)
      }
    )
  })
} // generateHtml
