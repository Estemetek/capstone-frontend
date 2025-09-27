import React, { useEffect, useState } from "react";
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
  IonSpinner,
} from "@ionic/react";
import { add, laptopOutline, cubeOutline, bagOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { getDonations, BlockchainDonation } from "../../services/api";
import "./Tab2.css";

const Tab2: React.FC = () => {
  const history = useHistory();
  const [donations, setDonations] = useState<BlockchainDonation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<BlockchainDonation[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); // 👈 comes from login

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getDonations(userId || "");
        setDonations(data);
        setFilteredDonations(data); // default = all
      } catch (err) {
        console.error("❌ Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  // Handle filter change
  const handleFilter = (status: string) => {
    setFilter(status);
    if (status === "All") {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(donations.filter((d) => d.status === status));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Donations</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="donations-content">
        <h1 className="section-title">My Donations</h1>

        {/* Filters */}
        <div className="filters">
          {["All", "Pending", "Donated", "In Transit", "Delivered", "Received"].map((status) => (
            <IonChip
              key={status}
              className={`filter-chip ${filter === status ? "active" : ""}`}
              onClick={() => handleFilter(status)}
            >
              <IonLabel>{status}</IonLabel>
            </IonChip>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && <IonSpinner name="crescent" />}

        {/* Donation List */}
        {!loading && filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <IonCard
              key={donation.itemID}
              className="donation-card"
              button
              onClick={() => history.push(`/tabs/donation/${donation.itemID}`)} // 👈 navigate
            >
              <IonCardContent className="donation-item">
                <div className="donation-icon">
                  <IonIcon
                    icon={
                      donation.itemType.toLowerCase().includes("laptop")
                        ? laptopOutline
                        : donation.itemType.toLowerCase().includes("bag")
                        ? bagOutline
                        : cubeOutline
                    }
                  />
                </div>
                <div className="donation-details">
                  <h4>{donation.itemType}</h4>
                  <p>Asset ID: {donation.itemID}</p>
                </div>
                <div
                  className={`status-badge ${donation.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {donation.status}
                </div>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          !loading && (
            <IonCard className="empty-card">
              <IonCardContent className="empty-card-content">
                <div className="empty-icon">
                  <IonIcon icon={bagOutline} />
                </div>
                <div className="empty-text">
                  <h4>You haven’t donated yet</h4>
                  <p>Start making a difference today!</p>
                </div>
              </IonCardContent>
            </IonCard>
          )
        )}

        {/* Floating Add Donation Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push("/tabs/add-donation")} color="primary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
