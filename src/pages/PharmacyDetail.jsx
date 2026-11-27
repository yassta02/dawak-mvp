import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock3, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { Layout } from '../components/Layout'
import { ConfirmedBadge, EmptyState, MapView, StatusPill, UpdatedAt, medicineName, medicineSubtitle } from '../components/Ui'
import { communeLabel, displayStatus } from '../data/seed'
import { useStore } from '../store'

const rank = { available: 0, low: 1, out: 2, stale: 3 }

export function PharmacyDetail() {
  const { id } = useParams()
  const { t, lang, pharmacies, medicines, stocks } = useStore()
  const pharmacy = pharmacies.find((item) => item.id === id)
  const rows = stocks
    .filter((row) => row.pharmacy_id === id)
    .sort((a, b) => rank[displayStatus(a)] - rank[displayStatus(b)] || b.updated_at - a.updated_at)

  if (!pharmacy) {
    return (
      <Layout>
        <EmptyState title={t('common.back')} text={t('search.start.text')} action={<Link className="button button-primary" to="/search">{t('common.search')}</Link>} />
      </Layout>
    )
  }

  const name = lang === 'ar' ? pharmacy.name_ar : pharmacy.name
  const address = lang === 'ar' ? pharmacy.address_ar : pharmacy.address
  const points = [{ lat: pharmacy.lat, lng: pharmacy.lng, name, subtitle: communeLabel(pharmacy.commune, lang), status: 'available' }]
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft

  return (
    <Layout>
      <Link className="back-link" to="/search"><BackIcon size={17} /> {t('common.back')}</Link>

      <section className="detail-hero card">
        <div className="detail-hero-top">
          <div className="detail-avatar"><MapPin size={25} /></div>
          <div>
            <span className="detail-commune">{communeLabel(pharmacy.commune, lang)}</span>
            <h1>{name}</h1>
          </div>
        </div>
        <div className="detail-info">
          <p><MapPin size={17} /> {address}</p>
          <p><Phone size={17} /> {pharmacy.phone}</p>
          <p><Clock3 size={17} /> {t('detail.hours')}: {pharmacy.hours}</p>
        </div>
        <a className="button button-primary button-full" href={`tel:${pharmacy.phone.replace(/[^\d+]/g, '')}`}>
          <Phone size={18} /> {t('detail.call')}
        </a>
      </section>

      <section className="section compact-section">
        <div className="section-head inline">
          <h2>{t('detail.map')}</h2>
          <span className="muted"><ShieldCheck size={15} /> OpenStreetMap</span>
        </div>
        <div className="results-map"><MapView points={points} center={{ lat: pharmacy.lat, lng: pharmacy.lng }} zoom={14} height={230} lang={lang} /></div>
      </section>

      <section className="section compact-section">
        <div className="section-head">
          <h2>{t('detail.medicines')}</h2>
          <p>{rows.length} {t('dashboard.count')}</p>
        </div>
        {rows.length === 0 ? (
          <EmptyState title={t('detail.empty')} text={t('search.sub')} />
        ) : (
          <div className="detail-medicines card">
            {rows.map((row) => {
              const medicine = medicines.find((item) => item.id === row.medicine_id)
              return (
                <div className="detail-medicine-row" key={`${row.pharmacy_id}-${row.medicine_id}`}>
                  <div>
                    <strong>{medicineName(medicine, lang)}</strong>
                    <span>{medicineSubtitle(medicine, lang)}</span>
                  </div>
                  <div className="detail-medicine-status">
                    <StatusPill stock={row} lang={lang} compact />
                    <UpdatedAt stock={row} lang={lang} />
                    {row.confirmed_by_pharmacist && <ConfirmedBadge />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="disclaimer"><ShieldCheck size={17} /> {t('search.disclaimer')}</div>
    </Layout>
  )
}
