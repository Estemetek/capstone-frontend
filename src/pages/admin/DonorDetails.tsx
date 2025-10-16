// DonorDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Use this to get the ID from the URL
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBackButton, IonButtons } from "@ionic/react";
import { getDonorDetails, getDonations, User, BlockchainDonation } from "../../services/api";

// Assuming User interface is available from services/api.ts
interface DonorDetailsType extends User {
    address?: string;
    govIdType?: string;
    govIdUrl?: string;
    createdAt?: string;
}

const DonorDetails: React.FC = () => {
    // Get the 'id' from the URL (e.g., /admin/donors/60f8...)
    const { id } = useParams<{ id: string }>();
    const [donor, setDonor] = useState<DonorDetailsType | null>(null);
    const [donations, setDonations] = useState<BlockchainDonation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                // 1. Fetch Donor Details
                const donorData = await getDonorDetails(id);
                setDonor(donorData as DonorDetailsType);

                // 2. Fetch Donor's Donations
                const donationData = await getDonations(id); // Reusing getDonations with a donorID filter
                setDonations(donationData);

            } catch (err: any) {
                console.error("Error fetching donor details:", err);
                setError(`Failed to load details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <IonContent className="ion-padding">Loading donor details...</IonContent>;
    if (error) return <IonContent className="ion-padding" color="danger">Error: {error}</IonContent>;
    if (!donor) return <IonContent className="ion-padding">Donor not found.</IonContent>;

    // Helper to format date
    const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/admin/donors" />
                    </IonButtons>
                    <IonTitle>{donor.name}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Contact & Registration Info</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList lines="none">
                            <IonItem>
                                <IonLabel>Email</IonLabel>
                                <IonNote slot="end">{donor.email}</IonNote>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Contact No.</IonLabel>
                                <IonNote slot="end">{donor.contactNo || 'N/A'}</IonNote>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Address</IonLabel>
                                <IonNote slot="end">{donor.address || 'N/A'}</IonNote>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Member Since</IonLabel>
                                <IonNote slot="end">{formatDate(donor.createdAt)}</IonNote>
                            </IonItem>
                        </IonList>
                    </IonCardContent>
                </IonCard>

                <IonCard style={{ marginTop: '20px' }}>
                    <IonCardHeader>
                        <IonCardTitle>Verification</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList lines="none">
                            <IonItem>
                                <IonLabel>Gov ID Type</IonLabel>
                                <IonNote slot="end">{donor.govIdType || 'N/A'}</IonNote>
                            </IonItem>
                            <IonItem href={donor.govIdUrl} target="_blank" disabled={!donor.govIdUrl}>
                                <IonLabel color={donor.govIdUrl ? "primary" : "medium"}>
                                    View Gov ID
                                    <p>Click to open the provided government ID document.</p>
                                </IonLabel>
                            </IonItem>
                        </IonList>
                    </IonCardContent>
                </IonCard>

                <IonCard style={{ marginTop: '20px' }}>
                    <IonCardHeader>
                        <IonCardTitle>Donation History ({donations.length})</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            {donations.length === 0 ? (
                                <IonItem><IonLabel>No donations recorded yet.</IonLabel></IonItem>
                            ) : (
                                donations.map((donation) => (
                                    <IonItem key={donation.itemID} detail routerLink={`/admin/donations/${donation.itemID}`}>
                                        <IonLabel>
                                            <h3>{donation.itemType}</h3>
                                            <p>Condition: {donation.condition}</p>
                                        </IonLabel>
                                        <IonNote slot="end">{formatDate(donation.timestamp)}</IonNote>
                                    </IonItem>
                                ))
                            )}
                        </IonList>
                    </IonCardContent>
                </IonCard>

            </IonContent>
        </IonPage>
    );
};

export default DonorDetails;