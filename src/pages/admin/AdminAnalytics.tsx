// AdminAnalytics.tsx
import "./AdminAnalytics.css";
import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonItem,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
} from "@ionic/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data for chart
const data = [
  { name: "Jan", Electronics: 3, "School Supplies": 5 },
  { name: "Feb", Electronics: 4, "School Supplies": 5 },
  { name: "Mar", Electronics: 3, "School Supplies": 5 },
  { name: "Apr", Electronics: 3, "School Supplies": 5 },
  { name: "May", Electronics: 3, "School Supplies": 5 },
  { name: "Jun", Electronics: 4, "School Supplies": 6 },
];

const AdminAnalytics: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Total Donations Chart */}
        <h1 className="section-title">Total Donations</h1>
        <p className="section-subtitle">Total Donations Received by Type</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Electronics" fill="#7a9bbd" />
              <Bar dataKey="School Supplies" fill="#003366" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Registered Donors Count */}
        <h2 className="section-title">Registered Donors</h2>
        <p className="donor-count">68</p>

        {/* Donation Records */}
        <IonCard className="donation-card">
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="8">
                  <IonLabel>
                    <h2>Maria Mendoza</h2>
                    <h2>2 Laptops</h2>
                  </IonLabel>
                </IonCol>
                <IonCol size="4" className="text-right">
                  <h2 className="donation-status">Delivered</h2>
                  <h2 className="donation-number">5</h2>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Status Summary */}
        <IonList className="status-summary">
          <IonItem lines="full">
            <IonLabel>Registered Donors</IonLabel>
            <IonLabel slot="end" className="summary-value">
              12
            </IonLabel>
          </IonItem>
          <IonItem lines="full">
            <IonLabel>Delivered</IonLabel>
            <IonLabel slot="end" className="summary-value">
              5
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Pending</IonLabel>
            <IonLabel slot="end" className="summary-value">
              3
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminAnalytics;
