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
  IonButton,
} from "@ionic/react";
import {
  addCircleOutline,
  heartOutline,
  peopleOutline,
  ellipsisHorizontal,
  megaphoneOutline,
} from "ionicons/icons";
import "./Tab1.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* Greeting */}
        <h2 className="greeting">
          Hi <span className="highlight">Dominique</span>,
        </h2>
        <p className="subtext">Making a difference, one donation at a time.</p>


        <div className="search-container">
  <input
    type="text"
    placeholder="what do you want to help?"
    className="search-input"
  />
  <div className="search-btn">
    <IonIcon icon="options-outline" />
  </div>
</div>

        {/* Image banner */}
        <div className="banner">
          <img src="/assets/donate.png" className="banner-img" />
          <div className="banner-overlay">
            <IonButton fill="solid" size="small" className="view-more-btn">
              View more
            </IonButton>
          </div>
        </div>


        {/* Stats section */}
<IonGrid>
  <IonRow>
    <IonCol size="4">
      <div className="stat-card">
        <p>Items Donated</p>
        <h3>3</h3>
      </div>
    </IonCol>
    <IonCol size="4">
      <div className="stat-card">
        <p>Students Helped</p>
        <h3>1</h3>
      </div>
    </IonCol>
    <IonCol size="4">
      <div className="stat-card">
        <p>Drop Off Schedule</p>
        <h3>2</h3>
      </div>
    </IonCol>
  </IonRow>
</IonGrid>


        {/* Sharing kindness */}
        <div className="section-header">
          <h3>Sharing Kindness</h3>
          <a href="#">See all</a>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol size="3" className="ion-text-center">
              <div className="icon-circle">
                <IonIcon icon={addCircleOutline} size="large" />
              </div>
              <p>Donate</p>
            </IonCol>
            <IonCol size="3" className="ion-text-center">
              <div className="icon-circle">
                <IonIcon icon={heartOutline} size="large" />
              </div>
              <p>Charity</p>
            </IonCol>
            <IonCol size="3" className="ion-text-center">
              <div className="icon-circle">
                <IonIcon icon={peopleOutline} size="large" />
              </div>
              <p>Campaigns</p>
            </IonCol>
            <IonCol size="3" className="ion-text-center">
              <div className="icon-circle">
                <IonIcon icon={ellipsisHorizontal} size="large" />
              </div>
              <p>More</p>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Urgent Donation */}
        <h3>Urgent Donation</h3>
        <IonCard className="urgent-card">
          <IonCardContent>
            <IonIcon icon={megaphoneOutline} size="large" />
            <h2>Call for Donations</h2>
            <p>Many schools lack the basic tools students need to learn...</p>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
