import React, { useState, useEffect } from 'react';
import useAuth from '../helpers/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Navbar = ({userProfilePic}) => {
  const [showNav, setShowNav] = useState(false);
  const [isCrossButton, setIsCrossButton] = useState(false);
  const { isLoggedIn, decodedToken } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState(userProfilePic);
  const navigate = useNavigate();
  const location = useLocation();
  const userPicDefault = localStorage.getItem('userProfile')

  const toggleNav = () => {
    setShowNav(!showNav);
    setIsCrossButton(!isCrossButton);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/')
  };

  useEffect(() => {
    console.log({userProfilePic})
    if (userProfilePic !== undefined) {
      setUserProfile(userProfilePic);
    }

  }, [userProfilePic]);


  useEffect(() => {
    const isScreenLarge = () => {
      return window.matchMedia("(min-width: 1024px)").matches;
    };

    const closeNavOnLargeScreen = () => {
      if (isScreenLarge() && showNav) {
        setShowNav(false);
        setIsCrossButton(false);
      }
    };

    window.addEventListener("resize", closeNavOnLargeScreen);

    return () => {
      window.removeEventListener("resize", closeNavOnLargeScreen);
    };
  }, [showNav]);


  return (
    <nav className="bg-white shadow-lg">
      <div className="container-lg mr-10 ml-5">
        <div className="flex justify-between items-center h-16">
          <div>
            <a href="/" className="text-purple-500 text-2xl font-semibold">
              <img
                alt=""
                className="h-12 w-12"
                src="https://ik.imagekit.io/pibjyepn7p9/Lilac_Navy_Simple_Line_Business_Logo_CGktk8RHK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649962071315"
              />
            </a>
          </div>
          <div className={`lg:hidden`}>
            <button onClick={toggleNav} className="text-gray-700 hover:text-purple-500">
              {isCrossButton ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" fill="none" stroke="currentColor" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" />
                </svg>
              )}
            </button>
          </div>
          {isLoggedIn ? (
            <div className="relative">
              <ul className='flex justify-around space-x-4 z-10'>
                {decodedToken.isAdmin && (location.pathname != '/createEvent') && (<li className='text-lg'><a href="/createEvent" className="text-purple-600 hover:text-purple-500" style={{'paddingTop': '0.2rem'}}>Create Event</a></li>)}
                {(location.pathname != '/events') && (<li className='text-lg'><a href="/events" className="text-purple-600 hover:text-purple-500" style={{'paddingTop': '0.2rem'}}>Events</a></li>)}
                {(location.pathname != '/myEvents') && (<li className='text-lg'><a href="/myEvents" className="text-purple-600 hover:text-purple-500" style={{'paddingTop': '0.2rem'}}>My Events</a></li>)}
                {(location.pathname != '/myBookings') && (<li className='text-lg'><a href="/myBookings" className="text-purple-600 hover:text-purple-500" style={{'paddingTop': '0.2rem'}}>My Bookings</a></li>)}
                <li onClick={toggleDropdown} className="cursor-pointer">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={`data:image/jpeg;base64,${userProfile || userPicDefault}`} alt=""/>
                </div>
                {/* <a className="text-purple-600 hover:text-purple-500">{decodedToken.user}</a> */}
                </li>
                </ul>
              {showDropdown && (
                <div className="absolute top-10 right-0 bg-white border shadow-md rounded-md p-2 z-10" style={{ width: '6.5rem' }}>
                  <div className="w-full text-purple-600 hover:text-purple-500 cursor-pointer z-10">
                    <FontAwesomeIcon icon="fa-regular fa-user" />
                    <Link to="/userProfile">
                      My Profile
                    </Link>
                    </div>
                  <div className="w-full text-purple-600 hover:text-purple-500 cursor-pointer" onClick={logout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`${showNav ? 'w-full lg:w-auto space-x-4 lg:space-x-0 fixed top-0 left-0 h-screen bg-white z-50' : 'hidden lg:flex'}`}>
              <ul className={`${showNav ? 'flex h-screen justify-center items-center flex-col' : 'flex justify-around space-x-4'}`}>
                <li className='text-lg'><a href="/events" className="text-purple-600 hover:text-purple-500 pr-5" style={{'paddingTop': '0.2rem'}}>Events</a></li>
                <li className='text-lg'><a href="/login" className="text-purple-600 hover:text-purple-500 pr-5" style={{'paddingTop': '0.2rem'}}>Login</a></li>
                <li className='text-lg'><a href="/signup" className="text-purple-600 hover:text-purple-500 pr-5" style={{'paddingTop': '0.2rem'}}>Sign up</a></li>
              </ul>
            </div>
          )}
          {showNav && (
            <div className="lg:hidden fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-40" onClick={toggleNav}></div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
