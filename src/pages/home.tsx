import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton
} from "@ionic/react";
import {
  heartOutline,
  schoolOutline,
  calendarOutline,
  addCircleOutline,
  peopleOutline,
  megaphoneOutline,
} from "ionicons/icons";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* Greeting */}
        <h2>
          Hi <strong>Dominique</strong>,
        </h2>
        <p>Making a difference, one donation at a time.</p>

        {/* Search bar */}
        <IonSearchbar placeholder="What do you want to help?" />

        {/* Stats Cards */}
        <IonGrid>
          <IonRow>
            <IonCol size="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>3</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>Items Donated</IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>1</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>Students Helped</IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>2</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>Drop-off</IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Sharing Kindness Section */}
        <h3>Sharing kindness</h3>
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonIcon icon={addCircleOutline} size="large" />
              <p>Donate</p>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonIcon icon={heartOutline} size="large" />
              <p>Charity</p>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonIcon icon={peopleOutline} size="large" />
              <p>Campaigns</p>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonIcon icon={calendarOutline} size="large" />
              <p>More</p>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Urgent Donation Section */}
        <h3>Urgent Donation</h3>
        <IonCard color="tertiary">
          <IonCardContent>
            <IonIcon icon={megaphoneOutline} size="large" />
            <h2>Call for Donations</h2>
            <p>Many schools lack the basic tools students need to learn.</p>
            <IonButton expand="block" fill="solid" color="light">
              Donate Now
            </IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
