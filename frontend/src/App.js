// Original Working Landing Page Component
const LandingPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API}${endpoint}`, payload);
      login(response.data.user, response.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ 
        padding: '6rem 2rem', 
        textAlign: 'center',
        background: 'rgba(0,0,0,0.5)',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Texas Process Server
          <br />
          <span style={{ color: '#93c5fd' }}>Certification Training</span>
        </h1>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
          Get JBCC approved certification with our comprehensive training program. 
          Complete your initial certification or renewal requirements with expert-led courses.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '0.5rem 1rem', 
            borderRadius: '1rem',
            fontSize: '0.875rem'
          }}>
            JBCC Approved
          </span>
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '0.5rem 1rem', 
            borderRadius: '1rem',
            fontSize: '0.875rem'
          }}>
            7-Hour Initial Course
          </span>
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '0.5rem 1rem', 
            borderRadius: '1rem',
            fontSize: '0.875rem'
          }}>
            8-Hour Renewal Course
          </span>
        </div>
      </div>

      <div style={{ padding: '4rem 2rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '2rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p style={{ color: '#6b7280' }}>
                {isLogin 
                  ? 'Access your training dashboard' 
                  : 'Start your certification journey today'
                }
              </p>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!isLogin && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        First Name
                      </label>
                      <input
                        name="first_name"
                        type="text"
                        required={!isLogin}
                        value={formData.first_name}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        Last Name
                      </label>
                      <input
                        name="last_name"
                        type="text"
                        required={!isLogin}
                        value={formData.last_name}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    first_name: '',
                    last_name: '',
                    phone: ''
                  });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
