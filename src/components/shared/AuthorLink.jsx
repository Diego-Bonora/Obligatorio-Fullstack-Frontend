import { Link } from 'react-router'
import Avatar from './Avatar'

// a deleted author populates as null, so there is no profile to link to
const AuthorLink = ({ author, size }) => {
  const content = (
    <>
      <Avatar user={author} size={size} />
      <strong>@{author?.username ?? 'usuario'}</strong>
    </>
  )

  if (!author?._id) return <span className="author-link">{content}</span>
  return <Link to={`/users/${author._id}`} className="author-link">{content}</Link>
}

export default AuthorLink
