import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInAnonymous, resetPassword } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, mode = 'signin' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [currentMode, setCurrentMode] = useState(mode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { currentUser } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (currentMode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signUpWithEmail(formData.email, formData.password, formData.displayName);
        setMessage('Account created successfully! You are now signed in.');
      } else if (currentMode === 'signin') {
        await signInWithEmail(formData.email, formData.password);
        setMessage('Signed in successfully!');
      } else if (currentMode === 'reset') {
        await resetPassword(formData.email);
        setMessage('Password reset email sent! Check your inbox.');
      }

      setTimeout(() => {
        onClose();
        setMessage('');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    try {
      await signInAnonymous();
      setMessage('Signed in as guest!');
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>
            {currentMode === 'signin' && 'Sign In'}
            {currentMode === 'signup' && 'Create Account'}
            {currentMode === 'reset' && 'Reset Password'}
          </h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="auth-modal-body">
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit}>
            {currentMode === 'signup' && (
              <div className="form-group">
                <label htmlFor="displayName">Full Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {currentMode !== 'reset' && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>
            )}

            {currentMode === 'signup' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>
            )}

            <button type="submit" className="auth-button primary" disabled={loading}>
              {loading ? 'Processing...' : (
                currentMode === 'signin' ? 'Sign In' :
                currentMode === 'signup' ? 'Create Account' : 'Send Reset Email'
              )}
            </button>
          </form>

          {currentMode !== 'reset' && (
            <div className="auth-divider">
              <span>or</span>
            </div>
          )}

          {currentMode !== 'reset' && (
            <button
              className="auth-button secondary"
              onClick={handleAnonymousSignIn}
              disabled={loading}
            >
              Continue as Guest
            </button>
          )}

          <div className="auth-links">
            {currentMode === 'signin' && (
              <>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setCurrentMode('signup')}
                >
                  Don't have an account? Sign up
                </button>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setCurrentMode('reset')}
                >
                  Forgot password?
                </button>
              </>
            )}
            {currentMode === 'signup' && (
              <button
                type="button"
                className="link-button"
                onClick={() => setCurrentMode('signin')}
              >
                Already have an account? Sign in
              </button>
            )}
            {currentMode === 'reset' && (
              <button
                type="button"
                className="link-button"
                onClick={() => setCurrentMode('signin')}
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
