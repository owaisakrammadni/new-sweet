import React from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import {useGlobalStateUpdate} from "../../context/globalContext"


function Logout(){
    const GlobalStateUpdate = useGlobalStateUpdate()
    const history = useHistory()
    function logout(){

        axios({
            method:"post",
            url:"http://localhost:5000/logout",
            withCredentials:true
        }).then((response)=>{
            GlobalStateUpdate(prev =>({
                ...prev,
                loginStatus:false,
                role:null
            }))
            history.push("/login")
        }).catch((error)=>{
            console.log(error)
        })
    }
    return (
        <div>
            <a className="btn btn-outline-primary "  onClick={logout}>Logout<span className="sr-only">(current)</span></a>
        </div>
    )
}
export default Logout;  
