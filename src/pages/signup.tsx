import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./signup.css";

const Signup: React.FC = () => {
  const history = useHistory();

  const handleSignup = () => {
    // 🔹 Replace with actual signup logic later (API call, validation, etc.)
    history.push("/tabs/Tab1"); // Redirect after signup
  };

  return (
    <IonPage className="signup-page">
      <IonContent fullscreen>
        <div className="signup-box">
          {/* Logo */}
          <div className="signup-logo">
            <img src="assets/BrightAid Logo.png" alt="Logo" />
          </div>

          {/* Titles */}
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Sign up to get started</p>

          {/* Form */}
          <form className="signup-form">
            <IonInput
              className="signup-input"
              label="Full Name"
              labelPlacement="floating"
              fill="outline"
              type="text"
              required
            />

            <IonInput
              className="signup-input"
              label="Email"
              labelPlacement="floating"
              fill="outline"
              type="email"
              required
            />

            <IonInput
              className="signup-input"
              label="Password"
              labelPlacement="floating"
              fill="outline"
              type="password"
              required
            />

            <IonInput
              className="signup-input"
              label="Confirm Password"
              labelPlacement="floating"
              fill="outline"
              type="password"
              required
            />

            <IonButton
              expand="block"
              className="signup-button"
              onClick={handleSignup}
            >
              Sign Up
            </IonButton>
          </form>

          {/* Link to Login */}
          <p className="login-text">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
