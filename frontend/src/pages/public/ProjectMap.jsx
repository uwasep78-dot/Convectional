import { useState } from 'react'
import { FaMapMarked, FaSun, FaBuilding } from 'react-icons/fa'

const PROJECTS = [
  {name:'Solar Installation - Kigali',lat:-1.9441,lng:30.0619,type:'Renewable Energy'},
  {name:'Technical Training Center - Musanze',lat:-1.4987,lng:29.6342,type:'Training'},
  {name:'Electrical Maintenance - Rubavu',lat:-1.7169,lng:29.3554,type:'Maintenance'},
  {name:'Tools Supply Depot - Gisenyi',lat:-1.6983,lng:29.2581,type:'Supply'},
]

export default function ProjectMap(){
  const [selected,setSelected]=useState(PROJECTS[0])
  return (
    <section className="section section-light innovation-page">
      <div className="wrap">
        <div className="section-head center">
          <span class="kicker">Our Projects</span>
          <h2>Where We Work</h2>
          <p>Explore our completed and ongoing projects across Rwanda.</p>
        </div>
        <div className="map-wrapper">
          <div className="map-sidebar">
            <h3>Project Locations</h3>
            <div className="location-list">
              {PROJECTS.map(p=>(<div key={p.name} className={`loc-item ${selected.name===p.name?'active':''}`} onClick={()=>setSelected(p)}><span className="dot"></span><div><strong>{p.name}</strong><span>{p.type}</span></div></div>))}
            </div>
          </div>
          <div className="map-canvas">
            <div className="map-placeholder">
              <FaMapMarked size={64} />
              <p>Interactive map loading…</p>
              <div className="map-info"><strong>{selected.name}</strong><span>{selected.type}</span><span>{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}