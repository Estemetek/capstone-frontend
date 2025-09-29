import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { login } from "../../services/api"; // your API call
import "./login.css";

const Login: React.FC = () => {
  const history = useHistory();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Check for default admin account first
    if (email === "admin@example.com" && password === "admin") {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userName", "Administrator");
      localStorage.setItem("userEmail", "admin@example.com");

      console.log("✅ Admin logged in");
      history.push("/admin/home");
      return;
    }

    try {
      // Otherwise, call your normal API for donors
      const res = await login(email, password);

      // Save token + user info
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("userName", res.user.name);
      localStorage.setItem("userEmail", res.user.email ?? email);
      localStorage.setItem("userContact", (res.user as any).contactNo ?? "");
      localStorage.setItem("userRole", res.user.role);

      console.log("✅ Donor logged in:", res);

      // Redirect donor side
      history.push("/tabs/tab1");
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      setError("Username or password incorrect");
    }
  };

  return (
    <IonPage className="login-page">
      <IonContent fullscreen>
        <div className="wave wave-top"></div>

        <div className="login-container">
          <div className="login-logo">
            <img src="assets/logo.png" alt="Logo" />
          </div>

          <div className="login-title">WELCOME</div>
          <p className="login-subtitle">Log in to your account to continue</p>

          <form className="login-form" onSubmit={handleLogin}>
            <IonInput
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              required
            />
            <IonInput
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              required
            />

            {error && <p className="error-text">{error}</p>}

            <IonButton expand="block" className="login-button" type="submit">
              Login
            </IonButton>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>

        <div className="wave wave-bottom"></div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
