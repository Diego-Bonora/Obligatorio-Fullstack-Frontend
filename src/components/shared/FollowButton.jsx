import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { setUser } from '../../features/auth/auth.slice'
import { getErrorMessage } from '../../utils/apiError'

const FollowButton = ({ userId }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.auth.user)
  const [busy, setBusy] = useState(false)

  const isFollowing = currentUser?.following.includes(userId)

  const toggleFollow = async () => {
    setBusy(true)
    try {
      const { data } = isFollowing
        ? await api.delete(`/users/${userId}/follow`)
        : await api.post(`/users/${userId}/follow`)
      dispatch(setUser(data))
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      className={`btn ${isFollowing ? 'secondary' : 'primary'}`}
      disabled={!currentUser || busy}
      onClick={toggleFollow}
    >
      {isFollowing ? 'Dejar de seguir' : 'Seguir'}
    </button>
  )
}

export default FollowButton
