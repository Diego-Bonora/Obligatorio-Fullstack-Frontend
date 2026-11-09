import { useSelector } from 'react-redux'
import Edit from './Edit'
import Following from './Following'

const UserInfo = () => {
  const user = useSelector(state => state.auth.user)

  if (!user) return <p className="loading">Cargando perfil...</p>

  return (
    <header className="profile-header">
      <span className="avatar large">
        {user.profilePicture
          ? <img src={user.profilePicture} alt="" />
          : user.username[0].toUpperCase()}
      </span>
      <div className="profile-info">
        <div className="profile-title">
          <h1>{user.username}</h1>
          <Following />
        </div>
        <Edit />
      </div>
    </header>
  )
}

export default UserInfo
