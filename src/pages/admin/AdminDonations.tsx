// src/pages/admin/AdminDonations.tsx
import "./AdminDonations.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonIcon,
    IonSpinner,
    IonSelect,
    IonSelectOption,
    useIonViewWillEnter, // ⭐️ IMPORT THIS HOOK
    IonButton,
    IonModal,
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import { getDonations } from "../../services/api";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import QrScanner from "qr-scanner";
import qrScannerWorkerPath from "qr-scanner/qr-scanner-worker.min.js?url";

QrScanner.WORKER_PATH = qrScannerWorkerPath;

// ... (Interface and Map definitions remain the same)
interface Donation {
    itemID: string;
    itemType: string;
    condition: string;
    category?: string;
    status: string;
    createdAt: string;
    donorInfo: {
        name: string;
    };
    blockchain?: { status: string };
}

const ALL_STATUSES = ["Pending", "Accepted", "In Transit", "Delivered"];

const CATEGORY_MAP: Record<string, string> = {
    electronics: "Electronics & Gadgets",
    school: "School Supplies",
    books: "Books & Learning Materials",
    uniforms: "Uniforms & Clothing",
    Uncategorized: "Uncategorized (Other)",
};

const ALL_CATEGORIES = Object.keys(CATEGORY_MAP); 

