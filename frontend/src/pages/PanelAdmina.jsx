import { useState } from "react";
import RejestracjaPracownika from "../components/admin/RejestracjaPracownika";
import ListaSamochodow from "../components/admin/ListaSamochodow";
import DodajSamochod from "../components/admin/DodajSamochod";
import ListaUzytkownikow from "../components/admin/ListaUzytkownikow";
import ListaWypozyczenAdmin from "../components/admin/ListaWypozyczenAdmin";
import DodajNaprawe from "../components/admin/DodajNaprawe";

const PanelAdmina = () => {
  const [pokazRejestracja, setPokazRejestracja] = useState(false);
  const [pokazSamochody, setPokazSamochody] = useState(false);
  const [pokazDodajSamochod, setPokazDodajSamochod] = useState(false);
  const [pokazUzytkownicy, setPokazUzytkownicy] = useState(false);
  const [pokazWypozyczenia, setPokazWypozyczenia] = useState(false);
  const [pokazNaprawy, setPokazNaprawy] = useState(false);

  return (
    <div className="panel-box">
      <h2>Panel Administratora</h2>

      <div className="admin-toolbar">
        <button className="action" onClick={() => setPokazRejestracja(!pokazRejestracja)}>
          {pokazRejestracja ? "Ukryj rejestrację pracownika" : "Dodaj pracownika"}
        </button>

        <button className="action" onClick={() => setPokazSamochody(!pokazSamochody)}>
          {pokazSamochody ? "Ukryj listę samochodów" : "Zarządzaj samochodami"}
        </button>

        <button className="action" onClick={() => setPokazUzytkownicy(!pokazUzytkownicy)}>
          {pokazUzytkownicy ? "Ukryj listę użytkowników" : "Zarządzaj użytkownikami"}
        </button>

        <button className="action" onClick={() => setPokazWypozyczenia(!pokazWypozyczenia)}>
          {pokazWypozyczenia ? "Ukryj wypożyczenia" : "Wszystkie wypożyczenia"}
        </button>

        <button className="action" onClick={() => setPokazNaprawy(!pokazNaprawy)}>
          {pokazNaprawy ? "Ukryj formularz naprawy" : "Dodaj naprawę"}
        </button>
      </div>

      {pokazRejestracja && <RejestracjaPracownika />}
      {pokazSamochody && <ListaSamochodow />}
      {pokazDodajSamochod && <DodajSamochod />}
      {pokazUzytkownicy && <ListaUzytkownikow />}
      {pokazWypozyczenia && <ListaWypozyczenAdmin />}
      {pokazNaprawy && <DodajNaprawe />}
    </div>
  );
};

export default PanelAdmina;
