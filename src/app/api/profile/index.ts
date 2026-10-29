import api from '../../../lib/axios';
import { requestApi } from '../../../utils/request';
import { API_KEYS, API_HEADERS } from '../../../utils/apiConfig';

interface homeProps {
    deviceId: string;
    langCode: string;
    mobileNo: string;
    isdCode: string;
    country: string;
}

export const handleSearch = async (payload: homeProps) => {

    const res = await api.post(`/api/v1/feed/GetHome/${API_KEYS.HOME_FEED}/web/${payload?.country || "ZA"}/en`, payload);
    return res.data;
};

export const handleGetProfile = async (userId?: string) => {
    let resolvedUserId = userId;
    if (!resolvedUserId && typeof window !== 'undefined') {
        try {
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            resolvedUserId = loginData?.profile?.userId?.toString();
        } catch (e) {
            console.error("Error reading loginData:", e);
        }
    }

    if (!resolvedUserId) {
        return null;
    }

    return await requestApi({
        url: 'api/v1/feed/GetProfile',
        method: 'POST',
        data: {
            userId: resolvedUserId,
        },
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.CONTENT_FEED,
        },
    });
};

export const handleUpdateProfile = async ({
    userId,
    firstName,
    lastName,
    email,
    phone,
    countryCode,
    isdCode,
    gender
}: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    isdCode: string;
    gender: string;
}) => {
    return await requestApi({
        url: 'api/v1/feed/setProfile',
        method: 'POST',
        data: {
            userId,
            email,
            mobileNo: phone,
            isdCode,
            firstname: firstName,
            lastname: lastName,
            gender,
        },
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.CONTENT_FEED,
        },
    });
};
