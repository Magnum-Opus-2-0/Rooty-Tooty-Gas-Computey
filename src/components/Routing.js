import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import FindGas from './FindGas';
import GasMap from './GasMap.js';
import PlanYourTrip from './PlanYourTrip.js';

const RoutingPage = () => (
    <Router>
        <div>
            <Switch>
                <Route exact path="/"></Route>
                <Route exact path="/findgas" component={FindGas} />
                <Route exact path="/gasmap" component={GasMap} />
                <Route exact path="/planyourtrip" component={PlanYourTrip} />
            </Switch>
        </div>
    </Router>
)

export default RoutingPage;
