// src/pages/DonationDetail.tsx
import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { getDonationById } from "../services/api";

interface RouteParams {
  id: string;
}

interface DonationDetailData {
  blockchain: {
    itemID: string;
    itemType: string;
    condition: string;
    donorID: string;
    currentOwner: string;
    status: string;
    timestamp: string;
  };
  offchain: {
    donorInfo: {
      name: string;
      email: string;
      contactNo: string;
    };
    recipientInfo?: {
      school?: string;
      contact?: string;
    };
    category?: string;
    quantity?: number;
    notes?: string;
    createdAt?: string;

    qrCodeUrl?: string;
  };
}

const DonationDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [donation, setDonation] = useState<DonationDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonation() {
      try {
        setLoading(true);
        const data = await getDonationById(id); // ✅ using API helper
        setDonation(data);
      } catch (err) {
        console.error("❌ Error fetching donation details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDonation();
  }, [id]);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Donation Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  if (!donation) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Donation Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Donation not found.</p>
        </IonContent>
      </IonPage>
    );
  }

  const { blockchain, offchain } = donation;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/donations" />
          </IonButtons>
          <IonTitle>Donation Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
            <IonCardContent>
                <h2>{blockchain.itemType}</h2>
                <p><strong>Asset ID:</strong> {blockchain.itemID}</p>
                <p><strong>Status:</strong> {blockchain.status}</p>
                <p><strong>Condition:</strong> {blockchain.condition}</p>
                <p><strong>Owner:</strong> {blockchain.currentOwner}</p>
                <p>
                <strong>Donor:</strong> {offchain.donorInfo.name} (
                {offchain.donorInfo.email})
                </p>

                {/* ✅ QR Code Section */}
                {offchain.qrCodeUrl && (
                  <div style={{ marginTop: "15px", textAlign: "center" }}>
                    <h3>Donation QR Code</h3>
                    <img
                      src={offchain.qrCodeUrl}   // ✅ already absolute, no prefix needed
                      alt="Donation QR Code"
                      style={{ width: "200px" }}
                    />
                    <p style={{ fontSize: "0.9em" }}>
                      Scan this code to verify donation
                    </p>
                  </div>
                )}

                {offchain.recipientInfo?.school && (
                <p><strong>Recipient School:</strong> {offchain.recipientInfo.school}</p>
                )}
                {offchain.notes && <p><strong>Notes:</strong> {offchain.notes}</p>}
                {offchain.quantity && (
                <p><strong>Quantity:</strong> {offchain.quantity}</p>
                )}
                <p>
                <strong>Date Donated:</strong>{" "}
                {new Date(offchain.createdAt || blockchain.timestamp).toLocaleString()}
                </p>
            </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DonationDetail;
