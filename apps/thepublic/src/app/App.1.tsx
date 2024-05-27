// apps/thepublic/src/app/App.1.tsx

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { RemoteHubProvider } from './frontend/context/RemoteHubContext';
import TopBar from './frontend/content/Utils/TopBar/TopBar';
import BottomBar from './frontend/content/Utils/BottomBar/BottomBar';
import styles from './App.module.scss';

const NetworkTrafficLog = lazy(() => import('./frontend/content/Network/NetworkTrafficLog'));
const CommunitySocialNetwork = lazy(() => import('./frontend/content/CommunitySocialNetwork'));
const MapComponent = lazy(() => import('./frontend/content/MapComponent'));
const StatisticsComponent = lazy(() => import('./frontend/content/StatisticsComponent'));
const NetworkCustomization = lazy(() => import('./frontend/content/Network/_pages/NetworkCustomization'));
const AccountOverview = lazy(() => import('./frontend/content/account/AccountOverview'));
const AccountUpdate = lazy(() => import('./frontend/content/account/AccountUpdate'));
const ChangePassword = lazy(() => import('./frontend/content/account/ChangePassword'));
const NotFound = lazy(() => import('./frontend/content/Utils/NotFound/NotFound'));

const App: React.FC = () => {
  return (
    <RemoteHubProvider>
      <Router>
        <div className={styles.app}>
          <TopBar />
          <div className={styles.content}>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path="/" exact component={NetworkCustomization} />
                <Route path="/account/overview" component={AccountOverview} />
                <Route path="/account/update" component={AccountUpdate} />
                <Route path="/account/change-password" component={ChangePassword} />
                <Route path="/network-traffic-log" component={NetworkTrafficLog} />
                <Route path="/community-social-network" component={CommunitySocialNetwork} />
                <Route path="/map-component" component={MapComponent} />
                <Route path="/statistics-component" component={StatisticsComponent} />
                <Route path="/404" component={NotFound} />
                <Redirect to="/404" />
              </Switch>
            </Suspense>
          </div>
          <BottomBar />
        </div>
      </Router>
    </RemoteHubProvider>
  );
};

export default App;