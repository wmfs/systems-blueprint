module.exports = function () {
  return async function stateMachineRunnerRun (event, env, context) {
    const { stateMachineName, input } = event.fields.results[0].validated
    const { statebox } = env.bootedServices
    const { userId } = context

    event.execDesc = await statebox.startExecution(
      input ? JSON.parse(input) : {},
      stateMachineName,
      {
        sendResponse: 'COMPLETE',
        userId
      }
    )

    return event
  }
}
