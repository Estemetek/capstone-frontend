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
  // 💡 NEW IMPORTS for Blockchain Verification and Copy Functionality
  IonButton,
  useIonToast,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { getDonationById } from "../../services/api";
// 💡 NEW ICONS for status checks, copying, and blockchain lock
import { checkmarkCircle, copyOutline, lockClosed } from "ionicons/icons";

interface RouteParams {
  id: string;
}

// 🐛 FIX 1: Align the StatusLog interface with the server's MongoDB schema
interface StatusLog {
  status: string;
  timestamp: string; // The primary date field from the server's statusLogs array
  updatedAt?: string; // Keep optional for compatibility if other parts use it
  updatedBy?: string;
  previousStatus?: string;
  newStatus?: string;
  remarks?: string;
  handoverDate?: string;
  transportDetails?: string;
  attachments?: string[];
  formFields?: {
    photoEvidence?: string[];
    [key: string]: any;
  };
  recipientInfo?: {
    school?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactNumber?: string;
  };
  txID?: string; // 💡 CRITICAL: Ensure TxID field is present for blockchain proof
}

interface DocumentationEntry {
  newStatus: string;
  remarks?: string;
  updatedBy: string;
  updatedByEmail?: string;
  createdAt: string;
}

type HistoryItem =
  | (StatusLog & { type: "statusLog"; sortDate: string })
  | (DocumentationEntry & { type: "documentation"; sortDate: string });

interface DonationDetailData {
  blockchain: {
    itemID: string;
    itemType: string;
    condition: string;
    donorID: string;
    currentOwner: string; // This is the field we must rely on
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
      contactPerson?: string;
      contactEmail?: string;
      contactNumber?: string;
    };
    category?: string;
    quantity?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    qrCodeUrl?: string;
    images?: string[];
    appraisalValue?: number;
    // The server combines offchainData.statusLogs and docs into statusHistory and documentationEntries
    statusHistory?: StatusLog[];
    documentationEntries?: DocumentationEntry[];
  };
}

// ----------------------------------------------------------------------
// 💡 ADDITION 1: Dedicated Blockchain Verification Card Component
// Highlights the immutable nature of the Asset ID.
// ----------------------------------------------------------------------
const BlockchainVerificationCard: React.FC<{ itemID: string }> = ({ itemID }) => (
  <IonCard style={{
    marginTop: "20px",
    background: "#e8f5e9", // Light green background for trust
    borderLeft: "6px solid #4CAF50",
    borderRadius: "12px",
    boxShadow: '0 4px 10px rgba(0, 70, 0, 0.1)'
  }}>
    <IonCardContent>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <IonIcon icon={lockClosed} style={{ fontSize: '32px', color: '#4CAF50', marginRight: '10px' }} />
        <h3 style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>
          ON-CHAIN VERIFIED
        </h3>
      </div>
      <p style={{ color: '#555', fontSize: '0.9em' }}>
        This item's creation is secured on the Hyperledger Fabric ledger, guaranteeing <strong>immutability</strong> and preventing tampering.
      </p>
      <p style={{ fontWeight: "bold", fontSize: "1.0em", wordBreak: "break-all", marginTop: '10px' }}>
        Asset ID (On-Chain Proof): <span style={{ color: "#2e7d32" }}>{itemID}</span>
      </p>
    </IonCardContent>
  </IonCard>
);


const DonationDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [donation, setDonation] = useState<DonationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  // 💡 NEW HOOK: Toast for copy confirmation
  const [presentToast] = useIonToast();

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
  
  // 💡 NEW HELPER FUNCTION: Copy to Clipboard
  const copyToClipboard = (text: string, message: string) => {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      // Use execCommand for broader compatibility in some browser environments
      document.execCommand('copy');
      document.body.removeChild(el);
      presentToast({ message, duration: 2000, color: 'success' });
    } catch (err) {
      presentToast({ message: 'Failed to copy.', duration: 2000, color: 'danger' });
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
    // ... loading UI
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Donation Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner name="crescent" style={{ marginTop: '50px' }} />
        </IonContent>
      </IonPage>
    );
  }

  if (!donation) {
    // ... not found UI
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

  // This line is correct and uses the latest status from the blockchain (which is updated by the server)
  const currentStatusIndex = statusOrder.indexOf(blockchain.status);

  const getLogImages = (log: StatusLog): string[] => {
    if (log.attachments && log.attachments.length > 0) return log.attachments;
    if (log.formFields?.photoEvidence?.length) return log.formFields.photoEvidence;
    return [];
  };

  const getLogFormFields = (log: StatusLog): { [key: string]: string } => {
    if (!log.formFields) return {};
    const fields: { [key: string]: string } = {};
    for (const key in log.formFields) {
      if (key !== "photoEvidence" && log.formFields[key] !== undefined) {
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        fields[formattedKey] = String(log.formFields[key]);
      }
    }
    // Added for robustness, though server only logs handover/transport in formFields
    if (log.handoverDate && !fields["Handover Date"]) {
      fields["Handover Date"] = log.handoverDate;
    }
    if (log.transportDetails && !fields["Transport Details"]) {
      fields["Transport Details"] = log.transportDetails;
    }
    return fields;
  };

  const getSortedHistory = (): HistoryItem[] => {
    const statusLogs: HistoryItem[] = (offchain.statusHistory || []).map((log) => ({
      ...log,
      type: "statusLog",
      // 🐛 FIX 2: Use `log.timestamp` as the primary date field for status logs
      // The server is logging to MongoDB with a `timestamp` field.
      sortDate: log.timestamp || log.updatedAt || new Date().toISOString(),
    }));

    const documentation: HistoryItem[] = (offchain.documentationEntries || []).map((doc) => ({
      ...doc,
      type: "documentation",
      sortDate: doc.createdAt,
    }));

    const combined = [...statusLogs, ...documentation];
    // Sort combined history by date
    combined.sort((a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime());
    return combined;
  };

  const sortedHistory = getSortedHistory();

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
            {/* Added color and boldness to status for quick glance */}
            <p><strong>Status:</strong> <span style={{ color: getStatusColor(blockchain.status), fontWeight: 'bold' }}>{blockchain.status}</span></p>
            <p><strong>Condition:</strong> {blockchain.condition}</p>
            <p><strong>Current Owner:</strong> {blockchain.currentOwner}</p>

            {/* Donor Info - Existing */}
            <p><strong>Donor Name:</strong> {offchain.donorInfo?.name || "N/A"}</p>
            <p><strong>Donor Email:</strong> {offchain.donorInfo?.email || "N/A"}</p>
            <p><strong>Donor Contact:</strong> {offchain.donorInfo?.contactNo || "N/A"}</p>

            {offchain.notes && <p><strong>Notes:</strong> {offchain.notes}</p>}
            {offchain.quantity && <p><strong>Quantity:</strong> {offchain.quantity}</p>}

            {/* Recipient Info - Existing */}
            {offchain.recipientInfo && offchain.recipientInfo.school && (
              <>
                <hr style={{ margin: "15px 0" }} />
                <h3>Recipient Details</h3>
                <p><strong>Recipient School:</strong> {offchain.recipientInfo.school}</p>
                {offchain.recipientInfo.contactPerson && (
                  <p><strong>Contact Person:</strong> {offchain.recipientInfo.contactPerson}</p>
                )}
                {offchain.recipientInfo.contactEmail && (
                  <p><strong>Contact Email:</strong> {offchain.recipientInfo.contactEmail}</p>
                )}
                {offchain.recipientInfo.contactNumber && (
                  <p><strong>Contact Number:</strong> {offchain.recipientInfo.contactNumber}</p>
                )}
              </>
            )}

            <p>
              <br></br>
              <strong>Date Donated:</strong>{" "}
              {new Date(offchain.createdAt || blockchain.timestamp).toLocaleString()}
            </p>

            {offchain.updatedAt && (
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(offchain.updatedAt).toLocaleString()}
              </p>
            )}

            {offchain.qrCodeUrl && (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <h3>Donation QR Code</h3>
                <img src={offchain.qrCodeUrl} alt="Donation QR Code" style={{ width: "200px" }} />
                <p style={{ fontSize: "0.9em" }}>Scan this code to verify donation</p>
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
            
            {/* 💡 INJECTION POINT 1: Dedicated Blockchain Verification Card */}
            {/* This replaces your previous simple blue box with a clearer component */}
            <BlockchainVerificationCard itemID={blockchain.itemID} />


            {/* Status Timeline - Enhanced with proper styling and current status spinner */}
            <div style={{ margin: "30px 0 25px 0" }}>
              <h3>Donation Progress</h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                {statusOrder.map((step, index) => {
                  const isActive = currentStatusIndex >= index;
                  const circleColor = isActive ? getStatusColor(step) : "#ccc";

                  const stepStyle = { minWidth: '70px', maxWidth: '80px', flex: 1, textAlign: 'center' as const };
                  
                  // Determine the content of the circle
                  let circleContent = null;
                  if (index < currentStatusIndex) {
                    // 1. Checkmark for all previous/completed steps
                    circleContent = <IonIcon icon={checkmarkCircle} />;
                  } else if (index === currentStatusIndex) {
                    if (step === "Delivered") {
                      // 2. Checkmark for the final, delivered status
                      circleContent = <IonIcon icon={checkmarkCircle} />;
                    } else {
                      // 3. Spinner for the current, in-progress status (Pending, Accepted, In Transit)
                      circleContent = <IonSpinner name="dots" color="light" />;
                    }
                  }

                  return (
                    <React.Fragment key={step}>
                      <div style={stepStyle}>
                        <div
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            backgroundColor: circleColor,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            margin: "0 auto",
                            boxShadow: isActive ? `0 0 8px ${circleColor}` : 'none',
                          }}
                        >
                          {/* Conditional content based on logic above */}
                          {circleContent} 
                        </div>
                        <p style={{ fontSize: "0.8em", fontWeight: isActive ? 'bold' : 'normal', margin: '5px 0 0 0' }}>{step}</p>
                      </div>
                      {index < statusOrder.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            height: "3px",
                            backgroundColor: index < currentStatusIndex ? circleColor : "#ccc",
                            margin: '0 5px'
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* History Section */}
            {sortedHistory.length > 0 && (
              <div style={{ marginTop: "25px" }}>
                <h3 style={{ borderBottom: '2px solid #ccc', paddingBottom: '5px', color: '#333' }}>
                  Immutable Audit History (Blockchain Traceability)
                </h3>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {sortedHistory.map((item, idx) => {
                    const newStatus =
                      item.type === "statusLog"
                        ? (item as StatusLog).newStatus || (item as StatusLog).status
                        : (item as DocumentationEntry).newStatus;
                    const remarks = item.remarks;
                    const updatedBy = item.updatedBy;
                    const dateString = item.sortDate;
                    const images =
                      item.type === "statusLog" ? getLogImages(item as StatusLog) : [];
                    const formFields =
                      item.type === "statusLog" ? getLogFormFields(item as StatusLog) : {};
                    const background = item.type === "statusLog" ? "#f8f8f8" : "#eef5ff";

                    // 💡 EXTRACT TXID FOR BLOCKCHAIN PROOF
                    const txID = item.type === "statusLog" ? (item as StatusLog).txID : null;

                    return (
                        <li
                        key={`history-${idx}`}
                        style={{
                          background,
                          padding: "15px",
                          borderRadius: "8px",
                          marginBottom: "15px", // Increased margin for better separation
                          borderLeft: `5px solid ${getStatusColor(newStatus || "default")}`,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        >
                        <p style={{ margin: 0, fontSize: '1.1em' }}>
                          <strong>
                          {item.type === "statusLog" ? "Status Updated" : "Documentation Added"}:
                          </strong>{" "}
                          <span style={{ fontWeight: "bold", color: getStatusColor(newStatus || 'default') }}>{newStatus}</span>
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                          <strong>Date:</strong> {new Date(dateString).toLocaleString()}
                        </p>
                        {updatedBy && <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}><strong>Signed By:</strong> {updatedBy}</p>}
                        {remarks && <p style={{ margin: '10px 0 0 0' }}><strong>Remarks:</strong> {remarks}</p>}

                        {/* Additional form fields (existing logic) */}
                        {Object.keys(formFields).map(key => (
                            <p key={key} style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                                <strong>{key}:</strong> {formFields[key]}
                            </p>
                        ))}
                        
                        {/* 💡 INJECTION POINT 2: Blockchan Proof with TxID and Copy Button */}
                        {txID && txID !== "fabric-failed" && (
                          <div style={{ marginTop: "15px", padding: "10px", border: "1px solid #c8e6c9", borderRadius: "6px", background: "#f0fff0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1, marginRight: '10px' }}>
                                <p style={{ margin: 0, fontWeight: "bold", color: '#4CAF50' }}>
                                  Blockchain Transaction ID (TxID):
                                </p>
                                <p style={{ margin: 0, fontSize: "0.8em", wordBreak: "break-all", color: "#388E3C" }}>
                                  {txID}
                                </p>
                            </div>
                            <IonButton
                                size="small"
                                fill="outline"
                                color="success"
                                onClick={() => copyToClipboard(txID, 'Transaction ID copied!')}
                                style={{ minWidth: 'auto' }}
                            >
                                <IonIcon icon={copyOutline} slot="icon-only" />
                            </IonButton>
                          </div>
                        )}
                        {txID === "fabric-failed" && (
                          <p style={{ color: 'red', fontSize: '0.8em', marginTop: '10px' }}>
                            ⚠️ **Warning:** Blockchain transaction failed to submit for this update.
                          </p>
                        )}


                        {images.length > 0 && (
                          <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <p style={{ fontWeight: 'bold', width: '100%', margin: '0 0 5px 0' }}>Evidence:</p>
                            {images.map((imgUrl, i) => (
                              <a
                              key={i}
                              href={imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: "inline-block" }}
                              >
                              <img
                                src={imgUrl}
                                alt={`Evidence ${i + 1}`}
                                style={{
                                width: "70px", // Reduced size slightly to fit well
                                height: "70px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                }}
                              />
                              </a>
                            ))}
                          </div>
                        )}
                        </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DonationDetail;
