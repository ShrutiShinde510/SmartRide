import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiGet, apiPost } from '../../utils/api';

export default function ChatPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isDriver = location.pathname.includes('driver');
  const currentUserModel = isDriver ? 'PlannedDriver' : 'User';

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    const { ok, data } = await apiGet(`/api/messages/${bookingId}`);
    if (ok && data.success) {
      setMessages(data.messages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const optimisticMsg = {
      _id: Date.now().toString(),
      text: inputText,
      senderModel: currentUserModel,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');

    const { ok, data } = await apiPost(`/api/messages/${bookingId}`, {
      text: optimisticMsg.text,
      senderModel: currentUserModel
    });

    if (!ok || !data.success) {
      alert('Failed to send message');
      fetchMessages(); // revert optimistic update
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100dvh', background: '#020e1c' }}>
      
      {/* Header */}
      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d3e4fe', cursor: 'pointer', flexShrink: 0 }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', letterSpacing: '-0.5px', marginBottom: 2 }}>Secure Chat</h2>
          <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3a0' }}></div> Online
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ color: 'rgba(211,228,254,0.3)', textAlign: 'center', marginTop: 40 }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ color: 'rgba(211,228,254,0.3)', textAlign: 'center', marginTop: 40, fontSize: 14 }}>
            <div style={{ background: 'rgba(0,219,231,0.05)', display: 'inline-flex', padding: 16, borderRadius: '50%', marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#00dbe7' }}>chat_bubble</span>
            </div>
            <div>No messages yet.<br/>Send a message to start chatting!</div>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderModel === currentUserModel;
            return (
              <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  maxWidth: '75%', 
                  padding: '12px 16px', 
                  borderRadius: 18, 
                  background: isMe ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'rgba(255,255,255,0.05)',
                  color: isMe ? '#002022' : '#d3e4fe',
                  borderBottomRightRadius: isMe ? 4 : 18,
                  borderBottomLeftRadius: isMe ? 18 : 4,
                  boxShadow: isMe ? '0 4px 12px rgba(0,219,231,0.2)' : 'none'
                }}>
                  <div style={{ fontSize: 15, lineHeight: 1.4, wordBreak: 'break-word' }}>{msg.text}</div>
                  <div style={{ fontSize: 11, color: isMe ? 'rgba(0,32,34,0.5)' : 'rgba(211,228,254,0.3)', marginTop: 4, textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 12 }}>
          <input 
            type="text" 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '14px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, color: '#d3e4fe', fontSize: 15, outline: 'none' }}
          />
          <button type="submit" disabled={!inputText.trim()}
            style={{ width: 52, height: 52, borderRadius: '50%', background: inputText.trim() ? 'linear-gradient(135deg,#00dbe7,#00f1fe)' : 'rgba(255,255,255,0.05)', border: 'none', color: inputText.trim() ? '#002022' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputText.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, marginLeft: 2 }}>send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
