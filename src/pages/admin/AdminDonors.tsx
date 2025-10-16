// AdminDonors.tsx (Revised with search and clickable items)
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonList, IonItem, IonLabel, IonSearchbar } from "@ionic/react";

// Define the expected structure of a donor object
interface Donor {
    _id: string; // The MongoDB ID is used for the route link
    name: string;
    email: string;
    contactNo: string;
    // Add other fields you might be fetching like 'role'
}

const AdminDonors: React.FC = () => {
    // Explicitly use the Donor interface for the state
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                // Assuming 'http://localhost:3000/api/users/donors' returns Donor[]
                const res = await axios.get<Donor[]>("http://localhost:3000/api/users/donors");
                setDonors(res.data);
            } catch (err: any) {
                console.error("Error fetching donors:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDonors();
    }, []);

    // Use useMemo to filter donors
    const filteredDonors = useMemo(() => {
        if (!searchTerm) {
            return donors;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return donors.filter(donor =>
            // Filter by donor name
            donor.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [donors, searchTerm]);

    if (loading) return <IonContent>Loading donors...</IonContent>;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Registered Donors</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* Search Bar Component */}
                <IonSearchbar
                    value={searchTerm}
                    onIonChange={e => setSearchTerm(e.detail.value!)}
                    placeholder="Search donors by name"
                    debounce={500}
                />
                
                {/* Conditional rendering for no donors/no search results */}
                {!donors.length && (
                    <div className="ion-padding">No donors registered yet.</div>
                )}
                {donors.length > 0 && !filteredDonors.length && (
                    <div className="ion-padding">No donors found matching "{searchTerm}".</div>
                )}
                
                {/* Display the filtered list */}
                {filteredDonors.length > 0 && (
                    <IonList>
                        {filteredDonors.map((donor) => (
                            // ⭐️ Key Changes for Clickability:
                            // 1. Use donor._id for the key.
                            // 2. Add 'detail' prop for the arrow icon.
                            // 3. Add 'routerLink' to navigate to the detail page.
                            <IonItem 
                                key={donor._id} 
                                detail 
                                routerLink={`/admin/donors/${donor._id}`}
                                button // Optional: gives a ripple/tap effect
                            >
                                <IonLabel>
                                    <h2>{donor.name}</h2>
                                    <p>{donor.email}</p>
                                    <p>{donor.contactNo}</p>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                )}

                <IonButton
                    expand="block"
                    color="primary"
                    routerLink="/admin/register-donor"
                    style={{ margin: "16px 0" }}
                >
                    Register a Donor Account
                </IonButton>
            </IonContent>
            <IonButton expand="block" color="medium" routerLink="/admin/settings" style={{ margin: "16px" }}>
                Back to Settings
            </IonButton>
        </IonPage>
    );
};

export default AdminDonors;