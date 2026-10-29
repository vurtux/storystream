import { requestApi } from "../../../utils/request";
import { API_KEYS } from "../../../utils/apiConfig";

interface PodcastPagingProps {
    conId: number,
    page?: number;
    debug?: boolean;
    test?: string | number;
    lang?: string;
    country: string;
}

export const handlePodcastPaging = async (params: PodcastPagingProps) => {
    return await requestApi({
        url: `api/v1/feed/GetPodcastDetailPaging/${API_KEYS.CONTENT_FEED}/web/${params.country || "ZA"}/${params?.lang || "en"}/${params?.conId}`,
        method: 'GET',
        params: {
            page: params.page ?? 1,
            debug: params.debug ?? false,
            test: params.test ?? '1122',
        },
    });
};

export const getEpisodeDetail = async (episode_id: number, lang: any, country: any) => {
    return await requestApi({
        url: `api/v1/feed/GetEpisodeDetail/${API_KEYS.CONTENT_FEED}/web/${country || "ZA"}/pl/${episode_id}`,
        method: 'GET',
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
