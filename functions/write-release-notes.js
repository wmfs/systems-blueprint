const fs = require('fs')
const path = require('path')

module.exports = function () {
  return async function writeReleaseNotes (event) {
    console.log('Write release notes incoming ', event)
    const exportFilename = 'release-notes-test.txt'
    fs.writeFileSync(path.join(event.exportDirectory, exportFilename), 'Test')

    event.exportFilename = exportFilename

    return event
  }
}
