// src/pages/admin/AdminDonationDetail.tsx
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
  IonButton,
  IonSelect,
  IonSelectOption,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonToast,
  IonInput,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { checkmarkCircle } from "ionicons/icons";

import { getBeneficiaries, Beneficiary } from "../../services/api";

interface RouteParams {
  itemID: string;
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

const AdminDonationDetail: React.FC = () => {
  const { itemID } = useParams<RouteParams>();
  const [donation, setDonation] = useState<DonationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [currentOwner, setCurrentOwner] = useState<string>("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [toastMsg, setToastMsg] = useState<string>("");
  const history = useHistory();

  const statusOrder = ["Pending", "Accepted", "In Transit", "Delivered"];

  // 🧠 Fetch donation data
  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/donations/${itemID}`);
        const data = await res.json();
        setDonation(data);
        setSelectedStatus(data.blockchain?.status || "Pending");
        setSelectedRecipient(data.offchain?.recipientInfo?.school || "");
        setCurrentOwner(data.blockchain?.currentOwner || "Donor");
      } catch (err) {
        console.error("❌ Error fetching donation detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [itemID]);

  // 🧠 Fetch beneficiaries
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const data = await getBeneficiaries();
        setBeneficiaries(data);
      } catch (err) {
        console.error("❌ Error fetching beneficiaries:", err);
      }
    };
    fetchBeneficiaries();
  }, []);

  // 🧩 Auto-adjust currentOwner when status changes
useEffect(() => {
  if (!donation) return;

  if (selectedStatus === "Pending") {
    setCurrentOwner(donation.offchain?.donorInfo?.name || "Donor");
  } else if (selectedStatus === "Accepted") {
    setCurrentOwner("Organization Warehouse");
  } else if (selectedStatus === "In Transit") {
    setCurrentOwner("Logistics / Courier");
  } else if (selectedStatus === "Delivered") {
    setCurrentOwner(selectedRecipient || "Recipient");
  }
}, [selectedStatus, selectedRecipient, donation]);

  // ✅ Status color helper
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

  const currentStatusIndex = statusOrder.indexOf(selectedStatus);

  // ✅ Update status and currentOwner on blockchain
  const handleStatusUpdate = async () => {
    try {
      // Compute currentOwner automatically before sending
      let updatedOwner = currentOwner;

      if (selectedStatus === "Pending") {
        updatedOwner = donation?.offchain?.donorInfo?.name || "Donor";
      } else if (selectedStatus === "Accepted") {
        updatedOwner = "Organization Warehouse";
      } else if (selectedStatus === "In Transit") {
        updatedOwner = "Logistics / Courier";
      } else if (selectedStatus === "Delivered") {
        updatedOwner = selectedRecipient || "Recipient";
      }

      const res = await fetch(`http://localhost:3000/api/donations/${itemID}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          currentOwner: updatedOwner,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setToastMsg(`Status updated to "${selectedStatus}"`);
        setDonation((prev) =>
          prev
            ? {
                ...prev,
                blockchain: {
                  ...prev.blockchain,
                  status: selectedStatus,
                  currentOwner: updatedOwner,
                },
              }
            : prev
        );
        setCurrentOwner(updatedOwner);
      } else {
        setToastMsg(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("❌ Error updating status:", err);
      setToastMsg("Error updating status");
    }
  };

  // ✅ Save manually edited currentOwner
  const handleOwnerUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/donations/${itemID}/owner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentOwner }),
      });
      const data = await res.json();

      if (res.ok) {
        setToastMsg(`Current owner updated to "${currentOwner}"`);
        setDonation((prev) =>
          prev
            ? {
                ...prev,
                blockchain: {
                  ...prev.blockchain,
                  currentOwner,
                },
              }
            : prev
        );
      } else {
        setToastMsg(data.error || "Failed to update current owner");
      }
    } catch (err) {
      console.error("❌ Error updating current owner:", err);
      setToastMsg("Error updating current owner");
    }
  };

  // ✅ Update recipient (MongoDB only)
  const handleRecipientUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/donations/${itemID}/recipient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ school: selectedRecipient }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMsg(`Recipient set to ${selectedRecipient}`);
        setDonation((prev) =>
          prev
            ? {
                ...prev,
                offchain: {
                  ...prev.offchain,
                  recipientInfo: { school: selectedRecipient },
                },
              }
            : prev
        );
      } else {
        setToastMsg(data.error || "Failed to assign recipient");
      }
    } catch (err) {
      console.error("❌ Error assigning recipient:", err);
      setToastMsg("Error assigning recipient");
    }
  };

  // 🌀 Loading / Empty State
  if (loading)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Donation Detail</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );

  if (!donation)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Donation Detail</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Donation not found.</p>
        </IonContent>
      </IonPage>
    );

  const { blockchain, offchain } = donation;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/donations" />
          </IonButtons>
          <IonTitle>Donation Detail</IonTitle>
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

            {/* 🧩 Editable Current Owner */}
            <IonInput
              label="Current Owner"
              value={currentOwner}
              onIonChange={(e) => setCurrentOwner(e.detail.value!)}
              fill="outline"
            />
            <IonButton expand="block" color="warning" onClick={handleOwnerUpdate}>
              Save Current Owner
            </IonButton>

            <p><strong>Donor Name:</strong> {offchain.donorInfo?.name || "N/A"}</p>
            <p><strong>Donor Email:</strong> {offchain.donorInfo?.email || "N/A"}</p>
            <p><strong>Donor Contact:</strong> {offchain.donorInfo?.contactNo || "N/A"}</p>

            {offchain.recipientInfo?.school && (
              <p><strong>Recipient School:</strong> {offchain.recipientInfo.school}</p>
            )}

            {offchain.notes && <p><strong>Notes:</strong> {offchain.notes}</p>}
            {offchain.quantity && <p><strong>Quantity:</strong> {offchain.quantity}</p>}
            {offchain.appraisalValue !== undefined && (
              <p><strong>Appraisal Value:</strong> ₱{offchain.appraisalValue.toLocaleString()}</p>
            )}

            <p>
              <strong>Date Donated:</strong>{" "}
              {new Date(offchain.createdAt || blockchain.timestamp).toLocaleString()}
            </p>
            
            {offchain.updatedAt && (
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(offchain.updatedAt).toLocaleString()}
              </p>
            )}

            {/* ✅ QR Code */}
            {offchain.qrCodeUrl && (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <h3>Donation QR Code</h3>
                <img
                  src={offchain.qrCodeUrl}
                  alt="Donation QR Code"
                  style={{ width: "200px" }}
                />
                <p style={{ fontSize: "0.9em" }}>Scan this code to verify donation</p>
              </div>
            )}

            {/* ✅ Uploaded Images */}
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

            {/* 🟢 Dynamic Status Steps */}
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
                          backgroundColor:
                            index < currentStatusIndex ? circleColor : "#ccc",
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* 🧩 Recipient Selector */}
            <IonSelect
              label="Assign Recipient"
              fill="outline"
              value={selectedRecipient}
              placeholder="Select organization"
              onIonChange={(e) => setSelectedRecipient(e.detail.value)}
            >
              {beneficiaries.map((b) => (
                <IonSelectOption key={b._id} value={b.schoolName}>
                  {b.schoolName}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonButton expand="block" color="secondary" onClick={handleRecipientUpdate}>
              Save Recipient
            </IonButton>

            {/* 🧩 Status Selector */}
            <IonSelect
              label="Update Status"
              fill="outline"
              value={selectedStatus}
              placeholder="Select status"
              onIonChange={(e) => setSelectedStatus(e.detail.value)}
              style={{ marginTop: "15px" }}
            >
              {statusOrder.map((s) => (
                <IonSelectOption key={s} value={s}>
                  {s}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonButton expand="block" color="primary" onClick={handleStatusUpdate}>
              Update Status
            </IonButton>

            <IonButton expand="block" color="medium" onClick={() => history.goBack()}>
              Back
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>

      <IonToast
        isOpen={!!toastMsg}
        message={toastMsg}
        duration={2000}
        onDidDismiss={() => setToastMsg("")}
      />
    </IonPage>
  );
};

export default AdminDonationDetail;
