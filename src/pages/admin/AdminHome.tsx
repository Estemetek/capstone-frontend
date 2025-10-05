// AdminHome.tsx
import "./AdminHome.css";
import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSearchbar,
  IonSpinner,
} from "@ionic/react";

import { heart, cube, people, business } from "ionicons/icons";

interface Donation {
  itemID: string;
  itemType: string;
  condition: string;
  donorInfo?: { name?: string };
  recipientInfo?: { school?: string };
  quantity?: number;
  createdAt?: string;
  status?: string;
}

const AdminHome: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Derived metrics
  const totalDonations = donations.length;
  const itemsDonated = donations
    .filter((d) =>
      d.status?.toLowerCase().includes("delivered") ||
      d.status?.toLowerCase().includes("donated")
    )
    .reduce((sum, d) => sum + (d.quantity || 1), 0);

  const activeDonors = new Set(
    donations.map((d) => d.donorInfo?.name).filter(Boolean)
  ).size;

  const organizations = new Set(
    donations.map((d) => d.recipientInfo?.school).filter(Boolean)
  ).size;

  // Fetch donations from backend
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/donations");
        const data = await res.json();
        setDonations(data);
      } catch (err) {
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Sort by most recent
  const sortedDonations = [...donations].sort(
    (a, b) =>
      new Date(b.createdAt || "").getTime() -
      new Date(a.createdAt || "").getTime()
  );

  // Filtered list for recent activity
  const filteredDonations = sortedDonations.filter((d) => {
    const donor = d.donorInfo?.name?.toLowerCase() || "";
    const item = d.itemType?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return donor.includes(search) || item.includes(search);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2 className="page-heading">Dashboard</h2>

        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Cards */}
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonCard className="dashboard-card blue-card">
                    <IonCardContent>
                      <IonIcon icon={heart} className="dashboard-icon" />
                      <h2 className="card-number">{totalDonations}</h2>
                      <h2 className="card-label">Donations</h2>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="6">
                  <IonCard className="dashboard-card blue-card">
                    <IonCardContent>
                      <IonIcon icon={cube} className="dashboard-icon" />
                      <h2 className="card-number">{itemsDonated}</h2>
                      <h2 className="card-label">Items Donated</h2>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6">
                  <IonCard className="dashboard-card gray-card">
                    <IonCardContent>
                      <IonIcon icon={people} className="dashboard-icon" />
                      <h2 className="card-number">{activeDonors}</h2>
                      <h2 className="card-label">Active Donors</h2>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="6">
                  <IonCard className="dashboard-card gray-card">
                    <IonCardContent>
                      <IonIcon icon={business} className="dashboard-icon" />
                      <h2 className="card-number">{organizations}</h2>
                      <h2 className="card-label">Organizations</h2>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* Recent Activity */}
            <h2 className="section-title">Recent Activity</h2>
            <div className="search-container">
              <IonSearchbar
                placeholder="Search by donor, item type..."
                value={searchTerm}
                onIonChange={(e) => setSearchTerm(e.detail.value!)}
              />
            </div>

            <IonList className="activity-list">
              {filteredDonations.length > 0 ? (
                filteredDonations.slice(0, 10).map((d) => (
                  <IonItem key={d.itemID} lines="full">
                    <IonLabel>
                      <h2>{d.donorInfo?.name || "Unknown Donor"}</h2>
                      <p>{d.itemType}</p>
                    </IonLabel>
                    <IonNote slot="end" className="note-column">
                      <div className="note-date">
                        {d.createdAt
                          ? new Date(d.createdAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {d.status && (
                        <div
                          className={`note-status ${
                            d.status.toLowerCase().includes("transit")
                              ? "in-transit"
                              : d.status.toLowerCase().includes("delivered")
                              ? "delivered"
                              : ""
                          }`}
                        >
                          {d.status}
                        </div>
                      )}
                    </IonNote>
                  </IonItem>
                ))
              ) : (
                <IonItem>
                  <IonLabel>No recent activity found.</IonLabel>
                </IonItem>
              )}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminHome;
