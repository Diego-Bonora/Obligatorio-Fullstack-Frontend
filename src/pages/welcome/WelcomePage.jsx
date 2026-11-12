import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import api from '../../api/api'
import { clearNewUser, setUser } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'
import Logo from '../../components/shared/Logo'
import { APP_NAME } from '../../constants/brand'
import PhotoPicker from '../../components/welcome/PhotoPicker'
import SuggestedCooks from '../../components/welcome/SuggestedCooks'

// Step 2 of the sign up: optional profile picture and people to follow.
const WelcomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)
  const [userError, setUserError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  // The welcome step was reached: from now on PublicOnlyRoute goes back to sending to the feed.
  useEffect(() => {
    dispatch(clearNewUser())
  }, [dispatch])

  // This page lives outside ContainerPage, so it loads the user itself.
  useEffect(() => {
    if (user) return

    const loadUser = async () => {
      setUserError(null)
      try {
        const { data: me } = await api.get('/users/me')
        dispatch(setUser(me))
      } catch (error) {
        if (error.response?.status !== 401) setUserError(getErrorMessage(error))
      }
    }
    loadUser()
  }, [user, dispatch, reloadCount])

  return (
    <div className="welcome-page">
      <main className="welcome-card">
        <Logo />

        <div className="welcome-progress">
          <span className="eyebrow primary">PASO 2 DE 2</span>
          <div className="progress-bars" aria-hidden="true">
            <span className="filled" />
            <span className="filled" />
          </div>
        </div>

        {userError && (
          <div className="feed-error">
            <p className="error">{userError}</p>
            <button type="button" className="btn secondary" onClick={() => setReloadCount(prev => prev + 1)}>Reintentar</button>
          </div>
        )}

        {!user && !userError && <p className="loading">Cargando tu perfil...</p>}

        {user && (
          <>
            <section className="welcome-section">
              <h1>¡Te damos la bienvenida a {APP_NAME}!</h1>
              <PhotoPicker user={user} />
            </section>

            <section className="welcome-section">
              <h2>Cocineros para seguir</h2>
              <SuggestedCooks currentUserId={user._id} />
            </section>
          </>
        )}

        <div className="welcome-actions">
          <button type="button" className="btn primary block" onClick={() => navigate('/', { replace: true })}>
            Empezar a cocinar
          </button>
          <Link to="/" replace className="welcome-skip">Saltar por ahora</Link>
        </div>
      </main>
    </div>
  )
}

export default WelcomePage
