import { useState } from 'react';



export default function WalletPage() {
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const balance = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#d3e4fe', marginBottom: 6 }}>Wallet</div>
      <div style={{ fontSize: 13, color: 'rgba(211,228,254,0.45)', marginBottom: 24 }}>Manage your Vaygo balance and transactions</div>

      {/* Balance Card */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 22, padding: '28px 28px', marginBottom: 24, background: 'linear-gradient(135deg, #0a4060 0%, #02253a 60%, #011a2b 100%)', border: '1px solid rgba(0,219,231,0.18)' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(0,219,231,0.06)', filter: 'blur(40px)' }} />
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(211,228,254,0.50)', letterSpacing: '0.06em', marginBottom: 8 }}>VAYGO WALLET BALANCE</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: '#00dbe7', letterSpacing: '-1.5px', marginBottom: 4 }}>
          ₹{Math.abs(balance).toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(211,228,254,0.40)', marginBottom: 24 }}>Available to use on rides</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setAdding(true)}
            style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add Money
          </button>
          <button style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: 'rgba(211,228,254,0.70)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_outward</span> Withdraw
          </button>
        </div>
      </div>

      {/* Add Money Modal */}
      {adding && (
        <div style={{ marginBottom: 20, padding: 20, borderRadius: 16, background: 'rgba(0,219,231,0.05)', border: '1px solid rgba(0,219,231,0.18)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#d3e4fe', marginBottom: 14 }}>Add Money to Wallet</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[100, 200, 500, 1000].map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                style={{ padding: '8px 14px', borderRadius: 8, background: amount === String(a) ? 'rgba(0,219,231,0.10)' : 'rgba(255,255,255,0.04)', border: amount === String(a) ? '1px solid rgba(0,219,231,0.25)' : '1px solid rgba(255,255,255,0.08)', color: amount === String(a) ? '#00dbe7' : 'rgba(211,228,254,0.55)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                ₹{a}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Custom amount (₹)" type="number"
              style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: '#d3e4fe', fontSize: 13, outline: 'none' }} />
            <button onClick={() => { if (amount) { alert(`₹${amount} added via UPI`); setAdding(false); setAmount(''); } }}
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#00dbe7,#00f1fe)', color: '#002022', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Pay via UPI</button>
            <button onClick={() => setAdding(false)}
              style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(211,228,254,0.50)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13, fontWeight: 700, color: '#d3e4fe' }}>Transaction History</div>
        {transactions.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(211,228,254,0.40)' }}>No transactions yet</div>
        ) : (
          transactions.map((t, i) => (
            <div key={i} style={{ padding: '13px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: t.type === 'credit' ? 'rgba(34,211,160,0.08)' : 'rgba(255,100,100,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: t.type === 'credit' ? '#22d3a0' : '#ff6b6b' }}>
                    {t.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#d3e4fe' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(211,228,254,0.35)', marginTop: 2 }}>{t.date} · {t.note}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.type === 'credit' ? '#22d3a0' : '#ff6b6b' }}>
                {t.type === 'credit' ? '+' : ''}₹{Math.abs(t.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
