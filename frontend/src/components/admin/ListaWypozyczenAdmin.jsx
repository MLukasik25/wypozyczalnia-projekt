import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ListaWypozyczenAdmin = () => {
  const { token } = useAuth();
  const [wypozyczenia, setWypozyczenia] = useState([]);
  const [error, setError] = useState("");

  const fetchWypozyczenia = async () => {
    try {
      const res = await api.get("/wypozyczenia/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWypozyczenia(res.data);
    } catch (err) {
      console.error(err);
      setError("Nie udało się pobrać listy wypożyczeń.");
    }
  };

  useEffect(() => {
    fetchWypozyczenia();
  }, [token]);

  const zakoncz = async (id) => {
    const confirm = window.confirm("Zakończyć wypożyczenie?");
    if (!confirm) return;
    try {
      await api.put(`/wypozyczenia/${id}`, { status: "zakończone" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Wypożyczenie zakończone.");
      fetchWypozyczenia();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas kończenia wypożyczenia.");
    }
  };

  return (
    <div>
      <h3>Wszystkie Wypożyczenia</h3>
      {error && <p>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Klient</th>
            <th>Samochód</th>
            <th>Rejestracja</th>
            <th>Od</th>
            <th>Do</th>
            <th>Status</th>
            <th>Obsługujący</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {wypozyczenia.map((w) => (
            <tr key={w.idWypożyczenia}>
              <td>{w.idWypożyczenia}</td>
              <td>{w.klient_imie} {w.klient_nazwisko}</td>
              <td>{w.Marka} {w.Model}</td>
              <td>{w.Nr_Rej}</td>
              <td>{w.Data_wypożyczenia ? new Date(w.Data_wypożyczenia).toLocaleDateString() : "—"}</td>
              <td>{w.Data_zwrotu ? new Date(w.Data_zwrotu).toLocaleDateString() : "—"}</td>
              <td>{w.Status}</td>
              <td>
                {w.pracownik_imie
                  ? `${w.pracownik_imie} ${w.pracownik_nazwisko}`
                  : "–"}
              </td>
              <td>
                {w.Status === "zatwierdzone" && (
                  <button onClick={() => zakoncz(w.idWypożyczenia)}>Zakończ</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaWypozyczenAdmin;
