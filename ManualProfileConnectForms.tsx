import { useState } from "react";

export default function ManualProfileConnectForm({ onSave, isLoading = false }) {
  const [platform, setPlatform] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!platform || !accountId || !accessToken) return;
    onSave(platform, accountId, accessToken);
    setPlatform("");
    setAccountId("");
    setAccessToken("");
  };

  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
          Red Social
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          <option value="">Selecciona una red social</option>
          {platforms.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-1">
          ID de la cuenta
        </label>
        <input
          id="accountId"
          type="text"
          placeholder="Ejemplo: 1234567890"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700 mb-1">
          Token de acceso
        </label>
        <input
          id="accessToken"
          type="password"
          placeholder="Ingresa tu token secreto"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Conectando..." : "Conectar cuenta"}
      </button>
    </form>
  );
}
