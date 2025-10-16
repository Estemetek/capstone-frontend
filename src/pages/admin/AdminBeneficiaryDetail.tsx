// src/pages/admin/AdminBeneficiaryDetail.tsx
import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonSpinner,
  IonButton,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { getBeneficiary, Beneficiary } from "../../services/api"; // Assume getBeneficiary is available

// Define the interface for route parameters
interface BeneficiaryDetailParams {
  id: string;
}

const AdminBeneficiaryDetail: React.FC = () => {
  const { id } = useParams<BeneficiaryDetailParams>();
  const history = useHistory();

  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getBeneficiary(id);
        setBeneficiary(data);
      } catch (err: any) {
        console.error("Error fetching beneficiary:", err);
        setError("Failed to load beneficiary details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner name="crescent" />
          <IonText>Loading details...</IonText>
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonText color="danger">
            <h1>Error</h1>
            <p>{error}</p>
          </IonText>
          <IonButton onClick={() => history.goBack()}>Go Back</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (!beneficiary) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonText>Beneficiary not found.</IonText>
          <IonButton onClick={() => history.goBack()}>Go Back</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" onClick={() => history.goBack()}>Back</IonButton>
          <IonTitle>Beneficiary Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>{beneficiary.schoolName}</h1>
        <IonText color="medium">
          <p>School ID: {beneficiary.schoolId}</p>
        </IonText>

        <h2>Basic Information</h2>
        <IonList>
          <IonItem>
            <IonLabel>School Type: <strong>{beneficiary.schoolType}</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Classification: <strong>{beneficiary.classification}</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Region: <strong>{beneficiary.region}</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Address: <strong>{beneficiary.address}</strong></IonLabel>
          </IonItem>
        </IonList>

        <h2>Accreditation</h2>
        <IonList>
          <IonItem>
            <IonLabel>Agency: <strong>{beneficiary.accreditation?.agency || "N/A"}</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Status: <strong>{beneficiary.accreditation?.status || "Pending"}</strong></IonLabel>
          </IonItem>
        </IonList>

        <h2>Contact Information</h2>
        <IonList>
          <IonItem>
            <IonLabel>Person: <strong>{beneficiary.contactPerson}</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Email: <strong>{beneficiary.contactEmail}</strong></IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Number: <strong>{beneficiary.contactNumber}</strong></IonLabel>
          </IonItem>
        </IonList>
        
        {/* You can add action buttons here, like "Edit" or "View Donations" */}

      </IonContent>
    </IonPage>
  );
};

export default AdminBeneficiaryDetail;