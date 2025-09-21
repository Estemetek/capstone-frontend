import React, { useState, useEffect } from "react";
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
  IonButton,
} from "@ionic/react";
import {
  notificationsOutline,
  settingsOutline,
  helpCircleOutline,
  logOutOutline,
  createOutline,
  chevronDownOutline,
  keyOutline,
  personRemoveOutline,
  chevronBackOutline,
} from "ionicons/icons";
import "./Tab4.css";

const Tab5: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSettings, setIsSettings] = useState(false);

  // ✅ State for user data
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userContact, setUserContact] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  // Load user data from localStorage on mount
  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "");
    setUserEmail(localStorage.getItem("userEmail") || "");
    setUserContact(localStorage.getItem("userContact") || "");
    setUserRole(localStorage.getItem("userRole") || "");
    setUserId(localStorage.getItem("userId") || ""); // ✅ load userId
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // ✅ Clear all stored user info & token
    window.location.href = "/login"; // Redirect to login
  };

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
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
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
              <h2 className="profile-name">{userName || "User"}</h2>
              {/* ✅ Display userId here */}
              <p className="profile-id">ID: {userId || "N/A"}</p>
              <p className="profile-email">{userEmail}</p>
              <p className="profile-role">Role: {userRole}</p>
            </div>
          </>
        )}

        {/* If editing profile */}
        {isEditing && !isSettings ? (
          <div className="form-container">
            <IonLabel>Full Name</IonLabel>
            <IonInput
              value={userName}
              placeholder="Enter full name"
              className="input-box"
              onIonChange={(e) => setUserName(e.detail.value!)}
            />

            <IonLabel>Email</IonLabel>
            <IonInput
              value={userEmail}
              placeholder="Enter email"
              className="input-box"
              onIonChange={(e) => setUserEmail(e.detail.value!)}
            />

            <IonLabel>Mobile Number</IonLabel>
            <IonInput
              value={userContact}
              placeholder="Enter mobile number"
              className="input-box"
              onIonChange={(e) => setUserContact(e.detail.value!)}
            />

            <IonButton
              expand="block"
              className="update-btn"
              onClick={() => {
                // ✅ Save updates locally (could also call API)
                localStorage.setItem("userName", userName);
                localStorage.setItem("userEmail", userEmail);
                localStorage.setItem("userContact", userContact);
                setIsEditing(false);
              }}
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
            <button
              className="menu-row"
              onClick={() => console.log("Notification clicked")}
            >
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

            <button
              className="menu-row"
              onClick={() => console.log("Help clicked")}
            >
              <div className="circle-btn">
                <IonIcon icon={helpCircleOutline} />
              </div>
              <p className="menu-text">Help</p>
            </button>

            <button className="menu-row" onClick={handleLogout}>
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

export default Tab5;