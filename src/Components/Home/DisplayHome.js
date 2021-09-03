import React from 'react';
import './Display.css';
const DisplayHome=({Change_Display})=>{
    return (
        <div className="Displayit">
        <div className="btns">
            <button onClick={()=>Change_Display('SignUp')} className="btn1">Sign up</button>
            <button onClick={()=>Change_Display('Register')}className="btn2">Log in</button>
        </div>
        <h1 className="hdr1">The <span>Debatotron,</span></h1>
            <div className="Mainer">
                <p className="pg">Well, We Debate , We eat , We Sleep , We Chill & We Repeat!
                Join this Community of over 100+ People sharing Knowledge about
                Various Topics & Enjoying themselves out in the process!</p>
                <div className="sng">
                <h2>So JOIN IN! to Get the Taste of Greatness & Enthusiasm!</h2>
                </div>
            </div>
        </div>
    );
}

export default DisplayHome;
