import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUser } from '../../store/slices/userSlice';
import chatIcon from '../../assets/icons/chat.png';
import googleIcon from '../../assets/icons/google.png';
import appleIcon from '../../assets/icons/appleLogin.png';
import fbIcon from '../../assets/icons/fb.png';

export const LoginWeb = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate logging in and hydrating redux User Slice
    dispatch(setUser({ 
      id: '1', 
      email: email || 'user@example.com', 
      name: 'Web User', 
      role: 'venter' 
    }));
    dispatch(setAuthenticated(true));
  };
  
  return (
    <div className="flex-center" style={{ minHeight: '100vh', width: '100%', padding: '20px' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '480px', borderRadius: '32px', overflow: 'hidden' }}>
        <div style={{ padding: '40px 32px' }}>
          {/* Mobile-Style Icon Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="flex-center" style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '20px', 
              margin: '0 auto 16px',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '12px'
            }}>
              <img src={chatIcon} alt="Ventally" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)' }}>Log In</h1>
          </div>
          
          <form onSubmit={handleMockLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>Email or Phone</label>
              <input 
                type="text" 
                placeholder="Enter your email or phone" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', height: '52px' }}
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', height: '52px' }}
                required
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <a href="#" style={{ fontSize: '14px', color: 'var(--text-pure)', textDecoration: 'underline', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>
            
            <button type="submit" className="btn-primary" style={{ height: '56px', justifyContent: 'center', fontSize: '17px', marginTop: '8px', borderRadius: '16px' }}>
              Log In
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>
              Don't have an account? <a href="#" style={{ color: 'var(--text-pure)', textDecoration: 'underline', fontWeight: 600 }}>Sign Up</a>
            </p>
          </div>

          <div className="divider-text">Or Continue With</div>

          <div className="social-buttons">
            <button className="social-btn" title="Sign in with Google">
              <img src={googleIcon} alt="Google" />
            </button>
            <button className="social-btn" title="Sign in with Facebook">
              <img src={fbIcon} alt="Facebook" />
            </button>
            <button className="social-btn" title="Sign in with Apple">
              <img src={appleIcon} alt="Apple" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
