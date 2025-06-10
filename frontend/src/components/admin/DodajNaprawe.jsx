import { useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DodajNaprawe = () => {
  const { token } = useAuth();
  const [nrWypozyczenia, setNrWypozyczenia] = useState("");
  const [koszt, setKoszt] = useState("");
  const [opis, setOpis] = useState("");
  const [error, setError] = useState("");
  const [sukces, setSukces] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSukces("");

    if (!nrWypozyczenia || !koszt || !opis) {
      setError("Wszystkie pola są wymagane.");
      return;
    }

    try {
      await api.post(
        "/naprawy",
        {
          NrWypożyczenia: parseInt(nrWypozyczenia),
          Koszt: parseFloat(koszt),
          Opis: opis,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSukces("Naprawa została dodana.");
      setNrWypozyczenia("");
      setKoszt("");
      setOpis("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Wystąpił błąd podczas dodawania naprawy."
      );
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Dodaj Naprawę</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {sukces && <p style={{ color: "green" }}>{sukces}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="ID wypożyczenia"
          value={nrWypozyczenia}
          onChange={(e) => setNrWypozyczenia(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Koszt naprawy"
          value={koszt}
          onChange={(e) => setKoszt(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Opis naprawy"
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
          required
        />
        <button type="submit">Dodaj naprawę</button>
      </form>
    </div>
  );
};

export default DodajNaprawe;
