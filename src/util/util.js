/** Miscelleanous Utility Functions */


// Helper function to truncate text
export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

//helper func to get urgency labels
export const getUrgencyLabel = (urgency) => {
    switch (urgency) {
        case 3:
            return "High";
        case 2:
            return "Med";
        case 1:
            return "Low";
        default:
            return "N/A";
    }
};