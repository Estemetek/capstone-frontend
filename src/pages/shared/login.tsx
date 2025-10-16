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

const DEV_ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzgxZjdmNmZhMzg5NjRhN2E4MDc3MyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MDYzMjA2NCwiZXhwIjoxNzYwNzE4NDY0fQ.c2InKBkyOzKRYYAip-XbzsfsJ72HO22sDisWizJQFgU";

const Login: React.FC = () => {
  const history = useHistory();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Check for default hardcoded admin (Development/Testing only)
    if (email === "admin@example.com" && password === "admin") {
      
      // ⭐️ CRITICAL FIX: The ProtectedRoute requires 'token' to confirm authentication.
      // We must set a placeholder token and userId for this hardcoded account.
      localStorage.setItem("token", DEV_ADMIN_TOKEN); 
      localStorage.setItem("userId", "admin-000-local");

      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userName", "Administrator");
      localStorage.setItem("userEmail", "admin@example.com");

      console.log("✅ Admin logged in (hardcoded)");
      history.push("/admin/home");
      return;
    }

    try {
      // Call your API for normal and dynamic admin accounts
      const res = await login(email, password);

      // Save token + user info from API response
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("userName", res.user.name);
      localStorage.setItem("userEmail", res.user.email ?? email);
      localStorage.setItem("userContact", res.user.contactNo ?? "");
      localStorage.setItem("userRole", res.user.role);

      console.log("✅ User logged in:", res);

      // 🔹 Redirect based on role provided by the API
      if (res.user.role === "admin") {
        history.push("/admin/home");
      } else {
        history.push("/tabs/tab1");
      }
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

          {/* <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p> */}
        </div>

        <div className="wave wave-bottom"></div>
      </IonContent>
    </IonPage>
  );
};

export default Login;