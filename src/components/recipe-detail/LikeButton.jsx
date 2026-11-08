import { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'

const LikeButton = ({ recipeId, liked, count, onChange }) => {
  const [sending, setSending] = useState(false)

  const toggleLike = async () => {
    setSending(true)
    try {
      if (liked) {
        await api.delete(`/recipes/${recipeId}/like`)
        onChange(false, count - 1)
      } else {
        await api.post(`/recipes/${recipeId}/like`)
        onChange(true, count + 1)
      }
    } catch (error) {
      // 409 = it was already liked, 404 = it was already unliked: just sync with the server
      const status = error.response?.status
      if (status === 409) onChange(true, count)
      else if (status === 404 && liked) onChange(false, count)
      else toast.error(getErrorMessage(error))
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      type="button"
      className={`btn like-button ${liked ? 'liked' : ''}`}
      onClick={toggleLike}
      disabled={sending}
      aria-pressed={liked}
    >
      {liked ? '♥' : '♡'} {count}
    </button>
  )
}

export default LikeButton
