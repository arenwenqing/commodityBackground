import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login';
import AddCommodity from './components/AddCommodity';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path="/commodityBackground/login" component={Login} />
        <Route path="/commodityBackground/addCommodity" component={AddCommodity} />
        <Redirect from="/" to="/commodityBackground/login" />
      </Switch>
      <div className='bottom'>
        <a 
          href="https://beian.miit.gov.cn/" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '12px',
            display: 'block',
            textAlign: 'center',
            background: 'rgb(240, 242, 245)',
            padding: '20px 0'
          }}
        >
          京ICP备2021021747号-1
        </a>
      </div>
    </div>
  );
};

export default App;