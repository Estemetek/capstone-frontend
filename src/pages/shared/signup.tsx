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
    // 🔹 Replace with actual signup logic later
    history.push("/tabs/tab1"); 
  };

  return (
    <IonPage className="signup-page">
      <IonContent fullscreen>
        <div className="signup-container">
          {/* Logo */}
          <div className="signup-logo">
            <img src="assets/logo.png" />
          </div>

          {/* Titles */}
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Sign up to get started</p>

          {/* Form */}
          <form className="signup-form">
            <IonInput
              className="signup-input"
              type="text"
              placeholder="Full Name"
              required
            />

            <IonInput
              className="signup-input"
              type="email"
              placeholder="Email"
              required
            />

            <IonInput
              className="signup-input"
              type="password"
              placeholder="Password"
              required
            />

            <IonInput
              className="signup-input"
              type="password"
              placeholder="Confirm Password"
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
