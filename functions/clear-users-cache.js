module.exports = function () {
  return async function (env, event) {
    const cacheService = env.bootedServices.caches
    cacheService.reset('rolesFromUserId')
    cacheService.reset('userMemberships')
    return event
  }
}
