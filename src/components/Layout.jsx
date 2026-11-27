import { NavLink, useLocation } from 'react-router-dom'
import { Home, LayoutDashboard, Search, ShieldCheck } from 'lucide-react'
import { useStore } from '../store'
import { Logo, Toast } from './Ui'

function LanguageSwitch({ compact = false }) {
  const { lang, setLang, t } = useStore()
  return (
    <div className={`lang-switch ${compact ? 'compact' : ''}`} aria-label="Language">
      <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>العربية</button>
      <span>/</span>
      <button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')}>Français</button>
      {compact && <span className="sr-only">{t('nav.lang')}</span>}
    </div>
  )
}

export function Footer() {
  const { t, resetDemo } = useStore()
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Logo className="footer-logo" />
        <div>
          <strong>Dawak — دواك</strong>
          <p>{t('app.tagline')}</p>
        </div>
      </div>
      <div className="footer-meta">
        <span>{t('footer.esi')}</span>
        <span>{t('footer.project')}</span>
        <span>{t('footer.rights')}</span>
      </div>
      <div className="footer-actions">
        <LanguageSwitch />
        <button className="text-button" onClick={resetDemo}>↺ Demo data</button>
      </div>
    </footer>
  )
}

export function Layout({ children, hideFooter = false }) {
  const { t, session, lang, setLang } = useStore()
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/pharmacy/dashboard')

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="brand" aria-label="Dawak home">
            <Logo className="header-logo" />
            <span className="brand-text">
              <strong>Dawak</strong>
              <small>{t('app.tagline')}</small>
            </span>
          </NavLink>
          <nav className="desktop-nav">
            <NavLink to="/">{t('nav.home')}</NavLink>
            <NavLink to="/search">{t('nav.search')}</NavLink>
            <NavLink to={session ? '/pharmacy/dashboard' : '/pharmacy/login'}>{t('nav.pharmacy')}</NavLink>
          </nav>
          <button className="lang-toggle" onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')} aria-label={t('nav.lang')}>
            {t('nav.lang')}
          </button>
        </div>
      </header>

      <main className="main-content">{children}</main>

      {!hideFooter && <Footer />}

      <nav className="bottom-nav" aria-label="Main navigation">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          <Home size={21} /><span>{t('nav.home')}</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Search size={21} /><span>{t('common.search')}</span>
        </NavLink>
        <NavLink to={session ? '/pharmacy/dashboard' : '/pharmacy/login'} className={isDashboard ? 'active' : ''}>
          <LayoutDashboard size={21} /><span>{t('nav.pharmacy')}</span>
        </NavLink>
        <span className="bottom-nav-note"><ShieldCheck size={16} /></span>
      </nav>

      <Toast />
    </div>
  )
}
