import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Helmet } from "@dr.pogodin/react-helmet";

const ResetPassword = ({ onSuccess }) => {
  // token prop should be passed from parent component or extracted from URL
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null);

  const navigate = useNavigate();

  // Verify token on component mount
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/verify-reset-token/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // setTokenValid(true);
      console.log(response)
      const data = await response.json();


      if (data.isAuthenticated) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError('Invalid or expired reset token');
      }
    } catch (err) {
      console.log(err)
      setTokenValid(false);
      setError('Error verifying token');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // const validatePassword = (password) => {
  //   const minLength = 8;
  //   const hasUpperCase = /[A-Z]/.test(password);
  //   const hasLowerCase = /[a-z]/.test(password);
  //   const hasNumbers = /\d/.test(password);
  //   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  //   if (password.length < minLength) {
  //     return 'Password must be at least 8 characters long';
  //   }
  //   if (!hasUpperCase || !hasLowerCase) {
  //     return 'Password must contain both uppercase and lowercase letters';
  //   }
  //   if (!hasNumbers) {
  //     return 'Password must contain at least one number';
  //   }
  //   if (!hasSpecialChar) {
  //     return 'Password must contain at least one special character';
  //   }
  //   return null;
  // };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    // Validate passwords
    // const passwordError = validatePassword(formData.password);

    // if (passwordError) {
    //   setError(passwordError);
    //   setLoading(false);
    //   return;
    // }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successfully!');
        setTimeout(() => {
          //   onSuccess && onSuccess(); // Call parent callback
          navigate("/")
        }, 2000);
      } else {
        setError(data.error.common.msg || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <>
        <Helmet>
          <title>Reset Password - MyChat</title>
        </Helmet>
        <div className="w-90 h-140 flex items-center justify-center bg-background rounded-2xl transition-colors duration-3000 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-primary"></div>
        </div>
      </>
    );
  }

  if (tokenValid === false) {
    return (
      <>
        <Helmet>
          <title>Reset Password - MyChat</title>
        </Helmet>
        <div className="h-140 w-90 flex items-center justify-center bg-background rounded-2xl transition-colors duration-3000 shadow-lg ">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-3xl font-bold text-black/90">Invalid Token</h2>
              <p className="mt-2 text-gray-400">{error}</p>
              <button
                // onClick={() => onSuccess && onSuccess('forgot-password')}
                onClick={() => navigate("/")}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary hover:bg-hoverSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - MyChat</title>
      </Helmet>
      <div className="sm:w-100 h-140 flex items-center justify-center bg-background rounded-2xl transition-colors duration-3000 shadow-xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-3xl font-bold text-black/90 transition-colors duration-3000">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your new password
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-4" onSubmit={handleSubmit}>
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-black mb-1">
                  New Password
                </label>
                <div className="relative bg-middleColor border-2 border-secondary/50 focus-within:border-secondary hover:border-secondary rounded-lg">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 rounded-lg focus:outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="dark:text-black block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative bg-middleColor border-2 border-secondary/50 focus-within:border-secondary hover:border-secondary rounded-lg">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 rounded-lg focus:outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary hover:bg-hoverSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;