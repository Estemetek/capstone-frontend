import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createDonation } from "../../services/api"; //  Your blockchain/offchain API
import { supabase } from "../../supabaseClient"; //  Supabase initialized client
import "./AddDonation.css";

const AddDonation: React.FC = () => {
  const history = useHistory();

  // --- Load logged-in user from localStorage (set in login.tsx) ---
  const donorInfo = {
    name: localStorage.getItem("userName") || "Unknown Donor",
    email: localStorage.getItem("userEmail") || "unknown@example.com",
    contactNo: localStorage.getItem("userContact") || "0000000000",
    id: localStorage.getItem("userId") || undefined,
  };

  // --- Form States ---
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [recipientSchool, setRecipientSchool] = useState("");
  const [recipientContact, setRecipientContact] = useState("");
  const [images, setImages] = useState<string[]>([]); // final uploaded URLs
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // raw files to upload

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");

  // --- Upload file to Supabase and return public URL ---
  const uploadToSupabase = async (file: File) => {
    const filePath = `public/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("donation-images") // 👈 must match your Supabase bucket
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Upload failed:", error.message);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("donation-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    try {
      // ✅ First upload all files
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadToSupabase(file);
        uploadedUrls.push(url);
      }

      // ✅ Build donation payload
      const donationPayload = {
        itemType: itemName,
        category,
        condition,
        quantity,
        notes: description,
        images: uploadedUrls, // saved Supabase URLs
        donorID: donorInfo.id || donorInfo.email,
        currentOwner: "Organization Warehouse",
        status: "Pending",
        donorInfo,
        recipientInfo: {
          school: recipientSchool,
          contact: recipientContact,
        },
        appraisalValue: 0,
      };

      const res = await createDonation(donationPayload);
      console.log("✅ Donation created:", res);

      if (res.offchain?.qrCodeUrl) {
        setQrUrl(res.offchain.qrCodeUrl);
      }

      setImages(uploadedUrls);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("❌ Error creating donation:", err);
      alert(`Failed to submit donation: ${err.message}`);
    }
  };

  const resetForm = () => {
    setItemName("");
    setCategory("");
    setCondition("");
    setDescription("");
    setQuantity(1);
    setRecipientSchool("");
    setRecipientContact("");
    setImages([]);
    setSelectedFiles([]);
    setIsSubmitted(false);
    setQrUrl("");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push("/tabs/tab2")}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Donations</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="add-donation-content">
        {!isSubmitted ? (
          <>
            <h1 className="form-title">Add Donation</h1>

            {/* Item Name */}
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <IonInput
                value={itemName}
                placeholder="Enter item name"
                className="form-box"
                onIonChange={(e) => setItemName(e.detail.value!)}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <IonSelect
                value={category}
                placeholder="Select Category"
                className="form-box"
                onIonChange={(e) => setCategory(e.detail.value)}
              >
                <IonSelectOption value="electronics">
                  Electronics & Gadgets
                </IonSelectOption>
                <IonSelectOption value="school">
                  School Supplies
                </IonSelectOption>
                <IonSelectOption value="books">
                  Books & Learning Materials
                </IonSelectOption>
                <IonSelectOption value="uniforms">
                  Uniforms & Clothing
                </IonSelectOption>
              </IonSelect>
            </div>

            {/* Condition */}
            <div className="form-group">
              <label className="form-label">Condition</label>
              <IonSelect
                value={condition}
                placeholder="Select Condition"
                className="form-box"
                onIonChange={(e) => setCondition(e.detail.value)}
              >
                <IonSelectOption value="new">Brand New</IonSelectOption>
                <IonSelectOption value="gentlyused">Gently Used</IonSelectOption>
                <IonSelectOption value="usedfunctional">
                  Used, Fully Functional
                </IonSelectOption>
                <IonSelectOption value="repairable">
                  Needs Repair/Repairable
                </IonSelectOption>
              </IonSelect>
            </div>

            {/* Description */}
            <div className="form-group">
              <IonTextarea
                value={description}
                placeholder="Condition Description"
                className="form-box"
                onIonChange={(e) => setDescription(e.detail.value!)}
              />
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <IonInput
                type="number"
                value={quantity}
                min="1"
                step="1"
                className="form-box"
                onIonChange={(e) => {
                  const value = parseInt(e.detail.value!, 10);
                  setQuantity(isNaN(value) || value < 1 ? 1 : value);
                }}
              />
            </div>

            {/* Recipient School */}
            <div className="form-group">
              <label className="form-label">Recipient School</label>
              <IonInput
                value={recipientSchool}
                placeholder="Enter recipient school"
                className="form-box"
                onIonChange={(e) => setRecipientSchool(e.detail.value!)}
              />
            </div>

            {/* Recipient Contact */}
            <div className="form-group">
              <label className="form-label">Recipient Contact</label>
              <IonInput
                value={recipientContact}
                placeholder="Enter recipient contact"
                className="form-box"
                onIonChange={(e) => setRecipientContact(e.detail.value!)}
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    setSelectedFiles(Array.from(files));
                    const previews = Array.from(files).map((file) =>
                      URL.createObjectURL(file)
                    );
                    setImages(previews); // preview before uploading
                  }
                }}
              />
              {images.length > 0 && (
                <div className="preview-images">
                  {images.map((img, idx) => (
                    <img key={idx} src={img} alt={`upload-${idx}`} width="100" />
                  ))}
                </div>
              )}
            </div>

            {/* Donate Button */}
            <IonButton
              expand="block"
              className="donate-button"
              onClick={handleSubmit}
            >
              Donate
            </IonButton>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="success-card">
            <div className="banner-image">
              <img
                src="https://res.cloudinary.com/dmajhtvmd/image/upload/c_scale/f_auto/dpr_auto/onjme2bzy465j8jle4yi"
                alt="Students"
              />
            </div>

            <div className="success-box">
              <img src="/assets/logo.png" alt="Logo" className="success-logo" />
              <h2 className="success-title">Thank you for donating!</h2>
              <p className="success-text">
                Your support helps BrightAid continue its mission of helping
                students in need.
              </p>

              {/* Donation Summary */}
              <div className="donation-summary">
                <h3>Donation Details</h3>
                <p><strong>Item Name:</strong> {itemName}</p>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Condition:</strong> {condition}</p>
                <p><strong>Quantity:</strong> {quantity}</p>
                {description && <p><strong>Description:</strong> {description}</p>}
                {recipientSchool && (
                  <p><strong>Recipient School:</strong> {recipientSchool}</p>
                )}
                {recipientContact && (
                  <p><strong>Recipient Contact:</strong> {recipientContact}</p>
                )}
                {images.length > 0 && (
                  <div className="submitted-images">
                    <strong>Uploaded Images:</strong>
                    <div className="image-preview">
                      {images.map((img, idx) => (
                        <img key={idx} src={img} alt={`upload-${idx}`} width="80" />
                      ))}
                    </div>
                  </div>
                )}
                <p><strong>Donor Name:</strong> {donorInfo.name}</p>
                <p><strong>Donor Email:</strong> {donorInfo.email}</p>
                <p><strong>Donor Contact:</strong> {donorInfo.contactNo}</p>
              </div>

              {qrUrl && (
                <div className="qr-code">
                  <img src={qrUrl} alt="QR Code" width="150" />
                </div>
              )}
              <p className="qr-text">
                Scan the QR code to trace and verify your donation progress.
              </p>

              <IonButton expand="block" className="download-btn">
                Download QR
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                className="done-btn"
                onClick={() => {
                  resetForm();
                  history.push("/tabs/tab2");
                }}
              >
                Done
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AddDonation;
