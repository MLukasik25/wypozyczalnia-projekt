import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const [samochody, setSamochody] = useState([]);
  const { token, rola } = useAuth();

  useEffect(() => {
    api.get('/samochody/ceny')
      .then(res => setSamochody(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Witaj na stronie głównej wypożyczalni!</h1>
      <p>Wybierz pojazd i rozpocznij swoją podróż.</p>

      <div className="car-list">
        {samochody.length > 0 ? (
          samochody.map(samochod => (
            <div key={samochod.Nr_Rej} className="car-item">
              <h3>{samochod.Marka} {samochod.Model}</h3>
              <p>Rocznik: {samochod.Rocznik}</p>
              <p>Klasa: {samochod.Klasa}</p>
              <p>Cena: {samochod.Cena_per_Dzień} PLN/dzień</p>

              <Link to={`/rezerwacja/${samochod.Nr_Rej}`}>
                <button>Zarezerwuj</button>
              </Link>

            </div>
          ))
        ) : (
          <p>Ładowanie danych...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
