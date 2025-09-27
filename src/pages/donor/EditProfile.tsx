import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonIcon,
  IonInput,
  IonLabel,
  IonButton
} from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Avatar with camera icon */}
        <div className="profile-header">
          <IonAvatar className="profile-avatar">
            <img src="https://i.imgur.com/t6nKQ9m.jpg" alt="Profile" />
          </IonAvatar>
          <IonIcon
            icon={cameraOutline}
            className="camera-icon"
            onClick={() => console.log("Change photo clicked")}
          />
        </div>

        {/* User info with blue highlight */}
        <div className="profile-info">
          <h2 className="profile-name">Jennie Kim</h2>
          <p className="profile-id">ID: 25030024</p>
        </div>

        {/* Form Fields */}
        <div className="form-container">
          <IonLabel>Full Name</IonLabel>
          <IonInput
            value="Jennie Kim"
            placeholder="Enter full name"
            className="input-box"
          />

          <IonLabel>Email</IonLabel>
          <IonInput
            value="Rockwithjennie@Gmail.Com"
            placeholder="Enter email"
            className="input-box"
          />

          <IonLabel>Mobile Number</IonLabel>
          <IonInput
            value="+123 4567 890"
            placeholder="Enter mobile number"
            className="input-box"
          />

          <IonButton expand="block" className="update-btn" onClick={() => console.log("Profile updated!")}>
            Update Profile
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
