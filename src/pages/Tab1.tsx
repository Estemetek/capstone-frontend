import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import "./Tab1.css";
import { getDonations, Donation } from "../services/api";

const Tab1: React.FC = () => {
  const userName = "Dominique"; // placeholder
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch donations from backend
  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDonations();
      setDonations(data);
    } catch (err: any) {
      console.error("Failed to fetch donations:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const totalDonations = donations.length;
  const itemsDelivered = donations.filter((d) => d.Owner && d.Owner !== "").length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        {/* Greeting */}
        <div className="home-greeting" style={{ textAlign: "left", margin: "20px" }}>
          <h1>
            Hello, <span className="user-name">{userName}</span> 👋
          </h1>
          <p>Making a difference, one donation at a time.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <IonSpinner name="crescent" />
          </div>
        )}

        {/* Error */}
        {error && (
          <IonText color="danger">
            <p style={{ textAlign: "center", marginTop: "20px" }}>Error: {error}</p>
          </IonText>
        )}

        {/* Stats and donation list */}
        {!loading && !error && (
          <>
            <IonCard>
              <IonCardContent>
                <h2>Total Donations</h2>
                <p>{totalDonations} Items</p>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardContent>
                <h2>Items Delivered</h2>
                <p>{itemsDelivered} Items</p>
              </IonCardContent>
            </IonCard>

            {/* Donation List */}
            {donations.map((donation) => (
              <IonCard key={donation.ID}>
                <IonCardContent>
                  <h3>
                    {donation.ID} - {donation.Color || "N/A"}
                  </h3>
                  <p>Owner: {donation.Owner || "N/A"}</p>
                  <p>Size: {donation.Size ?? "N/A"}</p>
                  <p>Appraised Value: {donation.AppraisedValue ?? "N/A"}</p>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
