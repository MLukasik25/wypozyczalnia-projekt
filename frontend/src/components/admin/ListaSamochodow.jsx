import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import DodajSamochod from "./DodajSamochod";

const ListaSamochodow = () => {
  const { token } = useAuth();
  const [samochody, setSamochody] = useState([]);
  const [error, setError] = useState("");

  const fetchSamochody = async () => {
    try {
      const res = await api.get("/samochody", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSamochody(res.data);
    } catch (err) {
      setError("Nie udało się pobrać listy samochodów.");
    }
  };

  useEffect(() => {
    fetchSamochody();
  }, [token]);

  const handleDelete = async (nr_rej) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten pojazd?")) return;

    try {
      await api.delete(`/samochody/${nr_rej}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSamochody((prev) => prev.filter((s) => s.nr_rej !== nr_rej));
    } catch (err) {
      alert("Błąd podczas usuwania pojazdu.");
    }
  };

  return (
    <div>
      
      {error && <p>{error}</p>}

      <DodajSamochod onDodano={fetchSamochody} />
      <h3>Lista Samochodów</h3>
      <table>
        <thead>
          <tr>
            <th>Nr Rejestracyjny</th>
            <th>VIN</th>
            <th>Rocznik</th>
            <th>Marka</th>
            <th>Model</th>
            <th>Klasa</th>
            <th>Kolor</th>
            <th>Dostępność</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {samochody.map((s) => (
            <tr key={s.Nr_Rej}>
              <td>{s.Nr_Rej}</td>
              <td>{s.Numer_VIN}</td>
              <td>{s.Rocznik}</td>
              <td>{s.Marka}</td>
              <td>{s.Model}</td>
              <td>{s.Klasa}</td>
              <td>{s.Kolor}</td>
              <td>{s.Dostępność ? "Tak" : "Nie"}</td>
              <td>
                <button onClick={() => handleDelete(s.Nr_Rej)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaSamochodow;
