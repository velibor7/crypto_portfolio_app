import { useState } from 'react';

const useAuth = () => {

    const getToken = () => {
        const userToken = localStorage.getItem('token');
        return userToken && userToken
    }

    const getUserId = () => {
        const userId = localStorage.getItem('userId');
        return userId && userId
    }

    const [token, setToken] = useState(getToken());
    const [userId, setUserId] = useState(getUserId());
    
    const saveToken = (userToken, userId) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);

        localStorage.setItem('userId', userId);
        setUserId(userId);
    };

    const removeToken = () => {
        localStorage.removeItem("token");
        setToken(null);

        localStorage.removeItem("userId");
        setUserId(null);
    }

    return {
        token,
        userId,
        setToken: saveToken,
        removeToken
    }
}

export default useAuth;