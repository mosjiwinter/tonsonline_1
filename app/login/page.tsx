'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://script.google.com/macros/s/AKfycbx6-3cFdNUM3j5PMnworjCIdygsqCVqElTL9sD47vftwJBF5mm0A-xrKn07ap7mFPzC/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('isStaffLoggedIn', 'true');
        localStorage.setItem('staffUserId', data.userId);
        window.location.href = '/staff'; // ไปหน้า staff
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: 'auto', padding: 20 }}>
      <h2>เข้าสู่ระบบสำหรับพนักงาน</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#00b900', color: 'white', border: 'none', borderRadius: 4 }}>
          เข้าสู่ระบบ
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
