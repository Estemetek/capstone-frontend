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

import { home, heart, searchCircle, person, helpCircle } from "ionicons/icons";

// 🔹 Shared pages
import Login from "./pages/shared/login";
import Signup from "./pages/shared/signup";

// 🔹 Donor pages
import Tab1 from "./pages/donor/Tab1";
import Tab2 from "./pages/donor/Tab2";
import Tab3 from "./pages/donor/Tab3";
import Tab4 from "./pages/donor/Tab4";
import Tab5 from "./pages/donor/Tab5";
import AddDonation from "./pages/donor/AddDonation";
import DonationDetail from "./pages/donor/DonationDetail";

/* Core CSS required for Ionic components to work */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Shared routes */}
        <Route path="/login" component={Login} exact />
        <Route path="/signup" component={Signup} exact />

        {/* Donor routes with tabs */}
        <Route
          path="/tabs"
          render={() => (
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

        {/* Default route */}
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
