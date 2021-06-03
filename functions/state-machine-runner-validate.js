module.exports = function () {
  return function stateMachineRunnerValidate (event, env) {
    const { statebox } = env.bootedServices
    const errors = []

    const { stateMachineName, input: inputStr } = event

    if (stateMachineName && typeof stateMachineName === 'string' && stateMachineName.trim().length) {
      const stateMachine = statebox.findStateMachineByName(stateMachineName)
      if (!stateMachine) {
        errors.push(`Cannot find a state machine with the name: '${stateMachineName}'`)
      }
    } else {
      errors.push('State machine name is required')
    }

    if (inputStr && typeof inputStr === 'string' && inputStr.trim().length) {
      try {
        JSON.parse(inputStr)
      } catch (e) {
        errors.push('Input must be valid JSON')
      }
    }

    return {
      results: [{ errors }],
      totalHits: 0
    }
  }
}
