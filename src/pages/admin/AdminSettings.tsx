// AdminSettings.tsx
import "./AdminSettings.css";
import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonText,
} from "@ionic/react";

const AdminSettings: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* User Info */}
        <div className="user-info">
          <div>
            <h1 className="user-name">Corazon Gomez</h1>
            <IonText color="medium">corazon@brightaid.com</IonText>
          </div>
          <IonButton size="small" className="logout-btn">
            Log Out
          </IonButton>
        </div>

        {/* Admin Section */}
        <IonList className="settings-list">
          <div className="list-header">ADMIN</div>
          <IonItem detail lines="full">
            <IonLabel>Manage Donors</IonLabel>
          </IonItem>
          <IonItem detail lines="full">
            <IonLabel>Recipient Organization</IonLabel>
          </IonItem>
          <IonItem detail lines="full">
            <IonLabel>Analytics & Reports</IonLabel>
          </IonItem>
        </IonList>

        {/* Help Section */}
        <IonList className="settings-list">
          <div className="list-header">HELP</div>
          <IonItem detail lines="full">
            <IonLabel>Help & FAQs</IonLabel>
          </IonItem>
          <IonItem detail lines="none">
            <IonLabel>Contact Support</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminSettings;
