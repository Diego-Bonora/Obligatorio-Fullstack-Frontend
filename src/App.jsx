import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles.css'
import store from './store/store'
import ProtectedRoute from './app/guards/ProtectedRoute'
import PublicOnlyRoute from './app/guards/PublicOnlyRoute'
import AdminRoute from './app/guards/AdminRoute'
import ContainerPage from './pages/ContainerPage'
import LoginPage from './pages/login/LoginPage'
import RegisterPage from './pages/register/RegisterPage'
import FeedPage from './pages/feed/FeedPage'
import RecipeDetailPage from './pages/recipe-detail/RecipeDetailPage'
import ProfilePage from './pages/profile/ProfilePage'
import AdminPage from './pages/admin/AdminPage'
import Categories from './components/admin/Categories'
import Reports from './components/admin/Reports'
import Users from './components/admin/Users'
import Stats from './components/admin/Stats'
import NotFoundPage from './pages/not-found/NotFoundPage'
import UsersPage from './pages/users/UsersPage'
import UserProfilePage from './pages/users/UserProfilePage'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ContainerPage />}>
              <Route index element={<FeedPage />} />
              <Route path="recipes/:id" element={<RecipeDetailPage />} />
              <Route path="users" element={<UsersPage/>} />
              <Route path="users/:id" element={<UserProfilePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminPage />}>
                 
                  <Route path="categories" element={<Categories />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="users" element={<Users />} />
                  <Route path="stats" element={<Stats />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </Provider>
  )
}

export default App
