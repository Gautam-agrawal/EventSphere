import React, { useEffect, useState } from 'react';
import useAuth from '../helpers/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './NavBar';
import DatePicker from "react-datepicker";
import { TagsInput } from "react-tag-input-component";
import "react-datepicker/dist/react-datepicker.css";
import './CreateEvent.css'

const CreateEvent = () => {
    const {isLoggedIn, decodedToken} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [image, setImage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selected, setSelected] = useState([]);
    const [secretId, setSecretId] = useState(null);


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


        const chatEndpoint = `https://out4tyvu01.execute-api.us-east-2.amazonaws.com/api/v1/chat/signup`;
        const body = {
            requestId: String(Date.now()),
            username: decodedToken.user,
            secret: decodedToken.userId
        };
        
        
        const resp = await axios.post(chatEndpoint, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        setSecretId(decodedToken.userId)



        const createChatEndpoint = `https://evi9rg1459.execute-api.us-east-2.amazonaws.com/api/v1/chat/create`;
        const reqbody = {
            requestId: String(Date.now()),
            title: formData.eventName,
            username: decodedToken.user,
            secret: decodedToken.userId
        };
        console.log({reqbody})
        
        
        const response = await axios.post(createChatEndpoint, reqbody, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(response)
        



        selectedDate.setHours(formData.timeHour);
        selectedDate.setMinutes(formData.timeMin)
        selectedDate.setSeconds(0);
        
        const storeEventEndpoint = `https://xfyxc8kgm1.execute-api.us-east-2.amazonaws.com/api/v1/event`;
        const requestData = {
            requestId: String(Date.now()),
            title: formData.eventName,
            description: formData.description,
            image: image || undefined,
            datetime: selectedDate.getTime().toString(),
            location: formData.location,
            organizer: decodedToken.organizerName,
            price: formData.price,
            maxSeats: formData.maxSeats,
            maxWaitlist: formData.maxWaitlist,
            address: formData.address,
            tags: selected,
            createdBy: decodedToken.userId,
            chatId: response.data.id,
            chatAccessKey: response.data.access_key,
            };
        
        console.log(requestData)
        const res = await axios.post(storeEventEndpoint, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(res)
        // if (res.status === 201 && !res.data.statusCode) {
        //     navigate("/events")
        //     return;
        // }
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


    return (
        <>
        <Navbar/>
    <div className='container-fluid p-4 m-4'>
        <form onSubmit={handleSubmit}>
            <div class="space-y-12">
                <div class="border-b border-gray-900/10 pb-12">
                    <h1 class="text-4xl pb-5 text-center">Create Event</h1>

                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-4">
                            <label for="eventName" class="block text-sm font-medium leading-6 text-gray-900">Event Name</label>
                            <div class="mt-2">
                                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600 sm:max-w-md">
                                <input type="text" name="eventName" id="eventName" autocomplete="eventName" onChange={handleInputChange} class="pl-2 block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder='Event Name'/>
                                </div>
                            </div>
                        </div>

                        <div class="col-span-full">
                            <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                            <div class="mt-2">
                                <textarea id="description" name="description" rows="3" onChange={handleInputChange} class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"></textarea>
                            </div>
                            <p class="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about the event.</p>
                        </div>

                        <div class="col-span-full">
                            <label for="photo" class="block text-sm font-medium leading-6 text-gray-900">Event Pic</label>
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
                    <h2 class="text-base font-semibold leading-7 text-gray-900">More Information</h2>
                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-3 flex">
                            <div className='mt-2'>
                                <label for="firstName" class="block text-sm font-medium leading-6 text-gray-900">Event Date</label>
                                <DatePicker style={{width: "100%"}}  className='pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2' selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                            </div>
                            <div className='mt-2'>
                                <label for="time" className='block mx-3 text-sm font-medium leading-6 text-gray-900'> Time</label>
                                <div className='mx-3 flex' style={{width: '10rem'}}>
                                    <input
                                        type="number"
                                        id="timeHour"
                                        name="timeHour"
                                        required
                                        autoComplete="off"
                                        placeholder="HH"
                                        min={0}
                                        max={23}
                                        onChange={handleInputChange}
                                        title="Enter a valid 24-hour time (HH:mm)"
                                        class="px-2 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                    />
                                    <input
                                        type="number"
                                        id="timeMin"
                                        name="timeMin"
                                        required
                                        autoComplete="off"
                                        placeholder="MM"
                                        min={0}
                                        max={59}
                                        onChange={handleInputChange}
                                        title="Enter a valid 24-hour time (HH:mm)"
                                        class="px-2 block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                    />
                                </div>
                            </div>
                            {/* <div className='mt-2' style={{width: '5.5rem'}}>
                                <label for="toTime">To Time:</label>
                                <input
                                    type="number"
                                    id="fromTime"
                                    name="fromTime"
                                    required
                                    autoComplete="off"
                                    placeholder="HH"
                                    min={0}
                                    max={23}
                                    title="Enter a valid 24-hour time (HH:mm)"
                                    class="px-2 mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                />
                                <input
                                    type="number"
                                    id="fromTime"
                                    name="fromTime"
                                    required
                                    autoComplete="off"
                                    placeholder="MM"
                                    min={0}
                                    max={59}
                                    title="Enter a valid 24-hour time (HH:mm)"
                                    class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
                                />
                            </div> */}
                        </div>

                        <div class="sm:col-span-3">
                            <label for="location" class="block text-sm font-medium leading-6 text-gray-900">Location</label>
                            <div class="mt-2">
                                <input type="text" name="location" id="location" autocomplete="location" onChange={handleInputChange} class="pl-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
                            <div class="mt-2">
                                <input type="text" name="address" id="address" autocomplete="address" onChange={handleInputChange} class="pl-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="organizer" class="block text-sm font-medium leading-6 text-gray-900">Organizer</label>
                            <div class="mt-2">
                                <input id="organizer" name="organizer" type="text" autocomplete="organizer" disabled value={decodedToken.organizerName} class="pl-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Price</label>
                            <div class="mt-2">
                                <input type="number" name="price" id="price" onChange={handleInputChange} class="pl-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="col-span-2">
                            <label for="maxSeats" class="block text-sm font-medium leading-6 text-gray-900">Maximum Seats</label>
                            <div class="mt-2">
                                <input type="number" name="maxSeats" required id="maxSeats" autocomplete="maxSeats" onChange={handleInputChange} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="col-span-2">
                            <label for="maxWaitlist" class="block text-sm font-medium leading-6 text-gray-900">Maximum Waitlists</label>
                            <div class="mt-2">
                                <input type="number" name="maxWaitlist" required id="maxWaitlist" autocomplete="maxWaitlist" onChange={handleInputChange} class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div class="col-span-full">
                            <label for="exampletags" class="inline-block mb-2">Tags</label>
                            <TagsInput
                                value={selected}
                                onChange={setSelected}
                                name="tags"
                                placeHolder="Event Tags"
                                style={''}
                            />
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
    </>
  );
};

export default CreateEvent;
