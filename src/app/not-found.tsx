export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="mt-2 text-gray-500">Page not found</p>

        <a
          href="/dashboard"
          className="inline-block mt-6 bg-black text-white px-5 py-2.5 rounded-lg"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}