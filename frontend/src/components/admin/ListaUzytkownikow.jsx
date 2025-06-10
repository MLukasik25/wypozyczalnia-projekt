import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ListaUzytkownikow = () => {
  const { token } = useAuth();
  const [uzytkownicy, setUzytkownicy] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUzytkownicy = async () => {
      try {
        const res = await api.get("/uzytkownicy/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUzytkownicy(res.data);
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać listy użytkowników.");
      }
    };

    fetchUzytkownicy();
  }, [token]);

  return (
    <div>
      <h3>Lista Użytkowników</h3>
      {error && <p>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rola</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Telefon</th>
            <th>Adres</th>
            <th>ID powiązany</th>
          </tr>
        </thead>
        <tbody>
          {uzytkownicy.map((u) => (
            <tr key={u.id_uzytkownika}>
              <td>{u.id_uzytkownika}</td>
              <td>{u.email}</td>
              <td>{u.rola}</td>
              <td>{u.imie || "-"}</td>
              <td>{u.nazwisko || "-"}</td>
              <td>{u.telefon || "-"}</td>
              <td>{u.adres || "-"}</td>
              <td>{u.powiazane_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaUzytkownikow;
