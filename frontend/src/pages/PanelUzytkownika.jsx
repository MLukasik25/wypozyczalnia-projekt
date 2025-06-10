import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DaneUzytkownika from "../components/DaneUzytkownika";
import MojeWypozyczeniaKlient from "../components/klient/MojeWypozyczeniaKlient";
import MojeFaktury from "../components/klient/MojeFaktury";
import ZmianaHasla from "../components/ZmianaHasla";

function PanelUzytkownika() {
  const { token } = useAuth();
  const [dane, setDane] = useState(null);
  const [rola, setRola] = useState("");
  const [wypozyczenia, setWypozyczenia] = useState([]);
  const [faktury, setFaktury] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pokazWypozyczenia, setPokazWypozyczenia] = useState(false);
  const [pokazFaktury, setPokazFaktury] = useState(false);
  const [pokazZmianeHasla, setPokazZmianeHasla] = useState(false);

  useEffect(() => {
    const fetchDane = async () => {
      try {
        const [meRes, wypRes, fakRes] = await Promise.all([
          api.get("/uzytkownicy/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/wypozyczenia/moje-klient", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/faktury/moje", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (meRes.data.dane) {
          setDane(meRes.data.dane);
        }
        setRola(meRes.data.rola);
        setWypozyczenia(wypRes.data);
        setFaktury(fakRes.data);
      } catch (err) {
        setError("Nie udało się pobrać danych.");
      } finally {
        setLoading(false);
      }
    };

    fetchDane();
  }, [token]);

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="panel-box">
        <h2>Panel użytkownika</h2>
        <p>Rola: <strong>{rola}</strong></p>

        <DaneUzytkownika dane={dane} rola={rola} />

        <button className="action" onClick={() => setPokazZmianeHasla(!pokazZmianeHasla)}>
          {pokazZmianeHasla ? "Ukryj zmianę hasła" : "Zmień hasło"}
        </button>
        {pokazZmianeHasla && <ZmianaHasla />}

        {rola === "klient" && (
          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button className="action" onClick={() => {
                setPokazWypozyczenia(!pokazWypozyczenia);
                setPokazFaktury(false);
              }}>
                {pokazWypozyczenia ? "Ukryj wypożyczenia" : "Pokaż wypożyczenia"}
              </button>
              <button className="action" onClick={() => {
                setPokazFaktury(!pokazFaktury);
                setPokazWypozyczenia(false);
              }}>
                {pokazFaktury ? "Ukryj faktury" : "Pokaż faktury"}
              </button>
            </div>

            {pokazWypozyczenia && <MojeWypozyczeniaKlient wypozyczenia={wypozyczenia} />}
            {pokazFaktury && <MojeFaktury faktury={faktury} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelUzytkownika;
