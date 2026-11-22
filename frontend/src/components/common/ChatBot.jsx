import { useState } from 'react'
import { FaRobot, FaPaperPlane as FaSend } from 'react-icons/fa'

const REPLIES = {
  hello: 'Hello! I am CCRs technical assistant. Ask me about solar systems, maintenance, training, or supplies.',
  solar: 'Solar systems reduce electricity bills by 40-70%. We offer consultation, installation, and maintenance.',
  maintenance: 'We provide preventive maintenance, fault finding, repairs, and inspections for technical equipment.',
  training: 'Our technical training covers electrical installation, maintenance basics, and solar energy systems.',
  default: 'I can help with solar energy, technical maintenance, training, tools supply, and booking services. How can I assist you?'
}

export default function ChatBot(){
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{from:'bot',text:'Hi! How can I help you today?'}])
  const [input,setInput]=useState('')
  const [typing,setTyping]=useState(false)
  const reply = (text)=>{
    const t=text.toLowerCase()
    for(const k of Object.keys(REPLIES)) if(t.includes(k)) return REPLIES[k]
    return REPLIES.default
  }
  const send=()=>{
    if(!input.trim()) return
    setMessages([...messages,{from:'user',text:input}])
    setTyping(true)
    setInput('')
    setTimeout(()=>{
      setTyping(false)
      setMessages([...messages,{from:'bot',text:reply(input)}])
    },900)
  }
  return (
    <>
      <button className="chat-toggle" onClick={()=>setOpen(!open)} aria-label="Open chat">
        <FaRobot />
      </button>
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div><strong>CCR Assistant</strong><span className="dot"></span></div>
            <button onClick={()=>setOpen(false)}>✕</button>
          </div>
          <div className="chat-body">
            {messages.map((m,i)=><div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>)}
            {typing && <div className="chat-msg bot typing"><span></span><span></span><span></span></div>}
          </div>
          <div className="chat-footer">
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message…" onKeyDown={e=>e.key==='Enter'&&send()} />
            <button className="btn-send" onClick={send}><FaSend /></button>
          </div>
        </div>
      )}
    </>
  )
}