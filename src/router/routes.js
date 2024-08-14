import '../views/HomeView.js'
import '../views/LoginView.js'
import '../views/AdminView.js'
import '../views/NotFound.js'

export default [
  { path: '/', view: '<home-view></-view>' },
  { path: '/login', view: '<login-view></login-view>' },
  { path: '/admin', view: '<admin-view></admin-view>', protected: true },
  { path: '/404', view: '<not-found></not-found>' }
]
