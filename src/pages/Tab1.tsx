import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import {
  addCircleOutline,
  peopleOutline,
  schoolOutline,
  megaphoneOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import "./Tab1.css";

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* Hero Section */}
        <section className="hero">
          <h2 className="greeting">
            Hi <span className="highlight">{userName || "Guest"}</span>,
          </h2>
          <p className="subtext">
            We connect unused electronics and school essentials with students in need — 
            powered by community, guided by transparency.
          </p>
        </section>

        {/* Banner */}
        <div className="banner">
          <img src="/assets/donate.png" className="banner-img" />
          <div className="banner-text">
            <h3>Every small act makes a big change.</h3>
          </div>
        </div>

        {/* Stats */}
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
                <p>Drop Offs</p>
                <h3>2</h3>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

      <IonButton expand="block" className="donate-btn">
        Donate Now
      </IonButton>

        {/* How It Works */}
        <section className="section">
          <h3>How It Works</h3>
          <IonGrid>
            <IonRow>
              <IonCol size="4" className="ion-text-center">
                <IonIcon icon={addCircleOutline} size="large" />
                <p>Donate Items</p>
              </IonCol>
              <IonCol size="4" className="ion-text-center">
                <IonIcon icon={checkmarkCircleOutline} size="large" />
                <p>Track Journey</p>
              </IonCol>
              <IonCol size="4" className="ion-text-center">
                <IonIcon icon={schoolOutline} size="large" />
                <p>Impact Lives</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>

        {/* Our Values */}
        <section className="section">
          <h3>Our Values</h3>
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-md="6">
                <IonCard className="value-card">
                  <IonCardContent>
                    <h4>Transparency</h4>
                    <p>Every donation is tracked with blockchain technology.</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" size-md="6">
                <IonCard className="value-card">
                  <IonCardContent>
                    <h4>Sustainability</h4>
                    <p>Reduce waste by giving items a second life.</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" size-md="6">
                <IonCard className="value-card">
                  <IonCardContent>
                    <h4>Community</h4>
                    <p>Built with volunteers, donors, and partners.</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" size-md="6">
                <IonCard className="value-card">
                  <IonCardContent>
                    <h4>Education First</h4>
                    <p>Focused on empowering students through access.</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>

        {/* Urgent Donation / Story */}
        <section className="section">
          <h3>Urgent Donation</h3>
          <IonCard className="urgent-card">
            <IonCardContent>
              <IonIcon icon={megaphoneOutline} size="large" />
              <h2>Call for Donations</h2>
              <p>
                Many schools lack the basic tools students need to learn. Your
                support can make a difference today.
              </p>
            </IonCardContent>
          </IonCard>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© 2025 BrightAid. Built for community impact.</p>
          <p>Partners: Org1 | Org2 | Org3</p>
        </footer>

      </IonContent>
    </IonPage>
  );
};

export default Home;
