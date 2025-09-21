// src/pages/Tab3.tsx
import { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonToast,
  IonButton,
} from "@ionic/react";
import "./Tab3.css";
import {
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { getDonationById, getDonationsByCategory, DonationResponse, OffchainDonation } from "../services/api";
import { QRCodeCanvas } from "qrcode.react";

const HISTORY_KEY = "scanHistory";

const Tab3: React.FC = () => {
  const [selected, setSelected] = useState("scan");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DonationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { id: string; time: string; itemType: string }[]
  >([]);
  const [categoryResults, setCategoryResults] = useState<OffchainDonation[]>([]);

  // ✅ Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // ✅ Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleTrace = async () => {
    if (!query.trim()) {
      setError("Please enter an Asset ID.");
      return;
    }
    try {
      setLoading(true);
      const data = await getDonationById(query.trim());
      setResult(data);

      // Add to history (avoid duplicates at top)
      setHistory((prev) => [
        {
          id: query.trim(),
          time: new Date().toLocaleString(),
          itemType: data.blockchain.itemType,
        },
        ...prev.filter((h) => h.id !== query.trim()),
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch donation.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle history click
  const handleHistoryClick = async (id: string) => {
    try {
      setLoading(true);
      const data = await getDonationById(id);
      setResult(data);

      // Move clicked ID to top of history
      setHistory((prev) => [
        { id, time: new Date().toLocaleString(), itemType: data.blockchain.itemType },
        ...prev.filter((h) => h.id !== id),
      ]);

      // Switch to Web Query tab
      setQuery(id);
      setSelected("webquery");
    } catch (err: any) {
      setError(err.message || "Failed to fetch donation.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

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
            <IonSegmentButton value="webquery">
              <IonLabel>Web Query</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Scan Content */}
        {selected === "scan" && (
          <div className="scan-container">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
              alt="QR Scanner"
              className="qr-image"
            />
            <h2 className="scan-title">Scan QR Code</h2>
            <p className="scan-subtitle">Scan to trace the donation</p>
          </div>
        )}

        {/* Share Content */}
        {selected === "share" && (
          <div className="share-container">
            <div className="qr-box">
              {result ? (
                <img
                  src={result.offchain.qrCodeUrl}
                  alt="Donation QR"
                  className="qr-image"
                />
              ) : (
                <p>No donation selected. Please trace a donation first.</p>
              )}
            </div>
            <h2 className="scan-title">Your QR Code</h2>
            <p className="scan-subtitle">Share or download your QR</p>

            {result && result.offchain.qrCodeUrl && (
              <IonButton
                expand="block"
                className="manual-btn"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = result.offchain.qrCodeUrl || "";  // ✅ safe fallback
                  link.download = `${result.blockchain.itemID}.png`;
                  link.click();
                }}
              >
                Download QR
              </IonButton>
            )}

            {/* Trace History */}
            <div className="section">
              <h3 className="section-title">Trace History</h3>
              {history.length === 0 && <p>No history yet.</p>}
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className="history-card clickable"
                  onClick={() => handleHistoryClick(h.id)}
                >
                  <div className="history-details">
                    <p className="history-asset">
                      Asset ID: {h.id} ({h.itemType})
                    </p>
                    <p className="history-time">{h.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Web Query Content */}
        {selected === "webquery" && (
          <div className="share-container">
            <h2 className="scan-title">Web Query</h2>
            <p className="scan-subtitle">Search donations by Asset ID or Category</p>

            {/* Manual Asset ID Search */}
            <div className="section">
              <input
                type="text"
                placeholder="Enter asset ID"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="manual-input"
              />
              <IonButton
                expand="block"
                className="manual-btn"
                onClick={handleTrace}
                disabled={loading}
              >
                {loading ? <IonSpinner name="crescent" /> : "Trace by ID"}
              </IonButton>
            </div>

            {/* Category Filter */}
            <div className="section">
              <IonSelect
                placeholder="Filter by Category"
                onIonChange={async (e) => {
                  const category = e.detail.value;
                  try {
                    setLoading(true);
                    const data = await getDonationsByCategory(category);
                    setCategoryResults(data);
                    setResult(null); // clear single ID result
                  } catch (err: any) {
                    setError(err.message || "No results for this category.");
                    setCategoryResults([]);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <IonSelectOption value="electronics">Electronics & Gadgets</IonSelectOption>
                <IonSelectOption value="school">School Supplies</IonSelectOption>
                <IonSelectOption value="books">Books & Learning Materials</IonSelectOption>
                <IonSelectOption value="uniforms">Uniforms & Clothing</IonSelectOption>
              </IonSelect>
            </div>

            {/* Single ID Result */}
            {result && (
              <IonCard>
                <IonCardContent>
                  <h3>{result.blockchain.itemType}</h3>
                  <p><strong>ID:</strong> {result.blockchain.itemID}</p>
                  <p><strong>Status:</strong> {result.blockchain.status}</p>
                  <p><strong>Condition:</strong> {result.blockchain.condition}</p>
                  <p><strong>Owner:</strong> {result.blockchain.currentOwner}</p>
                  <p><strong>Donor:</strong> {result.offchain.donorInfo.name}</p>
                  <p><strong>Date Donated:</strong>{" "}
                    {new Date(result.offchain.createdAt || result.blockchain.timestamp)
                      .toLocaleString()}
                  </p>

                  <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <QRCodeCanvas
                      value={result.blockchain.itemID}
                      size={180}
                      includeMargin={true}
                    />
                    <p className="scan-subtitle">QR for this donation</p>
                  </div>
                </IonCardContent>
              </IonCard>
            )}

            {/* Category Results */}
            {categoryResults.length > 0 && (
              <div className="section">
                <h3 className="section-title">Results</h3>
                {categoryResults.map((item, idx) => (
                  <IonCard key={idx}>
                    <IonCardContent>
                      <h3>{item.itemType}</h3>
                      <p><strong>ID:</strong> {item.itemID}</p>
                      <p><strong>Condition:</strong> {item.condition}</p>
                      <p><strong>Category:</strong> {item.category}</p>
                      <p><strong>Donor:</strong> {item.donorInfo.name}</p>
                      <p><strong>Date Donated:</strong>{" "}
                        {new Date(item.createdAt || "").toLocaleString()}
                      </p>
                      {item.qrCodeUrl && (
                        <img
                          src={item.qrCodeUrl}
                          alt="Donation QR"
                          style={{ marginTop: "10px", maxWidth: "150px" }}
                        />
                      )}
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            )}
          </div>
        )}

        <IonToast
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          message={error || ""}
          duration={2500}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
