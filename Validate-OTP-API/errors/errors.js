module.exports = {
    '000': {
        code: '000',
        message: 'Success',
        displayText: 'OTP validated successfully',
        errorType: ''
    },
    '001': {
        code: '001',
        message: 'Error in inserting key in redis',
        displayText: 'Error in inserting key in redis',
        errorType: 'T'
    },
    '002': {
        code: '002',
        message: 'Error in fetching value from redis',
        displayText: 'Error in fetching value from redis',
        errorType: 'T'
    },
    '003': {
        code: '003',
        message: 'Error in fetching TTL from redis',
        displayText: 'Error in fetching TTL from redis',
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
    },
    '007': {
        code: '007',
        message: 'Invalid Channel ID',
        displayText: 'Invalid Channel ID',
        errorType: 'B'
    },
    '008': {
        code: '008',
        message: 'Invalid OTP',
        displayText: 'Invalid OTP',
        errorType: 'B'
    },
    '009': {
        code: '009',
        message: 'Invalid Request ID',
        displayText: 'Invalid Request ID',
        errorType: 'B'
    },
    '010': {
        code: '010',
        message: 'OTP Expired. Please generate a new OTP.',
        displayText: 'OTP Expired. Please generate a new OTP.',
        errorType: 'B'
    },
    '011': {
        code: '011',
        message: 'OTP Invalid Attempts Exceeded',
        displayText: 'OTP Invalid Attempts Exceeded',
        errorType: 'B'
    },
    '012': {
        code: '012',
        message: 'Error in deleting key from redis',
        displayText: 'Error in deleting key from redis',
        errorType: 'T'
    },
}