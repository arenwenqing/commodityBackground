import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login';
import AddCommodity from './components/AddCommodity';

const App = () => {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/addCommodity" component={AddCommodity} />
      <Redirect from="/" to="/login" />
    </Switch>
  );
};

export default App;