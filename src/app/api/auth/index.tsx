import { requestApi } from "../../../utils/request";
import { API_KEYS, API_HEADERS } from "../../../utils/apiConfig";

interface loginProps {
    deviceId: string;
    langCode: string;
    mobileNo: string;
    isdCode: string;
}
interface mdnProps {
    mobileNo: string;
    isdCode: string;
}

interface verifyProps extends loginProps {
    otp: string;
    last_login_source: string;
}
interface validateProps {
    sid: string;
}

export const handleLogin = async (payload: loginProps) => {
    return await requestApi({
        url: 'api/v2/feed/GetOTP',
        method: 'POST',
        data: payload,
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.FEED_AUTH,
        },
    });
};
export const ValidateMDN = async (payload: mdnProps) => {
    return await requestApi({
        url: 'api/v1/storystream/ValidateMDN',
        method: 'POST',
        data: payload,
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.FEED_AUTH,
        },
    });
};

export const handleVerification = async (payload: verifyProps) => {
    return await requestApi({
        url: 'api/v1/storystream/ValidateOTP',
        method: 'POST',
        data: payload,
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.FEED_AUTH,
        },
    });
};

export const handleValidate = async (payload: validateProps) => {
    return await requestApi({
        url: 'api/v1/storystream/ValidateSSO',
        method: 'POST',
        data: payload,
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.FEED_AUTH,
        },
    });
};

// Takes the token from the login response. Do not send userId.
export const handleGetProfile = async (authToken: string) => {
    if (!authToken) {
        throw new Error("Login token is required to fetch profile");
    }
    return await requestApi({
        url: 'api/v1/storystream/GetProfile',
        method: 'POST',
        data: {},
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.FEED_AUTH,
            'Authorization': `Bearer ${authToken}`,
        },
    });
};