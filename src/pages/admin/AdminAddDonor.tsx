// src/pages/admin/AdminAddDonor.tsx
import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonIcon,
  IonToast,
  IonText,
  IonSpinner,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { cloudUploadOutline } from "ionicons/icons";
import "./AdminDonations.css";

const AdminAddDonor: React.FC = () => {
  const history = useHistory();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [govIdType, setGovIdType] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Step 2
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 3
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // UI & state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  // Step 1 -> Proceed
  const handleProceedStep1 = () => {
    if (!name || !email || !contactNo) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setStep(2);
  };

  // Step 2 -> Proceed
  const handleProceedStep2 = async () => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          contactNo,
          address,
          govIdType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP.");

      setIsOtpSent(true);
      setStep(3);
      setToastMsg("OTP sent to donor email!");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 -> Send OTP again
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend OTP.");
      setToastMsg("OTP sent again!");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 -> Submit OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMsg("Please enter the OTP code.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed.");

      setToastMsg("Donor successfully registered!");
      setTimeout(() => history.push("/admin/donors"), 1500);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>Back</IonButton>
          </IonButtons>
          <IonTitle>Register Donor</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2 className="page-heading">Donor Registration</h2>

        {step === 1 && (
          <>
            <IonInput
              label="Full Name"
              labelPlacement="stacked"
              fill="outline"
              value={name}
              onIonChange={(e) => setName(e.detail.value!)}
            />
            <IonInput
              label="Email Address"
              labelPlacement="stacked"
              fill="outline"
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
            <IonInput
              label="Phone Number"
              labelPlacement="stacked"
              fill="outline"
              value={contactNo}
              onIonChange={(e) => setContactNo(e.detail.value!)}
            />
            <IonSelect
              label="Government ID Type"
              labelPlacement="stacked"
              fill="outline"
              value={govIdType}
              placeholder="Select"
              onIonChange={(e) => setGovIdType(e.detail.value!)}
            >
              <IonSelectOption value="passport">Passport</IonSelectOption>
              <IonSelectOption value="driver">Driver’s License</IonSelectOption>
              <IonSelectOption value="national">National ID</IonSelectOption>
            </IonSelect>
            <IonTextarea
              label="Address"
              labelPlacement="stacked"
              fill="outline"
              placeholder="Enter donor address"
              value={address}
              onIonChange={(e) => setAddress(e.detail.value!)}
            />
            <div className="upload-box" onClick={() => document.getElementById("fileInput")?.click()}>
              <IonIcon icon={cloudUploadOutline} className="upload-icon" />
              <p>{file ? file.name : "Browse to upload"}</p>
              <input id="fileInput" type="file" hidden onChange={handleFileChange} />
            </div>

            <IonButton expand="block" onClick={handleProceedStep1}>
              Proceed
            </IonButton>
          </>
        )}

        {step === 2 && (
          <>
            <IonInput
              label="Password"
              labelPlacement="stacked"
              fill="outline"
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
            <IonInput
              label="Confirm Password"
              labelPlacement="stacked"
              fill="outline"
              type="password"
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            />
            <IonButton expand="block" onClick={handleProceedStep2}>
              {loading ? <IonSpinner name="dots" /> : "Proceed"}
            </IonButton>
          </>
        )}

        {step === 3 && (
          <>
            <IonText>Enter the OTP sent to {email}</IonText>
            <IonInput
              label="OTP Code"
              labelPlacement="stacked"
              fill="outline"
              value={otp}
              onIonChange={(e) => setOtp(e.detail.value!)}
            />
            <IonButton expand="block" onClick={handleSendOtp}>
              {loading ? <IonSpinner name="dots" /> : "Send OTP to Email"}
            </IonButton>
            <IonButton expand="block" color="success" onClick={handleVerifyOtp}>
              {loading ? <IonSpinner name="dots" /> : "Submit"}
            </IonButton>
          </>
        )}

        {/* Toasts */}
        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2000}
          color="success"
          onDidDismiss={() => setToastMsg("")}
        />
        <IonToast
          isOpen={!!errorMsg}
          message={errorMsg}
          duration={2000}
          color="danger"
          onDidDismiss={() => setErrorMsg("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminAddDonor;
