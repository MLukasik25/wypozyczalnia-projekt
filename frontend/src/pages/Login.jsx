import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [haslo, setHaslo] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, haslo });
      login(res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Błąd logowania:", err);
      alert("Nieprawidłowy email lub hasło");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="form-box">
        <h3>Logowanie</h3>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="hasło" value={haslo} onChange={(e) => setHaslo(e.target.value)} required />
        <br />
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}

export default Login;
