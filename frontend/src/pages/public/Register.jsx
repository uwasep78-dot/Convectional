import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'customer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="wrap login-wrap">
        <div className="login-card">
          <div className="login-header">
            <h2>Create an account</h2>
            <p>Join CCR and access services, quotations, and training.</p>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label><FaUser /> Full name</label>
              <input type="text" name="name" value={form.name} onChange={change} required />
            </div>
            <div className="form-group">
              <label><FaPhone /> Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={change} />
            </div>
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input type="email" name="email" value={form.email} onChange={change} required />
            </div>
            <div className="form-group">
              <label><FaLock /> Password</label>
              <input type="password" name="password" value={form.password} onChange={change} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={change}>
                <option value="customer">Customer</option>
              </select>
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>
          <p className="login-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <p className="login-footer"><Link to="/">Back to home</Link></p>
        </div>
      </div>
    </section>
  )
}