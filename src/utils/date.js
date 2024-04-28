export function sortObjectsByCreatedAt(data) {
    console.log(data);
    console.log(!data, typeof data !== 'object')
    if (!data || typeof data !== 'object') {
        // throw new TypeError('Invalid data argument. Please provide an object.');
        return;
    }
    // 2. Extract object values and filter (optional)
    const objects = Object.values(data).filter(obj => obj); // Remove falsy values (optional)

    // 3. Sort by createdAt (descending order: newest to oldest)
    return objects.sort((obj1, obj2) => new Date(obj1.createdAt) - new Date(obj2.createdAt));
}

export function getDayName(dateString) {
    const currentDate = new Date();
    const inputDate = new Date(dateString);
    
    // Function to check if two dates are on the same day
    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };
    
    // Function to get day name from a date
    const getDayNameFromDate = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    // Difference in milliseconds
    const diffInMs = currentDate - inputDate;
    // Convert difference to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (isSameDay(currentDate, inputDate)) {
        return 'Today';
    } else if (isSameDay(new Date(currentDate.getTime() - 86400000), inputDate)) {
        return 'Yesterday';
    } else if (diffInDays < 7) {
        return getDayNameFromDate(inputDate);
    } else {
        // If the date is more than a week ago, return the date in the format DD/MM/YYYY
        const day = inputDate.getDate();
        const month = inputDate.getMonth() + 1;
        const year = inputDate.getFullYear();
        return `${day}/${month}/${year}`;
    }
}