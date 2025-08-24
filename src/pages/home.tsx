import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Welcome! 🎉</h2>
        <p>You are now logged in.</p>
      </IonContent>
    </IonPage>
  );
};

export default Home;
