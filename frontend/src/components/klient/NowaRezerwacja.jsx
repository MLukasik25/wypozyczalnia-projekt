import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const NowaRezerwacja = ({ preselectedNrRej, onRezerwacja }) => {
  const { token } = useAuth();
  const [pojazd, setPojazd] = useState(null);
  const [pakiety, setPakiety] = useState([]);
  const [pakietId, setPakietId] = useState("");
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!preselectedNrRej) return;

    const fetchData = async () => {
      try {
        const [pojazdRes, pakietyRes] = await Promise.all([
          api.get(`/samochody/${preselectedNrRej}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/ocac", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setPojazd(pojazdRes.data);
        setPakiety(pakietyRes.data);

        const pakietBasic = pakietyRes.data.find(p => p.Pakiet.toLowerCase() === "basic");
        if (pakietBasic) {
          setPakietId(pakietBasic.idOCAC.toString());
        }
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać danych pojazdu lub pakietów.");
      }
    };

    fetchData();
  }, [token, preselectedNrRej]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pakietId) {
      alert("Wybierz pakiet ubezpieczeniowy.");
      return;
    }
    try {
      await api.post("/wypozyczenia/klient", {
        NrRej: preselectedNrRej,
        Pakiet_ubezpieczeń: parseInt(pakietId),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Rezerwacja złożona pomyślnie!");
      setPakietId("");
      if (onRezerwacja) onRezerwacja();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas składania rezerwacji.");
    }
  };

  const wybranyPakiet = pakiety.find(p => p.idOCAC === parseInt(pakietId));

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit} style={{ position: "relative" }}>
        <h3>Podsumowanie rezerwacji</h3>
        {error && <p>{error}</p>}

        {pojazd ? (
          <div className="car-summary">
            <p><strong>Numer Rejestracyjny:</strong> {pojazd.Nr_Rej}</p>
            <p><strong>Marka:</strong> {pojazd.Marka}</p>
            <p><strong>Model:</strong> {pojazd.Model}</p>
            <p><strong>Rocznik:</strong> {pojazd.Rocznik}</p>
            <p><strong>Klasa:</strong> {pojazd.Klasa}</p>
            <p><strong>Kolor:</strong> {pojazd.Kolor}</p>
          </div>
        ) : (
          <p>Ładowanie danych pojazdu...</p>
        )}

        <label style={{ marginTop: "1rem" }}>
          Wybierz pakiet ubezpieczeniowy:
          <select
            value={pakietId}
            onChange={(e) => setPakietId(e.target.value)}
            required
          >
            {pakiety.map(p => (
              <option key={p.idOCAC} value={p.idOCAC}>
                {p.Pakiet} ({p.Cena} PLN)
              </option>
            ))}
          </select>
          <span
            style={{ marginLeft: "0.5rem", cursor: "pointer" }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            title="Szczegóły pakietu"
          >
            ❓
          </span>
        </label>

        {showTooltip && wybranyPakiet && (
          <div style={{
            position: "absolute",
            left: "calc(100% + 10px)",
            top: "calc(100% - 150px)",
            width: "220px",
            backgroundColor: "#f9f9f9",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontSize: "0.85rem",
            zIndex: 999
          }}>
            Pakiet <strong>{wybranyPakiet.Pakiet}</strong> zapewnia pokrycie kosztów naprawy w wysokości <strong>{Math.round(wybranyPakiet.PokrycieNaprawy * 100)}%</strong>.
          </div>
        )}

        <button type="submit" style={{ marginTop: "1rem" }}>Zarezerwuj</button>
      </form>
    </div>
  );
};

export default NowaRezerwacja;
