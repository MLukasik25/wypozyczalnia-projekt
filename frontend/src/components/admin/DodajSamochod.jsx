import { useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DodajSamochod = ({ onDodano }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    nr_rej: "",
    numer_vin: "",
    rocznik: "",
    marka: "",
    model: "",
    klasa: "",
    kolor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/samochody", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Pojazd dodany pomyślnie!");
      setFormData({
        nr_rej: "",
        numer_vin: "",
        rocznik: "",
        marka: "",
        model: "",
        klasa: "",
        kolor: "",
      });
      if (onDodano) onDodano();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania pojazdu");
    }
  };

  return (
    <div>
      <h3>Dodaj Nowy Samochód</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nr_rej" placeholder="Nr Rejestracyjny" value={formData.nr_rej} onChange={handleChange} required />
        <input type="text" name="numer_vin" placeholder="Numer VIN" value={formData.numer_vin} onChange={handleChange} required />
        <input type="number" name="rocznik" placeholder="Rocznik" value={formData.rocznik} onChange={handleChange} required />
        <input type="text" name="marka" placeholder="Marka" value={formData.marka} onChange={handleChange} required />
        <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
        <input type="text" name="klasa" placeholder="Klasa" value={formData.klasa} onChange={handleChange} />
        <input type="text" name="kolor" placeholder="Kolor" value={formData.kolor} onChange={handleChange} />
        <br />
        <button type="submit">Dodaj pojazd</button>
      </form>
    </div>
  );
};

export default DodajSamochod;
