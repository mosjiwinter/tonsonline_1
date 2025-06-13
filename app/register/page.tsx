'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

// Add interface for ProfilePlus
interface ProfilePlus {
  email?: string;
  phoneNumber?: string;
}

export default function RegisterPage() {
  const [profile, setProfile] = useState<any>(null);
  const [referrer, setReferrer] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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

  const getPhoneNumber = async () => {
    try {
      if (liff.isInClient()) {
        if (liff.getOS() === "android" || liff.getOS() === "ios") {
          try {
            // Cast the result to our interface
            const result = await liff.getProfilePlus() as ProfilePlus;
            
            if (result?.phoneNumber) {
              setPhoneNumber(result.phoneNumber);
            } else {
              alert('ไม่พบเบอร์โทรศัพท์ในบัญชี LINE ของคุณ กรุณากรอกด้วยตนเอง');
            }
          } catch (error) {
            console.error('Error getting phone number:', error);
            alert('ไม่สามารถดึงเบอร์โทรศัพท์ได้ กรุณากรอกด้วยตนเอง');
          }
        } else {
          alert('กรุณาใช้งานผ่านแอพ LINE เท่านั้น');
        }
      } else {
        alert('กรุณาใช้งานผ่านแอพ LINE เท่านั้น');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nameInput = form.querySelector('[name="name"]') as HTMLInputElement;
    const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;

    const data = {
      name: nameInput.value,
      phone: phoneInput.value,
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
        <div style={{ position: 'relative' }}>
          <input
            name="phone"
            placeholder="เบอร์โทร"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              width: '100%'
            }}
          />
          <button
            type="button"
            onClick={getPhoneNumber}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '6px 12px',
              backgroundColor: '#00B900',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ดึงเบอร์จาก LINE
          </button>
        </div>
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
