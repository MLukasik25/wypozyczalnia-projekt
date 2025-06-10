import PropTypes from 'prop-types';

function MojeFaktury({ faktury }) {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Samochód</th>
          <th>Data wypożyczenia</th>
          <th>Data zwrotu</th>
          <th>Dni</th>
          <th>Pakiet</th>
          <th>Ubezpieczenie</th>
          <th>Cena wypożyczenia</th>
          <th>Koszt naprawy</th>
          <th>Suma</th>
        </tr>
      </thead>
      <tbody>
        {faktury.map(faktura => (
          <tr key={faktura.idFaktury}>
            <td>{faktura.idFaktury}</td>
            <td>{faktura.Samochod}</td>
            <td>{new Date(faktura.DataWypożyczenia).toLocaleDateString()}</td>
            <td>{new Date(faktura.DataZwrotu).toLocaleDateString()}</td>
            <td>{faktura.CzasWypożyczenia}</td>
            <td>{faktura.Pakiet}</td>
            <td>{parseFloat(faktura.CenaUbezpieczenia).toFixed(2)} zł</td>
            <td>{parseFloat(faktura.CenaWypożyczenia).toFixed(2)} zł</td>
            <td>{parseFloat(faktura.KosztNaprawy).toFixed(2)} zł</td>
            <td>{parseFloat(faktura.CenaCałkowita).toFixed(2)} zł</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

MojeFaktury.propTypes = {
  faktury: PropTypes.array.isRequired
};

export default MojeFaktury;
