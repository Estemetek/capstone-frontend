// AdminDonors.tsx (fixed)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonList, IonItem, IonLabel } from "@ionic/react";

const AdminDonors: React.FC = () => {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/donors"); // ✅ backend route
        setDonors(res.data);
      } catch (err: any) {
        console.error("Error fetching donors:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  if (loading) return <IonContent>Loading donors...</IonContent>;
  if (!donors.length) return <IonContent>No donors registered yet.</IonContent>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registered Donors</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {donors.map((donor, index) => (
            <IonItem key={index}>
              <IonLabel>
                <h2>{donor.name}</h2>
                <p>{donor.email}</p>
                <p>{donor.contactNo}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonButton
            expand="block"
            color="primary"
            routerLink="/admin/register-donor"
            style={{ margin: "16px 0" }}
            >
            Register a Donor Account
        </IonButton>
      </IonContent>
        <IonButton expand="block" color="medium" routerLink="/admin/settings" style={{ margin: "16px" }}>
            Back to Settings
        </IonButton>
    </IonPage>
  );
};

export default AdminDonors;
