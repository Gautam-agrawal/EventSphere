import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import useAuth from '../helpers/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import EventDetails from './EventDetails';
import { PiHandbagSimpleBold } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { ImClock } from "react-icons/im";
import { FiUnlock } from "react-icons/fi";
import { CiBookmarkPlus, CiBookmarkCheck } from "react-icons/ci";
import { MdDone } from "react-icons/md";
import axios from 'axios';
import Navbar from './NavBar';


const MyOrders = () => {
    const navigate = useNavigate();
    const isVerified = JSON.parse(localStorage.getItem('isVerified'));

    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState(null);
    const {isLoggedIn, decodedToken} = useAuth();
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

    const toggleBookmark = (e, eventId) => {
      e.preventDefault();
      e.stopPropagation();
      setBookmarkedEvents((prev) => {
        if (prev.includes(eventId)) {
          return prev.filter((id) => id !== eventId);
        } else {
          return [...prev, eventId];
        }
      });
    };


    const getDateString = (dateTimeString) => {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(new Date(dateTimeString));
      }

    const getEstTimeString = (dateTimeString) => {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(new Date(dateTimeString));
    }

    const filteredEvents = events
    ? events.filter((event) => {
        const cardText = isLoggedIn
        ? !event.isWaitlist
          ? 'Booked'
          : 'Waitlisted'
        : '';

        const combinedFields = `${event.title} ${event.organizer} $${event.price} ${event.location} ${getDateString(event.datetime)} ${getEstTimeString(event.datetime)} ${event.tags.join(' ')} ${cardText}`.toLowerCase();
        return combinedFields.includes(searchQuery.toLowerCase());
      })
    : [];


    useEffect(() => {
        // Function to fetch data from the API
        const fetchData = async () => {
            try {

                const myBookingsEndPoint = 'http://ec2-18-219-123-198.us-east-2.compute.amazonaws.com:6009/api/v1/utilityEvents';

                const requestData = {
                    requestId: String(Date.now()),
                    userId: decodedToken.userId,
                    type: "orders"
                    };
                
                const res = await axios.post(myBookingsEndPoint, requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (res.status === 200 && res.data.statusCode) {
                    console.log("You have no booked events", res.data)
                    navigate('/events');
                    return;
                }

                if (res.status === 500){
                    console.log("Some error occurred", res.data)
                    navigate('/events');
                    return;
                }

                setEvents(res.data.data.events)


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the fetch data function
        fetchData();
    }, []);


    if(!isVerified){
        localStorage.removeItem('jwtToken');
        navigate('/login');
        return;
    }

    return (
        <>
        <Navbar/>
      <div>
          <div className="w-11/12 md:w-3/4 lg:max-w-3xl m-auto mt-5">
          <h1 class="text-4xl pb-5 text-center">My Bookings</h1>
            <div className="relative z-30 text-base text-black">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keyword"
                className="mt-2 shadow-lg focus:outline-none rounded py-3 px-6 block w-full"
              />
              <div className="text-left absolute top-10 rounded-t-none rounded-b-2xl shadow bg-white divide-y w-full max-h-40 overflow-auto"></div>
            </div>
          </div>
          <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {/* Display events with a link to EventDetails component */}
            {filteredEvents &&
              filteredEvents.map((event) => {
                const isUserBooked = !event.isWaitlist && !event.isCancelled && event.isComplete;    
                const isUserCancelled = event.isComplete && event.isCancelled; 
                const isUserWaitlisted = event.isComplete && event.isWaitlist && !event.isCancelled;
                const isPaymentPending = !event.isComplete;         
                return (
                  <div className={`rounded overflow-hidden shadow-lg cursor-pointer`} style={{'min-height': '30rem'}}>
                    <img className="w-full h-48 object-cover" src={`data:image/jpeg;base64,${event.image}`} alt={event.title} />
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">{event.title}</div>
                      <div class="my-2 text-gray-600 flex justify-between">
                          <span className='text-sm'>${event.price}/person</span>
                      </div>
                      <div className='flex justify-start'>
                        <div className='mr-3'>
                          {isLoggedIn && (isUserBooked 
                              ?
                              <span class="bg-green-700 text-green-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-700 dark:text-green-300">Booked</span>
                              :
                              isUserWaitlisted
                              ?
                              <span class="bg-yellow-700 text-yellow-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-300">Waitlisted</span>
                              :
                              isUserCancelled
                              ?
                              <span class="bg-red-700 text-red-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-700 dark:text-red-300">Booking Cancelled</span>
                              :
                              <span class="bg-blue-700 text-blue-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-700 dark:text-blue-300">Payment Pending</span>

                              )
                          }
                        </div>
                        <div>
                          {isLoggedIn && isUserCancelled && event.isRefundComplete && <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Refunded</span>}
                          {isLoggedIn && isUserCancelled && !event.isRefundComplete && <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Refund Initiated</span>}
                        </div>
                      </div>
                      <div className='mt-3'>
                          <span className='text-sm'>Booking ID: {event.bookingId}</span>
                        </div>
                      <div className="grid grid-cols-2 mt-2 gap-4">
                          <div>
                              <p><FaRegCalendarAlt className='inline mr-2'/>{getDateString(event.datetime)}</p>
                              <p><ImClock className='inline mr-2'/>{getEstTimeString(event.datetime)} EST</p>
                          </div>
                          <div>
                              {event.waitlistArray.length || event.maxSeats === event.bookedSeatsArray.filter(booking => booking.isComplete).length ?
                                  <p className="text-md text-justify"><GiSandsOfTime className='inline mr-2'/> {event.maxWaitlist - event.waitlistArray.length}/{event.maxWaitlist}</p>
                                  :
                                  <p className="text-md text-justify"><FiUnlock className='inline mr-2'/> {event.maxSeats - event.bookedSeatsArray.filter(booking => booking.isComplete).length}/{event.maxSeats}</p>
                              }   
                              <p className="text-md text-justify"><PiHandbagSimpleBold className='inline mr-2'/> {event.organizer}</p>
                          </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            {!filteredEvents && <h1>No Bookings yet!</h1>}
          </div>
        </div>
        </>
      );
};

export default MyOrders;
