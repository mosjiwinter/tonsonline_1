'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'staff1' && password === '1234') {
      localStorage.setItem('isStaffLoggedIn', 'true');
      router.push('/staff');
    } else {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>เข้าสู่ระบบพนักงาน</h2>
      <input placeholder="username" onChange={(e) => setUsername(e.target.value)} /><br />
      <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
