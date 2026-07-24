// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔵 AuthCallback mounted');
      console.log('📍 URL:', window.location.href);
      console.log('📍 Hash:', window.location.hash);
      
      setStatus('Getting session...');
      
      const { data, error } = await supabase.auth.getSession();
      console.log('📦 Session data:', data);
      
      if (error) {
        console.error('❌ Session error:', error);
        setStatus('Error: ' + error.message);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (data?.session) {
        console.log('✅ User logged in successfully!');
        setStatus('Login successful! Redirecting...');
        // Navigate to home page (which should be localhost)
        setTimeout(() => navigate('/'), 1000);
      } else {
        console.log('⚠️ No session found');
        setStatus('No session found. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gold-50/20 to-slate-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent mb-4"></div>
        <h1 className="text-xl font-bold text-gray-800">Google Sign In</h1>
        <p className="text-gray-500 text-sm mt-2">{status}</p>
      </div>
    </div>
  );
}