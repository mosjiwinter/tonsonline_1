'use client'; // ← สำคัญมาก

import { useEffect, useState } from 'react';
import liff from '@line/liff';

export default function RegisterPage() {
  const [profile, setProfile] = useState<any>(null);
  const [referrer, setReferrer] = useState<string>('');

  useEffect(() => {
    const initLiff = async () => {
      try {
        const ref = new URLSearchParams(window.location.search).get('ref');
        if (ref) setReferrer(ref);

        await liff.init({ liffId: '2007552712-Ml60zkVe' });
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('LIFF init error', error);
      }
    };
    initLiff();
  }, []);

   if (!profile) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 24 24"
        style={{
          animation: 'spin 1s linear infinite'
        }}
      >
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#666"
          strokeWidth="2"
          fill="none"
          strokeDasharray="32"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  return (
    <main style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>ลงทะเบียน</h2>
      <p>สวัสดี {profile.displayName}</p>
      <form>
        <label>ชื่อ-นามสกุล</label>
        <input name="name" required />

        <label>เบอร์โทร</label>
        <input name="phone" required />

        <label>ผู้แนะนำ</label>
        <input value={referrer} readOnly name="referrer" />
      </form>
    </main>
  );
}
