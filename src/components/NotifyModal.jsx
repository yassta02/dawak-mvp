import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Modal, medicineName } from './Ui'
import { useStore } from '../store'
import { communeLabel } from '../data/seed'

export function NotifyModal({ open, onClose, medicineId, commune = '' }) {
  const { t, lang, medicines, pharmacies, addAlert } = useStore()
  const [selectedMedicine, setSelectedMedicine] = useState(medicineId || medicines[0]?.id || '')
  const [contact, setContact] = useState('')
  const [selectedCommune, setSelectedCommune] = useState(commune)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelectedMedicine(medicineId || medicines[0]?.id || '')
    setSelectedCommune(commune)
    setContact('')
    setError('')
    setDone(false)
  }, [open, medicineId, commune, medicines])

  const submit = (event) => {
    event.preventDefault()
    const value = contact.trim()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    const isPhone = /^[+\d][\d\s().-]{7,}$/.test(value)
    if (!isEmail && !isPhone) {
      setError(t('notify.error'))
      return
    }
    addAlert({ medicine_id: selectedMedicine, contact: value, commune: selectedCommune })
    setDone(true)
  }

  return (
    <Modal open={open} onClose={onClose} title={t('notify.title')}>
      {done ? (
        <div className="modal-success">
          <CheckCircle2 size={42} />
          <h3>{t('notify.success')}</h3>
          <p>{t('notify.saved')}</p>
          <button className="button button-primary button-full" onClick={onClose}>{t('common.close')}</button>
        </div>
      ) : (
        <form className="form-stack" onSubmit={submit}>
          <p className="modal-sub">{t('notify.sub')}</p>
          <label>
            <span>{t('notify.medicine')}</span>
            <select value={selectedMedicine} onChange={(event) => setSelectedMedicine(event.target.value)}>
              {medicines.map((medicine) => (
                <option key={medicine.id} value={medicine.id}>{medicineName(medicine, lang)}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{t('notify.contact')}</span>
            <input
              value={contact}
              onChange={(event) => { setContact(event.target.value); setError('') }}
              type="text"
              inputMode="email"
              placeholder="0555 123 456"
              autoComplete="off"
            />
            <small>{t('notify.contactHint')}</small>
          </label>
          <label>
            <span>{t('notify.commune')}</span>
            <select value={selectedCommune} onChange={(event) => setSelectedCommune(event.target.value)}>
              <option value="">{t('common.allCommunes')}</option>
              {[...new Set(pharmacies.map((item) => item.commune))].map((item) => (
                <option key={item} value={item}>{communeLabel(item, lang)}</option>
              ))}
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="button button-ghost" onClick={onClose}>{t('common.cancel')}</button>
            <button type="submit" className="button button-primary">{t('common.send')}</button>
          </div>
        </form>
      )}
    </Modal>
  )
}
