import { useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const RejestracjaPracownika = () => {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    telefon: "",
    email_kontakt: "",
    oddzial: "",
  });

  if (!user || user.rola !== "admin") {
    return <p>Brak dostępu</p>;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register/pracownik", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Pracownik dodany!");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania pracownika");
    }
  };

  return (
    <div>
      <h2>Dodaj pracownika</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="imie" placeholder="Imię" onChange={handleChange} required />
        <input type="text" name="nazwisko" placeholder="Nazwisko" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email (login)" onChange={handleChange} required />
        <input type="password" name="haslo" placeholder="Hasło" onChange={handleChange} required />
        <input type="text" name="telefon" placeholder="Telefon (opcjonalnie)" onChange={handleChange} />
        <input type="email" name="email_kontakt" placeholder="Email kontaktowy (opcjonalnie)" onChange={handleChange} />
        <input type="text" name="oddzial" placeholder="Oddział" onChange={handleChange} required />
        <button type="submit">Zarejestruj pracownika</button>
      </form>
    </div>
  );
};

export default RejestracjaPracownika;