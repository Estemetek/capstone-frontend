// AdminBeneficiaries.tsx
import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput,
  IonButton, IonTextarea, IonSelect, IonSelectOption, IonLabel, IonItem, IonList
} from "@ionic/react";
import axios from "axios";

const AdminBeneficiaries: React.FC = () => {
  const [schoolName, setSchoolName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [classification, setClassification] = useState("");
  const [agency, setAgency] = useState("");
  const [status, setStatus] = useState("Pending");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("/api/beneficiaries", {
        schoolName,
        schoolId,
        schoolType,
        classification,
        accreditation: { agency, status },
        contactPerson,
        contactEmail,
        contactNumber,
        address,
        region
      });
      alert("School Beneficiary registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Error registering school.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register School Beneficiary</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">School Name</IonLabel>
            <IonInput value={schoolName} onIonChange={e => setSchoolName(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">School ID</IonLabel>
            <IonInput value={schoolId} onIonChange={e => setSchoolId(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">School Type</IonLabel>
            <IonSelect value={schoolType} onIonChange={e => setSchoolType(e.detail.value!)}>
              <IonSelectOption value="Public">Public</IonSelectOption>
              <IonSelectOption value="Private">Private</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Classification</IonLabel>
            <IonSelect value={classification} onIonChange={e => setClassification(e.detail.value!)}>
              <IonSelectOption value="Elementary">Elementary</IonSelectOption>
              <IonSelectOption value="Secondary">Secondary</IonSelectOption>
              <IonSelectOption value="Senior High School">Senior High School</IonSelectOption>
              <IonSelectOption value="College">College</IonSelectOption>
              <IonSelectOption value="University">University</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Accreditation Agency</IonLabel>
            <IonSelect value={agency} onIonChange={e => setAgency(e.detail.value!)}>
              <IonSelectOption value="DepEd">DepEd</IonSelectOption>
              <IonSelectOption value="CHED">CHED</IonSelectOption>
              <IonSelectOption value="PAASCU">PAASCU</IonSelectOption>
              <IonSelectOption value="PACUCOA">PACUCOA</IonSelectOption>
              <IonSelectOption value="ACSCU-AAI">ACSCU-AAI</IonSelectOption>
              <IonSelectOption value="AACCUP">AACCUP</IonSelectOption>
              <IonSelectOption value="ISO">ISO</IonSelectOption>
              <IonSelectOption value="Other">Other</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Contact Person</IonLabel>
            <IonInput value={contactPerson} onIonChange={e => setContactPerson(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Contact Email</IonLabel>
            <IonInput value={contactEmail} onIonChange={e => setContactEmail(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Contact Number</IonLabel>
            <IonInput value={contactNumber} onIonChange={e => setContactNumber(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Address</IonLabel>
            <IonTextarea value={address} onIonChange={e => setAddress(e.detail.value!)} autoGrow />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Region</IonLabel>
            <IonInput value={region} onIonChange={e => setRegion(e.detail.value!)} />
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={handleSubmit}>Register School</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AdminBeneficiaries;
