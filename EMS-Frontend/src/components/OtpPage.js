import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router';
import useAuth from '../helpers/useAuth';

const OTPVerification = () => {
  const navigate = useNavigate();
  const {isLoggedIn, decodedToken } = useAuth();
  const numInputs = 6;
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [verificationResult, setVerificationResult] = useState('');
  const [alert, setAlert] = useState('');
  const inputRefs = useRef([]);
  const cursorPosition = useRef(0);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const isVerified = JSON.parse(localStorage.getItem('isVerified'));
    if (isVerified) {
      navigate('/');
    }
  }, [navigate]);

  const requestOTP = async () => {
    try { 
      const channelId = localStorage.getItem('otpChannelId');
      const reqBody = {
          requestId: String(Date.now()),
          otpRequestId: String(Date.now()),
          channelId: channelId,
          email: decodedToken.email,
          deliveryFlag: "E",
          serviceType: "N"
      }

      const headers = {
          'Access-Control-Allow-Origin': 'http://localhost:3000/',
          'Access-Control-Allow-Credentials': true,
          'content-type': 'application/json'
        }

         
      const endpoint=`https://9yecdsf6u1.execute-api.us-east-2.amazonaws.com/api/v1/generateOtp`;
      const res = await axios.post(endpoint, reqBody, {headers})
           
      if (!res.data.statusCode) {
        localStorage.setItem('otpRequestId', res.data.data.otpRequestId);
        setVerificationResult({error: false, type: 'gen', message: 'OTP sent successfully. Please check your email.'});
      } else {
        setVerificationResult({error: true, type: 'gen', message: res.data.info.message});
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs);

    requestOTP(); // Send a request for OTP when the page loads

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && cursorPosition.current > 0) {
          setOTP((prevOTP) => {
            const updatedOTP = [...prevOTP];
            updatedOTP[cursorPosition.current + 1] = ''; // Update the OTP one position earlier
            return updatedOTP;
          });
          cursorPosition.current -= 1; // Decrement the cursor position
          inputRefs.current[cursorPosition.current].focus(); // Set the focus to the previous input field
        }
      };
       

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOTPChange = (e, index) => {
    if (e.target.value.match(/^\d*$/)) {
      if (e.target.value === '') {
        // Clear the input and update cursor position
        setOTP((prevOTP) => {
          const updatedOTP = [...prevOTP];
          updatedOTP[index] = '';
          return updatedOTP;
        });
      } else {
        // Set the entered digit and move focus forward
        if (index < numInputs - 1) {
          cursorPosition.current = index + 1;
          inputRefs.current[cursorPosition.current].focus();
        }
        setOTP((prevOTP) => {
          const updatedOTP = [...prevOTP];
          updatedOTP[index] = e.target.value;
          return updatedOTP;
        });
      }
    }
  };

  const resendOTP = async () => {
    try {
      requestOTP();
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault(); // Prevent form submission
    const enteredOTP = otp.join('');

    if (enteredOTP.length !== 6) {
      setAlert('Please enter a 6-digit OTP.');
      return;
    }

    try {
        const otpRequestId = localStorage.getItem('otpRequestId');
        const channelId = localStorage.getItem('otpChannelId');

        const reqBody = {
            requestId: String(Date.now()),
            otpRequestId: otpRequestId,
            channelId: channelId,
            otp: CryptoJS.SHA256(enteredOTP).toString(CryptoJS.enc.Base64)
        }

        const headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000/',
            'Access-Control-Allow-Credentials': true,
            'content-type': 'application/json'
            }

            
        const endpoint=`https://dikva7nni2.execute-api.us-east-2.amazonaws.com/api/v1/validateOtp`;
        const res = await axios.post(endpoint, reqBody, {headers})
            
        if (!res.data.statusCode) {
            localStorage.removeItem('otpRequestId');
            localStorage.setItem('isVerified', 'true');
            navigate('/');
        } else {
            setVerificationResult({error: true, type: 'val', message: res.data.info.message});
        }

    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="mt-8 space-y-6">
        {verificationResult?.error && (
          <p className="text-center mt-2 text-red-500">{verificationResult.message}</p>
        )}
        {verificationResult && !verificationResult.error && (
          <p className="text-center mt-2 text-green-500">{verificationResult.message}</p>
        )}

      <div className="rounded-md shadow-md p-4">
        <h2 className="text-2xl font-semibold text-center mb-4">OTP Verification</h2>
        <form className="space-y-4" onSubmit={verifyOTP}>
        <p className="text-black-600 text-center">Please enter a 6-digit OTP.</p>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: numInputs }).map((_, index) => (
              <input
                ref={(ref) => (inputRefs.current[index] = ref)}
                key={index}
                type="text"
                className="p-2 mx-1 border rounded-md text-center"
                placeholder=""
                value={otp[index]}
                onChange={(e) => handleOTPChange(e, index)}
                maxLength="1"
                pattern="[0-9]*"
                style={{ 'height': '5rem', 'width': '4rem', 'fontSize': '1.5rem' }}
                disabled={verificationResult.type == 'gen' && verificationResult.error}
              />
            ))}
          </div>
          <button
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            type="submit" disabled={verificationResult.type == 'gen' && verificationResult.error}
          >
            Verify OTP
          </button>
          <button
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-4"
            onClick={resendOTP}
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
