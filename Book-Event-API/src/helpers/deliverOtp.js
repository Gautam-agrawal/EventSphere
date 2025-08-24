const axios = require('axios');
const {emailAlertsUrl, emailAlertsTimeout,} = require('../../config/config');
const { infoLogger, errorLogger } = require('../../logger/logger');
const errors = require('../../errors/errors');
const { encrypt, getDateString, getEstTimeString } = require('./helperFunctions');

const axiosInstance = axios.create({
    timeout: emailAlertsTimeout,
    headers: {'Content-Type': 'application/json'},
  });

module.exports = async function(configurationObject){
    try{
        let {emailSubject, emailBody, user, type, name, bookingRefNo, datetime} = configurationObject;
        const dateString = `${getDateString(datetime)} ${getEstTimeString(datetime)} EST`
        emailBody = emailBody.replaceAll('{USER}', user)
                             .replaceAll('{TYPE}', type)
                             .replaceAll('{NAME}', name)
                             .replaceAll('{DATE_TIME}', dateString)
                             .replaceAll('{BOOKING_REFERENCE_NUMBER}', bookingRefNo);
        emailSubject = emailSubject.replaceAll('{TYPE}', type);

        emailSubject = encrypt(emailSubject);
        emailBody  = encrypt(emailBody);
        const requestBody = {
            requestId: configurationObject.requestId,
            email: configurationObject.email,
            subject: emailSubject,
            body: emailBody
        }
        infoLogger(configurationObject.id, configurationObject.requestId, 'Sending Email alert')
        const response = axiosInstance.post(emailAlertsUrl, requestBody)
                            .then(res => {
                                infoLogger(configurationObject.id, configurationObject.requestId, 'Succesfully sent an email');
                            })
                            .catch(err => {
                                errorLogger(configurationObject.id, configurationObject.requestId, `Failed to send an email | ${err.message}`, err);
                            });
        return {error: false, message: "Email alert request initiated"}
    }
    catch(err){
        errorLogger(configurationObject.id, configurationObject.requestId, `Failed to send an email | ${err.message}`, err);
        return {error: true, message: errors['010'].message, code: '010'}
    }
}