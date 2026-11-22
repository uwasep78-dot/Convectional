import { useState } from 'react'
import { FaVideo, FaCalendar, FaUser, FaHeadset, FaClock } from 'react-icons/fa'

export default function VideoConsultation(){
  const [step,setStep]=useState(1)
  const [form,setForm]=useState({topic:'',date:'',time:'',name:'',email:'',phone:''})
  const topics=['Solar Energy Consultation','Technical Maintenance Assessment','Training Program Advice','Tools & Materials Sourcing','General Technical Query']
  const next=()=>setStep(s=>s<3?s+1:s)
  const back=()=>setStep(s=>s>1?s-1:s)
  const submit=(e)=>{e.preventDefault();localStorage.setItem('ccr-video',JSON.stringify({...form,id:Date.now(),status:'Scheduled'}));setStep(3)}
  return (
    <section className="section innovation-page">
      <div className="wrap">
        <div className="section-head center">
          <span class="kicker">Remote Support</span>
          <h2>Video Consultation</h2>
          <p>Book a remote technical assessment with our experts before a site visit.</p>
        </div>
        <div className="video-wrapper">
          {step===1 && (
            <>
              <div className="video-card"><FaVideo size={48} /><h3>Choose consultation topic</h3>
              <div className="topic-options">{topics.map(t=><button key={t} className={`topic ${form.topic===t?'selected':''}`} onClick={()=>setForm({...form,topic:t})}>{t}</button>)}</div>
              <button className="btn btn-primary" onClick={next} disabled={!form.topic}>Next</button></div>
            </>
          )}
          {step===2 && (
            <>
              <div className="video-card"><FaCalendar size={48} /><h3>Select date & time</h3>
              <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
              <div className="form-group"><label>Time</label><select value={form.time} onChange={e=>setForm({...form,time:e.target.value})}><option value="">Select</option>{['9:00 AM','11:00 AM','2:00 PM','4:00 PM'].map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="form-group"><label>Your name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div className="nav-buttons"><button className="btn btn-outline" onClick={back}>Back</button><button className="btn btn-primary" onClick={next} disabled={!form.date||!form.time||!form.name||!form.email}>Next</button></div>
              <p className="note">A secure video link will be emailed to you before the session.</p>
              </div>
            </>
          )}
          {step===3 && (
            <>
              <div className="success-card"><FaCheckCircle size={48} color="#39A96B" /><h3>Consultation Scheduled</h3><p>Your video consultation is booked. Check your email for the meeting link.</p><button className="btn btn-primary" onClick={()=>{setStep(1);setForm({topic:'',date:'',time:'',name:'',email:'',phone:''})}}>Book Another</button></div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}