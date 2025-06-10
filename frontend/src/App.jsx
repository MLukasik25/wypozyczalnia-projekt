import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Rejestracja from './pages/Rejestracja';
import Navbar from './components/Navbar';
import PanelUzytkownika from './pages/PanelUzytkownika';
import PanelAdmina from "./pages/PanelAdmina";
import PanelPracownika from "./pages/PanelPracownika";
import StronaRezerwacji from './pages/StronaRezerwacji';
import RequireAuth from './context/RequireAuth';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rejestracja" element={<Rejestracja />} />
        <Route
          path="/panel"
          element={
            <RequireAuth role="klient">
              <PanelUzytkownika />
            </RequireAuth>
          }
        />
        <Route
          path="/panel-admina"
          element={
            <RequireAuth role="admin">
              <PanelAdmina />
            </RequireAuth>
          }
        />
        <Route
          path="/panel-pracownika"
          element={
            <RequireAuth role="pracownik">
              <PanelPracownika />
            </RequireAuth>
          }
        />
        <Route 
        path="/rezerwacja/:nrRej" 
        element={<RequireAuth role="klient">
              <StronaRezerwacji />
            </RequireAuth>} />
      </Routes>
    </>
  );
}

export default App;
