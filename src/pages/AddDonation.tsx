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
  IonTextarea
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AddDonation.css';

const AddDonation: React.FC = () => {
  const history = useHistory();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log({ itemName, category, condition, description, quantity });
    setIsSubmitted(true); // switch to confirmation view
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push('/tabs/tab2')}>Cancel</IonButton>
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
                <IonSelectOption value="electronics">Electronics</IonSelectOption>
                <IonSelectOption value="school">School Essentials</IonSelectOption>
                <IonSelectOption value="books">Books</IonSelectOption>
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
                <IonSelectOption value="new">New</IonSelectOption>
                <IonSelectOption value="working">Working</IonSelectOption>
                <IonSelectOption value="repairable">Repairable</IonSelectOption>
              </IonSelect>
            </div>

            {/* Condition Description */}
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
              <IonSelect
                value={quantity}
                placeholder="1"
                className="form-box"
                onIonChange={(e) => setQuantity(parseInt(e.detail.value!, 10))}
              >
                {[...Array(10)].map((_, i) => (
                  <IonSelectOption key={i + 1} value={i + 1}>
                    {i + 1}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>

            {/* Donate Button */}
            <IonButton expand="block" className="donate-button" onClick={handleSubmit}>
              Donate
            </IonButton>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="success-card">
            {/* Banner Image */}
            <div className="banner-image">
              <img
                src="https://res.cloudinary.com/dmajhtvmd/image/upload/c_scale/f_auto/dpr_auto/onjme2bzy465j8jle4yi"
                alt="Students"
              />
            </div>

            {/* Thank you box */}
            <div className="success-box">
              <img
                src="/assets/logo.png"
                alt="Logo"
                className="success-logo"
              />

              <h2 className="success-title">Thank you for donating!</h2>
              <p className="success-text">
                Your support helps BrightAid continue its mission of helping students in need.
              </p>

              {/* QR Code */}
              <div className="qr-code">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?data=Donation123&size=150x150"
                  alt="QR Code"
                />
              </div>
              <p className="qr-text">
                Scan the QR code to trace and verify your donation progress.
              </p>

              {/* Buttons */}
              <IonButton expand="block" className="download-btn">
                Download QR
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                className="done-btn"
                onClick={() => history.push('/tabs/tab2')}
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
