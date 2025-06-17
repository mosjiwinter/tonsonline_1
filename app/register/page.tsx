'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import dynamic from 'next/dynamic';

// ⭐ Dynamic import ป้องกัน SSR error
const Map = dynamic(() => import('./LeafletMap'), { ssr: false });

interface ProfilePlus {
  phoneNumber?: string;
}

export default function RegisterPage() {
  const [profile, setProfile] = useState<any>(null);
  const [referrer, setReferrer] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      await liff.init({
        liffId: '2007552712-Ml60zkVe',
        withLoginOnExternalBrowser: true,
      });

      if (!liff.isLoggedIn()) {
        liff.login({
          scope: 'openid profile phone',
          redirectUri: window.location.href,
        });
        return;
      }

      const p = await liff.getProfile();
      setProfile(p);

      const ref = new URL(window.location.href).searchParams.get('ref') || '';
      setReferrer(ref);

      // ดึงเบอร์ทันที (ถ้ามีสิทธิ์)
      try {
        const plus = (await liff.getProfilePlus()) as ProfilePlus;
        if (plus.phoneNumber) {
          setPhoneNumber(plus.phoneNumber);
        }
      } catch (err) {
        console.warn('ไม่สามารถดึงเบอร์ได้:', err);
      }
    };
    init();
  }, []);

  const getPhoneNumber = async () => {
    try {
      const plus = (await liff.getProfilePlus()) as ProfilePlus;
      if (plus.phoneNumber) {
        setPhoneNumber(plus.phoneNumber);
      } else {
        alert('ไม่พบเบอร์ กรุณากรอกเอง');
      }
    } catch (error) {
      alert('ไม่สามารถดึงเบอร์ได้ กรุณากรอกเอง');
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('กำลังส่งข้อมูล...');

    const formData = new FormData();
    formData.append('userId', profile?.userId || '');
    formData.append('name', storeName);
    formData.append('phone', phoneNumber);
    formData.append('referrer', referrer);
    formData.append('address', address);
    if (latLng) {
      formData.append('lat', latLng.lat.toString());
      formData.append('lng', latLng.lng.toString());
    }
    if (storeImage) formData.append('storeImage', storeImage);
    if (idCardImage) formData.append('idCardImage', idCardImage);

    try {
      const res = await fetch('YOUR_GOOGLE_APPS_SCRIPT_ENDPOINT', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      setMessage(result.message || 'ลงทะเบียนสำเร็จ');
    } catch (err) {
      setMessage('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>ลงทะเบียนร้านค้า</h2>

      {profile && (
        <div>
          <p><strong>LINE Name:</strong> {profile.displayName}</p>
          <p><strong>LINE ID:</strong> {profile.userId}</p>
        </div>
      )}
      <p><strong>รหัสผู้แนะนำ:</strong> {referrer}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input placeholder="ชื่อร้านค้า" value={storeName} onChange={e => setStoreName(e.target.value)} required />
        <input placeholder="ที่อยู่จัดส่ง" value={address} onChange={e => setAddress(e.target.value)} required />

        <div>
          <input
            placeholder="เบอร์โทร"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button type="button" onClick={getPhoneNumber}>📱 ดึงเบอร์จาก LINE</button>
        </div>

        <div>
          <button type="button" onClick={getCurrentLocation}>📍 ใช้ GPS ปัจจุบัน</button>
        </div>

        <Map latLng={latLng} setLatLng={setLatLng} />

        {latLng && <p>📌 ตำแหน่ง: {latLng.lat}, {latLng.lng}</p>}

        <label>
          อัปโหลดรูปหน้าร้าน:
          <input type="file" accept="image/*" onChange={e => setStoreImage(e.target.files?.[0] || null)} required />
        </label>

        <label>
          อัปโหลดรูปบัตรประชาชน:
          <input type="file" accept="image/*" onChange={e => setIdCardImage(e.target.files?.[0] || null)} required />
        </label>

        <button type="submit" style={{ backgroundColor: '#00B900', color: '#fff', padding: 12, borderRadius: 6 }}>
          ส่งข้อมูล
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}