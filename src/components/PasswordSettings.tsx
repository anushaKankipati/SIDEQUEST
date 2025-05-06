export default function PasswordSettings() {
  return (
    <div className="border border-gray-300 rounded-xl max-w-4xl mx-auto p-6 mt-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h3>
      <form className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-theme-green"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-theme-green"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-theme-green"
          />
        </div>
        <button
          type="submit"
          className="bg-theme-green text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
