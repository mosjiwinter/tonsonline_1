'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

export default function RegisterPage() {
  const [profile, setProfile] = useState<any>(null);
  const [referrer, setReferrer] = useState('');

  useEffect(() => {
    const init = async () => {
      await liff.init({ liffId: '2007552712-Ml60zkVe' });
      if (!liff.isLoggedIn()) liff.login();

      const p = await liff.getProfile();
      setProfile(p);

      const url = new URL(window.location.href);
      const ref = url.searchParams.get('ref') || '';
      setReferrer(ref);
    };
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const data = {
      name: form.name.value,
      phone: form.phone.value,
      referrer,
      userId: profile?.userId,
    };

    await fetch('https://script.google.com/macros/s/AKfycby-gCj8HXTHCykYipyN4WAMQ_tD04GdHkOJXeK3cDJ1GfEQjXo1wgH5Q-otlDFpNMYA_A/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    alert('ลงทะเบียนสำเร็จ!');
    form.reset();
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h2 style={{
        fontSize: '24px',
        textAlign: 'center',
        color: '#333',
        marginBottom: '24px'
      }}>ลงทะเบียน</h2>

      {profile && (
        <div style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '8px 0' }}><strong>LINE Display Name:</strong> {profile.displayName}</p>
          <p style={{ margin: '8px 0' }}><strong>LINE User ID:</strong> {profile.userId}</p>
        </div>
      )}

      <p style={{
        background: '#e8f4fd',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}><strong>รหัสผู้แนะนำ:</strong> {referrer}</p>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <input
          name="name"
          placeholder="ชื่อ-สกุล"
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        <input
          name="phone"
          placeholder="เบอร์โทร"
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '14px',
            backgroundColor: '#00B900',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          ลงทะเบียน
        </button>
      </form>
    </div>
  );
}
