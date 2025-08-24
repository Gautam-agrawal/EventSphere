module.exports = {
    '000': {
        code: '000',
        message: 'Success',
        displayText: 'Booked Successfully',
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
        message: 'Event/Venue not found.',
        displayText: 'Event/Venue not found.',
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
    },
    '007': {
        code: '007',
        message: 'Waitlist exceeded',
        displayText: 'Waitlist exceeded',
        errorType: 'B'
    },
    '008': {
        code: '008',
        message: 'Succesfully added to waitlist',
        displayText: 'Successfully added to waitlist',
        errorType: ''
    },
    '009': {
        code: '009',
        message: 'Venue is not between available times',
        displayText: 'Venue is not between available times',
        errorType: 'B'
    },
    '010': {
        code: '010',
        message: 'Booking already exists at that timeslot.',
        displayText: 'Booking already exists at that timeslot.',
        errorType: 'B'
    },
    '011': {
        code: '011',
        message: 'User has already booked event/venue.',
        displayText: 'User has already booked event/venue.',
        errorType: 'B'
    },
    '012': {
        code: '012',
        message: 'User not found',
        displayText: 'User not found',
        errorType: 'B'
    },
    '013': {
        code: '013',
        message: 'User has booked but payment not completed',
        displayText: 'User has booked but payment not completed',
        errorType: 'B'
    }
}