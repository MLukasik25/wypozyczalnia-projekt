import { useState } from "react";
import axios from "axios";

const Rejestracja = () => {
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    telefon: "",
    email: "",
    haslo: "",
    adres: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage("Rejestracja zakończona sukcesem!");
      setFormData({
        imie: "",
        nazwisko: "",
        telefon: "",
        email: "",
        haslo: "",
        adres: "",
      });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Błąd rejestracji");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} className="form-box">
        <h2>Rejestracja</h2>
        <input type="text" name="imie" placeholder="Imię" value={formData.imie} onChange={handleChange} required />
        <input type="text" name="nazwisko" placeholder="Nazwisko" value={formData.nazwisko} onChange={handleChange} required />
        <input type="text" name="telefon" placeholder="Telefon" value={formData.telefon} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="haslo" placeholder="Hasło" value={formData.haslo} onChange={handleChange} required />
        <input type="text" name="adres" placeholder="Adres" value={formData.adres} onChange={handleChange} required />
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
};

export default Rejestracja;
