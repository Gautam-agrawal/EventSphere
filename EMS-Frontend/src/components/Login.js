import { useState } from 'react';
import axios from 'axios';
import { loginFields } from "../constants/formFields";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";
import { useNavigate } from 'react-router-dom';
import useAuth from '../helpers/useAuth';

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

export default function Login(){
    const [loginState,setLoginState]=useState(fieldsState);
    const [alert, setAlert] = useState('');
    const [token, setToken] = useState(null);

    const navigate = useNavigate();

    const {isLoggedIn, user } = useAuth();
    if(isLoggedIn){
        navigate('/');
        return;
    }

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        authenticateUser(loginState);
    }

    //Handle Login API Integration here
    const authenticateUser = (loginState) =>{
        const postLogin = {
            requestId: String(Date.now()),
            email: loginState.emailAddress,
            password: loginState.password
        };

        const headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000/',
            'Access-Control-Allow-Credentials': true,
            'content-type': 'application/json'
          }

           
        const endpoint=`https://pjihxm1kma.execute-api.us-east-2.amazonaws.com/api/v1/login`;
         axios.post(endpoint,
            postLogin,
            {headers})
             .then(response=>{
                localStorage.setItem('jwtToken', response.data.data.token);
                setToken(response.data.data.token);
                localStorage.setItem('isVerified', 'false');
                localStorage.setItem('otpChannelId', 'LOGIN_MFA');
                navigate('/verifyOtp');
             })
             .catch(error=>{
                setAlert(error.response?.data?.info.displayText || 'Something went wrong');
             })
    
    }
    

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {alert && (
        <p className="text-red-600 text-center">{alert}</p>
        )}
            <div className="-space-y-px">
                {
                    fields.map(field=>
                            <Input
                                key={field.id}
                                handleChange={handleChange}
                                value={loginState[field.id]}
                                labelText={field.labelText}
                                labelFor={field.labelFor}
                                id={field.id}
                                name={field.name}
                                type={field.type}
                                isRequired={field.isRequired}
                                placeholder={field.placeholder}
                        />
                    
                    )
                }
            </div>
            <FormExtra/>
            <FormAction handleSubmit={handleSubmit} text="Login"/>
        </form>
    )
}