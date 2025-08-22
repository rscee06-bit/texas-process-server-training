import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://texas-process-server-training-production.up.railway.app';
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Header Component
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ 
      background: 'white', 
      borderBottom: '1px solid #e5e7eb', 
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h1 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Texas Process Server Training
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
          JBCC Approved Certification
        </p>
      </div>
      
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#374151' }}>
            Welcome, {user.first_name} {user.last_name}
          </span>
          <button 
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

// Landing Page Component
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
      {/* Hero Section */}
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

      {/* Auth Section */}
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
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                      Phone (optional)
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
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

// Dashboard Component
  const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, myCoursesResponse] = await Promise.all([
          axios.get(`${API}/courses`),
          axios.get(`${API}/my-courses`)
        ]);
        
        setCourses(coursesResponse.data);
        setMyCourses(myCoursesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    handlePaymentReturn(); // Check for payment return
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, myCoursesResponse] = await Promise.all([
          axios.get(`${API}/courses`),
          axios.get(`${API}/my-courses`)
        ]);
        
        setCourses(coursesResponse.data);
        setMyCourses(myCoursesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const enrollInCourse = async (courseId) => {
    try {
      await axios.post(`${API}/enroll/${courseId}`);
      // Refresh my courses
      const response = await axios.get(`${API}/my-courses`);
      setMyCourses(response.data);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };
  
  const handlePayForCourse = async (courseId, courseTitle, price) => {
    try {
      const originUrl = window.location.origin;
      
      const response = await axios.post(`${API}/payment/create-checkout`, {
        course_id: courseId,
        origin_url: originUrl
      });
      
      // Redirect to Stripe Checkout
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const checkPaymentStatus = async (sessionId) => {
    try {
      const response = await axios.get(`${API}/payment/status/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return null;
    }
  };

  const handlePaymentReturn = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const paymentStatus = urlParams.get('payment');
    
    if (sessionId && paymentStatus === 'success') {
      setPaymentStatus('checking');
      
      // Poll payment status
      let attempts = 0;
      const maxAttempts = 5;
      
      const pollStatus = async () => {
        if (attempts >= maxAttempts) {
          setPaymentStatus('timeout');
          return;
        }
        
        const status = await checkPaymentStatus(sessionId);
        
        if (status && status.payment_status === 'paid' && status.course_enrolled) {
          setPaymentStatus('success');
          // Refresh courses data
          const response = await axios.get(`${API}/my-courses`);
          setMyCourses(response.data);
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (status && status.status === 'expired') {
          setPaymentStatus('expired');
        } else {
          attempts++;
          setTimeout(pollStatus, 2000); // Poll every 2 seconds
        }
      };
      
      pollStatus();
    } else if (paymentStatus === 'cancelled') {
      setPaymentStatus('cancelled');
      // Clear URL parameters
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        setPaymentStatus(null);
      }, 3000);
    }
  };
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Header />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '16rem',
          fontSize: '1.125rem'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Header />
      
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
            Training Dashboard
          </h1>
          <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
            Track your progress and manage your certifications
          </p>
        </div>

{/* Payment Status Messages */}
        {paymentStatus && (
          <div style={{
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '0.375rem',
            textAlign: 'center',
            background: paymentStatus === 'success' ? '#dcfce7' : 
                       paymentStatus === 'checking' ? '#fef3c7' : '#fef2f2',
            color: paymentStatus === 'success' ? '#166534' : 
                   paymentStatus === 'checking' ? '#92400e' : '#dc2626'
          }}>
            {paymentStatus === 'success' && '✅ Payment successful! You are now enrolled in the course.'}
            {paymentStatus === 'checking' && '⏳ Processing your payment...'}
            {paymentStatus === 'cancelled' && '❌ Payment was cancelled.'}
            {paymentStatus === 'expired' && '⏱️ Payment session expired.'}
            {paymentStatus === 'timeout' && '⚠️ Payment verification timed out. Please check your enrollments.'}
          </div>
        )}

        {/* My Courses Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            My Courses
          </h2>
          
          {myCourses.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                No courses enrolled
              </h3>
              <p style={{ color: '#6b7280' }}>
                Browse available courses to get started with your certification
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', 
              gap: '1.5rem' 
            }}>
              {myCourses.map((courseData) => (
                <div key={courseData.enrollment.id} style={{
                  background: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {courseData.course.title}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {courseData.course.description}
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Progress</span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {Math.round(courseData.progress.percentage)}%
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '0.5rem', 
                      background: '#e5e7eb', 
                      borderRadius: '0.25rem' 
                    }}>
                      <div style={{
                        width: `${courseData.progress.percentage}%`,
                        height: '100%',
                        background: '#3b82f6',
                        borderRadius: '0.25rem'
                      }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Duration:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {courseData.course.duration_hours} hours
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status:</span>
                    <span style={{
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: courseData.enrollment.status === 'completed' ? '#dcfce7' : '#f3f4f6',
                      color: courseData.enrollment.status === 'completed' ? '#166534' : '#374151'
                    }}>
                      {courseData.enrollment.status.replace('_', ' ')}
                    </span>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    Continue Course
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Courses Section */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Available Courses
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(24rem, 1fr))', 
            gap: '1.5rem' 
          }}>
            {courses.map((course) => {
              const isEnrolled = myCourses.some(mc => mc.course.id === course.id);
              
              return (
                <div key={course.id} style={{
                  background: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {course.title}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {course.description}
                      </p>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      background: course.name === 'initial' ? '#dbeafe' : '#f3f4f6',
                      color: course.name === 'initial' ? '#1e40af' : '#374151'
                    }}>
                      {course.name === 'initial' ? 'Initial' : 'Renewal'}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>Duration:</span>
                        <div style={{ fontWeight: '500' }}>{course.duration_hours} hours</div>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Passing Score:</span>
                        <div style={{ fontWeight: '500' }}>{course.passing_score}%</div>
                      </div>
                    </div>
                    
                    {course.ethics_hours_required > 0 && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        <span style={{ color: '#6b7280' }}>Ethics Hours Required:</span>
                        <span style={{ fontWeight: '500', marginLeft: '0.25rem' }}>
                          {course.ethics_hours_required}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
                      ${course.id === '1' ? '199' : '149'}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {course.id === '1' ? 'Initial Certification' : 'Renewal Course'}
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePayForCourse(course.id, course.title, course.id === '1' ? 199 : 149)}
                    disabled={isEnrolled}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: isEnrolled ? '#9ca3af' : '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontWeight: '500',
                      cursor: isEnrolled ? 'not-allowed' : 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    {isEnrolled ? 'Already Enrolled' : `Pay $${course.id === '1' ? '199' : '149'} & Enroll`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeCourses = async () => {
      try {
        await axios.post(`${API}/admin/initialize-courses`);
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing courses:', error);
        setInitialized(true);
      }
    };

    initializeCourses();
  }, []);

  if (!initialized) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '0.25rem solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>Initializing training platform...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

const AppRouter = () => {
  const { user } = useAuth();
  
  return user ? <Dashboard /> : <LandingPage />;
};

export default App;
