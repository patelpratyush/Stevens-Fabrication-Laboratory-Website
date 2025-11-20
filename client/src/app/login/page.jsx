export default function LoginPage() {
  return (
    <section className="max-w-md mx-auto mt-10 bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-stevens-maroon">
        Stevens Fab Lab Login
      </h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Log in to access your dashboard. Students and staff use the same login.
      </p>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
            placeholder="you@stevens.edu"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-stevens-maroon px-4 py-2 text-sm font-medium text-white hover:bg-stevens-maroon-dark transition"
        >
          Log In
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          After login, you&apos;ll be redirected based on your account type.
        </p>
      </form>
    </section>
  );
}

// TODO: Add Firebase auth logic here
// After successful login:
// - Check user role from Firestore or custom claims
// - If role === 'staff': router.push('/staff/dashboard')
// - If role === 'student': router.push('/dashboard')
// - Handle errors appropriately
