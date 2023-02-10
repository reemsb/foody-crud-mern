

import './App.scss';
import React from 'react';
import SnackForm from './components/SnackForm.tsx'

// React Notification
import { NotificationContainer } from 'react-notifications';
import SnackList from './components/SnackList.tsx';



function App() {
  return (
    <div className="App">
      <div> 
        <h1>Foody App with MERN</h1>
      </div>
      <SnackForm/>
      <SnackList/>
      <NotificationContainer/>
    </div>
  );
}

export default App;
