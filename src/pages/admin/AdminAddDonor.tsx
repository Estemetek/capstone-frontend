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
import { uploadImageToSupabase } from "../../services/upload"; 

const API_BASE_URL = "http://localhost:3000/api/users"; // ⬅️ CORRECTED: Use port 3000

const AdminAddDonor: React.FC = () => {
  const history = useHistory();

  // Form fields (Step 1)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [govIdType, setGovIdType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // 🟢 NEW STATE: Stores the public URL after Supabase upload
  const [govIdUrl, setGovIdUrl] = useState<string | null>(null);

  // Step 2
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 3
  const [otp, setOtp] = useState("");
  // const [isOtpSent, setIsOtpSent] = useState(false); // Can be removed, 'step === 3' implies OTP sent

  // UI & state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setGovIdUrl(null); // Reset URL if a new file is selected
    }
  };

  // 1️⃣ Step 1 -> Proceed (Upload file first)
  const handleProceedStep1 = async () => {
    if (!name || !email || !contactNo || !address || !govIdType || !file) {
      setErrorMsg("Please fill in all details, select an ID type, and upload the ID file.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setGovIdUrl(null); // Clear previous attempt

    try {
      // 🚀 Upload file to Supabase
      const url = await uploadImageToSupabase(file);
      setGovIdUrl(url); // Store the public URL
      
      setToastMsg("ID file uploaded successfully! Proceeding to password.");
      setStep(2); // Proceed to Step 2 (Password)
    } catch (err: any) {
      console.error("Supabase upload error:", err);
      setErrorMsg(`Failed to upload ID file. Please try again. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Step 2 -> Pre-Register and Send OTP
  const handleProceedStep2 = async () => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    if (!govIdUrl) {
      setErrorMsg("ID file URL is missing. Please go back to Step 1.");
      return;
    }

    try {
      setLoading(true);
      // 💡 Calling the pre-register endpoint with the Supabase URL
      const res = await fetch(`${API_BASE_URL}/pre-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          contactNo,
          address,
          govIdType,
          govIdUrl, // 🟢 Send the uploaded URL
          role: "donor",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP.");

      // setIsOtpSent(true); // No longer needed
      setStep(3);
      setToastMsg("OTP sent to donor email!");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Step 3 -> Send OTP again
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      // 💡 Calling the send-otp endpoint
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
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

  // 4️⃣ Step 3 -> Submit OTP (Final Registration)
  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMsg("Please enter the OTP code.");
      return;
    }

    try {
      setLoading(true);
      // 💡 Calling the verify-otp endpoint for final registration
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
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
        <h2 className="page-heading">Donor Registration (Step {step} of 3)</h2>

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
              placeholder="Select ID Type"
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

            {/* File Upload UI */}
            <div className="upload-box" onClick={() => document.getElementById("fileInput")?.click()}>
              <IonIcon icon={cloudUploadOutline} className="upload-icon" />
              <p>{file ? file.name : "Browse to upload Government ID"}</p>
              <input id="fileInput" type="file" hidden onChange={handleFileChange} accept="image/*,.pdf" />
            </div>
            {govIdUrl && <IonText color="success"><p>✅ ID File uploaded successfully!</p></IonText>}

            <IonButton expand="block" onClick={handleProceedStep1} disabled={loading}>
              {loading ? <IonSpinner name="dots" /> : "Upload ID and Proceed (Step 2)"}
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
            <IonButton expand="block" onClick={handleProceedStep2} disabled={loading}>
              {loading ? <IonSpinner name="dots" /> : "Set Password and Send OTP (Step 3)"}
            </IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setStep(1)} disabled={loading}>
              Back to Details
            </IonButton>
          </>
        )}

        {step === 3 && (
          <>
            <IonText>Enter the OTP sent to **{email}**</IonText>
            <IonInput
              label="OTP Code"
              labelPlacement="stacked"
              fill="outline"
              value={otp}
              onIonChange={(e) => setOtp(e.detail.value!)}
            />
            <IonButton expand="block" onClick={handleSendOtp} disabled={loading} fill="outline" className="ion-margin-vertical">
              {loading ? <IonSpinner name="dots" /> : "Resend OTP to Email"}
            </IonButton>
            <IonButton expand="block" color="success" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? <IonSpinner name="dots" /> : "Submit and Register Donor"}
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