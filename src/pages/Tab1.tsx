import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  const userName = "Eunice"; // placeholder, will replace with API later
  return (
    <IonPage>
      <IonContent fullscreen className="home-content">
        {/* Greeting Section */}
        <div className="home-greeting">
          <h1>Hello, <span className="user-name">{userName}</span> 👋</h1>
        </div>
        {/* <ExploreContainer name="Home page" /> */}

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
