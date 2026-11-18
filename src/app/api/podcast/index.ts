import { requestApi } from "../../../utils/request";
import { API_KEYS, API_HEADERS } from "../../../utils/apiConfig";
import {
    getSessionToken,
    isLoggedIn,
    endSessionAndRedirectToLogin,
} from "../../../utils/sessionToken";

const UNAUTHORIZED = 401;

interface PodcastPagingProps {
    conId: number,
    page?: number;
    lang?: string;
    country: string;
}

// StoryStream content routes: audio links come back only for a logged-in subscriber.
const storyStreamContent = async (route: string, data: Record<string, unknown>) => {
    const token = getSessionToken();
    if (!token && isLoggedIn()) {
        endSessionAndRedirectToLogin();
        throw new Error("Login expired");
    }

    const headers: Record<string, string> = {
        'device-os': API_HEADERS.DEVICE_OS,
        'API-KEY': API_KEYS.FEED_AUTH,
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        return await requestApi({ url: `api/v1/storystream/${route}`, method: 'POST', data, headers });
    } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === UNAUTHORIZED && token) {
            endSessionAndRedirectToLogin();
        }
        throw error;
    }
};

export const handlePodcastPaging = async (params: PodcastPagingProps) => {
    return await storyStreamContent('GetPodcastDetailPaging', {
        podcastId: params.conId,
        page: params.page ?? 1,
        country: params.country || "ZA",
        lang: params.lang || "en",
    });
};

export const getEpisodeDetail = async (episode_id: number, lang: any, country: any) => {
    return await storyStreamContent('GetEpisodeDetail', {
        episodeId: episode_id,
        country: country || "ZA",
        lang: "pl",
    });
};

export const getContentDownloadCheck = async (episode_id: number, country: any, userId: any) => {
    return await requestApi({
        url: `api/v1/feed/contentDownloadCheck/${API_KEYS.FEED_AUTH}/web/${country}`,
        method: 'POST',
        data: {
            "userId": userId,
            "plan_id":"1658"
        },
    });
};
