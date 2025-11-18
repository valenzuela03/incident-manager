"use client";
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { URL_API } from './CONSTANTS';
import Cookies from 'js-cookie';

interface UserProp {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    rating: number;
}

const UserContext = createContext<{
    user: UserProp | null;
    setUser: React.Dispatch<React.SetStateAction<UserProp | null>>;
    loading: boolean;
}>({
    user: null,
    setUser: () => {},
    loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProp | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching user data...");
    
        const fetchUser = async () => {
            const token = Cookies.get('authToken');
            console.log("Token:", token);
            if (token) {
                try {
                    const response = await axios.get(URL_API + "/user/getMyUser", {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    console.log("User data:", response.data.user);
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Error fetching user data', error);
                }
            }
            setLoading(false);
        };
    
        fetchUser();
    }, []);
    

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);