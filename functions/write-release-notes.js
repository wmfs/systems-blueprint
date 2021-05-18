const path = require('path')
const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = function () {
  return async function writeReleaseNotes (event, env) {
    const { stories, exportDirectory } = event

    const notes = stories.map(story => `${story.name} [ch${story.id}]`)

    const now = env.bootedServices.timestamp.now()
    const exportFilename = `release-notes-${now.format('YYYYMMDD-HHmm')}.pdf`

    const filePath = path.join(exportDirectory, exportFilename)

    const doc = new PDFDocument()

    doc.pipe(fs.createWriteStream(filePath))

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
      .text(`Released on ${now.format('DD/MM/YYYY')}`, 80, 160)

    doc
      .fontSize(12)
      .text('Features', 80, 215)

    doc
      .list(notes, 90, 240)

    doc.end()

    event.exportFilename = exportFilename

    return event
  }
}
