module.exports = {
    '000': {
        code: '000',
        message: 'Success',
        displayText: 'OTP generated successfully',
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
        message: 'OTP Generation limit exceeded',
        displayText: 'OTP Generation limit exceeded',
        errorType: 'B'
    },
    '009': {
        code: '009',
        message: 'Duplicate OTP request ID',
        displayText: 'Duplicate OTP request ID',
        errorType: 'B'
    },
    '010': {
        code: '010',
        message: 'Error in sending email OTP',
        displayText: 'Error in sending email OTP',
        errorType: 'T'
    }
}