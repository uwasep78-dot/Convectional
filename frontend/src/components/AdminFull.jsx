import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

export function AdminFull() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const path = location.pathname
  const isAdmin = user && ['superadmin','managing_director','manager'].includes(user.role)
  
  if (!user) return <div style={{padding:40,textAlign:'center'}}><p>Please sign in to access admin.</p><Link to="/login" className="btn btn-primary">Sign In</Link></div>
  if (!isAdmin) return <div style={{padding:40,textAlign:'center'}}><p>Access denied</p><button className="btn btn-outline" onClick={()=>logout()}>Sign out</button></div>
  
  const section = path.split('/admin/')[1]?.split('/')[0] || 'dashboard'
  
  return (
    <div style={{padding:'20px 0'}}>
      <div className="wrap">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:30,flexWrap:'wrap',gap:10}}>
          <h2>Admin Dashboard</h2>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <Link to="/admin/services" className="btn btn-outline">Services</Link>
            <Link to="/admin/products" className="btn btn-outline">Products</Link>
            <Link to="/admin/quotations" className="btn btn-outline">Quotations</Link>
            <Link to="/admin/enquiries" className="btn btn-outline">Enquiries</Link>
            <Link to="/admin/customers" className="btn btn-outline">Users</Link>
            <Link to="/admin/courses" className="btn btn-outline">Courses</Link>
            <Link to="/admin/registrations" className="btn btn-outline">Applications</Link>
            <button className="btn btn-outline" onClick={()=>logout()}>Sign out</button>
          </div>
        </div>
        {section === 'dashboard' ? <AdminDashboardHome /> : <AdminSection section={section} />}
      </div>
    </div>
  )
}

function AdminDashboardHome() {
  return (
    <div className="admin-grid">
      <div className="admin-card"><h3>Services</h3><p>Manage services</p><Link to="/admin/services" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Products</h3><p>Manage products</p><Link to="/admin/products" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Projects</h3><p>Manage projects</p><Link to="/admin/projects" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Quotations</h3><p>Manage quotations</p><Link to="/admin/quotations" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Enquiries</h3><p>Manage enquiries</p><Link to="/admin/enquiries" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Users/Customers</h3><p>Manage users</p><Link to="/admin/customers" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Training/Courses</h3><p>Manage courses</p><Link to="/admin/courses" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Training Applications</h3><p>View/manage applications</p><Link to="/admin/registrations" className="btn btn-primary">Manage Applications</Link></div>
      <div className="admin-card"><h3>Maintenance</h3><p>Manage maintenance</p><Link to="/admin/maintenance" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Gallery</h3><p>Manage gallery</p><Link to="/admin/gallery" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Notifications</h3><p>Manage notifications</p><Link to="/admin/notifications" className="btn btn-primary">Manage</Link></div>
      <div className="admin-card"><h3>Settings</h3><p>Site settings</p><Link to="/admin/settings" className="btn btn-primary">Manage</Link></div>
    </div>
  )
}

