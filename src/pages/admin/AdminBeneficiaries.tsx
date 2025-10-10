// AdminBeneficiaries.tsx
import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { getBeneficiaries, addBeneficiary, Beneficiary } from "../../services/api";

const AdminBeneficiaries: React.FC = () => {
  const [schools, setSchools] = useState<Beneficiary[]>([]);
  const [showForm, setShowForm] = useState(false);

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

  const fetchSchools = async () => {
    try {
      const res = await getBeneficiaries();
      console.log("Fetched beneficiaries:", res);
      setSchools(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching schools:", err);
      setSchools([]);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSubmit = async () => {
    if (!schoolName || !schoolId || !schoolType) {
      alert("Please fill in School Name, School ID, and School Type.");
      return;
    }

    const newBeneficiary: Beneficiary = {
      schoolName,
      schoolId,
      schoolType,
      classification,
      accreditation: { agency, status },
      contactPerson,
      contactEmail,
      contactNumber,
      address,
      region,
    };

    try {
      await addBeneficiary(newBeneficiary);
      alert("School Beneficiary registered successfully!");
      setShowForm(false);
      fetchSchools();
    } catch (err) {
      console.error(err);
      alert("Error registering school.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>School Beneficiaries</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Registered Schools</h2>
        <IonList>
          {schools.length === 0 ? (
            <IonItem>
              <IonLabel>No registered schools yet.</IonLabel>
            </IonItem>
          ) : (
            schools.map((school) => (
              <IonItem key={school._id}>
                <IonLabel>
                  <h3>{school.schoolName}</h3>
                  <p>
                    {school.schoolId} | {school.schoolType} | {school.classification}
                  </p>
                  <p>
                    {school.address} — {school.region}
                  </p>
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>

        {!showForm && (
          <IonButton expand="block" onClick={() => setShowForm(true)}>
            Register School
          </IonButton>
        )}

        {showForm && (
          <>
            <h2>Register New School Beneficiary</h2>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">School Name</IonLabel>
                <IonInput value={schoolName} onIonChange={(e) => setSchoolName(e.detail.value ?? "")} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">School ID</IonLabel>
                <IonInput value={schoolId} onIonChange={(e) => setSchoolId(e.detail.value ?? "")} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">School Type</IonLabel>
                <IonSelect value={schoolType} onIonChange={(e) => setSchoolType(e.detail.value ?? "")}>
                  <IonSelectOption value="Public">Public</IonSelectOption>
                  <IonSelectOption value="Private">Private</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Classification</IonLabel>
                <IonSelect value={classification} onIonChange={(e) => setClassification(e.detail.value ?? "")}>
                  <IonSelectOption value="Elementary">Elementary</IonSelectOption>
                  <IonSelectOption value="Secondary">Secondary</IonSelectOption>
                  <IonSelectOption value="Senior High School">Senior High School</IonSelectOption>
                  <IonSelectOption value="College">College</IonSelectOption>
                  <IonSelectOption value="University">University</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Accreditation Agency</IonLabel>
                <IonSelect value={agency} onIonChange={(e) => setAgency(e.detail.value ?? "")}>
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
                <IonInput value={contactPerson} onIonChange={(e) => setContactPerson(e.detail.value ?? "")} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Contact Email</IonLabel>
                <IonInput value={contactEmail} onIonChange={(e) => setContactEmail(e.detail.value ?? "")} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Contact Number</IonLabel>
                <IonInput value={contactNumber} onIonChange={(e) => setContactNumber(e.detail.value ?? "")} />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Address</IonLabel>
                <IonTextarea value={address} onIonChange={(e) => setAddress(e.detail.value ?? "")} autoGrow />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Region</IonLabel>
                <IonInput value={region} onIonChange={(e) => setRegion(e.detail.value ?? "")} />
              </IonItem>
            </IonList>

            <IonButton expand="block" color="primary" onClick={handleSubmit}>
              Register School
            </IonButton>

            <IonButton expand="block" color="medium" onClick={() => setShowForm(false)}>
              Cancel
            </IonButton>
          </>
        )}
      </IonContent>
      <IonButton expand="block" color="medium" routerLink="/admin/settings" style={{ margin: "16px" }}>
        Back to Settings
      </IonButton>
    </IonPage>
  );
};

export default AdminBeneficiaries;
