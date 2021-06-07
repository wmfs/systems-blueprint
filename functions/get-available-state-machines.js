module.exports = function () {
  return async function getAvailableStateMachines (event, env) {
    const { statebox } = env.bootedServices
    const availableStateMachines = statebox.listStateMachines()

    event.availableStateMachines = availableStateMachines.map(r => {
      return {
        title: r.name,
        value: r.name
      }
    })
    event.availableStateMachinesOrig = event.availableStateMachines
    event.availableStateMachinesFilt = event.availableStateMachines

    return event
  }
}
