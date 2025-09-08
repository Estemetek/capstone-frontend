import React, { useState } from 'react';
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
import {
  notificationsOutline,
  settingsOutline,
  helpCircleOutline,
  logOutOutline,
  createOutline,
  chevronDownOutline,
  keyOutline,
  personRemoveOutline,
  chevronBackOutline
} from 'ionicons/icons';
import './Tab4.css';

const Tab4: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSettings, setIsSettings] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isSettings ? (
            <div className="header-with-back">
              <IonIcon
                icon={chevronBackOutline}
                className="back-btn"
                onClick={() => setIsSettings(false)}
              />
              <IonTitle>Settings</IonTitle>
            </div>
          ) : (
            <IonTitle>My Profile</IonTitle>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {!isSettings && (
          <>
            {/* Profile Avatar */}
            <div className="profile-header">
              <IonAvatar className="profile-avatar">
                <img
                  src="https://cdnphoto.dantri.com.vn/FTH2E5KX4ObLWPDl9xP3VO8ZDO4=/thumb_w/1020/2025/04/08/jennie-2-1744084779771.jpg"
                  alt="Profile"
                />
              </IonAvatar>

              {/* Edit Profile button */}
              <IonIcon
                icon={createOutline}
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>

            {/* User info */}
            <div className="profile-info">
              <h2 className="profile-name">Jennie Kim</h2>
              <p className="profile-id">ID: 25030024</p>
            </div>
          </>
        )}

        {/* If editing profile */}
        {isEditing && !isSettings ? (
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

            <IonButton
              expand="block"
              className="update-btn"
              onClick={() => setIsEditing(false)}
            >
              Update Profile
            </IonButton>
          </div>
        ) : isSettings ? (
          /* Settings View */
          <div className="settings-list">
            <div className="settings-row">
              <IonIcon icon={notificationsOutline} className="settings-icon" />
              <p className="settings-text">Notification Settings</p>
              <IonIcon icon={chevronDownOutline} className="settings-chevron" />
            </div>

            <div className="settings-row">
              <IonIcon icon={keyOutline} className="settings-icon" />
              <p className="settings-text">Password Settings</p>
              <IonIcon icon={chevronDownOutline} className="settings-chevron" />
            </div>

            <div className="settings-row">
              <IonIcon icon={personRemoveOutline} className="settings-icon" />
              <p className="settings-text">Delete Account</p>
              <IonIcon icon={chevronDownOutline} className="settings-chevron" />
            </div>
          </div>
        ) : (
          /* Default menu list */
          <div className="menu-list">
            <button className="menu-row" onClick={() => console.log('Notification clicked')}>
              <div className="circle-btn">
                <IonIcon icon={notificationsOutline} />
              </div>
              <p className="menu-text">Notification</p>
            </button>

            <button className="menu-row" onClick={() => setIsSettings(true)}>
              <div className="circle-btn">
                <IonIcon icon={settingsOutline} />
              </div>
              <p className="menu-text">Settings</p>
            </button>

            <button className="menu-row" onClick={() => console.log('Help clicked')}>
              <div className="circle-btn">
                <IonIcon icon={helpCircleOutline} />
              </div>
              <p className="menu-text">Help</p>
            </button>

            <button className="menu-row" onClick={() => console.log('Logout clicked')}>
              <div className="circle-btn">
                <IonIcon icon={logOutOutline} />
              </div>
              <p className="menu-text">Logout</p>
            </button>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
