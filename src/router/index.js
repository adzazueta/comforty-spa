// Services
import User from '../services/User.js'

// Import routes
import Routes from './routes.js'

async function router() {
  const routeMatch = Routes.find((route) => route.path === location.pathname)

  if (!routeMatch) {
    navigateTo('/404')
    return
  }

  if (routeMatch?.protected && !User.verifyToken()) {
    navigateTo('/login')
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
