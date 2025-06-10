import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ZmianaHasla = () => {
  const { token } = useAuth();
  const [aktualneHaslo, setAktualneHaslo] = useState("");
  const [noweHaslo, setNoweHaslo] = useState("");
  const [powtorzHaslo, setPowtorzHaslo] = useState("");
  const [wiadomosc, setWiadomosc] = useState("");

  const handleZmianaHasla = async (e) => {
    e.preventDefault();

    if (noweHaslo !== powtorzHaslo) {
      setWiadomosc("Nowe hasła nie są identyczne!");
      return;
    }

    try {
      const res = await api.put(
        "/uzytkownicy/zmiana-hasla",
        { aktualneHaslo, noweHaslo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWiadomosc(res.data.message);
    } catch (err) {
      setWiadomosc(err.response?.data?.error || "Błąd przy zmianie hasła.");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Zmiana hasła</h3>
      <form onSubmit={handleZmianaHasla}>
        <input
          type="password"
          placeholder="Aktualne hasło"
          value={aktualneHaslo}
          onChange={(e) => setAktualneHaslo(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Nowe hasło"
          value={noweHaslo}
          onChange={(e) => setNoweHaslo(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Powtórz nowe hasło"
          value={powtorzHaslo}
          onChange={(e) => setPowtorzHaslo(e.target.value)}
          required
        />
        <br />
        <button type="submit">Zmień hasło</button>
      </form>
      {wiadomosc && <p>{wiadomosc}</p>}
    </div>
  );
};

export default ZmianaHasla;
