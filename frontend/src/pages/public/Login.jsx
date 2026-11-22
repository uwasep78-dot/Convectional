import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="wrap login-wrap">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to access your CCR account.</p>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input type="email" name="email" value={form.email} onChange={change} required />
            </div>
            <div className="form-group">
              <label><FaLock /> Password</label>
              <input type="password" name="password" value={form.password} onChange={change} required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="login-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
          <p className="login-footer"><Link to="/">Back to home</Link></p>
        </div>
      </div>
    </section>
  )
}