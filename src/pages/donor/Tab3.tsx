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
import { getDonationById, getDonationsByCategory, DonationResponse, OffchainDonation } from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

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
  const [categoryResults, setCategoryResults] = useState<DonationResponse[]>([]);

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
          <p className="scan-subtitle">Scan or upload to trace the donation</p>

          {/* 📸 Camera-based scan button (existing or future integration) */}
          <IonButton
            expand="block"
            onClick={async () => {
              try {
                // Request camera permission
                const permission = await BarcodeScanner.requestPermissions();
                if (permission.camera !== "granted") {
                  alert("Camera permission denied");
                  return;
                }

                // Start scanning (opens a live camera preview)
                const { barcodes } = await BarcodeScanner.scan();

                if (barcodes.length > 0) {
                  const scannedId = barcodes[0].rawValue.trim();
                  setQuery(scannedId);
                  setSelected("webquery");

                  setLoading(true);
                  const data = await getDonationById(scannedId);
                  setResult(data);
                  setLoading(false);
                } else {
                  setError("No QR code detected.");
                }
              } catch (err) {
                console.error("Barcode scan error:", err);
                setError("Failed to scan QR code.");
              }
            }}
          >
            Scan using Camera
          </IonButton>

          {/* 🖼 Upload QR option */}
          <IonButton
            expand="block"
            color="medium"
            className="manual-btn"
            onClick={() => document.getElementById("qrUploadInput")?.click()}
          >
            Upload QR Code Image
          </IonButton>

          <input
            type="file"
            id="qrUploadInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                const img = new Image();
                const reader = new FileReader();
                reader.onload = async (event) => {
                  img.src = event.target?.result as string;

                  img.onload = async () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return;

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);

                    const jsQR = (await import("jsqr")).default;
                    const qrCode = jsQR(
                      imageData.data,
                      imageData.width,
                      imageData.height
                    );

                    if (qrCode) {
                      const scannedId = qrCode.data.trim();
                      setQuery(scannedId);
                      setSelected("webquery");

                      // Automatically trace the donation
                      try {
                        setLoading(true);
                        const data = await getDonationById(scannedId);
                        setResult(data);
                      } catch (err: any) {
                        setError("QR detected but donation not found.");
                      } finally {
                        setLoading(false);
                      }
                    } else {
                      setError("No QR code detected in the image.");
                    }
                  };
                };
                reader.readAsDataURL(file);
              } catch (err: any) {
                setError("Failed to read QR image.");
              }
            }}
          />
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
                  <p><strong>Current Owner:</strong> {result.blockchain.currentOwner}</p>
                  {/* <p><strong>Donor:</strong> {result.offchain.donorInfo.name}</p> */}
                  <p><strong>Blockchain Donor ID:</strong> {result.blockchain.donorID}</p>
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
                      <h3>{item.blockchain?.itemType || item.offchain.itemType}</h3>
                      <p><strong>ID:</strong> {item.blockchain?.itemID || item.offchain.itemID}</p>
                      <p><strong>Status:</strong> {item.blockchain?.status || "N/A"}</p>
                      <p><strong>Condition:</strong> {item.offchain.condition}</p>
                      <p><strong>Category:</strong> {item.offchain.category}</p>
                      <p><strong>Blockchain Donor ID:</strong> {item.blockchain?.donorID || "N/A"}</p>
                      <p><strong>Date Donated:</strong>{" "}
                        {new Date(item.offchain.createdAt || item.blockchain?.timestamp || "").toLocaleString()}
                      </p>
                      {item.offchain.qrCodeUrl && (
                        <img
                          src={item.offchain.qrCodeUrl}
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

        {categoryResults.length === 0 && selected === "webquery" && (
          <div className="section">
            <p style={{ textAlign: "center", color: "#888" }}>
              No donations found for this category.
            </p>
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