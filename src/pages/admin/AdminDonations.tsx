// AdminDonations.tsx
import "./AdminDonations.css";
import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

import {
  chevronForwardOutline,
  cloudUploadOutline,
  checkmarkCircle,
} from "ionicons/icons";

const AdminDonations: React.FC = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Donations</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
       {/* ---------- Donation Management ---------- */}
{!showRegisterForm && !showStatusForm && (
  <>
    <div className="donation-header">
      <h2 className="page-heading">Donation Management</h2>

      {/* Buttons */}
      <div className="button-group">
        <IonButton
          expand="block"
          className="action-btn register-btn"
          onClick={() => setShowRegisterForm(true)}
        >
          Register
        </IonButton>
        <IonButton
          expand="block"
          className="action-btn status-btn"
          onClick={() => setShowStatusForm(true)}
        >
          Status
        </IonButton>
      </div>
    </div>


            {/* Searchbar with filter button */}
            <div className="search-container">
              <IonSearchbar placeholder="Search by donor, item type..." />
            </div>

            {/* Donations List */}
            <h3 className="section-title">Donations</h3>
            <IonList className="donations-list">
          
              <IonItem lines="full">
                <IonLabel>
                  <h2>Maria Mendoza</h2>
                  <p>2 Laptops</p>
                </IonLabel>
                <IonNote slot="end">
                  Sept 14, 2025
                  <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
                </IonNote>
              </IonItem>
              <IonItem lines="full">
                <IonLabel>
                  <h2>Jennie Kim</h2>
                  <p>2 Laptops</p>
                </IonLabel>
                <IonNote slot="end">
                  Sept 14, 2025
                  <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
                </IonNote>
              </IonItem>
              <IonItem lines="full">
                <IonLabel>
                  <h2>Lisa Manoban</h2>
                  <p>2 Laptops</p>
                </IonLabel>
                <IonNote slot="end">
                  Sept 14, 2025
                  <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
                </IonNote>
              </IonItem>
              <IonItem lines="full">
                <IonLabel>
                  <h2>Rose Park</h2>
                  <p>School Supplies</p>
                </IonLabel>
                <IonNote slot="end">
                  Sept 09, 2025
                  <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
                </IonNote>
              </IonItem>
            </IonList>
          </>
        )}

        {/* ---------- Register Donor Form ---------- */}
        {showRegisterForm && (
          <>
            <div className="donation-header">
  <h2 className="page-heading">Register Donor</h2>
</div>


            <div className="form-grid">
  <IonInput label="Full Name" labelPlacement="stacked" fill="outline" />
  <IonInput label="Email Address" labelPlacement="stacked" fill="outline" />
  <IonInput label="Phone Number" labelPlacement="stacked" fill="outline" />
  <IonSelect label="Government ID Type" labelPlacement="stacked" fill="outline" placeholder="Select">
    <IonSelectOption value="passport">Passport</IonSelectOption>
    <IonSelectOption value="driver">Driver's License</IonSelectOption>
    <IonSelectOption value="national">National ID</IonSelectOption>
  </IonSelect>
</div>

<IonTextarea
  label="Address"
  labelPlacement="stacked"
  fill="outline"
  autoGrow
  placeholder="Enter donor address"
/>

<h3 className="section-subtitle">Document Verification</h3>
<div className="upload-box">
  <IonIcon icon={cloudUploadOutline} className="upload-icon" />
  <p>Browse to upload</p>
</div>

            <div className="form-buttons">
              <IonButton
                expand="block"
                className="cancel-btn"
                onClick={() => setShowRegisterForm(false)}
              >
                Cancel
              </IonButton>
              <IonButton expand="block" className="submit-btn">
                Create Donor Account
              </IonButton>
            </div>
          </>
        )}

        {/* ---------- Update Donation Status ---------- */}
        {showStatusForm && (
          <>
          <div className="donation-header">
  <h2 className="page-heading">Update Donation Status</h2>
</div>


            {/* Donor Info */}
            <div className="donation-info">
              <h2>Maria Mendoza</h2>
              <p>September 14, 2025 • 2 Laptops</p>
            </div>

           <div className="status-steps">
  <div className="step active">
    <div className="circle checked">
      <IonIcon icon={checkmarkCircle} />
    </div>
    <p>Pending</p>
  </div>
  <div className="line active"></div>
  <div className="step">
    <div className="circle"></div>
    <p>Accepted</p>
  </div>
  <div className="line"></div>
  <div className="step">
    <div className="circle"></div>
    <p>In Transit</p>
  </div>
  <div className="line"></div>
  <div className="step">
    <div className="circle"></div>
    <p>Delivered</p>
  </div>
</div>


            {/* Recipient Dropdown */}
            <IonSelect
              label="Assign Recipient"
              fill="outline"
              placeholder="Select organization"
            >
              <IonSelectOption value="bangoy">Bangoy Elementary School</IonSelectOption>
              <IonSelectOption value="matina">Matina HS</IonSelectOption>
              <IonSelectOption value="uic">UIC College</IonSelectOption>
            </IonSelect>

            {/* Buttons */}
            <div className="form-buttons">
              <IonButton
                expand="block"
                className="cancel-btn"
                onClick={() => setShowStatusForm(false)}
              >
                Cancel
              </IonButton>
              <IonButton expand="block" className="submit-btn">
                Update Status
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminDonations;
