module.exports = function () {
  return function (event) {
    event.feedback = event.feedback.map(x => {
      return {
        ...x,
        launches: [{
          title: 'View',
          stateMachineName: 'system_feedbackViewOne_1_0',
          input: { id: x.id }
        }]
      }
    })

    return event
  }
}
