import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TopBar from './Utils/TopBar/TopBar';
import NetworkTrafficLog from './content/Network/NetworkTrafficLog';
import CommunitySocialNetwork from './content/CommunitySocialNetwork';
import MapComponent from './content/MapComponent';
import StatisticsComponent from './content/StatisticsComponent';
import NetworkCustomization from './content/Network/_pages/NetworkCustomization';
import AccountOverview from './account/AccountOverview';
import AccountUpdate from './account/AccountUpdate';
import ChangePassword from './account/ChangePassword';
import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.app}>
        <TopBar />
        <div className={styles.content}>
          <Switch>
            <Route path="/account/overview" component={AccountOverview} />
            <Route path="/account/update" component={AccountUpdate} />
            <Route path="/account/change-password" component={ChangePassword} />
            <Route path="/" component={NetworkCustomization} />
            <Route path="/network-traffic-log" component={NetworkTrafficLog} />
            <Route path="/community-social-network" component={CommunitySocialNetwork} />
            <Route path="/map-component" component={MapComponent} />
            <Route path="/statistics-component" component={StatisticsComponent} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;