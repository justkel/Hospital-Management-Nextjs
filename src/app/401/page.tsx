export default function UnauthorizedPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>401 - Unauthorized</h1>
      <p>You do not have access to this page. Please log in.</p>
      <a href="/login">Go to Login</a>
    </div>
  );
}
