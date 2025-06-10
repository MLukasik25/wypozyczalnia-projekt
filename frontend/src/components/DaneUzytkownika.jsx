import PropTypes from "prop-types";

const DaneUzytkownika = ({ dane, rola }) => {
  if (!dane) {
    return (
      <p>
        {rola === "admin"
          ? "To konto administracyjne – brak danych osobowych."
          : "Brak danych kontaktowych."}
      </p>
    );
  }

  return (
    <div style={{ marginBottom: "2rem", maxWidth: "600px" }}>
      <p><strong>Imię:</strong> {dane.Imie}</p>
      <p><strong>Nazwisko:</strong> {dane.Nazwisko}</p>
      <p><strong>Email:</strong> {dane.Email}</p>
      <p><strong>Telefon:</strong> {dane.Telefon}</p>
      {dane.Adres && (
        <p><strong>Adres:</strong> {dane.Adres}</p>
      )}
    </div>

  );
};

DaneUzytkownika.propTypes = {
  dane: PropTypes.object,
  rola: PropTypes.string.isRequired,
};

export default DaneUzytkownika;
