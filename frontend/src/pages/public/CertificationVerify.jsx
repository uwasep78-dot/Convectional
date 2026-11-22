import { useState } from 'react'
import { FaGraduationCap, FaSearch, FaIdCard, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

const CERTS = [
  {name:'John Doe',course:'Electrical Installation Fundamentals',id:'CCR-ELEC-2024-001',date:'2024-06-15',status:'Verified'},
  {name:'Jane Smith',course:'Solar Energy Systems Introduction',id:'CCR-SOLAR-2024-002',date:'2024-07-10',status:'Verified'},
]

export default function CertificationVerify(){
  const [query,setQuery]=useState('')
  const [result,setResult]=useState(null)
  const verify=()=>{
    const c=CERTS.find(x=>x.id.toLowerCase()===query.toLowerCase()||x.name.toLowerCase()===query.toLowerCase())
    setResult(c)
  }
  return (
    <section className="section innovation-page">
      <div className="wrap">
        <div className="section-head center">
          <span class="kicker">Training Verification</span>
          <h2>Verify a Certificate</h2>
          <p>Employers and partners can validate CCR trainee certificates.</p>
        </div>
        <div className="verify-wrapper">
          <div className="verify-search">
            <h3>Search by name or certificate ID</h3>
            <div className="form-group"><label>Certificate ID or trainee name</label><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. CCR-ELEC-2024-001" /></div>
            <button className="btn btn-primary" onClick={verify}>Verify</button>
          </div>
          {result && (
            <div className="cert-card">
              <div className="cert-head"><FaGraduationCap size={32} /><span className={`badge ${result.status}`}>{result.status}</span></div>
              <div className="cert-body"><div className="cert-row"><strong>Trainee</strong><span>{result.name}</span></div><div className="cert-row"><strong>Course</strong><span>{result.course}</span></div><div className="cert-row"><strong>Certificate ID</strong><span>{result.id}</span></div><div className="cert-row"><strong>Date issued</strong><span>{new Date(result.date).toLocaleDateString()}</span></div></div>
              <div className="cert-foot"><button className="btn btn-outline">Download Certificate</button></div>
            </div>
          )}
          {!result && query && <p className="empty">No matching certificate found.</p>}
        </div>
      </div>
    </section>
  )
}