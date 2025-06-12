

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
    <div style={{ padding: 20 }}>
      <h2>ลงทะเบียน</h2>
      {profile && (
        <div>
          <p><strong>LINE Display Name:</strong> {profile.displayName}</p>
          <p><strong>LINE User ID:</strong> {profile.userId}</p>
        </div>
      )}
      <p><strong>รหัสผู้แนะนำ:</strong> {referrer}</p>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="ชื่อ-สกุล" required />
        <input name="phone" placeholder="เบอร์โทร" required />
        <button type="submit">ลงทะเบียน</button>
      </form>
    </div>
  );
}
