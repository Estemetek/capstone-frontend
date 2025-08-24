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

import Login from "./pages/login";
import Signup from "./pages/signup";
import Tab1 from "./pages/Tab1";

/* Core CSS required for Ionic components to work */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
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
        {/* Login page */}
        <Route path="/login" component={Login} exact />

        {/* Signup page */}
        <Route path="/signup" component={Signup} exact />

        {/* Tabs (main app) */}
        <Route
          path="/tabs"
          render={() => (
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/tabs/tab1" component={Tab1} />
                <Redirect exact from="/tabs" to="/tabs/tab1" />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tabs/tab1">
                  <IonIcon aria-hidden="true" icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>

                <IonTabButton tab="tab2" href="/tabs/tab2">
                  <IonIcon aria-hidden="true" icon={heart} />
                  <IonLabel>Donations</IonLabel>
                </IonTabButton>

                <IonTabButton tab="tab3" href="/tabs/tab3">
                  <IonIcon aria-hidden="true" icon={searchCircle} />
                  <IonLabel>Trace</IonLabel>
                </IonTabButton>

                <IonTabButton tab="tab4" href="/tabs/tab4">
                  <IonIcon aria-hidden="true" icon={person} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>

                <IonTabButton tab="tab5" href="/tabs/tab5">
                  <IonIcon aria-hidden="true" icon={helpCircle} />
                  <IonLabel>Help</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          )}
        />

        {/* Default route → Login */}
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
