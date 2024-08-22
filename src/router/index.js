// Import routes
import Routes from './routes.js'

function pathToRegex(path) {
  return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$")
}

function getParams(match) {
  const values = match.result.slice(1)
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1])

  return keys.map((key, i) => ({ key, value: values[i] }))
}

function router() {
  const app = document.querySelector('#app')

  while (app.firstChild) {
    app.removeChild(app.firstChild)
  }

  const potentialRouteMatches = Routes.map(route => ({
    route: route,
    result: location.pathname.match(pathToRegex(route.path))
  }))

  let routeMatch = potentialRouteMatches.find((potentialRouteMatch) => !!potentialRouteMatch.result)

  if (!routeMatch) {
    navigateTo('/404')
    return
  }

  if (routeMatch.route?.redirectTo) {
    navigateTo(routeMatch.route.redirectTo)
    return
  }

  const isSessionActive = !!sessionStorage.getItem(`firebase:authUser:${import.meta.env.VITE_FIREBASE_API_KEY}:[DEFAULT]`)

  if (routeMatch.route?.protected && !isSessionActive) {
    navigateTo('/login')
    return
  }

  if (routeMatch.route?.path === '/login' && isSessionActive) {
    navigateTo('/admin')
    return
  }

  const viewToRender = document.createElement(routeMatch.route?.view)
  
  getParams(routeMatch).forEach((param) => {
    viewToRender.setAttribute(`data-${param.key}`, param.value)    
  })

  app.appendChild(viewToRender)
}

export function navigateTo(path) {
  history.pushState(null, null, path)
  router()
}

export function initRouter() {
  window.addEventListener('popstate', router)
  
  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', event => {
      if (event.target.matches('[data-internal-link]')) {
        event.preventDefault()
        navigateTo(event.target.href)
      }
    })
  
    router()
  })
}