function AdminSection({ section }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({})
  const [editId, setEditId] = useState(null)
  
  const endpoints = {
    services: '/services',
    products: '/products',
    categories: '/categories',
    projects: '/projects',
    courses: '/training',
    training: '/training',
    quotations: '/quotations',
    enquiries: '/contact',
    customers: '/users',
    maintenance: '/maintenance',
    gallery: '/gallery',
    notifications: '/notifications',
    registrations: '/enrollments',
    settings: '/settings'
  }
  
  const endpoint = endpoints[section] || `/${section}`
  
  useEffect(() => {
    fetchItems()
  }, [section])
  
  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await api.get(endpoint)
      setItems(res.data.data || res.data.items || res.data || [])
    } catch (e) {
      console.error(e)
      setItems([])
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await api.put(`${endpoint}/${editId}`, form)
      } else {
        await api.post(endpoint, form)
      }
      setShowForm(false)
      setForm({})
      setEditId(null)
      fetchItems()
      alert('Saved successfully')
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving')
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await api.delete(`${endpoint}/${id}`)
      fetchItems()
      alert('Deleted successfully')
    } catch (e) {
      alert(e.response?.data?.message || 'Error deleting')
    }
  }
  
  const handleEdit = (item) => {
    setForm(item)
    setEditId(item._id || item.id)
    setShowForm(true)
  }
  
  const getDisplayName = (item) => {
    return item.name || item.title || item.fullName || item.student?.name || item.course?.name || item.subject || item.email || 'N/A'
  }
  
  return (
    <div>
      <div style={{marginBottom:20, display:'flex', gap:10, flexWrap:'wrap'}}>
        <button className="btn btn-primary" onClick={()=>{setShowForm(true); setForm({}); setEditId(null)}}><FaPlus /> Add New</button>
      </div>
      
      {showForm && (
        <div style={{background:'#f9f9f9',padding:20,borderRadius:8,marginBottom:20}}>
          <h3>{editId ? 'Edit' : 'Add New'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{display:'grid',gap:10}}>
              <input placeholder="Name/Title" value={form.name||form.title||form.fullName||''} onChange={e=>setForm({...form,name:e.target.value,title:e.target.value,fullName:e.target.value})} style={{padding:10}} />
              <input placeholder="Email" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} style={{padding:10}} />
              <input placeholder="Phone" value={form.phone||form.phoneNumber||''} onChange={e=>setForm({...form,phone:e.target.value,phoneNumber:e.target.value})} style={{padding:10}} />
              <textarea placeholder="Description/Details/Notes" value={form.description||form.details||form.notes||form.message||''} onChange={e=>setForm({...form,description:e.target.value,details:e.target.value,notes:e.target.value,message:e.target.value})} style={{padding:10,minHeight:80}} />
              {section === 'registrations' && <select value={form.status||'pending'} onChange={e=>setForm({...form,status:e.target.value})} style={{padding:10}}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="completed">Completed</option><option value="active">Active</option></select>}
              {section === 'quotations' && <select value={form.status||'pending'} onChange={e=>setForm({...form,status:e.target.value})} style={{padding:10}}><option value="pending">Pending</option><option value="reviewing">Reviewing</option><option value="quoted">Quoted</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select>}
              {section === 'enquiries' && <select value={form.status||'pending'} onChange={e=>setForm({...form,status:e.target.value})} style={{padding:10}}><option value="pending">Pending</option><option value="read">Read</option><option value="replied">Replied</option><option value="closed">Closed</option></select>}
            </div>
            <div style={{display:'flex',gap:10,marginTop:10}}>
              <button className="btn btn-primary" type="submit">Save</button>
              <button className="btn btn-outline" type="button" onClick={()=>{setShowForm(false);setEditId(null);setForm({})}}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? <p>Loading...</p> : (
        <div style={{overflowX:'auto',background:'white',borderRadius:8}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f5f5f5'}}>
                <th style={{padding:12,textAlign:'left'}}>Name/Title</th>
                <th style={{padding:12,textAlign:'left'}}>Contact/Info</th>
                <th style={{padding:12,textAlign:'left'}}>Status</th>
                <th style={{padding:12,textAlign:'left'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item,idx) => (
                <tr key={item._id||idx} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:12}}>{getDisplayName(item)}</td>
                  <td style={{padding:12}}>{item.email||item.phone||item.code||item.subject||'-'}</td>
                  <td style={{padding:12}}>{item.status||item.paymentStatus||'-'}</td>
                  <td style={{padding:12,display:'flex',gap:5}}>
                    <button className="btn btn-outline" onClick={()=>handleEdit(item)} title="Edit"><FaEdit /></button>
                    <button className="btn btn-outline" onClick={()=>handleDelete(item._id||item.id)} title="Delete"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{textAlign:'center',padding:30}}>No items found</p>}
        </div>
      )}
    </div>
  )
}

export default AdminFull
