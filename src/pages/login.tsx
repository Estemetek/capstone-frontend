import React from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton
} from "@ionic/react";
import "./login.css";

const Login: React.FC = () => {
  return (
    <IonPage className="login-page">
      <IonContent fullscreen>
        <div className="login-box">
          {/* Logo */}
          <div className="login-logo">
            <img src="assets/BrightAid Logo.png" alt="App Logo" />
          </div>

          {/* Welcome greeting */}
          <div className="login-title">Welcome</div>
          <p className="login-subtitle">Log in to your account to continue</p>

          {/* Form */}
          <form className="login-form">
            <IonInput
              className="login-input"
              type="email"
              placeholder="Email"
              fill="outline"
            />
            <IonInput
              className="login-input"
              type="password"
              placeholder="Password"
              fill="outline"
            />
            <IonButton expand="block" className="login-button" routerLink="/tabs/tab1">
              Login
            </IonButton>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
            </p>
            
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
