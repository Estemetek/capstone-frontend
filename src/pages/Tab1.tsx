import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import "./Tab1.css";

const Tab1: React.FC = () => {
  const userName = "Dominique"; // placeholder, replace later with API

  return (
    <IonPage>
      {/* ✅ Header at the top */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        {/* Greeting Section - aligned left */}
        <div className="home-greeting" style={{ textAlign: "left", margin: "20px" }}>
          <h1>
            Hello, <span className="user-name">{userName}</span> 👋
          </h1>
        </div>

        {/* Quick Stats / Cards Example */}
        <IonCard>
          <IonCardContent>
            <h2>Total Donations</h2>
            <p>12 Items</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Items Delivered</h2>
            <p>7 Items</p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
