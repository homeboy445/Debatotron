import React,{useState,useRef} from 'react';
import {Redirect} from 'react-router-dom';
import './Register.css';
const Register = ({ HandleAuth,Change_Display }) => {
    const [name,ChangeName]=useState('');
    const [email_1,ChangeEmail]=useState('');
    const [password_1,ChangePassword]=useState('');
    const [answer_1,ChangeAns]=useState('');
    const [state,set]=useState('Enter your Credentials!');
    const recovery_1=useRef(null);

    const HandleChange_1=(event)=>{
        if(event.target.value.trim())
        {ChangeName(event.target.value);}
        else{ChangeName('')}
    }
    const HandleChange_2=(event)=>{
        if(event.target.value.trim()){
        ChangeEmail(event.target.value);}
        else{ChangeEmail('')}
    }
    const HandleChange_3=(event)=>{
        if(event.target.value.trim()){
        ChangePassword(event.target.value);}        
        else{ChangePassword('')}
    }
    const HandleChange_4=(event)=>{
        if(event.target.value.trim()){
        ChangeAns(event.target.value);}
        else{ChangeAns('')}
    }
    const HandleSubmit=(event)=>{
        event.preventDefault();
        fetch('http://localhost:3005/register',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            user:name,
            password:password_1,
            email:email_1,
            recovery:recovery_1.current.value,
            answer:answer_1
        })})
        .then(response=>response.json())
        .then(response=>{
            if(response[0].name)
            { 
                window.location.href="/signin";
            }
            else
            {
                throw 'Error!';
            }
        })
        .catch(err=>{
            set("Something's Wrong,Try again!");
            setTimeout(()=>{
                set('Enter your Credentials!')
            },3000);
        });
        ChangeAns('');
        ChangeEmail('');
        ChangeName('');
        ChangePassword('');
    }
    return (
        <div className="wrap-backg-reg">
        <div className="wrapper-reg">
            <h1>Register</h1>
            <form onSubmit={HandleSubmit}>
                <input type="text" placeholder="UserName"  
                onChange={HandleChange_1}
                value={name}
                required/>
                <input type="text" placeholder="Email" 
                onChange={HandleChange_2}
                value={email_1}
                required/>
                <input type="password" className="psw"
                placeholder="Password"
                value={password_1} 
                onChange={HandleChange_3}
                required/>
                <h2>Please Choose from below questions!</h2>
                <select ref={recovery_1}>
                    <option>choose your recovery question</option>
                    <option value="What is you pet's name?">What is you pet's name?</option>
                    <option value="What is favourite game?">What is favourite game?</option>
                    <option value="What is your favourite dish?">What is your favourite dish?</option>
                    <option value="What is your hobby?">What is your hobby?</option>
                </select>
                <input type="text" value={answer_1} placeholder="Enter your Answer!" 
                className="ans" 
                onChange={HandleChange_4}
                required/>
                <p className="stat">{state}</p>
                <div className="g">
                <input type="submit" value="Register"/>
                <p>Or</p>
                <a href="/signin" className="sngg" onClick={()=>Change_Display('SignIn')}>Sign-In</a>
                </div>
            </form>
        </div>
        </div>
    );
}

export default Register;