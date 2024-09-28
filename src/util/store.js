
export const setRole = (role) => {
    localStorage.setItem('userRole', role);
};

export const getRole = () => {
    return localStorage.getItem('userRole');
};