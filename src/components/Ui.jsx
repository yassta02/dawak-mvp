import { useEffect, useRef, useState } from 'react'
import { BellRing, Check, CheckCircle2, MapPin, Navigation, Star, X } from 'lucide-react'
import L from 'leaflet'
import { displayStatus } from '../data/seed'
import { useStore } from '../store'

export function medicineName(medicine, lang) {
  if (!medicine) return ''
  return lang === 'ar' ? medicine.brand_ar || medicine.brand_name : medicine.brand_name
}

export function medicineSubtitle(medicine, lang) {
  if (!medicine) return ''
  return lang === 'ar' ? medicine.dci_ar || medicine.dci : medicine.dci
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim()
}

export function medicineMatches(medicine, query) {
  const needle = normalize(query)
  if (!needle) return true
  return [medicine.brand_name, medicine.brand_ar, medicine.dci, medicine.dci_ar].some((value) => normalize(value).includes(needle))
}

export function formatAgo(timestamp, lang, prefix) {
  const diff = Math.max(0, Date.now() - (timestamp || Date.now()))
  if (diff < 60_000) return lang === 'ar' ? 'محدّث الآن' : 'Mis à jour à l’instant'
  const minutes = Math.floor(diff / 60_000)
  const label = lang === 'ar' ? 'محدّث منذ' : 'Mis à jour il y a'
  const unit = lang === 'ar' ? 'دقيقة' : 'min'
  if (minutes < 60) return `${prefix ? `${label} ` : ''}${minutes} ${unit}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${prefix ? `${label} ` : ''}${hours} ${lang === 'ar' ? 'ساعة' : 'h'}`
  const days = Math.floor(hours / 24)
  return `${prefix ? `${label} ` : ''}${days} ${lang === 'ar' ? 'يوم' : 'j'}`
}

export function Logo({ className = '' }) {
  return <img src="/Dawak_Logo_Transparent.png" alt="Dawak — دواك" className={`dawak-logo ${className}`} />
}

export function StatusPill({ stock, lang, showTime = true, compact = false }) {
  const { t } = useStore()
  const status = displayStatus(stock)
  if (status === 'none') {
    return <span className={`status-pill status-none ${compact ? 'compact' : ''}`}>{t('common.noData')}</span>
  }
  return (
    <span className={`status-pill status-${status} ${compact ? 'compact' : ''}`}>
      <span className="status-dot" />
      {t(`legend.${status}`)}
    </span>
  )
}

export function UpdatedAt({ stock, lang }) {
  const { t } = useStore()
  if (!stock) return <span className="muted">{t('common.noData')}</span>
  return <span className="muted"><CheckCircle2 size={14} /> {formatAgo(stock.updated_at, lang, true)}</span>
}

export function ConfirmedBadge() {
  const { t } = useStore()
  return (
    <span className="confirmed-badge">
      <CheckCircle2 size={14} /> {t('common.confirmed')}
    </span>
  )
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toast() {
  const { toast, dismissToast } = useStore()
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(dismissToast, 6000)
    return () => clearTimeout(timer)
  }, [toast, dismissToast])

  if (!toast) return null
  return (
    <div className={`toast toast-${toast.kind || 'success'}`} role="status">
      <span className="toast-icon">{toast.kind === 'alert' ? <BellRing size={20} /> : <Check size={20} />}</span>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.body}</p>
      </div>
      <button className="icon-button" onClick={dismissToast} aria-label="Close"><X size={18} /></button>
    </div>
  )
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

export function MapView({ points = [], center, zoom = 12, height = 320, lang = 'ar' }) {
  const container = useRef(null)
  const pointsKey = JSON.stringify(points)
  const centerKey = `${center.lat},${center.lng},${zoom}`

  useEffect(() => {
    if (!container.current) return undefined
    const map = L.map(container.current, { zoomControl: false, scrollWheelZoom: false }).setView(center, zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    L.control.zoom({ position: lang === 'ar' ? 'bottomleft' : 'bottomright' }).addTo(map)

    points.forEach((point) => {
      const icon = L.divIcon({
        className: 'dawak-pin-wrap',
        html: `<span class="dawak-pin pin-${escapeHtml(point.status || 'none')}"></span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      })
      L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindPopup(`<div class="map-popup"><strong>${escapeHtml(point.name)}</strong>${point.subtitle ? `<br><span>${escapeHtml(point.subtitle)}</span>` : ''}</div>`)
    })

    const timer = setTimeout(() => map.invalidateSize(), 120)
    return () => {
      clearTimeout(timer)
      map.remove()
    }
  }, [pointsKey, centerKey, lang])

  return <div className="map-view" ref={container} style={{ height }} />
}

export function LocationButton({ onClick, active }) {
  const { t } = useStore()
  return (
    <button type="button" className={`chip-button ${active ? 'active' : ''}`} onClick={onClick}>
      <Navigation size={15} /> {t('common.useLocation')}
    </button>
  )
}

export function EmptyState({ icon = 'search', title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon === 'bell' ? <BellRing size={30} /> : <MapPin size={30} />}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  )
}

export function FeedbackWidget({ medicineId }) {
  const { t, addFeedback } = useStore()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    if (!rating) return
    addFeedback({ rating, comment, medicine_id: medicineId })
    setSent(true)
  }

  return (
    <form className="feedback-card" onSubmit={submit}>
      <div className="feedback-head">
        <div>
          <h3>{t('feedback.title')}</h3>
          <p>{t('feedback.sub')}</p>
        </div>
        <Star size={22} className="feedback-star-icon" />
      </div>
      {sent ? (
        <p className="feedback-thanks"><CheckCircle2 size={18} /> {t('feedback.thanks')}</p>
      ) : (
        <>
          <div className="star-row" role="radiogroup" aria-label={t('feedback.title')}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`star-button ${value <= rating ? 'selected' : ''}`}
                onClick={() => setRating(value)}
                aria-label={`${value} stars`}
              >
                <Star size={26} fill={value <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder={t('feedback.placeholder')} rows={2} />
          <button className="button button-primary button-full" type="submit" disabled={!rating}>{t('feedback.send')}</button>
        </>
      )}
    </form>
  )
}
