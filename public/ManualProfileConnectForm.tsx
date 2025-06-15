import { useState } from "react";

export default function ManualProfileConnectForm({ onSave }) {
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

  return (
    <form onSubmit={handleSubmit}>
      <select value={platform} onChange={e => setPlatform(e.target.value)} required>
        <option value="">Elige red</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
        {/* ...agrega más si quieres */}
      </select>
      <input placeholder="ID de la cuenta" value={accountId} onChange={e => setAccountId(e.target.value)} required />
      <input placeholder="Token de acceso" value={accessToken} onChange={e => setAccessToken(e.target.value)} required />
      <button type="submit">Conectar</button>
    </form>
  );
}
