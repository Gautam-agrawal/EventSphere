import React from 'react';

const TimeSelector = ({ handleInputChange }) => {
  // Generate time options
  const generateTimeOptions = (startHour, endHour, interval, isMinutesIncluded = false) => {
    const options = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const formattedHour = String(hour).padStart(2, '0');
        const formattedMinute = String(minute).padStart(2, '0');
        const time = isMinutesIncluded ? `${formattedHour}:${formattedMinute}` : formattedHour;
        options.push(
          <option key={time} value={time}>
            {time}
          </option>
        );
      }
    }
    return options;
  };

  return (
    <div>
      <label htmlFor="fromTime">From Time:</label>
      <select
        id="fromTime"
        name="fromTime"
        required
        autoComplete="time"
        onChange={handleInputChange}
        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
      >
        {generateTimeOptions(6, 23, 1)}
      </select>

      <label htmlFor="toTime">To Time:</label>
      <select
        id="toTime"
        name="toTime"
        required
        autoComplete="time"
        onChange={handleInputChange}
        className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:max-w-xs sm:text-sm sm:leading-6 pl-2"
      >
        {generateTimeOptions(6, 23, 1, true)}
      </select>
    </div>
  );
};

export default TimeSelector;
