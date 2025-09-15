import api from '../../../lib/axios';
import { requestApi } from '../../../utils/request';

interface homeProps {
    deviceId: string;
    langCode: string;
    mobileNo: string;
    isdCode: string;
}

export const handleSearch = async (payload: homeProps) => {

    const res = await api.post('/api/v1/feed/GetHome/a995570eea6c716c8305ea42213a853d/web/IN/en', payload);
    return res.data;
};

export const handleGetProfile = async () => {
    return await requestApi({
        url: 'api/v1/feed/GetProfile',
        method: 'POST',
        data: {
            "userId": "17193448"
        },
        headers: {
            'device-os': 'web',
            'API-KEY': 'eb3fb92a88badce847f88fb8c9bb9be6',
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
            'device-os': 'web',
            'API-KEY': 'eb3fb92a88badce847f88fb8c9bb9be6',
        },
    });
};
