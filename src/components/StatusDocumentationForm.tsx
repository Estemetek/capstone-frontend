import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonToast,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { uploadImageToSupabase } from "../services/upload";

interface Beneficiary {
  schoolName: string;
  schoolId: string;
  classification: string;
  contactPerson?: string;
  contactEmail?: string;
  contactNumber?: string;
}

interface StatusDocumentationFormProps {
  isOpen: boolean;
  currentStatus: string;
  status: string;
  itemID: string;
  beneficiaries?: Beneficiary[];
  selectedRecipient?: string;
  existingImages?: string[];
  onRecipientChange?: (value: string) => void;
  onClose: () => void;
  onSuccess: (updatedData: any) => void;
}

const StatusDocumentationForm: React.FC<StatusDocumentationFormProps> = ({
  isOpen,
  status,
  itemID,
  beneficiaries = [],
  selectedRecipient = "",
  onRecipientChange,
  onClose,
  onSuccess,
}) => {
  const [remarks, setRemarks] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [transportDetails, setTransportDetails] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const statusOrder = ["Pending", "Accepted", "In Transit", "Delivered"];

  const adminName = localStorage.getItem("userName") || "Administrator";
  const adminRole = localStorage.getItem("userRole") || "guest";
  const adminEmail = localStorage.getItem("userEmail") || "admin@example.com";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const url = await uploadImageToSupabase(file);
      setPhotoUrls((prev) => [...prev, url]);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setToastMsg("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (adminRole !== "admin") {
        setToastMsg("Only admins can update donation statuses.");
        return;
    }

    if (!remarks.trim() || !handoverDate.trim()) {
        setToastMsg("Please fill in all required fields before submitting.");
        return;
    }

    if (status === "Accepted" && !selectedRecipient) {
        setToastMsg("Please select a recipient before submitting.");
        return;
    }

    setLoading(true);

    try {
        const selectedBeneficiary = beneficiaries.find(
                (b) => b.schoolName === selectedRecipient
            );
            // 1. Get Contact Person
            const recipientContactPerson = selectedBeneficiary?.contactPerson || "N/A";
            
            // 2. Get Contact Detail (Number + Email)
            const recipientContactDetail = 
                (selectedBeneficiary?.contactNumber ? selectedBeneficiary.contactNumber : "") +
                (selectedBeneficiary?.contactNumber && selectedBeneficiary?.contactEmail ? " / " : "") +
                (selectedBeneficiary?.contactEmail ? selectedBeneficiary.contactEmail : "");
                
            const finalContactDetail = recipientContactDetail || "Not provided";

        const documentation: any = {
            updatedBy: adminName,
            updatedByEmail: adminEmail,
            updatedAt: new Date().toISOString(),
            remarks,
            previousStatus: statusOrder[statusOrder.indexOf(status) - 1] || "Pending",
            newStatus: status, 
            formFields: {
                handoverDate,
                transportDetails,
                photoEvidence: photoUrls,
            },
        };

        if (status === "Accepted" && selectedRecipient) {
          documentation.recipientInfo = {
            school: selectedRecipient,
            contactPerson: recipientContactPerson, 
            contactDetail: finalContactDetail,
          };
        }

        const res = await fetch(`http://localhost:3000/api/donations/${itemID}/status`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-role": adminRole,
        },
        body: JSON.stringify({
            status,
            documentation,
        }),
        });

        const data = await res.json();

        if (res.ok) {
          setToastMsg(`✅ Status updated to "${status}"`);

          if (status === "Accepted" && documentation.recipientInfo) {
            data.offchain = {
              ...(data.offchain || {}),
              recipientInfo: documentation.recipientInfo,
            };
          }

          onSuccess(data);
          onClose();

          setRemarks("");
          setHandoverDate("");
          setTransportDetails("");
          setPhotoUrls([]);
          } else {
          setToastMsg(data.error || "Failed to update status");
        }
    } catch (err) {
        console.error("❌ Error submitting documentation:", err);
        setToastMsg("Error updating status");
    } finally {
        setLoading(false);
    }
    };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Documentation for {status}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <p style={{ fontSize: "0.9em", color: "#666" }}>
            Please fill in this documentation form before proceeding with the status update.
          </p>

          {status === "Accepted" && beneficiaries.length > 0 && (
            <IonItem>
              <IonLabel>Recipient School *</IonLabel>
              <IonSelect
                value={selectedRecipient}
                placeholder="Select School"
                onIonChange={(e) => onRecipientChange?.(e.detail.value)}
              >
                {beneficiaries.map((b) => (
                  <IonSelectOption key={b.schoolId} value={b.schoolName}>
                    {b.schoolName} ({b.classification})
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          )}

          <IonItem>
            <IonLabel position="stacked">Date of Handover / Action *</IonLabel>
            <IonInput
              type="date"
              value={handoverDate}
              onIonChange={(e) => setHandoverDate(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Remarks / Justification *</IonLabel>
            <IonTextarea
              placeholder="Explain the reason or supporting details for this update"
              value={remarks}
              onIonChange={(e) => setRemarks(e.detail.value!)}
              autoGrow
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Transport / Logistics Details (optional)</IonLabel>
            <IonTextarea
              placeholder="Courier name, tracking details, etc."
              value={transportDetails}
              onIonChange={(e) => setTransportDetails(e.detail.value!)}
              autoGrow
            />
          </IonItem>

          {/* Image upload */}
          <IonItem>
            <IonLabel position="stacked">Photo Evidence (optional)</IonLabel>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </IonItem>

          {uploading && <p>Uploading image...</p>}

          {/* Display thumbnails */}
          {photoUrls.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {photoUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Evidence ${idx + 1}`}
                  style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer", borderRadius: "8px" }}
                  onClick={() => setLightboxImage(url)}
                />
              ))}
            </div>
          )}

          {/* Lightbox */}
          {lightboxImage && (
            <div
              onClick={() => setLightboxImage(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <img src={lightboxImage} alt="Enlarged" style={{ maxWidth: "90%", maxHeight: "90%" }} />
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <IonButton expand="block" color="success" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Documentation"}
            </IonButton>
            <IonButton expand="block" color="medium" onClick={onClose} disabled={loading}>
              Cancel
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={!!toastMsg}
        message={toastMsg}
        duration={2500}
        onDidDismiss={() => setToastMsg("")}
      />
    </>
  );
};

export default StatusDocumentationForm;