const AdminDonations: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    
    // Initialize status filter from URL on mount
    const initialStatus = new URLSearchParams(location.search).get('status') || 'All';
    const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
    
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [showScanner, setShowScanner] = useState(false);

    // 1. ⭐️ CENTRALIZED FETCH FUNCTION
    const fetchDonations = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getDonations();

            // Normalize data (similar to your previous logic)
            const validData: Donation[] = data
                .map((d: any) => ({
                    itemID: d.offchain?.itemID || d.itemID,
                    itemType: d.offchain?.itemType || d.itemType || "N/A",
                    condition: d.offchain?.condition || d.condition || "N/A",
                    category: d.offchain?.category || d.category || "Uncategorized",
                    status: d.blockchain?.status || d.status || "Pending",
                    createdAt: d.offchain?.createdAt || d.createdAt || new Date().toISOString(),
                    donorInfo: {
                        name: d.offchain?.donorInfo?.name || d.donorInfo?.name || "Unknown Donor",
                    },
                }))
                .filter((d: Donation) => d.itemID && d.donorInfo.name !== "Unknown Donor");

            setDonations(validData);
        } catch (err) {
            console.error("Error fetching donations:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. ⭐️ USE IONIC LIFECYCLE HOOK FOR REFRESHING
    // This will fetch data every time the tab/view is entered.
    useIonViewWillEnter(() => {
        fetchDonations();
        
        // Also handle the initial URL query parameter and clean it up after initial load
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status') || 'All';
        setStatusFilter(status);
        if (location.search.includes('status=')) {
             // Clean the URL so subsequent tab switches don't re-apply the filter unnecessarily
            history.replace(location.pathname); 
        }
    });

    // 🔹 Memoized filtered list (unchanged, depends on state)
    const filteredDonations = useMemo(() => {
        let list = donations;

        // 1. Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter(d =>
                d.donorInfo.name.toLowerCase().includes(term) ||
                d.itemType.toLowerCase().includes(term)
            );
        }

        // 2. Status Filter
        if (statusFilter !== "All") {
            list = list.filter(d => d.status === statusFilter);
        }

        // 3. Category Filter
        if (categoryFilter !== "All") {
            list = list.filter(d => d.category?.toLowerCase() === categoryFilter.toLowerCase());
        }

        // Sort by most recent for easier viewing (assuming a createdAt field exists)
        list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return list;
    }, [donations, searchTerm, statusFilter, categoryFilter]);


    // Helper function to get color based on status (unchanged)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'danger';
            case 'Accepted': return 'warning';
            case 'In Transit': return 'primary';
            case 'Delivered': return 'success';
            default: return 'medium';
        }
    };

    // ✅ Handle QR scan result
    const handleScanResult = (result: any) => {
        if (result?.text) {
        const scannedItemID = result.text.trim();
        console.log("✅ Scanned QR Code:", scannedItemID);
        setShowScanner(false);
        history.push(`/admin/donations/${scannedItemID}`);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Donations</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <h2 className="page-heading">Donation Management</h2>

                <IonButton
                    expand="block"
                    color="primary"
                    onClick={() => setShowScanner(true)}
                    style={{ marginBottom: "15px" }}
                    >
                    Scan QR Code
                </IonButton>
                <IonButton
                    expand="block"
                    color="secondary"
                    onClick={() => document.getElementById("qr-upload")?.click()}
                    >
                    Upload QR Code
                    </IonButton>

                    <input
                    id="qr-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadedImage(file);

                        try {
                        const imageUrl = URL.createObjectURL(file);
                        const result = await QrScanner.scanImage(imageUrl, { returnDetailedScanResult: true });
                        URL.revokeObjectURL(imageUrl);

                        if (result) {
                        const scannedText = result.data.trim(); // ✅ FIXED
                        console.log("✅ Scanned from uploaded image:", scannedText);
                        history.push(`/admin/donations/${scannedText}`);
                        } else {
                        alert("❌ No QR code detected in image.");
                        }
                        } catch (err: any) {
                            console.error("Error reading QR image:", err);
                            alert(`❌ Failed to decode QR code.\n${err?.message || "Try another image."}`);
                        }
                    }}
                />

                <IonModal isOpen={showScanner} onDidDismiss={() => setShowScanner(false)}>
                    <IonHeader>
                        <IonToolbar>
                        <IonTitle>Scan Donation QR</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <BarcodeScannerComponent
                            width={400}
                            height={400}
                            onUpdate={(err: any, result: any) => {
                                if (result) {
                                const scannedText =
                                    typeof result === "string"
                                    ? result.trim()
                                    : result.getText().trim();

                                console.log("✅ Scanned QR Code:", scannedText);
                                setShowScanner(false);
                                history.push(`/admin/donations/${scannedText}`);
                                } else if (err) {
                                console.error("❌ Scanner Error:", err);
                                }
                            }}
                            />
                        <IonButton
                        expand="block"
                        color="medium"
                        onClick={() => setShowScanner(false)}
                        style={{ marginTop: "20px" }}
                        >
                        Close Scanner
                        </IonButton>
                    </IonContent>
                </IonModal>

                {/* Searchbar */}
                <IonSearchbar
                    placeholder="Search by donor or item..."
                    value={searchTerm}
                    onIonInput={(e) => setSearchTerm(e.detail.value!)}
                />

                {/* Filter Controls Container */}
                <div className="filter-controls" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    
                    {/* Status Filter */}
                    <IonItem style={{ flex: 1, minWidth: 0 }}>
                        <IonLabel position="stacked">Status</IonLabel>
                        <IonSelect 
                            value={statusFilter} 
                            placeholder="All Statuses" 
                            onIonChange={e => setStatusFilter(e.detail.value)}
                        >
                            <IonSelectOption value="All">All Statuses</IonSelectOption>
                            {ALL_STATUSES.map(s => <IonSelectOption key={s} value={s}>{s}</IonSelectOption>)}
                        </IonSelect>
                    </IonItem>

                    {/* Category Filter */}
                    <IonItem style={{ flex: 1, minWidth: 0 }}>
                        <IonLabel position="stacked">Category</IonLabel>
                        <IonSelect 
                            value={categoryFilter} 
                            placeholder="All Categories" 
                            onIonChange={e => setCategoryFilter(e.detail.value)}
                        >
                            <IonSelectOption value="All">All Categories</IonSelectOption>
                            {ALL_CATEGORIES.map(key => (
                                <IonSelectOption 
                                    key={key} 
                                    value={key}
                                >
                                    {CATEGORY_MAP[key]}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                </div>

                {/* Donation List */}
                {loading ? (
                    <IonSpinner name="crescent" />
                ) : (
                    <IonList className="donations-list">
                        {filteredDonations.length === 0 ? (
                            <IonItem>
                                <IonLabel>No donations found matching the current filters.</IonLabel>
                            </IonItem>
                        ) : (
                            filteredDonations.map((donation) => (
                                <IonItem
                                    key={donation.itemID}
                                    button
                                    onClick={() => history.push(`/admin/donations/${donation.itemID}`)}
                                >
                                    <IonLabel>
                                        <h2>{donation.donorInfo.name}</h2>
                                        <p>
                                            {donation.itemType} • {donation.condition.toUpperCase()}
                                        </p>
                                    </IonLabel>
                                    <IonNote slot="end" color={getStatusColor(donation.status)}>
                                        <strong>{donation.status}</strong>
                                        <p style={{ color: 'var(--ion-color-step-500)', fontSize: '0.7em', marginTop: '2px' }}>
                                            {new Date(donation.createdAt).toLocaleDateString()}
                                        </p>
                                        <IonIcon icon={chevronForwardOutline} className="arrow-icon" style={{ verticalAlign: 'middle' }} />
                                    </IonNote>
                                </IonItem>
                            ))
                        )}
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    );
};

export default AdminDonations;