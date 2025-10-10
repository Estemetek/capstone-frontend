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
  IonIcon,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { getDonationById } from "../../services/api";
import { checkmarkCircle } from "ionicons/icons";

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
    updatedAt?: string;
    qrCodeUrl?: string;
    images?: string[];
    appraisalValue?: number;
  };
}

const DonationDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [donation, setDonation] = useState<DonationDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const statusOrder = ["Pending", "Accepted", "In Transit", "Delivered"];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#f4c542";
      case "Accepted":
        return "#2dd36f";
      case "In Transit":
        return "#3880ff";
      case "Delivered":
        return "#9b59b6";
      default:
        return "#ccc";
    }
  };

  useEffect(() => {
    async function fetchDonation() {
      try {
        setLoading(true);
        const data = await getDonationById(id);
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
  const currentStatusIndex = statusOrder.indexOf(blockchain.status);

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
            <h1 style={{ fontWeight: "bold", color: "#000" }}>{blockchain.itemType}</h1>
            <p><strong>Asset ID:</strong> {blockchain.itemID}</p>
            <p><strong>Category:</strong> {offchain.category || "Uncategorized"}</p>
            <p><strong>Status:</strong> {blockchain.status}</p>
            <p><strong>Condition:</strong> {blockchain.condition}</p>
            <p><strong>Current Owner:</strong> {blockchain.currentOwner}</p>

            <p><strong>Donor Name:</strong> {offchain.donorInfo?.name || "N/A"}</p>
            <p><strong>Donor Email:</strong> {offchain.donorInfo?.email || "N/A"}</p>
            <p><strong>Donor Contact:</strong> {offchain.donorInfo?.contactNo || "N/A"}</p>

            {offchain.recipientInfo?.school && (
              <p><strong>Recipient School:</strong> {offchain.recipientInfo.school}</p>
            )}
            {offchain.recipientInfo?.contact && (
              <p><strong>Recipient Contact:</strong> {offchain.recipientInfo.contact}</p>
            )}

            {offchain.notes && <p><strong>Notes:</strong> {offchain.notes}</p>}
            {offchain.quantity && <p><strong>Quantity:</strong> {offchain.quantity}</p>}
            {offchain.appraisalValue !== undefined && (
              <p><strong>Appraisal Value:</strong> ₱{offchain.appraisalValue.toLocaleString()}</p>
            )}

            <p><strong>Date Donated:</strong>{" "}
              {new Date(offchain.createdAt || blockchain.timestamp).toLocaleString()}
            </p>
            
            {offchain.updatedAt && (
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(offchain.updatedAt).toLocaleString()}
              </p>
            )}

            {/* QR Code */}
            {offchain.qrCodeUrl && (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <h3>Donation QR Code</h3>
                <img
                  src={offchain.qrCodeUrl}
                  alt="Donation QR Code"
                  style={{ width: "200px" }}
                />
                <p style={{ fontSize: "0.9em" }}>
                  Scan this code to verify donation
                </p>
              </div>
            )}

            {blockchain.status === "Pending" && (
              <p style={{ margin: "20px 0", color: "#2dd36f", fontWeight: "bold", fontSize: "1.1em", textAlign: "center" }}>
                Donation Form successfully submitted. Physically deliver your donation at the Organization Drop Office and let your difference start making its journey to its beneficiaries!
              </p>
            )}

            {/* Uploaded Images */}
            {offchain.images && offchain.images.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <h3>Uploaded Photos</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {offchain.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Donation image ${idx + 1}`}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Status Steps */}
            <div style={{ margin: "20px 0", display: "flex", alignItems: "center" }}>
              {statusOrder.map((step, index) => {
                const isActive = currentStatusIndex >= index;
                const circleColor = isActive ? getStatusColor(step) : "#ccc";
                return (
                  <React.Fragment key={step}>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          backgroundColor: circleColor,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "white",
                          margin: "0 auto",
                        }}
                      >
                        {index < currentStatusIndex && (
                          <IonIcon icon={checkmarkCircle} />
                        )}
                      </div>
                      <p style={{ fontSize: "0.8em" }}>{step}</p>
                    </div>
                    {index < statusOrder.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: "3px",
                          backgroundColor: index < currentStatusIndex ? circleColor : "#ccc",
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DonationDetail;
