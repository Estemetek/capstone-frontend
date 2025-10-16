// AdminAnalytics.tsx
import "./AdminAnalytics.css";
import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonItem,
  IonList,
  IonSpinner,
} from "@ionic/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// interface Donation {
//   _id: string;
//   offchain?: {
//     category?: string;
//     donorInfo?: { email?: string; name?: string };
//   };
//   blockchain?: {
//     status?: string;
//     timestamp?: string;
//   };
// }
interface Donation {
  _id?: string;
  itemID?: string;
  status?: string;
  category?: string;
  offchain?: { category?: string };
  blockchain?: { status?: string };
}

const AdminAnalytics: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statusSummary, setStatusSummary] = useState({
    Pending: 0,
    Accepted: 0,
    "In Transit": 0,
    Delivered: 0,
  });
  const [donorCount, setDonorCount] = useState(0);

  // 🔹 Fetch donations and donors
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token"); // or sessionStorage
        if (!token) {
          throw new Error("No token found. Please log in first.");
        }

        const [donationsRes, donorsRes] = await Promise.all([
          fetch("http://localhost:3000/api/donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/users/count-donors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Check if unauthorized
        if (donationsRes.status === 401 || donorsRes.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }

        const donationData = await donationsRes.json();
        const donorData = await donorsRes.json();

        // 👇 Check if donationData is array
        if (!Array.isArray(donationData)) {
          console.error("Invalid donation data format:", donationData);
          return;
        }

        setDonations(donationData);
        setDonorCount(donorData.donorCount ?? 0);
        computeAnalytics(donationData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // 🔹 Compute status and category analytics
  const computeAnalytics = (donations: Donation[]) => {
    const statusCount = {
      Pending: 0,
      Accepted: 0,
      "In Transit": 0,
      Delivered: 0,
    };
    const categoryCount: Record<string, number> = {};

    donations.forEach((don: any) => {
      // ✅ Handle status (works for both flat and nested)
      const status =
        don.status ||
        don.blockchain?.status ||
        "Pending";
      if (statusCount.hasOwnProperty(status)) {
        statusCount[status as keyof typeof statusCount]++;
      }

      // ✅ Handle category (works for both flat and nested)
      const category =
        don.category ||
        don.offchain?.category ||
        "Uncategorized";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    setStatusSummary(statusCount);

    // Map to readable labels
    const categoryNameMap: Record<string, string> = {
      electronics: "Electronics & Gadgets",
      school: "School Supplies",
      books: "Books & Learning Materials",
      uniforms: "Uniforms & Clothing",
      Uncategorized: "Uncategorized",
    };

    const chartReady = Object.entries(categoryCount).map(([key, count]) => ({
      name: categoryNameMap[key] || key,
      Donations: count,
    }));

    setChartData(chartReady);
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <div className="center-spinner">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <>
            {/* 🔹 Category Bar Chart */}
            <h1 className="section-title">Total Donations</h1>
            <p className="section-subtitle">Total Donations Received by Type</p>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Donations" fill="#003366" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 🔹 Registered Donors */}
            <h2 className="section-title">Registered Donors</h2>
            <p className="donor-count">{donorCount}</p>

            {/* 🔹 Donation Status Summary */}
            <IonList className="status-summary">
              <IonItem lines="full">
                <IonLabel>Pending</IonLabel>
                <IonLabel slot="end">{statusSummary.Pending}</IonLabel>
              </IonItem>
              <IonItem lines="full">
                <IonLabel>Accepted</IonLabel>
                <IonLabel slot="end">{statusSummary.Accepted}</IonLabel>
              </IonItem>
              <IonItem lines="full">
                <IonLabel>In Transit</IonLabel>
                <IonLabel slot="end">{statusSummary["In Transit"]}</IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonLabel>Delivered</IonLabel>
                <IonLabel slot="end">{statusSummary.Delivered}</IonLabel>
              </IonItem>
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminAnalytics;
