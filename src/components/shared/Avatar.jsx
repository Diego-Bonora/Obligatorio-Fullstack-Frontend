const Avatar = ({ user, size }) => {
  const username = user?.username ?? 'usuario'

  return (
    <span className={size ? `avatar ${size}` : 'avatar'}>
      {user?.profilePicture
        ? <img src={user.profilePicture} alt="" />
        : username[0].toUpperCase()}
    </span>
  )
}

export default Avatar
