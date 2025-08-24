import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter
} from "react-router-dom";
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Dashboard from './components/EventsDashboard';
import OtpPage from './pages/Otp';
import EventDetails from './components/EventDetails';
import LandingPage from './components/LandingPage';
import SuccessfulPayment from './components/SuccesfulPayment';
import UserProfile from './components/UserProfile';
import MyEvents from './components/MyEvents';
import MyOrders from './components/MyOrders';
import MapComponent from './components/Map';
import CreateEvent from './components/CreateEvent';

function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path="/createEvent" element={<CreateEvent/>}/>
            <Route path="/map" element={<MapComponent/>}/>
            <Route path="/myBookings" element={<MyOrders/>} />
            <Route path="/myEvents" element={<MyEvents/>} />
            <Route path="/userProfile" element={<UserProfile/>} />
            {/* Add Payment failure page */}
            <Route path="/payment/success" element={<SuccessfulPayment/>} />
            <Route path="/" element={<LandingPage/>} />
            <Route path="/event/:eventId" element={<EventDetails/>} />
            <Route path="/events" element={<Dashboard/>}/>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/verifyOtp" element={<OtpPage/>} />
        </Routes>
      </BrowserRouter>
  </>
  );
}

export default App;
