import { useEffect, useState } from "react";
import MojeWypozyczenia from "../components/MojeWypozyczenia";
import OczekujaceWypozyczenia from "../components/OczekujaceWypozyczenia";
import DaneUzytkownika from "../components/DaneUzytkownika";
import ZmianaHasla from "../components/ZmianaHasla";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PanelPracownika = () => {
  const { token } = useAuth();
  const [moje, setMoje] = useState([]);
  const [oczekujace, setOczekujace] = useState([]);
  const [pokazMoje, setPokazMoje] = useState(false);
  const [pokazOczekujace, setPokazOczekujace] = useState(false);
  const [pokazZmianeHasla, setPokazZmianeHasla] = useState(false);
  const [dane, setDane] = useState(null);
  const [rola, setRola] = useState("");

  useEffect(() => {
    const fetchDane = async () => {
      try {
        const [meRes, mojeRes, oczekujaceRes] = await Promise.all([
          api.get("/uzytkownicy/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/wypozyczenia/moje-pracownik", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/wypozyczenia/oczekujace", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (meRes.data.dane) {
          setDane(meRes.data.dane);
        }
        setRola(meRes.data.rola);
        setMoje(mojeRes.data);
        setOczekujace(oczekujaceRes.data);
      } catch (err) {
        console.error("Błąd przy pobieraniu danych:", err);
      }
    };

    fetchDane();
  }, [token]);

  return (
    <div className="container">
      <div className="panel-box">
        <h2>Panel Pracownika</h2>

        <DaneUzytkownika dane={dane} rola={rola} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <button className="action" onClick={() => setPokazMoje(!pokazMoje)}>
            {pokazMoje ? "Ukryj moje wypożyczenia" : "Pokaż moje wypożyczenia"}
          </button>

          <button className="action" onClick={() => setPokazOczekujace(!pokazOczekujace)}>
            {pokazOczekujace ? "Ukryj oczekujące wypożyczenia" : "Pokaż oczekujące wypożyczenia"}
          </button>

          <button className="action" onClick={() => setPokazZmianeHasla(!pokazZmianeHasla)}>
            {pokazZmianeHasla ? "Ukryj zmianę hasła" : "Zmień hasło"}
          </button>
        </div>

        {pokazMoje && <MojeWypozyczenia wypozyczenia={moje} />}
        {pokazOczekujace && <OczekujaceWypozyczenia wypozyczenia={oczekujace} />}
        {pokazZmianeHasla && <ZmianaHasla />}
      </div>
    </div>

  );
};

export default PanelPracownika;
