module.exports = function () {
  return async function stateMachineRunnerRun (event, env, context) {
    const { stateMachineName, input } = event.fields.params
    const { statebox } = env.bootedServices
    const { userId } = context

    await statebox.startExecution(
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
