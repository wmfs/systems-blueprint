const path = require('path')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const Headers = { features: 'Features', bugs: 'Bugs', chores: 'Chores' }

module.exports = function () {
  return async function writeReleaseNotes (event, env) {
    const { bugs, features, chores, endDate, exportDirectory, exportType } = event
    const now = env.bootedServices.timestamp.now()
    let exportFilename = `release-notes-${now.format('YYYYMMDD-HHmm')}`

    if (exportType === 'PDF') {
      exportFilename += '.pdf'
      const doc = new PDFDocument({ compress: false })

      doc.pipe(fs.createWriteStream(path.join(exportDirectory, exportFilename)))

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
            .list(section)
        }
      }

      doc.end()
    } else if (exportType === 'HTML') {
      exportFilename += '.html'
      let html = `<html lang="en"><head><meta charset="UTF-8"><title>${exportFilename}</title></head><body><h3>Release Notes:</h3><br>`
      for (const [key, section] of Object.entries({ features, bugs, chores })) {
        if (section.length > 0) {
          html += `<h3>${Headers[key]}:</h3><ul>`
          section.forEach(story => {
            html += `<li>${story}</li>`
          })
          html += '</ul>'
        }
      }
      html += '</body></html>'
      fs.writeFileSync(path.join(exportDirectory, exportFilename), html)
    }

    event.exportFilename = exportFilename

    return event
  }
}
