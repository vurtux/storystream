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
        url: 'api/v1/feed/ValidateMDN',
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
        url: 'api/v1/feed/ValidateOTP',
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
        url: 'api/v1/feed/ValidateSSO',
        method: 'POST',
        data: payload,
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.FEED_AUTH,
        },
    });
};

export const handleGetProfile = async (userID: string) => {
    if (!userID) {
        throw new Error("User ID is required to fetch profile");
    }
    return await requestApi({
        url: 'api/v1/feed/GetProfile',
        method: 'POST',
        data: {
            userId: userID
        },
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.CONTENT_FEED,
        },
    });
};