const path = require('path')

module.exports = function (ctx) {
  return async function () {
    const { changelog } = ctx.blueprintComponents
    const sortedChangelog = {}

    Object.keys(changelog).sort().forEach(c => { sortedChangelog[c] = changelog[c] })

    const items = []

    Object.entries(sortedChangelog).forEach(([key, value]) => {
      items.push({
        type: 'Collapsible',
        title: path.basename(path.dirname(value.filePath)),
        spacing: 'medium',
        card: {
          type: 'AdaptiveCard',
          body: [
            {
              id: key,
              type: 'TextBlock',
              text: value.content,
              markdown: true
            }
          ]
        }
      })
    })

    return items
  }
}
