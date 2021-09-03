import React,{ useState } from 'react';
import './SignIn.css';

const SignIn = ({HandleAuth,Change_Display}) => {
    const [name,setName]=useState('');
    const [password,setPassword]=useState('');
    const [stat,set]=useState('');
    const HandleName=(e)=>{
        if(e.target.value.trim())
        {
            setName(e.target.value);
        }
        else{
            setName('');
        }
    }
    const HandlePassword=(e)=>{
        if(e.target.value.trim())
        {
            setPassword(e.target.value);
        }
        else
        {
            setPassword('');
        }
    }
    const HandleSubmit=(event)=>{
        event.preventDefault();
        fetch('http://localhost:3005/signin',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            email:name,
            password:password
        })})
        .then(response=>response.json())
        .then(response=>{
            console.log(response);
                var obj={
                    data:response.id,
                    state:true
                }
                HandleAuth(obj);
        })
        .catch(err=>{
            set("Something's Wrong!");
            setInterval(()=>{
                set("")
            },3000);
        })
        setName('');
        setPassword('');
    }
    return (
        <div className="wrap-backg">
        <a href="/register" className="rgs" onClick={()=>Change_Display('Register')}>Register</a>
        <div className="wrapper">
            <h1>Sign-In</h1>
            <form onSubmit={HandleSubmit}>
                <input type="text" 
                placeholder="Email"
                onChange={HandleName}
                value={name}
                required/>
                <input type="password" 
                placeholder="Password"
                onChange={HandlePassword}
                value={password}
                required/>
                <p className="pst">{stat}</p>
                <div className="jkk">
                <a href="/fp" className="lnk">Forgot password?</a>
                <input type="submit" value="Login"/>
                </div>
            </form>
        </div>
        </div>
    )
}

export default SignIn;