export const DummyPage = () => {
  return (
    <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Safety Hub</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>This is where you can manage your safety settings and reports.</p>
      
      <div className="grid-responsive" style={{ marginTop: '20px' }}>
        <div className="glass-dark" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '12px' }}>Verify Identity</h3>
          <p style={{ color: 'var(--text-dim)' }}>Ensure your account is secure by verifying your mobile number.</p>
        </div>
        <div className="glass-dark" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '12px' }}>Emergency Contacts</h3>
          <p style={{ color: 'var(--text-dim)' }}>Manage people to notify in case of an emergency during a session.</p>
        </div>
      </div>
      
      <button 
        className="btn-primary"
        onClick={() => alert('Feature coming soon!')}
        style={{ width: 'fit-content', marginTop: '12px' }}
      >
        Launch Security Audit
      </button>
    </div>
  );
};
