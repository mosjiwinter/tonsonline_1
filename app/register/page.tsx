'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import dynamic from 'next/dynamic';
import {
  TextField,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Map = dynamic(() => import('./LeafletMap'), { ssr: false });

interface ProfilePlus {
  phoneNumber?: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface InputFileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
}

function InputFileUpload({ label, onChange }: InputFileUploadProps) {
  return (
    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
      {label}
      <VisuallyHiddenInput
        type="file"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </Button>
  );
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      await liff.init({ liffId: '2007552712-Ml60zkVe' });

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }

      const p = await liff.getProfile();
      setProfile(p);

      const ref = new URL(window.location.href).searchParams.get('ref') || '';
      setReferrer(ref);
    };
    init();
  }, []);

  const getPhoneNumber = async () => {
    try {
      const result = await liff.getProfilePlus() as ProfilePlus;
      if (result?.phoneNumber) {
        setPhoneNumber(result.phoneNumber);
      } else {
        alert('ไม่พบเบอร์โทร กรุณากรอกเอง');
      }
    } catch (err) {
      console.error(err);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        ลงทะเบียนร้านค้า
      </Typography>

      {profile && (
        <Stack spacing={1}>
          <Typography><strong>LINE Name:</strong> {profile.displayName}</Typography>
          <Typography><strong>LINE ID:</strong> {profile.userId}</Typography>
        </Stack>
      )}

      <Typography sx={{ mt: 2 }}><strong>รหัสผู้แนะนำ:</strong> {referrer}</Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2} mt={2}>
          <TextField
            label="ชื่อร้านค้า"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="ที่อยู่จัดส่ง"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            fullWidth
          />
          <Stack direction="row" spacing={1}>
            <TextField
              label="เบอร์โทร"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              fullWidth
            />
            <Button variant="outlined" onClick={getPhoneNumber}>
              📱 ดึงเบอร์
            </Button>
          </Stack>

          <Button variant="contained" onClick={getCurrentLocation}>
            📍 ใช้ GPS ปัจจุบัน
          </Button>

          <Map latLng={latLng} setLatLng={setLatLng} />

          {latLng && (
            <Typography>📌 ตำแหน่ง: {latLng.lat}, {latLng.lng}</Typography>
          )}

          <Stack spacing={1}>
            <Typography>อัปโหลดรูปหน้าร้าน</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <InputFileUpload
                label="เลือกรูปหน้าร้าน"
                onChange={setStoreImage}
              />
              <Typography variant="body2">
                {storeImage ? storeImage.name : 'ยังไม่ได้เลือกรูป'}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography>อัปโหลดรูปบัตรประชาชน</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <InputFileUpload
                label="เลือกรูปบัตร ปชช."
                onChange={setIdCardImage}
              />
              <Typography variant="body2">
                {idCardImage ? idCardImage.name : 'ยังไม่ได้เลือกรูป'}
              </Typography>
            </Stack>
          </Stack>

          <LoadingButton
            type="submit"
            variant="contained"
            color="success"
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            size="large"
            fullWidth
          >
            ส่งข้อมูล
          </LoadingButton>

          {message && <Typography color="primary">{message}</Typography>}
        </Stack>
      </form>
    </div>
  );
}