import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
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
  IonButtons,
  IonBackButton,
  IonIcon,
  IonToast,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { checkmarkCircle } from "ionicons/icons";
import { getBeneficiaries, Beneficiary } from "../../services/api";
import StatusDocumentationForm from "../../components/StatusDocumentationForm";

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
    status: string; // The status used for the timeline
    timestamp: string;
  };
  offchain: {
    donorInfo: { name: string; email: string; contactNo: string };
    recipientInfo?: { 
      school?: string; 
      contactPerson?: string; 
      contactEmail?: string;
      contactNumber?: string;
      contactDetail?: string; 
    };
    category?: string;
    quantity?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    qrCodeUrl?: string;
    images?: string[];
    appraisalValue?: number;
    // CRITICAL: Updated interface to align with backend's response name (statusLogs or statusHistory)
    statusHistory?: any[]; 
    statusLogs?: any[]; // The MongoDB array of immutable logs
    documentationEntries?: any[]; // The separate StatusDocumentation entries
  };
}

const formatDateTime = (isoString?: string) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const AdminDonationDetail: React.FC = () => {
  const { itemID } = useParams<RouteParams>();
  const [donation, setDonation] = useState<DonationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [currentOwner, setCurrentOwner] = useState<string>("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [showDocModal, setShowDocModal] = useState(false);
  const [nextStatus, setNextStatus] = useState<string>("");
  
  // Note: showRecipientDropdown is no longer needed as the form handles its own conditional logic.
  // const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);

  const adminRole = localStorage.getItem("userRole") || "guest";
  const statusOrder = ["Pending", "Accepted", "In Transit", "Delivered"];
  
  // ✅ FIX: Use useMemo to reliably derive the index and the next status
  const currentStatusIndex = useMemo(() => statusOrder.indexOf(selectedStatus), [selectedStatus]);
  const nextStatusForDisplay = useMemo(() => {
    return statusOrder[currentStatusIndex + 1] || "Delivered";
  }, [currentStatusIndex, statusOrder]);


  // 1. Fetch donation details
  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found. Admin not logged in.");
          setToastMsg("Session expired. Please log in again.");
          return;
        }

        const res = await fetch(`http://localhost:3000/api/donations/${itemID}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          console.error("❌ Unauthorized — Invalid or missing token");
          setToastMsg("Unauthorized. Please log in again.");
          return;
        }

        const data: DonationDetailData = await res.json();
        setDonation(data);

        const chainStatus = data.blockchain?.status || "Pending";
        setSelectedStatus(chainStatus);

        const chainOwner = data.blockchain?.currentOwner || data.offchain?.donorInfo?.name || "Donor";
        setCurrentOwner(chainOwner);

        setSelectedRecipient(data.offchain?.recipientInfo?.school || "");
      } catch (err) {
        console.error("❌ Error fetching donation detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [itemID]);

  // 2. Fetch beneficiaries (unchanged)
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

  // 3. Status color helper (unchanged)
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

  // 4. Handle next status button click
  const handleNextStatus = () => {
    if (adminRole !== "admin") {
      setToastMsg("Only admins can update donation statuses.");
      return;
    }

    // Use the derived next status value
    const next = nextStatusForDisplay;
    
    if (next === "Delivered" && selectedStatus === "Delivered") {
        setToastMsg("Donation is already in final status (Delivered).");
        return;
    }

    setNextStatus(next);
    setShowDocModal(true);
  };

  // ... (loading and not found UI remains the same)

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
    
  // Use statusLogs for history if available, otherwise fall back to statusHistory
  const statusLogs = donation.offchain.statusLogs || donation.offchain.statusHistory || [];
    
  const { blockchain, offchain } = donation;

  return (
    <IonPage>
      {/* ... IonHeader ... */}
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
            {/* Display uses state variables for immediate feedback */}
            <h1 style={{ fontWeight: "bold", color: "#000" }}>{blockchain.itemType}</h1>
            <p><strong>Asset ID:</strong> {blockchain.itemID}</p>
            <p><strong>Category:</strong> {offchain.category || "Uncategorized"}</p>
            <p><strong>Status:</strong> {selectedStatus}</p> 
            <p><strong>Current Owner:</strong> {currentOwner}</p> 
            
            {/* ... Other Info (unchanged) ... */}
            <p><strong>Donor Name:</strong> {offchain.donorInfo?.name}</p>
            <p><strong>Donor Email:</strong> {offchain.donorInfo?.email}</p>
            <p><strong>Donor Contact:</strong> {offchain.donorInfo?.contactNo}</p>
            
            {/* --- RECIPIENT INFORMATION DISPLAY --- */}
            {offchain.recipientInfo?.school && (
              <p><strong>Recipient School:</strong> {offchain.recipientInfo.school}</p>
            )}
            {offchain.recipientInfo?.contactPerson && (
              <p><strong>Contact Person:</strong> {offchain.recipientInfo.contactPerson}</p>
            )}
            {offchain.recipientInfo?.contactEmail && (
              <p><strong>Contact Email:</strong> {offchain.recipientInfo.contactEmail}</p>
            )}
            {offchain.recipientInfo?.contactNumber && (
              <p><strong>Contact Number:</strong> {offchain.recipientInfo.contactNumber}</p>
            )}
            {offchain.recipientInfo?.contactDetail && 
              !offchain.recipientInfo.contactEmail && 
              !offchain.recipientInfo.contactNumber && (
              <p><strong>Contact Detail:</strong> {offchain.recipientInfo.contactDetail}</p>
            )}
            {/* ------------------------------------------- */}
            
            {offchain.notes && <p><strong>Notes:</strong> {offchain.notes}</p>}
            {offchain.quantity && <p><strong>Quantity:</strong> {offchain.quantity}</p>}
            <p>
              <strong>Date Donated:</strong>{" "}
              {formatDateTime(offchain.createdAt || blockchain.timestamp)}
            </p>
            {offchain.updatedAt && (
              <p>
                <strong>Last Updated:</strong>{" "}
                {formatDateTime(offchain.updatedAt)}
              </p>
            )}
            
            {/* QR Code and Images display sections are unchanged */}
            {offchain.qrCodeUrl && (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <h3>Donation QR Code</h3>
                <img src={offchain.qrCodeUrl} alt="Donation QR Code" style={{ width: "200px" }} />
                <p style={{ fontSize: "0.9em" }}>Scan this code to verify donation</p>
              </div>
            )}

            {offchain.images && offchain.images.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <h3>Uploaded Photos</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {offchain.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Donation image ${idx + 1}`}
                      style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Status Progress uses currentStatusIndex based on selectedStatus */}
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
                        {index < currentStatusIndex && <IonIcon icon={checkmarkCircle} />}
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

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              {/* ✅ CRITICAL FIX: Use nextStatusForDisplay for immediate button text update */}
              <IonButton
                expand="block"
                color="primary"
                onClick={handleNextStatus}
                disabled={selectedStatus === "Delivered"}
              >
                {selectedStatus === "Delivered"
                  ? "Delivered (Final Status)"
                  : `Proceed to Next Stage (${nextStatusForDisplay})`}
              </IonButton>
            </div>

            {/* Status Documentation History */}
            {statusLogs.length > 0 && (
              <div style={{ marginTop: "25px" }}>
                <h3>Status Update History</h3>
                {statusLogs.map((entry: any, idx: number) => {
                  const prevStatus = entry.previousStatus || "N/A";
                  const newStatus = entry.newStatus || entry.status || "N/A";
                  const updatedAt = formatDateTime(
                    entry.updatedAt || entry.createdAt || entry.timestamp
                  );
                  const remarks = entry.remarks || "No remarks";
                  const updatedBy = entry.updatedBy || "System";
                  const updatedByRole = entry.updatedByRole || "Admin";

                  // Check both StatusDocumentation format (attachments) and statusLogs format (formFields.photoEvidence)
                  const images: string[] = entry.attachments && entry.attachments.length > 0
                      ? entry.attachments
                      : entry.formFields?.photoEvidence || [];
                  
                  const historyRecipient = entry.recipientInfo || {};
                  const isAcceptedStatus = newStatus === "Accepted";
                    
                  return (
                    <IonCard key={idx} style={{ background: "#f9f9f9", marginBottom: "10px" }}>
                      <IonCardContent>
                        {/* Only display previous status if it exists in the log entry (from StatusDocumentation) */}
                        {prevStatus !== "N/A" && <p><strong>Previous Status:</strong> {prevStatus}</p>}
                        <p><strong>New Status:</strong> {newStatus}</p>
                        <p><strong>Updated By:</strong> {updatedBy} ({updatedByRole})</p>
                        <p><strong>Date:</strong> {updatedAt}</p>
                        <p><strong>Remarks:</strong> {remarks}</p>

                        {isAcceptedStatus && historyRecipient.school && (
                            <div style={{ marginTop: "10px", borderTop: "1px dashed #ccc", paddingTop: "10px" }}>
                                <h4>Recipient Assigned:</h4>
                                <p><strong>School:</strong> {historyRecipient.school}</p>
                                {historyRecipient.contactPerson && <p><strong>Contact Person:</strong> {historyRecipient.contactPerson}</p>}
                                {historyRecipient.contactEmail && <p><strong>Contact Email:</strong> {historyRecipient.contactEmail}</p>}
                                {historyRecipient.contactNumber && <p><strong>Contact Number:</strong> {historyRecipient.contactNumber}</p>}
                            </div>
                        )}

                        {entry.formFields && Object.keys(entry.formFields).length > 0 && (
                          <div style={{ marginTop: "10px" }}>
                            <h4>Form Details:</h4>
                            {Object.entries(entry.formFields).map(([key, value], i) => {
                              if (key === "photoEvidence") return null;
                              return (
                                <p key={i}>
                                  <strong>{key}:</strong> {String(value)}
                                </p>
                              );
                            })}
                          </div>
                        )}

                        {images.length > 0 && (
                          <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {images.map((imgUrl, i) => (
                              <img
                                key={i}
                                src={imgUrl}
                                alt={`Evidence ${i + 1}`}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </div>
            )}
          </IonCardContent>
        </IonCard>

        {/* Documentation Modal */}
        <StatusDocumentationForm
          isOpen={showDocModal}
          // Pass the explicitly calculated next status
          status={nextStatusForDisplay} 
          itemID={itemID}
          currentStatus={selectedStatus}
          beneficiaries={beneficiaries}
          selectedRecipient={selectedRecipient}
          onRecipientChange={setSelectedRecipient}
          existingImages={offchain.images || []}
          onClose={() => {
            setShowDocModal(false);
            setNextStatus("");
          }}
          onSuccess={(updatedData) => {
            // ✅ CRITICAL FIX: Use the authoritative status and owner from the server response
            const serverStatus = updatedData.blockchain?.status || nextStatusForDisplay;
            const serverOwner = updatedData.blockchain?.currentOwner || currentOwner;
            
            // 1. Update component tracking states for immediate UI refresh
            setSelectedStatus(serverStatus);
            setCurrentOwner(serverOwner);
            setNextStatus("");
            
            // 2. Update the main donation state object using the complete response
            setDonation((prev) => {
              if (!prev) return prev;

              return {
                ...prev,
                blockchain: {
                  ...prev.blockchain,
                  status: serverStatus,
                  currentOwner: serverOwner,
                },
                offchain: {
                  ...prev.offchain,
                  ...updatedData.offchain,
                  // Ensure statusLogs, images, and recipientInfo are used from the *latest* response
                  recipientInfo: updatedData.offchain?.recipientInfo || prev.offchain?.recipientInfo,
                  statusHistory: updatedData.offchain?.statusLogs || prev.offchain?.statusHistory || [],
                  statusLogs: updatedData.offchain?.statusLogs || prev.offchain?.statusLogs || [], // Sync logs
                  images: updatedData.offchain?.images || prev.offchain?.images || [],
                },
              };
            });
            
            setShowDocModal(false);
          }}
        />

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2000}
          onDidDismiss={() => setToastMsg("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminDonationDetail;