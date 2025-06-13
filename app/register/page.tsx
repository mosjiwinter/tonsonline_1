'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface ProfilePlus {
  phoneNumber?: string;
}

export default function RegisterPage() {
  const [profile, setProfile] = useState<any>(null);
  const [referrer, setReferrer] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [message, setMessage] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

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
      if (liff.isInClient() && (liff.getOS() === 'android' || liff.getOS() === 'ios')) {
        const result = await liff.getProfilePlus() as ProfilePlus;
        if (result.phoneNumber) setPhoneNumber(result.phoneNumber);
        else alert('ไม่พบเบอร์โทร กรุณากรอกด้วยตนเอง');
      } else alert('กรุณาใช้งานผ่านแอป LINE');
    } catch {
      alert('ไม่สามารถดึงเบอร์ได้ กรุณากรอกด้วยตนเอง');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('กำลังส่งข้อมูล...');

    const formData = new FormData();
    formData.append('userId', profile?.userId || '');
    formData.append('name', name);
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
      const res = await fetch('https://script.google.com/macros/s/AKfycbznj_ki27vdcuOYcXALXXnaavexpR6fUEvIvH-3thuX/dev', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      setMessage(result.message || 'ลงทะเบียนสำเร็จ');
    } catch {
      setMessage('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>ลงทะเบียนร้านค้า</h2>

      {profile && (
        <div style={{ background: '#f0f0f0', padding: 10, borderRadius: 8 }}>
          <p><strong>ชื่อ LINE:</strong> {profile.displayName}</p>
          <p><strong>LINE ID:</strong> {profile.userId}</p>
        </div>
      )}

      <p><strong>รหัสผู้แนะนำ:</strong> {referrer}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          placeholder="ชื่อ-สกุล"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <div style={{ position: 'relative' }}>
          <input
            placeholder="เบอร์โทร"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={getPhoneNumber}
            style={{
              position: 'absolute', right: 8, top: '50%',
              transform: 'translateY(-50%)', padding: '4px 8px', background: '#00B900',
              color: 'white', border: 'none', borderRadius: 4
            }}
          >
            ดึงเบอร์จาก LINE
          </button>
        </div>

        <textarea
          placeholder="ที่อยู่จัดส่ง"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />

        <button type="button" onClick={getCurrentLocation}>📍 ใช้ตำแหน่ง GPS</button>

        {isLoaded && (
          <div style={{ height: '300px' }}>
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              zoom={15}
              center={latLng || { lat: 13.7563, lng: 100.5018 }}
              onClick={(e) => {
                setLatLng({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
              }}
            >
              {latLng && <Marker position={latLng} draggable onDragEnd={(e) => {
                setLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              }} />}
            </GoogleMap>
          </div>
        )}

        {latLng && (
          <p>📌 lat: {latLng.lat}, lng: {latLng.lng}</p>
        )}

        <label>
          อัปโหลดรูปหน้าร้าน:
          <input type="file" accept="image/*" onChange={e => setStoreImage(e.target.files?.[0] || null)} required />
        </label>

        <label>
          อัปโหลดรูปบัตรประชาชน:
          <input type="file" accept="image/*" onChange={e => setIdCardImage(e.target.files?.[0] || null)} required />
        </label>

        <button type="submit" style={{ padding: '12px', background: '#00B900', color: 'white', border: 'none', borderRadius: 6 }}>
          ✅ ลงทะเบียน
        </button>
      </form>

      {message && <p style={{ marginTop: 10, color: 'green' }}>{message}</p>}
    </div>
  );
}
