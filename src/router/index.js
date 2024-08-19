// Import routes
import Routes from './routes.js'

async function router() {
  const routeMatch = Routes.find((route) => route.path === location.pathname)

  if (!routeMatch) {
    navigateTo('/404')
    return
  }

  if (routeMatch.redirectTo) {
    navigateTo(routeMatch.redirectTo)
    return
  }

  const isSessionActive = !!sessionStorage.getItem(`firebase:authUser:${import.meta.env.VITE_FIREBASE_API_KEY}:[DEFAULT]`)

  if (routeMatch?.protected && !isSessionActive) {
    navigateTo('/login')
    return
  }

  if (routeMatch.path === '/login' && isSessionActive) {
    navigateTo('/admin')
    return
  }

  document.querySelector('#app').innerHTML = routeMatch.view
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
