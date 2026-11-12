import { useEffect, useState } from 'react'
import api from '../../api/api'
import { formatRelativeDate, isWithinLastWeek } from '../../utils/date'
import Avatar from '../shared/Avatar'
import Logo from '../shared/Logo'
import { CakeIcon, HeartIcon, LeafIcon, PotIcon } from '../shared/Icons'

// Login and register are public pages: their showcase comes from GET /showcase, which needs no token.
const useShowcase = () => {
  const [showcase, setShowcase] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    api.get('/showcase')
      .then(({ data }) => {
        if (!ignore) setShowcase(data)
      })
      // Without data the panel just shows the title: the form must keep working.
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  return { showcase, loading }
}

// Placeholders with the same shape as the real cards, so nothing jumps when the data arrives.
const SkeletonLine = ({ width }) => <span className="skeleton-line" style={{ width }} />

const CardSkeleton = ({ featured }) => (
  <div className={`showcase-card${featured ? ' featured' : ''}`} aria-hidden="true">
    <div className="showcase-card-image skeleton" />
    <div className="showcase-card-body">
      <SkeletonLine width="70%" />
      <SkeletonLine width="45%" />
    </div>
  </div>
)

const getAuthors = (recipes) =>
  [...new Map(recipes.filter(recipe => recipe?.author).map(recipe => [recipe.author._id, recipe.author])).values()]

const AuthorStack = ({ authors }) => authors.length > 0 && (
  <span className="avatar-stack">
    {authors.map(author => <Avatar key={author._id} user={author} size="small" />)}
  </span>
)

const RecipeTile = ({ recipe, tone, Icon, meta }) => (
  <article className="showcase-card">
    <div className={`showcase-card-image${recipe.imageUrl ? '' : ` tone-${tone}`}`}>
      {recipe.imageUrl
        ? <img src={recipe.imageUrl} alt="" />
        : <Icon size={56} strokeWidth={1.6} className="" />}
    </div>
    <div className="showcase-card-body">
      <strong>{recipe.title}</strong>
      <div className="showcase-card-meta">
        <span className="showcase-author"><Avatar user={recipe.author} size="small" />@{recipe.author?.username ?? 'usuario'}</span>
        {meta}
      </div>
    </div>
  </article>
)

const RegisterShowcase = () => {
  const { showcase, loading } = useShowcase()
  const featured = showcase?.featured
  const latest = showcase?.recent.find(recipe => recipe._id !== featured?._id)
  const authors = getAuthors([featured, ...(showcase?.recent ?? [])])

  return (
    <>
      <div className="auth-showcase-content">
        <div className="auth-hero">
          <p className="auth-hero-title">Cociná, compartí y descubrí recetas de gente como vos.</p>
          <p className="auth-community">
            <AuthorStack authors={authors} />
            Sumate a la comunidad de cocineros caseros
          </p>
        </div>

        {loading && (
          <div className="auth-feed">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {(featured || latest) && (
          <div className="auth-feed">
            {featured && (
              <RecipeTile
                recipe={featured}
                tone="peach"
                Icon={PotIcon}
                meta={(
                  <span className="showcase-likes" aria-label={`${featured.likesCount} me gusta`}>
                    <HeartIcon size={16} className="" />{featured.likesCount}
                  </span>
                )}
              />
            )}
            {latest && (
              <RecipeTile
                recipe={latest}
                tone="butter"
                Icon={CakeIcon}
                meta={<span className="showcase-date">{formatRelativeDate(latest.createdAt)}</span>}
              />
            )}
          </div>
        )}
      </div>

      {/* Mobile only: replaces the hero and the feed */}
      <div className="auth-collage" aria-hidden="true">
        <span className="tone-peach"><PotIcon size={44} strokeWidth={1.6} className="" /></span>
        <span className="tone-butter"><CakeIcon size={44} strokeWidth={1.6} className="" /></span>
        <span className="tone-mint"><LeafIcon size={44} strokeWidth={1.6} className="" /></span>
      </div>
    </>
  )
}

const FeaturedRecipe = ({ recipe }) => {
  // The API falls back to the all-time favorite when nothing was posted this week.
  const isThisWeek = isWithinLastWeek(recipe.createdAt)

  return (
    <article className="showcase-card featured">
      <div className={`showcase-card-image${recipe.imageUrl ? '' : ' tone-mint'}`}>
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt="" />
          : <LeafIcon size={72} strokeWidth={1.5} className="" />}
        <span className="showcase-badge">{isThisWeek ? 'RECETA DE LA SEMANA' : 'LA MÁS QUERIDA'}</span>
      </div>
      <div className="showcase-card-body row">
        <div>
          <strong>{recipe.title}</strong>
          <span className="showcase-author">por @{recipe.author?.username ?? 'usuario'} · {recipe.prepTime} min</span>
        </div>
        <span className="showcase-likes" aria-label={`${recipe.likesCount} me gusta`}>
          <HeartIcon size={18} className="" />{recipe.likesCount}
        </span>
      </div>
    </article>
  )
}

const LoginShowcase = () => {
  const { showcase, loading } = useShowcase()
  const recent = showcase?.recent ?? []
  const authors = getAuthors(recent)

  return (
    <>
      <div className="auth-showcase-content">
        <p className="auth-hero auth-hero-title">Tu cocina te estaba esperando.</p>

        {loading && (
          <>
            <CardSkeleton featured />
            <ul className="auth-activity" aria-hidden="true">
              {[1, 2, 3].map(row => (
                <li key={row}>
                  <span className="avatar small skeleton" />
                  <SkeletonLine width="65%" />
                </li>
              ))}
            </ul>
          </>
        )}

        {showcase?.featured && <FeaturedRecipe recipe={showcase.featured} />}

        {recent.length > 0 && (
          <ul className="auth-activity">
            {recent.map(recipe => (
              <li key={recipe._id}>
                <Avatar user={recipe.author} size="small" />
                <span>
                  <b>@{recipe.author?.username ?? 'usuario'}</b> subió {recipe.title}
                  <small> · {formatRelativeDate(recipe.createdAt)}</small>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile only: replaces the hero, the featured recipe and the activity */}
      <div className="auth-community-card">
        <span className="eyebrow">EN LA COMUNIDAD</span>
        <p className="auth-community">
          <AuthorStack authors={authors} />
          <span><b>Cocineros caseros</b> comparten recetas nuevas todos los días</span>
        </p>
      </div>
    </>
  )
}

const AuthLayout = ({ variant, children }) => (
  <div className={`auth-page auth-page--${variant}`}>
    <section className="auth-showcase">
      <Logo variant="white" size={44} withSlogan />
      {variant === 'login' ? <LoginShowcase /> : <RegisterShowcase />}
    </section>
    <main className="auth-main">{children}</main>
  </div>
)

export default AuthLayout
