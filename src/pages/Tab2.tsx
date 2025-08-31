import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Tab2.css';

const mockDonations = [
  { id: 1, name: 'Old Laptop', date: 'Aug 20, 2025', status: 'Distributed' },
  { id: 2, name: 'School Bag', date: 'Aug 22, 2025', status: 'Pending Verification' },
];

const Tab2: React.FC = () => {
  const history = useHistory();
  const userName = "Dominique"; // placeholder, replace later with API

  const goToAddDonation = () => {
    history.push('/add-donation');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Donations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="donations-content">
        <div className="home-greeting" style={{ textAlign: "left", margin: "20px" }}>
          <h1>
            Hello, <span className="user-name">{userName}</span> 👋
          </h1>
          <p>Making a difference, one donation at a time.</p>
        </div>

        {mockDonations.map(donation => (
          <IonCard key={donation.id}>
            <IonCardContent>
              <h3>{donation.name}</h3>
              <p>Donated: {donation.date}</p>
              <p>Status: {donation.status}</p>
            </IonCardContent>
          </IonCard>
        ))}

        {/* Floating Action Button to Add Donation */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/add-donation')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
