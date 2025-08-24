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
import Navbar from './NavBar';




const Dashboard = () => {
    const navigate = useNavigate();
    const isVerified = JSON.parse(localStorage.getItem('isVerified'));

    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState(null);
    const {isLoggedIn, decodedToken} = useAuth();
    // const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

    // const toggleBookmark = (e, eventId) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   setBookmarkedEvents((prev) => {
    //     if (prev.includes(eventId)) {
    //       return prev.filter((id) => id !== eventId);
    //     } else {
    //       return [...prev, eventId];
    //     }
    //   });
    // };


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
        const combinedFields = `${event.title} ${event.organizer} $${event.price} ${event.location} ${getDateString(event.datetime)} ${getEstTimeString(event.datetime)} ${event.tags.join(' ')}`.toLowerCase();
        return combinedFields.includes(searchQuery.toLowerCase());
      })
    : [];


    useEffect(() => {
        // Function to fetch data from the API
        const fetchData = async () => {
            try {
                const response = await fetch('http://ec2-18-219-123-198.us-east-2.compute.amazonaws.com:6003/api/v1/events');
                const data = await response.json();
                setEvents(data.data.events);
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
            {filteredEvents &&
              filteredEvents.filter(event => new Date(event.datetime) >= new Date()).map((event) => {
                console.log(event.createdBy, decodedToken.userId, event.createdBy == decodedToken.userId)
                const isUserBooked = event.bookedSeatsArray.some(
                  (booking) => booking.user._id === decodedToken.userId && booking.isComplete);


                const isUserWaitlisted = event.waitlistArray.some(
                  (waitlist) => waitlist.user._id === decodedToken.userId && waitlist.isComplete);

                // const isBookmarked = bookmarkedEvents.includes(event._id);   

                return (<Link key={event._id} to={`/event/${event._id}`} className="text-decoration-none">
                  <div className={`rounded overflow-hidden shadow-lg cursor-pointer`} style={{'min-height': '30rem'}}>
                    <img className="w-full h-48 object-cover" src={`data:image/jpeg;base64,${event.image}`} alt={event.title} />
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">{event.title}</div>
                      <div class="my-2 text-gray-600 flex justify-between">
                          <span className='text-sm'>${event.price}/person</span>
                            {event.createdBy === decodedToken.userId && <span class="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">Organizer</span>}
                      </div>
                      <div>
                        {isLoggedIn && (isUserBooked 
                            &&
                              <span class="bg-green-700 text-green-300 text-xs font-medium me-2 px-2.5 py-0.5 my-2 rounded dark:bg-green-700 dark:text-green-300">Booked</span>)
                        }
                        {isLoggedIn && (isUserWaitlisted
                              &&
                              <span class="bg-yellow-700 text-yellow-300 text-xs font-medium me-2 px-2.5 py-0.5 my-2 rounded dark:bg-yellow-700 dark:text-yellow-300">Waitlisted</span>)
                          }
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
                      <div class="px-0 pt-4">
                          {event.tags.map((tag) => (
                              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
                          ))}
                      </div>
                    </div>
                  </div>
                </Link>)
              })}
          </div>
        </div>
        </>
      );
};

export default Dashboard;
