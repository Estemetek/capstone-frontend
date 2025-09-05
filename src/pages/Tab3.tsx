import { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import "./Tab3.css";

const Tab3: React.FC = () => {
  const [selected, setSelected] = useState("scan");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Trace</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Segmented control */}
        <div className="trace-segment">
          <IonSegment
        value={selected}
        onIonChange={(e) => setSelected(e.detail.value as string)}
      >
        <IonSegmentButton value="scan">
          <IonLabel>Scan</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="share">
          <IonLabel>Share</IonLabel>
        </IonSegmentButton>
      </IonSegment>

        </div>

        {/* Scan Content */}
        {selected === "scan" && (
          <div className="scan-container">
            <img src="/assets/qr-placeholder.png" alt="QR Scanner" className="qr-image" />
            <h2 className="scan-title">Scan QR Code</h2>
            <p className="scan-subtitle">Scan to trace the donation</p>
          </div>
        )}

        {/* Share Content */}
        {selected === "share" && (
          <div className="share-container">
            {/* QR Code */}
            <div className="qr-box">
              <img src="/assets/qr-placeholder.png" alt="QR Code" className="qr-image" />
            </div>
            <h2 className="scan-title">Your QR Code</h2>
            <p className="scan-subtitle">Scan to trace the donation</p>

            {/* Scan History */}
            <div className="section">
              <h3 className="section-title">Scan History</h3>
              <div className="history-card">
                <img src="/assets/qr-placeholder.png" alt="History QR" className="history-icon" />
                <div className="history-details">
                  <p className="history-asset">Asset ID: 12345</p>
                  <p className="history-time">Scanned 2 hours ago</p>
                </div>
              </div>
            </div>

            {/* Manual Entry */}
            <div className="section">
              <h3 className="section-title">Manual Entry</h3>
              <input type="text" placeholder="Enter asset ID" className="manual-input" />
              <button className="manual-btn">Trace</button>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
