'use client';

import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbx6-3cFdNUM3j5PMnworjCIdygsqCVqElTL9sD47vftwJBF5mm0A-xrKn07ap7mFPzC/exec',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('isStaffLoggedIn', 'true');
        localStorage.setItem('staffUserId', data.userId);
        window.location.href = '/staff';
      } else {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          เข้าสู่ระบบสำหรับพนักงาน
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="ชื่อผู้ใช้"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="รหัสผ่าน"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#00b900', color: 'white' }}
          >
            เข้าสู่ระบบ
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}