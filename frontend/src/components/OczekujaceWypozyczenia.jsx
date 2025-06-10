import PropTypes from "prop-types";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const OczekujaceWypozyczenia = ({ wypozyczenia }) => {
  const { token } = useAuth();

  const zatwierdzWypozyczenie = async (id) => {
    try {
      await api.put(`/wypozyczenia/zatwierdz/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Wypożyczenie nr ${id} zostało zatwierdzone.`);
      window.location.reload();
    } catch (error) {
      console.error("Błąd przy zatwierdzaniu:", error);
      alert("Nie udało się zatwierdzić wypożyczenia.");
    }
  };

  if (wypozyczenia.length === 0) {
    return <p>Brak oczekujących wypożyczeń.</p>;
  }

  return (
    <div>
      <h3>Oczekujące wypożyczenia</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Klient</th>
            <th>Samochód</th>
            <th>Data wypożyczenia</th>
            <th>Status</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {wypozyczenia.map((w) => (
            <tr key={w.idWypożyczenia}>
              <td>{w.idWypożyczenia}</td>
              <td>{w.Imie} {w.Nazwisko}</td>
              <td>{w.Marka} {w.Model}</td>
              <td>
                {w.Data_wypożyczenia
                  ? new Date(w.Data_wypożyczenia).toLocaleDateString()
                  : "—"}
              </td>
              <td className={`status-${w.Status}`}>{w.Status}</td>
              <td>
                <button className="action" onClick={() => zatwierdzWypozyczenie(w.idWypożyczenia)}>
                  Zatwierdź
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

OczekujaceWypozyczenia.propTypes = {
  wypozyczenia: PropTypes.array.isRequired,
};

export default OczekujaceWypozyczenia;
