// AdminHome.tsx
import "./AdminHome.css";
import React from "react";
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
} from "@ionic/react";

import { heart, cube, people, business } from "ionicons/icons";

const AdminHome: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Page Heading */}
        <h2 className="page-heading">Dashboard</h2>

        {/* Dashboard Cards */}
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard className="dashboard-card blue-card">
              <IonCardContent>
                <IonIcon icon={heart} className="dashboard-icon" />
                <h2 className="card-number">10</h2>
                <h2 className="card-label">Donations</h2>
              </IonCardContent>

              </IonCard>
            </IonCol>

            <IonCol size="6">
              <IonCard className="dashboard-card blue-card">
                <IonCardContent>
                  <IonIcon icon={cube} className="dashboard-icon" />
                  <h2>62</h2>
                  <h2>Items Donated</h2>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6">
              <IonCard className="dashboard-card gray-card">
                <IonCardContent>
                  <IonIcon icon={people} className="dashboard-icon" />
                  <h2>5</h2>
                  <h2>Active Donors</h2>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="6">
              <IonCard className="dashboard-card gray-card">
                <IonCardContent>
                  <IonIcon icon={business} className="dashboard-icon" />
                  <h2>3</h2>
                  <h2>Organization</h2>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Recent Activity */}
        <h2 className="section-title">Recent Activity</h2>
        <div className="search-container">
          <IonSearchbar placeholder="Search by donor, item type..." />
        </div>


        <IonList className="activity-list">
          <IonItem lines="full">
            <IonLabel>
              <h2>Maria Mendoza</h2>
              <p>2 Laptops</p>
            </IonLabel>
            <IonNote slot="end" className="note-column">
              <div className="note-date">Sept 14, 2025</div>
              <div className="note-status in-transit">In Transit</div>
            </IonNote>

          </IonItem>

          <IonItem lines="full">
            <IonLabel>
              <h2>Jennie Kim</h2>
              <p>School Supplies</p>
            </IonLabel>
            <IonNote slot="end" className="note-column">
              <div className="note-date">Sept 09, 2025</div>
              <div className="note-status delivered">Delivered</div>
            </IonNote>

          </IonItem>

          <IonItem lines="full">
            <IonLabel>
              <h2>Rose Park</h2>
              <p>Educational Books</p>
            </IonLabel>
          <IonNote slot="end" className="note-column">
            <div className="note-date">Sept 08, 2025</div>
            <div className="note-status delivered">Delivered</div>
          </IonNote>

          </IonItem>

          <IonItem lines="full">
            <IonLabel>
              <h2>Lisa Manoban</h2>
            </IonLabel>
          <IonNote slot="end" className="note-column">
            <div className="note-date">Sept 08, 2025</div>
          </IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminHome;
