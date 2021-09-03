import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './DebForm.css';
const DebateForm = ({userInfo}) => {

    const [title,Altertitle]=useState('');
    const [Description,AlterDesc]=useState('');
    const { id }=useParams();
    
    useEffect(()=>{
        console.log('ran')
        fetch(`http://localhost:3005/getdebdata/${id}`)
        .then(response=>response.json())
        .then(response=>{
            Altertitle(response[0].topic)
            AlterDesc(response[0].overview)
        })
        .catch(err=>{
            Altertitle("")
            AlterDesc("")
        })
    },[])

    const HandleTitle=(evt)=>{
        Altertitle(evt.target.value);
    }

    const HandleDescription=(evt)=>{
        AlterDesc(evt.target.value);
    }

    const SendData=(recieved_flag)=>{
        console.log(id);
        if(id&&title&&Description&&recieved_flag)
        {
        fetch(`http://localhost:3005/deletedeb/${id}`)
        .then(response=>response.json())
        .then(response=>{
            fetch('http://localhost:3005/save',{
                method:'post',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                uniqid:id,
                title:title,
                overview:Description,
                publishedat:new Date().toLocaleDateString(),
                publisher:userInfo[0].name,
                flag:recieved_flag
            })
        })
        .then(response=>response.json())
        .then(response=>{
                console.log(response)
                window.location.href=`/DebPage/${id}`;
            })
            .catch(err=>{
                window.location.href='/';
            })
        })
        .catch(err=>{
            console.log('An error has occured!')
        })}
    }
    return (
        <div className="form1">
        <h1 className="hh">Start a New Debate!</h1>
            <form>
                <h2 className="tp">Specify the topic!</h2>
                <input type="text" className="inp" onChange={HandleTitle} value={title}/>
                <h2 className="dsp">Now,Give Some of your views about it!</h2>
                <textarea className="txt" onChange={HandleDescription}>{Description}</textarea>
                <div className="btnn">
                    <button onClick={()=>SendData('saved')} className="sv">Save</button>
                </div>
            </form>
        </div>
    );
}
export default DebateForm;
