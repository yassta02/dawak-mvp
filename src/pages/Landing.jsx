import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BellRing, MapPin, Search, ShieldCheck, Sparkles, Store, TrendingDown } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Logo, StatusPill } from '../components/Ui'
import { useStore } from '../store'

function Step({ number, icon, title, text }) {
  return (
    <article className="step-card">
      <div className="step-index">{number}</div>
      <div className="step-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

function Benefit({ icon, title, text }) {
  return (
    <article className="benefit-card">
      <span className="benefit-icon">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  )
}

export function Landing() {
  const { t, lang, medicines } = useStore()
  const sample = medicines[0]
  const rtl = lang === 'ar'
  const Forward = rtl ? ArrowLeft : ArrowRight

  return (
    <Layout>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={15} /> {t('hero.eyebrow')}</span>
          <div className="hero-logo"><Logo /></div>
          <h1>{t('hero.slogan')}</h1>
          <p className="hero-sub">{t('hero.sub')}</p>
          <div className="hero-actions">
            <Link className="button button-primary button-lg" to="/search">
              <Search size={19} /> {t('hero.cta.patient')} <Forward size={18} />
            </Link>
            <Link className="button button-outline button-lg" to="/pharmacy/login">
              <Store size={19} /> {t('hero.cta.pharmacy')}
            </Link>
          </div>
          <p className="hero-trust"><ShieldCheck size={16} /> {t('hero.trust')}</p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="mini-card mini-card-main">
            <div className="mini-card-top">
              <div className="mini-avatar"><Store size={20} /></div>
              <div>
                <strong>{lang === 'ar' ? 'صيدلية الأمين' : 'Pharmacie El Amine'}</strong>
                <span>{lang === 'ar' ? 'سيدي بلعباس · 0.4 كم' : 'Sidi Bel Abbès · 0.4 km'}</span>
              </div>
            </div>
            <div className="mini-card-status">
              <StatusPill stock={{ status: 'available', updated_at: Date.now() - 22 * 60_000, confirmed_by_pharmacist: true }} lang={lang} />
              <span>{lang === 'ar' ? 'محدّث منذ 22 دقيقة' : 'Updated 22 min ago'}</span>
            </div>
            <div className="mini-card-medicine">{lang === 'ar' ? sample.brand_ar : sample.brand_name}</div>
          </div>
          <div className="mini-card mini-card-float">
            <StatusPill stock={{ status: 'low', updated_at: Date.now() - 45 * 60_000 }} lang={lang} compact />
            <StatusPill stock={{ status: 'out', updated_at: Date.now() - 10 * 60_000 }} lang={lang} compact />
          </div>
          <div className="hero-orbit" />
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="section-head">
          <h2>{t('steps.title')}</h2>
          <p>{t('steps.sub')}</p>
        </div>
        <div className="steps-grid">
          <Step number="01" icon={<Search size={23} />} title={t('steps.1.title')} text={t('steps.1.desc')} />
          <Step number="02" icon={<MapPin size={23} />} title={t('steps.2.title')} text={t('steps.2.desc')} />
          <Step number="03" icon={<BellRing size={23} />} title={t('steps.3.title')} text={t('steps.3.desc')} />
        </div>
      </section>

      <section className="section">
        <div className="legend-panel">
          <div className="section-head inline">
            <div>
              <h2>{t('legend.title')}</h2>
              <p>{t('legend.note')}</p>
            </div>
            <span className="updated-example"><ShieldCheck size={15} /> {t('legend.updatedSample')}</span>
          </div>
          <div className="legend-pills">
            <StatusPill stock={{ status: 'available', updated_at: Date.now() }} lang={lang} />
            <StatusPill stock={{ status: 'low', updated_at: Date.now() }} lang={lang} />
            <StatusPill stock={{ status: 'out', updated_at: Date.now() }} lang={lang} />
            <StatusPill stock={{ status: 'available', updated_at: Date.now() - 6 * 60 * 60_000 }} lang={lang} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{t('benefits.title')}</h2>
          <p>{t('benefits.sub')}</p>
        </div>
        <div className="benefits-grid">
          <Benefit icon={<TrendingDown size={22} />} title={t('benefits.1.title')} text={t('benefits.1.desc')} />
          <Benefit icon={<Sparkles size={22} />} title={t('benefits.2.title')} text={t('benefits.2.desc')} />
          <Benefit icon={<Store size={22} />} title={t('benefits.3.title')} text={t('benefits.3.desc')} />
        </div>
        <Link className="inline-link" to="/pharmacy/login">
          {t('hero.cta.pharmacy')} <Forward size={17} />
        </Link>
      </section>

      <section className="section">
        <div className="privacy-banner">
          <div className="privacy-icon"><ShieldCheck size={26} /></div>
          <div>
            <h2>{t('privacy.title')}</h2>
            <p>{t('privacy.text')}</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
