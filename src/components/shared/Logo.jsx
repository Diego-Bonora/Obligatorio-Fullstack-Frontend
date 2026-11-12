import { APP_NAME, APP_SLOGAN } from '../../constants/brand'

// Isotipo from public/brand/isotipo-currentcolor.svg: takes the CSS `color` of its parent.
const Isotipo = ({ size }) => (
  <svg
    className="logo-icon"
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 30 L32 10 L56 30 V54 a2 2 0 0 1 -2 2 H10 a2 2 0 0 1 -2 -2 Z" stroke="currentColor" strokeWidth="4" />
    <path d="M19 38 h26 a13 13 0 0 1 -26 0z" fill="currentColor" />
    <path d="M28 33 q-3 -3 0 -6 M36 33 q-3 -3 0 -6" stroke="currentColor" strokeWidth="3" />
  </svg>
)

// variant: 'default' (green icon, dark text, for light backgrounds) or 'white' (for green/dark backgrounds)
const Logo = ({ variant = 'default', size = 32, withSlogan = false }) => (
  <span className={`logo logo--${variant}`}>
    <span className="logo-row">
      <Isotipo size={size} />
      <span className="logo-name">{APP_NAME}</span>
    </span>
    {withSlogan && <span className="logo-slogan">{APP_SLOGAN}</span>}
  </span>
)

export default Logo
