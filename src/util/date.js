export const formatDate = (dateString) => {
    if(!dateString) return dateString;
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