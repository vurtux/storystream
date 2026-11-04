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

export { handleGetProfile } from '../auth';

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
