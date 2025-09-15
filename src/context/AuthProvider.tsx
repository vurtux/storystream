// context/AuthContext.tsx
'use client';

import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    Dispatch,
    SetStateAction,
} from 'react';
import { UserInfo } from '../types/user';

interface AuthState {
    userInfo: UserInfo | null;
}

interface loginDataProps {
    mobileNo: string;
    deviceId: string;
    isdCode: string;
}

interface AuthContextType {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
    authData: loginDataProps;
    setAuthData: Dispatch<SetStateAction<loginDataProps>>;
}

const defaultLoginData: loginDataProps = {
    mobileNo: '',
    deviceId: '',
    isdCode: ''
};

export const AuthContext = createContext<AuthContextType>({
    auth: { userInfo: null },
    setAuth: () => { },
    authData: defaultLoginData,
    setAuthData: () => { },
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthState>({ userInfo: null });
    const [authData, setAuthData] = useState<loginDataProps>({
        mobileNo: '',
        deviceId: '',
        isdCode: ''
    });

    useEffect(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            try {
                const userInfo: UserInfo = JSON.parse(userInfoStr);
                setAuth({ userInfo });
            } catch (err) {
                console.error('Error parsing userInfo:', err);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, authData, setAuthData }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
