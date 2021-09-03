import React,{ useState } from 'react';
import DisplayPage from '../Home1/DisplayHome';
import SignIn from '../SignIn/SignIn';
import Register from '../Register/Register';
import ForgotPassword from '../ForgePassword/ForgotPass';

const AuthRouter = ({ HandleAuth }) => {
    const [Display_Page,Change_State]=useState('');
    let render_it;
    const Change_Display=(state)=>{
        Change_State(state);
    }
    switch(Display_Page)
    {
        case 'SignIn':render_it=<SignIn Change_Display={ Change_Display } HandleAuth={ HandleAuth }/>; break;
        case 'Register':render_it=<Register Change_Display={ Change_Display } HandleAuth={ HandleAuth }/>; break;
        case 'ForgotPassword':render_it=<ForgotPassword Change_Display={ Change_Display }/>; break;
        default:render_it=<DisplayPage/>;
    }
    return (
        <div>    
            { render_it }
        </div>
    );
}

export default AuthRouter;