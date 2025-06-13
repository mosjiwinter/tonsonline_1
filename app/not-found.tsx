export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', margin: '0 0 16px' }}>404</h1>
      <p style={{ fontSize: '20px', color: '#666' }}>ไม่พบหน้าที่คุณกำลังค้นหา</p>
      <a 
        href="/"
        style={{
          marginTop: '24px',
          padding: '12px 24px',
          backgroundColor: '#00B900',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px'
        }}
      >
        กลับหน้าแรก
      </a>
    </div>
  );
}