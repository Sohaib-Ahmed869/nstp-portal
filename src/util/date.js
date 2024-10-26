export const formatDate = (dateString) => {
    if (!dateString) return dateString;
    try {
        const date = new Date(dateString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        console.log("datestring which caused the error: ", dateString)
        return dateString; //return the original string if error occurs
    }
};

export const getCurrentDateTime = () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    return `${formattedDate}, ${formattedTime}`;
};



//helper func to calc if complaint can be re opened or not
export const isWithin72Hours = (dateResolved) => {
    if (!dateResolved) return false;
    const resolvedDate = new Date(dateResolved);
    const currentDate = new Date();
    const timeDifference = currentDate - resolvedDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference <= 72;
};

//Helper func to convert MTTR minutes into hours or days if needed.
export const formatMTTR = (minutes) => {
    if (minutes >= 1440) { // 1440 minutes in a day
        const days = (minutes / 1440).toFixed(1);
        return { number: days, unit: 'days' };
    } else if (minutes >= 60) { // 60 minutes in an hour
        const hours = (minutes / 60).toFixed(1);
        return { number: hours, unit: 'hours' };
    } else {
        return { number: minutes, unit: 'minutes' };
    }
};