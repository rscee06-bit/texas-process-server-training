// Enhanced Landing Page Component
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
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Enhanced Hero Section */}
      <div style={{ 
        position: 'relative',
        minHeight: '100vh',
        background: `linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(67, 56, 202, 0.9) 100%), url('https://images.unsplash.com/photo-1595880961482-c68f6456a921?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjb3VydGhvdXNlJTIwanVzdGljZXxlbnwwfHx8fDE3NTU5MDA3MTF8MA&ixlib=rb-4.1.0&q=85')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30, 64, 175, 0.8)',
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
        }} />
        
        <div style={{ 
          position: 'relative',
          zIndex: 2,
          width: '100%',
          padding: '0 2rem',
          maxWidth: '80rem',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          {/* Left Column - Hero Content */}
          <div style={{ color: 'white' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                ⚖️ JBCC Approved Training Platform
              </div>
              
              <h1 style={{ 
                fontSize: '4rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Texas Process Server
                <br />
                <span style={{ color: '#93c5fd' }}>Certification Training</span>
              </h1>
              
              <p style={{ 
                fontSize: '1.25rem', 
                marginBottom: '2.5rem', 
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Get JBCC approved certification with our comprehensive training program. 
                Complete your initial certification or renewal requirements with expert-led courses.
              </p>
            </div>

            {/* Feature Badges */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1rem',
              marginBottom: '3rem' 
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📜</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>JBCC Approved</div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏱️</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>7-Hour Initial</div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔄</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>8-Hour Renewal</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '2rem' 
            }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#93c5fd' }}>1000+</div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Certified Servers</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#93c5fd' }}>98%</div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Pass Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#93c5fd' }}>24/7</div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Support</div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Auth Form */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '2.5rem',
              width: '100%',
              maxWidth: '28rem',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem'
                }}>⚖️</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
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
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <p style={{ color: '#dc2626', margin: 0, fontSize: '0.875rem' }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {!isLogin && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
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
                          padding: '0.75rem',
                          border: '1.5px solid #e5e7eb',
                          borderRadius: '0.75rem',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
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
                          padding: '0.75rem',
                          border: '1.5px solid #e5e7eb',
                          borderRadius: '0.75rem',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
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
                      padding: '0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
                  onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? '⏳ Please wait...' : (isLogin ? '🚀 Sign In' : '✨ Create Account')}
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
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {isLogin 
                    ? "Don't have an account? Sign up →" 
                    : "Already have an account? Sign in →"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '6rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
            Why Choose Our Platform?
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '4rem', maxWidth: '48rem', margin: '0 auto 4rem' }}>
            Professional certification training designed specifically for Texas Process Servers
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                borderRadius: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem'
              }}>📚</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                Expert Content
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                JBCC approved curriculum designed by legal experts with years of experience
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem'
              }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                Fast Certification
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Complete your certification quickly with our streamlined online courses
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem'
              }}>🏆</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                Instant Certificates
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Download your official JBCC certificate immediately after completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
