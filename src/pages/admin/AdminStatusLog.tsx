// src/pages/admin/AdminStatusLog.tsx
import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonButtons,
  IonBackButton,
  IonSpinner,
} from "@ionic/react";
import { useParams } from "react-router-dom";

interface StatusChange {
  status: string;
  changedBy: string;
  timestamp: string;
  remarks?: string;
  currentOwner?: string;
}

interface RouteParams {
  itemID: string;
}

const AdminStatusLog: React.FC = () => {
  const { itemID } = useParams<RouteParams>();
  const [statusHistory, setStatusHistory] = useState<StatusChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/donations/${itemID}/status-history`
        );
        const data = await res.json();
        setStatusHistory(data);
      } catch (err) {
        console.error("Error fetching status history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusHistory();
  }, [itemID]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/admin/donations/${itemID}`} />
          </IonButtons>
          <IonTitle>Status Change History</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <IonSpinner name="crescent" />
        ) : statusHistory.length === 0 ? (
          <p>No status changes recorded for this donation yet.</p>
        ) : (
          <IonList>
            {statusHistory
              .slice()
              .reverse() // latest first
              .map((entry, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    <h2>{entry.status}</h2>
                    <p>
                      Changed by: <strong>{entry.changedBy}</strong>
                    </p>
                    {entry.currentOwner && (
                      <p>
                        New Owner: <em>{entry.currentOwner}</em>
                      </p>
                    )}
                    {entry.remarks && (
                      <p style={{ color: "#555" }}>
                        Remarks: {entry.remarks}
                      </p>
                    )}
                  </IonLabel>
                  <IonNote slot="end">
                    {new Date(entry.timestamp).toLocaleString()}
                  </IonNote>
                </IonItem>
              ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminStatusLog;
