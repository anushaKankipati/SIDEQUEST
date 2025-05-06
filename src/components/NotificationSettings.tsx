export default function NotificationSetting() {
  return (
    <div className="border border-gray-300 rounded-xl max-w-4xl mx-auto p-6 mt-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Notification Settings</h3>
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            defaultChecked
            className="form-checkbox h-5 w-5 text-theme-green"
          />
          <span className="text-gray-700">Email me about task updates</span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-theme-green"
          />
          <span className="text-gray-700">Email me about promotions</span>
        </label>
      </div>
    </div>
  );
}
