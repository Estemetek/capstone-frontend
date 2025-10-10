// src/pages/admin/AdminDonations.tsx
import "./AdminDonations.css";
import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";

const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/donations");
        const data = await res.json();

        // Filter out empty donations
        const validData = data.filter((d: any) => d.itemID && d.donorInfo?.name);
        setDonations(validData);
      } catch (err) {
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  // Filter search results
  const filtered = donations.filter((d) => {
    const donor = d.donorInfo?.name?.toLowerCase() || "";
    const item = d.itemType?.toLowerCase() || "";
    return donor.includes(searchTerm.toLowerCase()) || item.includes(searchTerm.toLowerCase());
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Donations</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2 className="page-heading">Donation Management</h2>

        {/* Searchbar */}
        <IonSearchbar
          placeholder="Search by donor or item..."
          value={searchTerm}
          onIonInput={(e) => setSearchTerm(e.detail.value!)}
        />

        {/* Donation List */}
        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          <IonList className="donations-list">
            {filtered.length === 0 ? (
              <IonItem>
                <IonLabel>No donations found</IonLabel>
              </IonItem>
            ) : (
              filtered.map((donation) => (
                <IonItem
                  key={donation.itemID}
                  button
                  onClick={() => history.push(`/admin/donations/${donation.itemID}`)}
                >
                  <IonLabel>
                    <h2>{donation.donorInfo?.name || "Unknown Donor"}</h2>
                    <p>
                      {donation.itemType || "N/A"} •{" "}
                      {donation.condition ? donation.condition.toUpperCase() : "Unknown Condition"}
                    </p>
                  </IonLabel>
                  <IonNote slot="end">
                    {donation.createdAt
                      ? new Date(donation.createdAt).toLocaleDateString()
                      : "N/A"}
                    <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
                  </IonNote>
                </IonItem>
              ))
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminDonations;
