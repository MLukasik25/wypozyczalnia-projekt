import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { useState } from "react";

const MojeWypożyczenia = ({ wypozyczenia, odswiez }) => {
  const { token } = useAuth();
  const [error, setError] = useState("");

  const zakonczWypozyczenie = async (id) => {
    const potwierdz = window.confirm("Czy na pewno chcesz zakończyć to wypożyczenie?");
    if (!potwierdz) return;

    try {
      await api.put(`/wypozyczenia/${id}`, { status: "zakończone" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Wypożyczenie zakończone.");
      if (odswiez) odswiez();
    } catch (err) {
      console.error(err);
      setError("Błąd podczas kończenia wypożyczenia.");
    }
  };

  return (
    <div>
      <h3>Wypożyczenia obsługiwane przez Ciebie</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {wypozyczenia.length === 0 ? (
        <p>Brak wypożyczeń.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Klient</th>
              <th>Pojazd</th>
              <th>Data wypożyczenia</th>
              <th>Data zwrotu</th>
              <th>Status</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {wypozyczenia.map((w) => (
              <tr key={w.idWypożyczenia}>
                <td>{w.idWypożyczenia}</td>
                <td>{w.Klient}</td>
                <td>{`${w.Marka} ${w.Model} (${w.NrRej})`}</td>
                <td>{w.Data_wypożyczenia ? new Date(w.Data_wypożyczenia).toLocaleDateString() : "—"}</td>
                <td>{w.Data_zwrotu ? new Date(w.Data_zwrotu).toLocaleDateString() : "—"}</td>
                <td className={`status-${w.Status}`}>{w.Status}</td>
                <td>
                  {w.Status === "zatwierdzone" && (
                    <button className="action" onClick={() => zakonczWypozyczenie(w.idWypożyczenia)}>
                      Zakończ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

MojeWypożyczenia.propTypes = {
  wypozyczenia: PropTypes.array.isRequired,
  odswiez: PropTypes.func
};

export default MojeWypożyczenia;
