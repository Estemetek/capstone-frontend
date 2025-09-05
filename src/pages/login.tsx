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
        {/* Wave background top */}
        <div className="wave wave-top"></div>
      
        {/* Centered container */}
        <div className="login-container">
          {/* Logo */}
        <div className="login-logo">
          <img src="assets/logo.png"/>
        </div>


          {/* Welcome greeting */}
          <div className="login-title">WELCOME</div>
          <p className="login-subtitle">Log in to your account to continue</p>

          {/* Form */}
          <form className="login-form">
            <IonInput
              className="login-input"
              type="email"
              placeholder="Email"
            />
            <IonInput
              className="login-input"
              type="password"
              placeholder="Password"
            />
            <IonButton expand="block" className="login-button" routerLink="/tabs/tab1">
              Login
            </IonButton>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>

        {/* Wave background bottom */}
        <div className="wave wave-bottom"></div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
