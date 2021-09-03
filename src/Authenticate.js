import React,{ useState } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Menu from './Components/Menu/MenuFiles';
import AuthRouter from './Components/Home1/AuthRouter';
import './App.css';
 
const App=({HandleAuth,IsAuthorized})=>{

  let render=IsAuthorized?<Router><Menu/></Router>
  :<AuthRouter HandleAuth={HandleAuth}/>
  return (
    <div>
      {render}
    </div>
  );
}
export default App;
