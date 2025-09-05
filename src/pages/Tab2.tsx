import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonChip,
  IonLabel,
} from "@ionic/react";
import {
  add,
  laptopOutline,
  cubeOutline,
  bagOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./Tab2.css";

const mockDonations = [
  { id: "12345", updated: "2 days ago by Admin", status: "In Transit", icon: laptopOutline },
  { id: "67890", updated: "1 week ago by Partner Org", status: "Delivered", icon: cubeOutline },
  { id: "14333", updated: "1 day ago by Partner Org", status: "Received", icon: bagOutline },
];

const Tab2: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Donations</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="donations-content">

        {/* My Donations Title */}
        <h2 className="section-title">My Donations</h2>

        {/* Filters */}
        <div className="filters">
          <IonChip className="filter-chip"><IonLabel>All</IonLabel></IonChip>
          <IonChip className="filter-chip"><IonLabel>Pending</IonLabel></IonChip>
          <IonChip className="filter-chip"><IonLabel>In Transit</IonLabel></IonChip>
          <IonChip className="filter-chip"><IonLabel>Delivered</IonLabel></IonChip>
        </div>


        {/* Stats */}
        <IonGrid>
          <IonRow>
            <IonCol size="4">
              <div className="stat-card">
                <p>Total Items Donated</p>
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
                <p>Organizations Supported</p>
                <h3>2</h3>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Donation List */}
        {mockDonations.map((donation) => (
          <IonCard key={donation.id} className="donation-card">
            <IonCardContent className="donation-item">
              <div className="donation-icon">
                <IonIcon icon={donation.icon} />
              </div>
              <div className="donation-details">
                <h4>Asset ID: {donation.id}</h4>
                <p>{donation.updated}</p>
              </div>
              <div className={`status-badge ${donation.status.toLowerCase().replace(" ", "-")}`}>
                {donation.status}
              </div>
            </IonCardContent>
          </IonCard>
        ))}

        {/* Empty State */}
<IonCard className="empty-card">
  <IonCardContent className="empty-card-content">
    <div className="empty-icon">
      <IonIcon icon="heart-outline" />
    </div>
    <div className="empty-text">
      <h4>You haven’t donated yet</h4>
      <p>Start making a difference today!</p>
    </div>
  </IonCardContent>
</IonCard>

        {/* Floating Add Donation Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push("/add-donation")} color="primary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};



export default Tab2;
