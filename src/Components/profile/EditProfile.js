import React,{useState,useEffect,useRef} from 'react';
import './Profile.css';

const EditProfile = ({user,ToggleDisplay}) => {
    const [about,changeAbout]=useState('');
    const [access,changeAccess]=useState('');
    const [image,changeImage]=useState('');
    const Accessmode=useRef(null);

    const UpdateProfile=()=>{
        fetch(`http://localhost:3005/UpdateProfile`,{
            method:'post',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
            user:user,
            access:Accessmode.current.value,
            About:about,
            image:image
        })})
        .then(response=>response.json())
        .then(response=>{
            console.log(response);
            ToggleDisplay(true);
        })
        .catch(err=>{
            console.log(err);
        })
    }
    const HandleInputChange=(event)=>{
        if(!event.target.value.trim()){
            changeAbout("");
            return;
        }
        changeAbout(event.target.value);
    }

    const HandleImageChange=(evt)=>{
        if(!evt.target.value.trim()){
            return;
        }
        changeImage(evt.target.value);
    }

    useEffect(()=>{
        fetch(`http://localhost:3005/profile_Data/${user}`)
        .then(response=>response.json())
        .then(response=>{
            if(response[0].name)
            {
                changeAbout(response[0].about);
                changeAccess(response[0].access);
            }
            else
            {
                throw 'Failed To Load!';
            }
        })
        .catch(err=>{
            changeAbout('An error has occured!');
            changeAccess('An error has occured!');
        })
    },[]);

    return (
        <div className="editPro">
        <h1 className="edt_pro_hdr">Edit Your Profile!</h1>
        <div className="edt_pro_flx">
        <h2 className="edt_pro_img">Edit Image:</h2>
        <input type="text" className="input1" 
        placeholder="Enter Link!"
        onChange={HandleImageChange}
        />
        </div>
        <div className="edt_pro_flx_1">
        <h2>Enter About me Info:</h2>
        <textarea value={about} className="input2" onChange={HandleInputChange}>
        </textarea> 
        </div>
        <div className="acs">
        <h2 className="edt_pro_sts">You're Current Choosen Access for your profile is:<span className="edt_pro_sts_s">{access}</span></h2>
        <select ref={Accessmode} className="edt_pro_sel">
            <option value="public" className="edt_pro_opt1">Public</option>
            <option value="private" className="edt_pro_opt2">Private</option>
        </select>
        <button className="butn_11" onClick={UpdateProfile}>Update</button>
        </div>
        </div>
    );
}

export default EditProfile;
