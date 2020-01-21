module.exports = function () {
  return async function (event) {
    const messageStatusInput = {}

    if (event.notifyId) {
      messageStatusInput.notificationId = event.notifyId
      messageStatusInput.messageTemplateId = `${event.namespace}_${event.templateName}`
    }

    return messageStatusInput
  }
}
