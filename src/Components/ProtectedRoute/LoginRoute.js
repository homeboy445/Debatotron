import React from 'react';
import {Route,Redirect} from 'react-router-dom';
const LoginRoute = ({auth,HandleAuth,component:Component,...rest}) => {
    return <Route {...rest} render={()=>{
        return auth?<Redirect to="/"/>:<Component HandleAuth={HandleAuth}/>
    }}/>
}

export default LoginRoute;