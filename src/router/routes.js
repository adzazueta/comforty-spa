import '../views/HomeView.js'
import '../views/LoginView.js'
import '../views/AdminProductsView.js'
import '../views/AdminCategoriesView.js'
import '../views/NotFound.js'

export default [
  { path: '/', view: '<home-view></-view>' },
  { path: '/login', view: '<login-view></login-view>' },
  { path: '/admin', redirectTo: '/admin/products' },
  { path: '/admin/products', view: '<admin-products-view></admin-products-view>', protected: true },
  { path: '/admin/categories', view: '<admin-categories-view></admin-categories-view>', protected: true },
  { path: '/404', view: '<not-found></not-found>' }
]
