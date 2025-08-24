import React, { useEffect, useState } from 'react';
import useAuth from '../helpers/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './NavBar';

const UserProfile = () => {
    const {isLoggedIn, decodedToken} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
      
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result.split(',')[1]); // reader.result contains the base64-encoded image
          };
          reader.readAsDataURL(file);
        }
      };
      
    

    async function handleSubmit(e){
        e.preventDefault();
        const updateProfileEndpoint = `https://00qlol5bse.execute-api.us-east-2.amazonaws.com/api/v1/userProfile`;
        const requestData = {
            requestId: String(Date.now()),
            userId: decodedToken.userId,
            about: formData.about || undefined,
            userPic: image || undefined,
            country: formData.country || undefined,
            streetAddress: formData.streetAddress || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            zip: formData.zip || undefined
            };
        
        const res = await axios.post(updateProfileEndpoint, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(res)
        if (res.status === 200 && !res.data.statusCode) {
            window.location.reload(true);
            return;
        }
        localStorage.setItem('userProfile', res.data.userPic)
    }

    const cancelHandle = (e) => {
        navigate(-1); 
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    


    useEffect(() => {
        if(!isLoggedIn){
            localStorage.removeItem('jwtToken');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
          try {
            const response = await fetch(`https://5tkz3sakp3.execute-api.us-east-2.amazonaws.com/api/v1/userProfile/${decodedToken.userId}`);
            const data = await response.json();
            if (data && !data.statusCode){
                console.log(data.data )
                localStorage.setItem('userProfile', data.data.userPic);
                localStorage.setItem('lat', data.data.lat);
                localStorage.setItem('long', data.data.long);
                setFormData(data.data);
            }
            else{
                console.log("Something went wrong")
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);


    return (
        <>
        <Navbar userProfilePic={formData && formData.userPic}/>
    {formData &&
    (<div className='container-fluid p-4 m-4'>
        <form onSubmit={handleSubmit}>
            <div class="space-y-12">
                <div class="border-b border-gray-900/10 pb-12">
                    <h1 class="text-4xl pb-5 text-center">Profile</h1>
                    <h1 class="text-3xl pb-5">Hi {formData.firstName} {formData.lastName}</h1>

                    <div className='pt-5'>
                        <img src={`data:image/jpeg;base64,${formData.userPic}`} class="rounded-full shadow-lg" style={{'width': '12rem', 'height': '12rem'}}/>
                    </div>

                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-4">
                            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div class="mt-2">
                                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600 sm:max-w-md">
                                <input type="text" name="username" id="username" autocomplete="username" disabled class="pl-2 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" value={formData.email}/>
                                </div>
                            </div>
                        </div>

                        <div class="col-span-full">
                            <label for="about" class="block text-sm font-medium leading-6 text-gray-900">About</label>
                            <div class="mt-2">
                                <textarea id="about" name="about" rows="3" onChange={handleInputChange} class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6" value={formData.about}></textarea>
                            </div>
                            <p class="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                        </div>

                        <div class="col-span-full">
                            <label for="photo" class="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                            <div class="mt-2 flex items-center gap-x-3">
                                <svg class="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                                </svg>
                                <input type="file" onChange={handleImageChange} class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"/>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="border-b border-gray-900/10 pb-12">
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-3">
                            <label for="firstName" class="block text-sm font-medium leading-6 text-gray-900">First name</label>
                            <div class="mt-2">
                                <input type="text" name="first-name" id="first-name" autocomplete="given-name" disabled value={formData.firstName} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="lastName" class="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                            <div class="mt-2">
                                <input type="text" name="last-name" id="last-name" autocomplete="family-name" disabled value={formData.lastName} class="pl-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-4">
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div class="mt-2">
                                <input id="email" name="email" type="email" autocomplete="email" disabled value={formData.email} class="pl-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="country" class="block text-sm font-medium leading-6 text-gray-900">Country</label>
                            <div class="mt-2">
                                <select id="country" name="country" required autocomplete="country-name" value={formData.country} onChange={handleInputChange} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                <option>United States</option>
                                <option>Canada</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-span-full">
                            <label for="streetAddress" class="block text-sm font-medium leading-6 text-gray-900">Street address</label>
                            <div class="mt-2">
                                <input type="text" name="streetAddress" required id="streetAddress" autocomplete="streetAddress" onChange={handleInputChange} value={formData.streetAddress} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-2 sm:col-start-1">
                            <label for="city" class="block text-sm font-medium leading-6 text-gray-900">City</label>
                            <div class="mt-2">
                                <input type="text" name="city" required id="city" autocomplete="address-level2" value={formData.city} onChange={handleInputChange} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="state" class="block text-sm font-medium leading-6 text-gray-900">State / Province</label>
                            <div class="mt-2">
                                <input type="text" name="state" id="state" required autocomplete="address-level1" value={formData.state} onChange={handleInputChange} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="zip" class="block text-sm font-medium leading-6 text-gray-900">ZIP / Postal code</label>
                            <div class="mt-2">
                                <input type="text" required name="zip" id="zip" autocomplete="zip" value={formData.zip} onChange={handleInputChange} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" onClick={cancelHandle} class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                <button type="submit" class="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">Save</button>
            </div>
        </form>
    </div>
    )}
    </>
  );
};

export default UserProfile;
