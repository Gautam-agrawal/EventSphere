# Generate-OTP-API
API for generating OTP

API URL and Request/ response is in request.http file

Example Request Body
{
    "requestId": "123456sdf78986543", - random requestId for logging purpose. Needs to be passed by frontend.
    "otpRequestId": "123dd3drfdf", - random otpRequestId needs to be passed during OTP generation and validation.
    "channelId": "LOGIN_MFA", - Pass this channel only.
    "email": "rutvijUdemy@gmail.com", - User email
    "deliveryFlag": "E", - Pass this config only
    "serviceType": "N" - Pass this config only
}