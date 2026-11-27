import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createSeed, hashPassword } from './data/seed'
import { translate } from './i18n'

const STORAGE_KEY = 'dawak-mvp-v1'
const StoreContext = createContext(null)

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.pharmacies) && Array.isArray(parsed.medicines) && Array.isArray(parsed.stocks)) {
        return parsed
      }
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return createSeed()
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(loadState)
  const [toast, setToast] = useState(null)

  const t = useCallback((key) => translate(data.lang || 'ar', key), [data.lang])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    const lang = data.lang || 'ar'
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [data.lang])

  const showToast = useCallback((next) => {
    setToast({ ...next, id: Date.now() + Math.random() })
  }, [])

  const setLang = useCallback((lang) => {
    setData((prev) => ({ ...prev, lang }))
  }, [])

  const commitNotifications = useCallback((transitions, alerts, lang) => {
    if (!transitions.length) return alerts
    const ids = new Set(transitions.map((item) => item.alert.id))
    const now = Date.now()
    const lines = transitions.map(({ alert, medicine, pharmacy }) => {
      const message = `[Dawak] Alert sent to ${alert.contact}: ${medicine.brand_name} is available at ${pharmacy.name}`
      console.log(message)
      return `${medicine.brand_name} → ${alert.contact}`
    })
    showToast({
      title: translate(lang || 'ar', 'toast.alertTitle'),
      body: `${translate(lang || 'ar', 'toast.alertBody')} ${lines.join(' · ')}`,
      kind: 'alert',
    })
    return alerts.map((alert) => (ids.has(alert.id) ? { ...alert, notified_at: now } : alert))
  }, [showToast])

  const findTransitions = useCallback((prevStock, nextStatus, medicine, pharmacy, alerts) => {
    if (!prevStock || prevStock.status !== 'out' || nextStatus !== 'available') return []
    const now = Date.now()
    return alerts
      .filter((alert) => !alert.notified_at && alert.medicine_id === medicine.id && (!alert.commune || alert.commune === pharmacy.commune))
      .map((alert) => ({ alert, medicine, pharmacy, now }))
  }, [])

  const updateStock = useCallback((pharmacyId, medicineId, status) => {
    const pharmacy = data.pharmacies.find((item) => item.id === pharmacyId)
    const medicine = data.medicines.find((item) => item.id === medicineId)
    if (!pharmacy || !medicine) return
    const previous = data.stocks.find((row) => row.pharmacy_id === pharmacyId && row.medicine_id === medicineId)
    const transitions = findTransitions(previous, status, medicine, pharmacy, data.alerts)
    const nextAlerts = commitNotifications(transitions, data.alerts, data.lang)
    const now = Date.now()
    const nextRow = {
      pharmacy_id: pharmacyId,
      medicine_id: medicineId,
      status,
      updated_at: now,
      confirmed_by_pharmacist: true,
    }
    setData((prev) => {
      const exists = prev.stocks.some((row) => row.pharmacy_id === pharmacyId && row.medicine_id === medicineId)
      return {
        ...prev,
        stocks: exists
          ? prev.stocks.map((row) => (row.pharmacy_id === pharmacyId && row.medicine_id === medicineId ? nextRow : row))
          : [...prev.stocks, nextRow],
        alerts: nextAlerts,
        lastFullUpdate: now,
      }
    })
  }, [data, commitNotifications, findTransitions])

  const bulkUpdate = useCallback((pharmacyId, status) => {
    const pharmacy = data.pharmacies.find((item) => item.id === pharmacyId)
    if (!pharmacy) return
    const now = Date.now()
    const transitions = []
    const nextRows = data.medicines.map((medicine) => {
      const previous = data.stocks.find((row) => row.pharmacy_id === pharmacyId && row.medicine_id === medicine.id)
      transitions.push(...findTransitions(previous, status, medicine, pharmacy, data.alerts))
      return {
        pharmacy_id: pharmacyId,
        medicine_id: medicine.id,
        status,
        updated_at: now,
        confirmed_by_pharmacist: true,
      }
    })
    const nextAlerts = commitNotifications(transitions, data.alerts, data.lang)
    setData((prev) => ({
      ...prev,
      stocks: [...prev.stocks.filter((row) => row.pharmacy_id !== pharmacyId), ...nextRows],
      alerts: nextAlerts,
      lastFullUpdate: now,
    }))
  }, [data, commitNotifications, findTransitions])

  const addAlert = useCallback(({ medicine_id, contact, commune }) => {
    const alert = {
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      medicine_id,
      contact,
      commune: commune || '',
      created_at: Date.now(),
      notified_at: null,
    }
    setData((prev) => ({ ...prev, alerts: [...prev.alerts, alert] }))
    console.log('[Dawak] AlertRequest saved', alert)
    showToast({ title: translate(data.lang || 'ar', 'notify.saved'), body: contact, kind: 'success' })
    return alert
  }, [data.lang, showToast])

  const addFeedback = useCallback(({ rating, comment, medicine_id }) => {
    const feedback = {
      id: `f-${Date.now()}`,
      rating,
      comment,
      medicine_id: medicine_id || null,
      created_at: Date.now(),
    }
    setData((prev) => ({ ...prev, feedbacks: [...prev.feedbacks, feedback] }))
    console.log('[Dawak] Feedback saved', feedback)
  }, [])

  const login = useCallback((email, password) => {
    const user = data.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
    if (!user || user.password_hash !== hashPassword(password)) return null
    setData((prev) => ({ ...prev, session: { user_id: user.id, pharmacy_id: user.pharmacy_id } }))
    return user
  }, [data.users])

  const logout = useCallback(() => {
    setData((prev) => ({ ...prev, session: null }))
  }, [])

  const resetDemo = useCallback(() => {
    setData(createSeed())
    showToast({ title: translate(data.lang || 'ar', 'toast.savedTitle'), body: 'Demo data reset', kind: 'success' })
  }, [data.lang, showToast])

  const logMetric = useCallback((event, payload = {}) => {
    console.log('[Dawak:metric]', event, { at: new Date().toISOString(), ...payload })
  }, [])

  const value = useMemo(() => ({
    ...data,
    t,
    setLang,
    showToast,
    updateStock,
    bulkUpdate,
    addAlert,
    addFeedback,
    login,
    logout,
    resetDemo,
    logMetric,
    toast,
    dismissToast: () => setToast(null),
  }), [data, t, setLang, showToast, updateStock, bulkUpdate, addAlert, addFeedback, login, logout, resetDemo, logMetric, toast])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}
