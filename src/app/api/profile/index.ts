import { requestApi } from '../../../utils/request';
import { API_KEYS, API_HEADERS } from '../../../utils/apiConfig';
import { getSessionToken, endSessionAndRedirectToLogin } from '../../../utils/sessionToken';

export { handleGetProfile } from '../auth';

interface ProfileUpdate {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
}

// The user comes from the login token on the server; no userId is sent. The mobile
// number is the login identity and can't be changed here.
export const handleUpdateProfile = async ({ firstName, lastName, email, gender }: ProfileUpdate) => {
    const token = getSessionToken();
    if (!token) {
        endSessionAndRedirectToLogin();
        throw new Error('Login expired');
    }

    try {
        return await requestApi({
            url: 'api/v1/storystream/SetProfile',
            method: 'POST',
            data: {
                email,
                firstname: firstName,
                lastname: lastName,
                gender,
            },
            headers: {
                'device-os': API_HEADERS.DEVICE_OS,
                'API-KEY': API_KEYS.FEED_AUTH,
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
            endSessionAndRedirectToLogin();
        }
        throw error;
    }
};
