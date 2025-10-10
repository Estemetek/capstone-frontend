import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import {
  home,
  heart,
  searchCircle,
  person,
  helpCircle,
  settings,
} from "ionicons/icons";

// Shared pages
import Login from "./pages/shared/login";
import Signup from "./pages/shared/signup";

// Donor pages
import Tab1 from "./pages/donor/Tab1";
import Tab2 from "./pages/donor/Tab2";
import Tab3 from "./pages/donor/Tab3";
import Tab4 from "./pages/donor/Tab4";
import Tab5 from "./pages/donor/Tab5";
import AddDonation from "./pages/donor/AddDonation";
import DonationDetail from "./pages/donor/DonationDetail";

// Admin pages
import AdminHome from "./pages/admin/AdminHome";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminDonationDetail from "./pages/admin/AdminDonationDetail";
import AdminBeneficiaries from "./pages/admin/AdminBeneficiaries";
import AdminDonors from "./pages/admin/AdminDonors";
import AdminRegisterDonor from "./pages/admin/AdminAddDonor";

// Services
import ProtectedRoute from "./services/ProtectedRoute";

// Ionic CSS
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact();

// A separate component for admin tabs
const AdminTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/admin/home" component={AdminHome} />
      <Route exact path="/admin/donations" component={AdminDonations} />
      <Route exact path="/admin/donations/:itemID" component={AdminDonationDetail} />
      <Route exact path="/admin/analytics" component={AdminAnalytics} />
      <Route exact path="/admin/settings" component={AdminSettings} />
      <Route exact path="/admin/donors" component={AdminDonors} />
      <Route exact path="/admin/register-donor" component={AdminRegisterDonor} />

      {/* Add this route for AdminBeneficiaries inside tabs outlet */}
      <Route exact path="/admin/beneficiaries" component={AdminBeneficiaries} />

      <Redirect exact from="/admin" to="/admin/home" />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="admin-home" href="/admin/home">
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="admin-donations" href="/admin/donations">
        <IonIcon icon={heart} />
        <IonLabel>Donations</IonLabel>
      </IonTabButton>
      <IonTabButton tab="admin-analytics" href="/admin/analytics">
        <IonIcon icon={searchCircle} />
        <IonLabel>Analytics</IonLabel>
      </IonTabButton>
      <IonTabButton tab="admin-settings" href="/admin/settings">
        <IonIcon icon={settings} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Shared routes */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />

        {/* Donor routes */}
        <ProtectedRoute
          path="/tabs"
          requiredRole="donor"
          component={() => (
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/tabs/tab1" component={Tab1} />
                <Route exact path="/tabs/tab2" component={Tab2} />
                <Route exact path="/tabs/tab3" component={Tab3} />
                <Route exact path="/tabs/tab4" component={Tab4} />
                <Route exact path="/tabs/tab5" component={Tab5} />
                <Route exact path="/tabs/add-donation" component={AddDonation} />
                <Route exact path="/tabs/donation/:id" component={DonationDetail} />
                <Redirect exact from="/tabs" to="/tabs/tab1" />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tabs/tab1">
                  <IonIcon icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tabs/tab2">
                  <IonIcon icon={heart} />
                  <IonLabel>Donations</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tabs/tab3">
                  <IonIcon icon={searchCircle} />
                  <IonLabel>Trace</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab4" href="/tabs/tab4">
                  <IonIcon icon={helpCircle} />
                  <IonLabel>Help</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab5" href="/tabs/tab5">
                  <IonIcon icon={person} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          )}
        />

        {/* Admin routes */}
        <ProtectedRoute path="/admin" requiredRole="admin" component={AdminTabs} />

        {/* Standalone Admin Beneficiaries route */}
        <ProtectedRoute
          exact
          path="/admin/beneficiaries"
          requiredRole="admin"
          component={AdminBeneficiaries}
        />

        {/* Default route */}
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
