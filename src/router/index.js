// Import routes
import Routes from './routes.js'

// Import views
import NotFound from '../views/NotFound.js'

async function router() {
  const routeMatch = Routes.find((route) => route.path === location.pathname) ?? { view: NotFound }
  const view = new routeMatch.view()

  document.querySelector('#app').innerHTML = await view.getHTML()
}

function navigateTo(path) {
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
