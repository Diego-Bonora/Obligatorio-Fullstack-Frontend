import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../api/api'
import { getErrorMessage } from '../../utils/apiError'
import { formatRelativeDate } from '../../utils/date'
import { commentSchema } from '../../validators/comment.validators'

const Comments = ({ recipeId }) => {
  const username = useSelector(state => state.auth.user?.username)
  const [comments, setComments] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, control, reset, formState: { errors, isValid, isSubmitting } } = useForm({
    resolver: joiResolver(commentSchema),
    mode: 'onChange',
    defaultValues: { text: '' }
  })
  const textLength = useWatch({ control, name: 'text' }).length

  useEffect(() => {
    let ignore = false

    const loadComments = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/recipes/${recipeId}/comments`, { params: { page, limit: 10 } })
        if (ignore) return
        // "load more" appends; skip any comment already shown (a new one shifts the pages)
        setComments(prev => {
          const shownIds = new Set(prev.map(comment => comment._id))
          return [...prev, ...data.data.filter(comment => !shownIds.has(comment._id))]
        })
        setMeta(data.meta)
      } catch (error) {
        if (!ignore) toast.error(getErrorMessage(error))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadComments()

    return () => { ignore = true }
  }, [recipeId, page])

  const sendComment = async ({ text }) => {
    try {
      const { data } = await api.post(`/recipes/${recipeId}/comments`, { text })
      // the POST answer has the author id only, and the author is me
      setComments(prev => [{ ...data.comment, author: { _id: data.comment.author, username } }, ...prev])
      setMeta(prev => prev && { ...prev, total: prev.total + 1 })
      reset()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const hasMore = meta && page < meta.totalPages

  return (
    <section className="card detail-section">
      <h2>Comentarios {meta ? `(${meta.total})` : ''}</h2>

      <form className="comment-form" onSubmit={handleSubmit(sendComment)}>
        <textarea rows={2} placeholder="Escribí un comentario..." aria-label="Comentario" {...register('text')} />
        <div className="comment-form-footer">
          <span className={`char-count ${textLength > 300 ? 'over' : ''}`}>{textLength}/300</span>
          <button type="submit" className="btn primary" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Comentar'}
          </button>
        </div>
        {errors.text && <span className="error">{errors.text.message}</span>}
      </form>

      {!loading && comments.length === 0 && <p className="muted">Todavía no hay comentarios. ¡Sé el primero!</p>}
      <ul className="comment-list">
        {comments.map(comment => {
          const author = comment.author?.username ?? 'usuario'
          return (
            <li key={comment._id} className="comment">
              <span className="avatar small">{author[0].toUpperCase()}</span>
              <div>
                <p className="comment-header"><strong>@{author}</strong> <span className="muted">· {formatRelativeDate(comment.createdAt)}</span></p>
                <p className="comment-text">{comment.text}</p>
              </div>
            </li>
          )
        })}
      </ul>

      {loading && <p className="loading">Cargando comentarios...</p>}
      {!loading && hasMore && (
        <button type="button" className="btn link" onClick={() => setPage(prev => prev + 1)}>Cargar más comentarios</button>
      )}
    </section>
  )
}

export default Comments
