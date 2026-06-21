import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NegotiateChat() {
  const navigate = useNavigate();
  const { ownerId } = useParams();
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'owner', text: 'Hi there! I saw you are looking for a sedan for 8 hours tomorrow.', time: '10:00 AM' },
    { id: 2, sender: 'user', text: 'Yes, looking for a trip within Mumbai.', time: '10:02 AM' },
    { id: 3, sender: 'owner', text: 'Great. My standard rate is ₹400/hr. Total would be ₹3200 for 8 hours.', time: '10:05 AM' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'user', text: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInput('');
  };

  const sendOffer = () => {
    setMessages([...messages, { id: Date.now(), sender: 'user', text: 'I would like to offer ₹3000 for the 8 hours. Is that acceptable?', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'owner', text: '₹3000 works for me! I have accepted your offer.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 900, margin: '0 auto', background: '#0a0f1e' }}>
      
      {/* App Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #00dbe7, #006b8f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>R</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#d3e4fe' }}>Ramesh K.</div>
              <div style={{ fontSize: 11, color: '#22d3a0', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3a0' }} /> Online
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(`/dashboard/hire/payment/${ownerId}`)}
          style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
          Book Now
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(211,228,254,0.4)', margin: '10px 0' }}>Today</div>
        {messages.map(m => (
          <div key={m.id} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
            <div style={{ 
              background: m.sender === 'user' ? 'linear-gradient(135deg, rgba(0,219,231,0.2), rgba(0,219,231,0.05))' : 'rgba(255,255,255,0.05)', 
              border: m.sender === 'user' ? '1px solid rgba(0,219,231,0.3)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: m.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
              padding: '12px 16px', color: '#d3e4fe', fontSize: 14, lineHeight: 1.5 
            }}>
              {m.text}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(211,228,254,0.4)', marginTop: 4, textAlign: m.sender === 'user' ? 'right' : 'left' }}>
              {m.time}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto' }}>
          <button onClick={sendOffer} style={{ padding: '6px 12px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, color: '#fbbf24', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Offer ₹3000
          </button>
          <button style={{ padding: '6px 12px', background: 'rgba(0,219,231,0.1)', border: '1px solid rgba(0,219,231,0.2)', borderRadius: 12, color: '#00dbe7', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Can we negotiate?
          </button>
        </div>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: 12 }}>
          <input type="text" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, color: '#fff', fontSize: 14, outline: 'none' }} />
          <button type="submit" style={{ width: 44, height: 44, borderRadius: '50%', background: '#00dbe7', border: 'none', color: '#002022', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
