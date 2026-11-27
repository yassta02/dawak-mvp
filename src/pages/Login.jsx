import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail, Store } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useStore } from '../store'

const demoAccounts = [
  { email: 'amine@sba.dz', pharmacy: 'Pharmacie El Amine' },
  { email: 'benbara@sba.dz', pharmacy: 'Pharmacie Benbara' },
  { email: 'ainelberd@sba.dz', pharmacy: 'Pharmacie Aïn El Berd' },
]

export function Login() {
  const { t, session, login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (session) return <Navigate to="/pharmacy/dashboard" replace />

  const submit = (event) => {
    event.preventDefault()
    const user = login(email, password)
    if (!user) {
      setError(t('login.error'))
      return
    }
    navigate('/pharmacy/dashboard')
  }

  return (
    <Layout hideFooter>
      <section className="auth-card card">
        <div className="auth-icon"><Store size={28} /></div>
        <h1>{t('login.title')}</h1>
        <p className="auth-sub">{t('login.sub')}</p>

        <form className="form-stack" onSubmit={submit}>
          <label>
            <span>{t('login.email')}</span>
            <div className="input-with-icon"><Mail size={17} /><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} required /></div>
          </label>
          <label>
            <span>{t('login.password')}</span>
            <div className="input-with-icon"><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} required /></div>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-primary button-full button-lg" type="submit">{t('login.button')}</button>
        </form>

        <div className="demo-accounts">
          <h2>{t('login.demo')}</h2>
          <p>{t('login.hint')}</p>
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              className="demo-account"
              onClick={() => { setEmail(account.email); setPassword('demo1234'); setError('') }}
            >
              <span><strong>{account.pharmacy}</strong><small>{account.email} · demo1234</small></span>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>

        <p className="auth-footer">
          {t('login.join')} <a href="mailto:contact@dawak.dz">{t('login.contact')}</a>
        </p>
      </section>
    </Layout>
  )
}
