import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AlertTriangle, Ban, Check, CheckCircle2, Clock3, LogOut, Search, ShieldCheck, Users } from 'lucide-react'
import { Layout } from '../components/Layout'
import { StatusPill, formatAgo, medicineName, medicineSubtitle } from '../components/Ui'
import { displayStatus } from '../data/seed'
import { useStore } from '../store'

const options = [
  { status: 'available', icon: CheckCircle2, className: 'available' },
  { status: 'low', icon: AlertTriangle, className: 'low' },
  { status: 'out', icon: Ban, className: 'out' },
]

export function Dashboard() {
  const { t, lang, session, pharmacies, medicines, stocks, alerts, lastFullUpdate, logout, updateStock, bulkUpdate } = useStore()
  const [filter, setFilter] = useState('')
  const [saved, setSaved] = useState('')

  if (!session) return <Navigate to="/pharmacy/login" replace />

  const pharmacy = pharmacies.find((item) => item.id === session.pharmacy_id)
  if (!pharmacy) return <Navigate to="/pharmacy/login" replace />

  const flagSaved = (key) => {
    setSaved(key)
    setTimeout(() => setSaved(''), 1400)
  }

  const visible = medicines.filter((medicine) => {
    const needle = filter.trim().toLowerCase()
    return !needle || [medicine.brand_name, medicine.brand_ar, medicine.dci, medicine.dci_ar].some((value) => String(value || '').toLowerCase().includes(needle))
  })

  const openAlerts = alerts.filter((alert) => !alert.notified_at).length

  return (
    <Layout hideFooter>
      <section className="dashboard-header card">
        <div>
          <span className="eyebrow"><ShieldCheck size={14} /> {t('nav.pharmacy')}</span>
          <h1>{lang === 'ar' ? pharmacy.name_ar : pharmacy.name}</h1>
          <p className="last-update"><Clock3 size={16} /> {t('dashboard.lastUpdate')}: {formatAgo(lastFullUpdate, lang, false)}</p>
        </div>
        <button className="button button-ghost" onClick={logout}><LogOut size={17} /> {t('dashboard.logout')}</button>
      </section>

      <section className="dashboard-shortcuts">
        <button className="button button-available" onClick={() => { bulkUpdate(pharmacy.id, 'available'); flagSaved('all') }}>
          <CheckCircle2 size={18} /> {t('dashboard.markAllAvailable')}
        </button>
        <button className="button button-out" onClick={() => { bulkUpdate(pharmacy.id, 'out'); flagSaved('all') }}>
          <Ban size={18} /> {t('dashboard.markAllOut')}
        </button>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-list">
          <div className="search-tools compact-tools">
            <div className="autocomplete-wrap">
              <Search className="input-icon" size={18} />
              <input className="search-input" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder={t('dashboard.searchPlaceholder')} />
            </div>
            <span className="med-count">{visible.length} {t('dashboard.count')}</span>
          </div>

          <div className="stock-list">
            {visible.map((medicine) => {
              const stock = stocks.find((row) => row.pharmacy_id === pharmacy.id && row.medicine_id === medicine.id)
              const key = `${pharmacy.id}-${medicine.id}`
              return (
                <article className="stock-row" key={medicine.id}>
                  <div className="stock-row-head">
                    <div>
                      <strong>{medicineName(medicine, lang)}</strong>
                      <span>{medicineSubtitle(medicine, lang)}</span>
                    </div>
                    <div className="stock-row-status">
                      <StatusPill stock={stock} lang={lang} compact />
                      <small>{stock ? formatAgo(stock.updated_at, lang, false) : t('common.noData')}</small>
                      {saved === key && <span className="saved-flag"><Check size={13} /> {t('dashboard.saved')}</span>}
                    </div>
                  </div>
                  <div className="status-buttons">
                    {options.map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.status}
                          className={`status-button ${option.className} ${stock?.status === option.status && displayStatus(stock) !== 'stale' ? 'active' : ''}`}
                          onClick={() => { updateStock(pharmacy.id, medicine.id, option.status); flagSaved(key) }}
                          aria-label={`${medicineName(medicine, lang)} — ${t(`legend.${option.status}`)}`}
                        >
                          <Icon size={19} />
                          <span>{t(`legend.${option.status}`)}</span>
                        </button>
                      )
                    })}
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="pending-card card">
            <div className="pending-icon"><Users size={23} /></div>
            <h2>{t('dashboard.pending')}</h2>
            <p>{t('dashboard.pendingText')}</p>
            <span className="pending-count">{openAlerts}</span>
          </div>
          <div className="dashboard-note card">
            <ShieldCheck size={20} />
            <p>{t('privacy.text')}</p>
          </div>
          {saved === 'all' && <div className="saved-flag big"><Check size={15} /> {t('dashboard.saved')}</div>}
        </aside>
      </section>

      <div className="disclaimer"><ShieldCheck size={17} /> {t('search.disclaimer')}</div>
    </Layout>
  )
}
