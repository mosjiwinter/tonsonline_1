'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import QRCode from 'qrcode';

export default function StaffPage() {
  const [profile, setProfile] = useState<any>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: '2007552712-Ml60zkVe' });
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const p = await liff.getProfile();
        console.log('LINE USER ID:', p.userId); // 👉 สำคัญ: copy userId ไปใส่ allowedStaffIds ด้านล่าง

        if (!isStaff(p.userId)) {
          setErrorMessage('คุณไม่มีสิทธิ์ใช้งานหน้านี้');
          return;
        }

        setProfile(p);

        // สร้างลิงก์ลงทะเบียนที่แนบ ref
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
      {profile && (
        <>
          <p><strong>ชื่อ:</strong> {profile.displayName}</p>
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
    </div>
  );
}

// ✅ เพิ่ม userId ที่ได้รับจาก console ตรงนี้
function isStaff(userId: string) {
  const allowedStaffIds = [
    'U6bb4012907c8d56f3ab4c9615f0bbc7b', // <--- ใส่ LINE userId ของพนักงานที่ได้รับอนุญาต
    'Uyyyyyyyyyyyyyyyyyyyyy',
  ];
  return allowedStaffIds.includes(userId);
}
