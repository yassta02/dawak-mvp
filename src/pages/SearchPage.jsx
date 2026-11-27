import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BellRing, ChevronDown, List, Map as MapIcon, Phone, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { Layout } from '../components/Layout'
import { ConfirmedBadge, EmptyState, FeedbackWidget, LocationButton, MapView, StatusPill, UpdatedAt, medicineMatches, medicineName, medicineSubtitle } from '../components/Ui'
import { NotifyModal } from '../components/NotifyModal'
import { CITY_CENTER, communeLabel, displayStatus, distanceKm } from '../data/seed'
import { useStore } from '../store'

const rank = { available: 0, low: 1, out: 2, stale: 3, none: 4 }

export function SearchPage() {
  const { t, lang, pharmacies, medicines, stocks, logMetric, showToast } = useStore()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [focused, setFocused] = useState(false)
  const [commune, setCommune] = useState('')
  const [origin, setOrigin] = useState(null)
  const [view, setView] = useState('list')
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [notifyMedicine, setNotifyMedicine] = useState('')
  const searchStarted = useRef(Date.now())

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    return medicines.filter((item) => medicineMatches(item, query)).slice(0, 8)
  }, [medicines, query])

  const selectedMedicine = useMemo(() => {
    if (selectedId) return medicines.find((item) => item.id === selectedId) || null
    const needle = query.trim().toLowerCase()
    if (!needle) return null
    return medicines.find((item) => [item.brand_name, item.brand_ar, item.dci, item.dci_ar].some((value) => String(value || '').toLowerCase() === needle)) || null
  }, [medicines, query, selectedId])

  const results = useMemo(() => {
    if (!selectedMedicine) return []
    const from = origin || CITY_CENTER
    return stocks
      .filter((row) => row.medicine_id === selectedMedicine.id)
      .map((row) => {
        const pharmacy = pharmacies.find((item) => item.id === row.pharmacy_id)
        if (!pharmacy || (commune && pharmacy.commune !== commune)) return null
        return { pharmacy, stock: row, distance: distanceKm(from, pharmacy), status: displayStatus(row) }
      })
      .filter(Boolean)
      .sort((a, b) => rank[a.status] - rank[b.status] || a.distance - b.distance)
  }, [commune, origin, pharmacies, selectedMedicine, stocks])

  const points = results.map((result) => ({
    lat: result.pharmacy.lat,
    lng: result.pharmacy.lng,
    name: lang === 'ar' ? result.pharmacy.name_ar : result.pharmacy.name,
    subtitle: `${communeLabel(result.pharmacy.commune, lang)} · ${result.distance.toFixed(1)} ${t('common.km')}`,
    status: result.status,
  }))

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude })
        showToast({ title: t('common.useLocation'), body: `${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`, kind: 'success' })
      },
      () => showToast({ title: t('common.useLocation'), body: lang === 'ar' ? 'تعذّر تحديد الموقع' : 'Position indisponible', kind: 'success' }),
    )
  }

  const openNotify = (medicineId) => {
    setNotifyMedicine(medicineId || '')
    setNotifyOpen(true)
  }

  const trackAction = (result, action) => {
    logMetric(`search.${action}`, {
      medicine_id: selectedMedicine?.id,
      pharmacy_id: result.pharmacy.id,
      status: result.status,
      seconds: Math.round((Date.now() - searchStarted.current) / 1000),
    })
  }

  const handleSelect = (medicine) => {
    setSelectedId(medicine.id)
    setQuery(lang === 'ar' ? medicine.brand_ar || medicine.brand_name : medicine.brand_name)
    setFocused(false)
    searchStarted.current = Date.now()
  }

  return (
    <Layout>
      <section className="page-head">
        <h1>{t('search.title')}</h1>
        <p>{t('search.sub')}</p>
      </section>

      <section className="search-tools">
        <div className="autocomplete-wrap">
          <Search className="input-icon" size={19} />
          <input
            className="search-input"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setSelectedId(''); setFocused(true) }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={t('common.searchPlaceholder')}
            aria-label={t('common.search')}
          />
          {focused && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((medicine) => (
                <button key={medicine.id} type="button" onMouseDown={() => handleSelect(medicine)}>
                  <span className="suggestion-name">{medicineName(medicine, lang)}</span>
                  <span className="suggestion-sub">{medicineSubtitle(medicine, lang)} · {medicine.form}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="filter-row">
          <label className="select-wrap">
            <SlidersHorizontal size={16} />
            <select value={commune} onChange={(event) => setCommune(event.target.value)} aria-label={t('common.commune')}>
              <option value="">{t('common.allCommunes')}</option>
              {[...new Set(pharmacies.map((item) => item.commune))].map((item) => (
                <option key={item} value={item}>{communeLabel(item, lang)}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          <LocationButton onClick={useMyLocation} active={Boolean(origin)} />
        </div>
      </section>

      {!selectedMedicine ? (
        <EmptyState title={t('search.start.title')} text={t('search.start.text')} action={
          <button className="button button-outline" onClick={() => openNotify()}>
            <BellRing size={17} /> {t('common.notifyMe')}
          </button>
        } />
      ) : (
        <>
          <div className="results-toolbar">
            <div>
              <strong>{results.length} {t('search.results')}</strong>
              <small>{t('search.sorted')}</small>
            </div>
            <div className="segmented" role="tablist">
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} role="tab">
                <List size={16} /> {t('common.list')}
              </button>
              <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')} role="tab">
                <MapIcon size={16} /> {t('common.map')}
              </button>
            </div>
          </div>

          {results.length === 0 ? (
            <EmptyState icon="bell" title={t('search.empty.title')} text={t('search.empty.text')} action={
              <button className="button button-primary" onClick={() => openNotify(selectedMedicine.id)}>
                <BellRing size={17} /> {t('common.notifyMe')}
              </button>
            } />
          ) : view === 'map' ? (
            <div className="results-map">
              <MapView points={points} center={origin || CITY_CENTER} zoom={origin ? 12 : 11} height={420} lang={lang} />
            </div>
          ) : (
            <div className="results-list">
              {results.map((result) => {
                const pharmacy = result.pharmacy
                return (
                  <article className="result-card" key={pharmacy.id}>
                    <div className="result-top">
                      <div>
                        <h2>{lang === 'ar' ? pharmacy.name_ar : pharmacy.name}</h2>
                        <p className="result-meta">
                          {communeLabel(pharmacy.commune, lang)} · {result.distance < 1 ? `<1 ${t('common.km')}` : `${result.distance.toFixed(1)} ${t('common.km')}`}
                        </p>
                      </div>
                      <StatusPill stock={result.stock} lang={lang} />
                    </div>
                    <div className="result-details">
                      <UpdatedAt stock={result.stock} lang={lang} />
                      {result.stock.confirmed_by_pharmacist && <ConfirmedBadge />}
                    </div>
                    <div className="result-actions">
                      <a className="button button-primary" href={`tel:${pharmacy.phone.replace(/[^\d+]/g, '')}`} onClick={() => trackAction(result, 'call')}>
                        <Phone size={17} /> {t('common.call')}
                      </a>
                      <Link className="button button-outline" to={`/pharmacy/${pharmacy.id}`} onClick={() => { trackAction(result, 'details'); searchStarted.current = Date.now() }}>
                        {t('common.details')}
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <div className="disclaimer"><ShieldCheck size={17} /> {t('search.disclaimer')}</div>
          <FeedbackWidget medicineId={selectedMedicine.id} />
        </>
      )}

      <NotifyModal open={notifyOpen} onClose={() => setNotifyOpen(false)} medicineId={notifyMedicine} commune={commune} />
    </Layout>
  )
}
