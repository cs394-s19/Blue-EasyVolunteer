import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css'
import EventForm from './components/CreateEvent'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'



const routing = (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/newEvent" component={EventForm} />
    </div>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));
