import { useState } from 'react';
import Turnstile, { useTurnstile } from 'react-turnstile';
import axios from 'axios';

const TurnstileIntegration = () => {
  const [token, setToken] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const turnstile = useTurnstile();

  const verifyToken = async (turnstileToken: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/verify-turnstile', {
        token: turnstileToken,
        secret: process.env.TURNSTILE_SECRET_KEY
      });

      if (response.data.success) {
        setIsVerified(true);
        setError('');
        return true;
      } else {
        setError('Verification failed');
        turnstile.reset();
        return false;
      }
    } catch (err) {
      setError('Verification error');
      turnstile.reset();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      setError('Complete verification first');
      return;
    }

    // Proceed with form submission
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    try {
      const response = await axios.post('/your-api-endpoint', {
        ...Object.fromEntries(formData),
        turnstileToken: token
      });

      // Handle successful submission
    } catch (error) {
      // Handle API errors
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <form onSubmit={handleSubmit}>
        {/* Example form field with validation */}
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            disabled={!isVerified}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                !isVerified ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            required
          />
        </div>

        <div className="mt-4">
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            theme="dark"  // Changed to dark theme
            language="en"
            size="normal"
            retry="auto"
            retryInterval={5000}
            refreshExpired="auto"
            fixedSize={true}
            onVerify={async (token) => {
              setToken(token);
              await verifyToken(token); // Immediate verification
            }}
            onExpire={() => {
              setToken('');
              setIsVerified(false);
              setError('Verification expired - please retry');
            }}
            onError={() => {
              setIsVerified(false);
              setError('Verification failed - try again');
            }}
            className="turnstile-widget dark:filter dark:invert" // Additional dark mode styling
          />
        </div>

        {error && (
          <p className="mt-2 text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !isVerified}
          className={`mt-4 w-full px-4 py-2 rounded-md transition-colors
            ${
              loading || !isVerified 
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white'
            }`}
        >
          {loading ? 'Verifying...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default TurnstileIntegration;