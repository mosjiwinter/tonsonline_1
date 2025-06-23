'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import QRCode from 'qrcode';

export default function StaffPage() {
  const [profile, setProfile] = useState<any>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('');
  const [staffUserId, setStaffUserId] = useState('');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isStaffLoggedIn');
    if (isLoggedIn !== 'true') {
      window.location.href = '/login';
      return;
    }

    // ดึงข้อมูลจาก sessionStorage
    setStaffName(sessionStorage.getItem('staffName') || '');
    setStaffUserId(sessionStorage.getItem('staffUserId') || '');

    const init = async () => {
      try {
        await liff.init({ liffId: '2007552712-Ml60zkVe' });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const p = await liff.getProfile();
        console.log('LINE USER ID:', p.userId);
        setProfile(p);

        // ใช้ userId นี้เพื่อสร้างลิงก์สมัคร
        const registerUrl = `https://liff.line.me/2007552712-Ml60zkVe/register?ref=${p.userId}`;
        const qr = await QRCode.toDataURL(registerUrl);
        setQrImage(qr);
      } catch (err) {
        console.error('เกิดข้อผิดพลาด:', err);
        setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    };

    init();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  if (errorMessage) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'red' }}>
        <h3>⚠️ {errorMessage}</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>หน้าพนักงาน</h2>

      <p><strong>ชื่อ (จาก Sheet):</strong> {staffName}</p>
      <p><strong>รหัสพนักงาน:</strong> {staffUserId}</p>

      {profile && (
        <>
          <p><strong>ชื่อ LINE:</strong> {profile.displayName}</p>
          <p><strong>LINE ID:</strong> {profile.userId}</p>

          <div style={{ marginTop: '20px' }}>
            <p>📲 ให้ลูกค้าสแกน QR นี้เพื่อลงทะเบียน:</p>
            {qrImage && (
              <img
                src={qrImage}
                alt="QR Code"
                style={{ width: '240px', border: '1px solid #ccc', marginTop: '10px' }}
              />
            )}
          </div>
        </>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: '30px',
          backgroundColor: '#d32f2f',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        ออกจากระบบ
      </button>
    </div>
  );
}