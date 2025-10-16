import React, { useState, useCallback } from "react";
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonChip,
    IonLabel,
    IonSpinner,
    useIonViewWillEnter, // ⭐️ IMPORT THE IONIC HOOK
} from "@ionic/react";
import { add, laptopOutline, cubeOutline, bagOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import { getDonations, BlockchainDonation } from "../../services/api";
import "./Tab2.css";

interface LocationState {
    donationSubmitted?: boolean;
}

const Tab2: React.FC = () => {
    const history = useHistory();
    const location = useLocation();

    const [donations, setDonations] = useState<BlockchainDonation[]>([]);
    const [filteredDonations, setFilteredDonations] = useState<BlockchainDonation[]>([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    // const userId = localStorage.getItem("userId");

    // 1. CENTRALIZED FETCH LOGIC (Slightly simplified since `useIonViewWillEnter` handles the load event)
    const fetchData = useCallback(async () => {
        setLoading(true); // Always show spinner when fetching on tab change

        const currentUserId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!currentUserId || !token) {
            // If no user/token, stop loading and potentially redirect to login
            console.warn("User ID or Token missing. Cannot fetch donations.");
            setLoading(false);
            // history.replace('/login'); // Optional: force redirect if token is missing
            return; 
        }

        try {
            // Use the newly read currentUserId
            const data = await getDonations(currentUserId); 
            const newDonations = data;
            setDonations(newDonations);

            // Re-apply the current filter after fetching new data
            if (filter === "All") {
                setFilteredDonations(newDonations);
            } else {
                setFilteredDonations(newDonations.filter((d) => d.status === filter));
            }
        } catch (err) {
            console.error("❌ Error fetching donations:", err);
        } finally {
            setLoading(false);

            // Clean up the history state flag after the fetch is complete
            const state = location.state as LocationState;
            if (state?.donationSubmitted) {
                // Using history.replace to remove the flag from history state
                history.replace(location.pathname, {});
            }
        }
    }, [filter, location.state, location.pathname, history]); 
    // NOTE: Removed `donations.length` from dependency array as it's no longer used for triggering the fetch, preventing unnecessary re-runs.

    // 2. ⭐️ USE IONIC LIFECYCLE HOOK FOR REFRESHING
    // This hook runs every time the component's view is about to be shown (i.e., when you click the tab).
    useIonViewWillEnter(() => {
        fetchData();
    });

    // ❌ REMOVE THE OLD `useEffect` HOOK. It's now redundant because the view-will-enter hook handles the refresh.

    // Handle filter change (updated to use the latest `donations` state correctly)
    const handleFilter = (status: string) => {
        setFilter(status);
        if (status === "All") {
            setFilteredDonations(donations);
        } else {
            setFilteredDonations(donations.filter((d) => d.status === status));
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Donations</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="donations-content">
                <h1 className="section-title">My Donations</h1>

                {/* Filters */}
                <div className="filters">
                    {["All", "Pending", "Accepted", "In Transit", "Delivered"].map((status) => (
                        <IonChip
                            key={status}
                            className={`filter-chip ${filter === status ? "active" : ""}`}
                            onClick={() => handleFilter(status)}
                        >
                            <IonLabel>{status}</IonLabel>
                        </IonChip>
                    ))}
                </div>

                {/* Loading Spinner */}
                {loading && (
                    <div className="ion-text-center ion-padding">
                        <IonSpinner name="crescent" />
                    </div>
                )}

                {/* Donation List */}
                {!loading && filteredDonations.length > 0 ? (
                    filteredDonations.map((donation) => (
                        <IonCard
                            key={donation.itemID}
                            className="donation-card"
                            button
                            onClick={() => history.push(`/tabs/donation/${donation.itemID}`)}
                        >
                            <IonCardContent className="donation-item">
                                <div className="donation-icon">
                                    <IonIcon
                                        icon={
                                            donation.itemType.toLowerCase().includes("laptop")
                                                ? laptopOutline
                                                : donation.itemType.toLowerCase().includes("bag")
                                                    ? bagOutline
                                                    : cubeOutline
                                        }
                                    />
                                </div>
                                <div className="donation-details">
                                    <h4>{donation.itemType}</h4>
                                    <p>Asset ID: {donation.itemID}</p>
                                </div>
                                <div
                                    className={`status-badge ${donation.status
                                        .toLowerCase()
                                        .replace(" ", "-")}`}
                                >
                                    {donation.status}
                                </div>
                            </IonCardContent>
                        </IonCard>
                    ))
                ) : (
                    !loading && (
                        <IonCard className="empty-card">
                            <IonCardContent className="empty-card-content">
                                <div className="empty-icon">
                                    <IonIcon icon={bagOutline} />
                                </div>
                                <div className="empty-text">
                                    <h4>You haven’t donated yet</h4>
                                    <p>Start making a difference today!</p>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )
                )}

                {/* Floating Add Donation Button */}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push("/tabs/add-donation")} color="primary">
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Tab2;