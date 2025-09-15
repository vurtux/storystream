import { requestApi } from "../../../utils/request";

interface loginProps {
    deviceId: string;
    langCode: string;
    mobileNo: string;
    isdCode: string;
}

interface verifyProps extends loginProps {
    otp: string;
    last_login_source: string;
}

export const handleLogin = async (payload: loginProps) => {
    return await requestApi({
        url: 'api/v1/feed/GetOTP',
        method: 'POST',
        data: payload,
        headers: {
            'device-os': 'web',
            'API-KEY': '3ab0242fb7a6f01b9c2467dd221a43a5',
        },
    });
};

export const handleVerification = async (payload: verifyProps) => {
    return await requestApi({
        url: 'api/v1/feed/ValidateOTP',
        method: 'POST',
        data: payload,
        headers: {
            'device-os': 'web',
            'API-KEY': '3ab0242fb7a6f01b9c2467dd221a43a5',
        },
    });
};
