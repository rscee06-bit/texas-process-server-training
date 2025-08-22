// Enhanced Landing Page Component (Fixed for Vercel)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Enhanced Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Hero Content */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm font-medium">
                  <span className="mr-2">⚖️</span>
                  JBCC Approved Training Platform
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block">Texas Process Server</span>
                  <span className="block text-blue-300">Certification Training</span>
                </h1>
                
                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                  Get JBCC approved certification with our comprehensive training program. 
                  Complete your initial certification or renewal requirements with expert-led courses.
                </p>
              </div>

              {/* Feature Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white border-opacity-20">
                  <div className="text-2xl mb-2">📜</div>
                  <div className="text-sm font-semibold">JBCC Approved</div>
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white border-opacity-20">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-sm font-semibold">7-Hour Initial</div>
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white border-opacity-20">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="text-sm font-semibold">8-Hour Renewal</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-blue-300">1000+</div>
                  <div className="text-sm text-blue-200">Certified Servers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-300">98%</div>
                  <div className="text-sm text-blue-200">Pass Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-300">24/7</div>
                  <div className="text-sm text-blue-200">Support</div>
                </div>
              </div>
            </div>

            {/* Right Column - Enhanced Auth Form */}
            <div className="flex justify-center">
              <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white border-opacity-20">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                    ⚖️
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isLogin ? 'Welcome Back' : 'Get Started'}
                  </h3>
                  <p className="text-gray-600">
                    {isLogin 
                      ? 'Access your training dashboard' 
                      : 'Start your certification journey today'
                    }
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          name="first_name"
                          type="text"
                          required={!isLogin}
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          name="last_name"
                          type="text"
                          required={!isLogin}
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transform hover:scale-105'
                    } text-white shadow-lg`}
                  >
                    {loading ? '⏳ Please wait...' : (isLogin ? '🚀 Sign In' : '✨ Create Account')}
                  </button>
                </form>

                <div className="mt-6 text-center">
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
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
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
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Professional certification training designed specifically for Texas Process Servers
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
                📚
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Expert Content
              </h3>
              <p className="text-gray-600 leading-relaxed">
                JBCC approved curriculum designed by legal experts with years of experience
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Fast Certification
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complete your certification quickly with our streamlined online courses
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
                🏆
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Instant Certificates
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Download your official JBCC certificate immediately after completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
