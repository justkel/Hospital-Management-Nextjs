export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-red-600">403</h1>
        <h2 className="text-xl font-semibold text-gray-800">
          Access Denied
        </h2>
        <p className="text-gray-500">
          You don’t have permission to view this page.
        </p>

        <a
          href="/dashboard"
          className="inline-block bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition"
        >
          Go back to dashboard
        </a>
      </div>
    </div>
  );
}