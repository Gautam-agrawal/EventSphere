module.exports = {
    '000': {
        code: '000',
        message: 'Success',
        displayText: 'Event Stored successfully',
        errorType: ''
    },
    '001': {
        code: '001',
        message: 'Error in inserting key in redis',
        displayText: 'Error in inserting key in redis',
        errorType: 'T'
    },
    '003': {
        code: '003',
        message: 'Invalid base64 format for the image. Please provide a valid base64-encoded image.',
        displayText: 'Invalid base64 format for the image. Please provide a valid base64-encoded image.',
        errorType: 'B'
    },
    '002': {
        code: '002',
        message: 'Error while saving in the database',
        displayText: 'Something went wrong',
        errorType: 'T'
    },
    '004': {
        code: '004',
        message: 'Bad request',
        displayText: 'Bad request',
        errorType: 'B'
    },
    '005': {
        code: '005',
        message: 'Method not allowed',
        displayText: 'Method not allowed',
        errorType: 'B'
    },
    '006': {
        code: '006',
        message: 'Unexpected Error',
        displayText: 'Something went wrong',
        errorType: 'T'
    }
}