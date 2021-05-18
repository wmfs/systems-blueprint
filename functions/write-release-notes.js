const path = require('path')
const Pdf = require('pdfkit')
const fs = require('fs')

module.exports = function () {
  return async function writeReleaseNotes (event) {
    const { stories } = event
    const notes = []

    stories.forEach(story => {
      notes.push(`${story.name} (https://app.clubhouse.io/wmfs/story/${story.id})`)
    })

    const doc = new Pdf()
    const today = new Date().toString().split(' ').slice(1, 4).join('-')
    const exportFilename = 'release-notes-test.pdf'

    const stream = doc.pipe(fs.createWriteStream(exportFilename))

    doc.image(path.join(__dirname, '..', 'shared', 'Tymly-Logo.png'), {
      fit: [250, 300],
      align: 'top',
      valign: 'left'
    })

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
      .text(`Versions released on ${today.toString().split(' ').slice(1, 4).join(' ')}`, 80, 160)

    doc
      .fontSize(12)
      .text('Feature List:', 80, 215)

    doc
      .list(notes, 90, 240)

    doc.end()
    stream.on('finish', function () {
      event.exportFilename = exportFilename
      return event
    })
  }
}
