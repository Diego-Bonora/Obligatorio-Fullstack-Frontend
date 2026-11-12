import Logo from '../shared/Logo'
import { CakeIcon, CommentIcon, HeartIcon, LeafIcon, PotIcon } from '../shared/Icons'

// Static showcase content: login/register are public pages, so there's no real feed to show here.
const MockAvatar = ({ initials, tone, size }) => (
  <span className={`mock-avatar tone-${tone}${size ? ` ${size}` : ''}`} aria-hidden="true">{initials}</span>
)

const AvatarStack = () => (
  <span className="avatar-stack" aria-hidden="true">
    <MockAvatar initials="LM" tone="peach" />
    <MockAvatar initials="JP" tone="butter" />
    <MockAvatar initials="AR" tone="rose" />
  </span>
)

const RegisterShowcase = () => (
  <>
    <div className="auth-hero">
      <p className="auth-hero-title">Cociná, compartí y descubrí recetas de gente como vos.</p>
      <p className="auth-community">
        <AvatarStack />
        Sumate a la comunidad de cocineros caseros
      </p>
    </div>

    <div className="auth-feed" aria-hidden="true">
      <article className="showcase-card">
        <div className="showcase-card-image tone-peach"><PotIcon size={56} strokeWidth={1.6} className="" /></div>
        <div className="showcase-card-body">
          <strong>Ñoquis caseros del 29</strong>
          <div className="showcase-card-meta">
            <span className="showcase-author"><MockAvatar initials="LM" tone="peach" size="tiny" />@lucia.cocina</span>
            <span className="showcase-likes"><HeartIcon size={16} className="" />248</span>
          </div>
        </div>
      </article>
      <article className="showcase-card offset">
        <div className="showcase-card-image tone-butter"><CakeIcon size={56} strokeWidth={1.6} className="" /></div>
        <div className="showcase-card-body">
          <strong>Chajá en vasito</strong>
          <div className="showcase-card-meta">
            <span className="showcase-author"><MockAvatar initials="JP" tone="butter" size="tiny" />@juanpi.dulce</span>
            <span className="showcase-comments"><CommentIcon size={16} className="" />32</span>
          </div>
        </div>
      </article>
    </div>

    {/* Mobile only: replaces the hero and the feed */}
    <div className="auth-collage" aria-hidden="true">
      <span className="tone-peach"><PotIcon size={44} strokeWidth={1.6} className="" /></span>
      <span className="tone-butter"><CakeIcon size={44} strokeWidth={1.6} className="" /></span>
      <span className="tone-mint"><LeafIcon size={44} strokeWidth={1.6} className="" /></span>
    </div>
  </>
)

const LoginShowcase = () => (
  <>
    <p className="auth-hero auth-hero-title">Tu cocina te estaba esperando.</p>

    <article className="showcase-card featured" aria-hidden="true">
      <div className="showcase-card-image tone-mint">
        <LeafIcon size={72} strokeWidth={1.5} className="" />
        <span className="showcase-badge">RECETA DE LA SEMANA</span>
      </div>
      <div className="showcase-card-body row">
        <div>
          <strong>Tarta de zapallitos y queso</strong>
          <span className="showcase-author">por @ana.verde · 35 min</span>
        </div>
        <span className="showcase-likes"><HeartIcon size={18} className="" />1,2k</span>
      </div>
    </article>

    <ul className="auth-activity" aria-hidden="true">
      <li><MockAvatar initials="LM" tone="peach" /><span><b>@lucia.cocina</b> subió Ñoquis caseros del 29</span></li>
      <li><MockAvatar initials="JP" tone="butter" /><span><b>@juanpi.dulce</b> compartió Chajá en vasito</span></li>
    </ul>

    {/* Mobile only: replaces the hero, the featured recipe and the activity */}
    <div className="auth-community-card">
      <span className="eyebrow">EN LA COMUNIDAD</span>
      <p className="auth-community">
        <AvatarStack />
        <span><b>Cocineros caseros</b> comparten recetas nuevas todos los días</span>
      </p>
    </div>
  </>
)

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
