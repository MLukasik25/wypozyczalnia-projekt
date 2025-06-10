import PropTypes from "prop-types";

const MojeWypozyczeniaKlient = ({ wypozyczenia }) => {
  return (
    <div>
      <h3>Moje wypożyczenia</h3>
      {wypozyczenia.length === 0 ? (
        <p>Brak wypożyczeń.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Samochód</th>
              <th>Data wypożyczenia</th>
              <th>Data zwrotu</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {wypozyczenia.map((w) => (
              <tr key={w.idWypożyczenia}>
                <td>{w.idWypożyczenia}</td>
                <td>{`${w.Marka} ${w.Model}`}</td>
                <td>
                  {w.Data_wypożyczenia
                    ? new Date(w.Data_wypożyczenia).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  {w.Data_zwrotu
                    ? new Date(w.Data_zwrotu).toLocaleDateString()
                    : "—"}
                </td>
                <td className={`status-${w.Status}`}>{w.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>

      )}
    </div>
  );
};

MojeWypozyczeniaKlient.propTypes = {
  wypozyczenia: PropTypes.array.isRequired,
};

export default MojeWypozyczeniaKlient;
