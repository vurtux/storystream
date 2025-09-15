import { requestApi } from "../../../utils/request";

interface PodcastPagingProps {
    conId: number,
    page?: number;
    debug?: boolean;
    test?: string | number;
    lang?: string;
}

export const handlePodcastPaging = async (params: PodcastPagingProps) => {
    return await requestApi({
        url: `api/v1/feed/GetPodcastDetailPaging/eb3fb92a88badce847f88fb8c9bb9be6/web/in/${params?.lang}/${params?.conId}`,
        method: 'GET',
        params: {
            page: params.page ?? 1,
            debug: params.debug ?? false,
            test: params.test ?? '1122',
        },
        // headers: {
        //     'device-os': 'web',
        //     'API-KEY': '3ab0242fb7a6f01b9c2467dd221a43a5',
        // },
    });
};

export const getEpisodeDetail = async (episode_id: number, lang: any) => {
    return await requestApi({
        url: `api/v1/feed/GetEpisodeDetail/eb3fb92a88badce847f88fb8c9bb9be6/web/IN/pl/${episode_id}`,
        method: 'GET',
        // headers: {
        //     'device-os': 'web',
        //     'API-KEY': '3ab0242fb7a6f01b9c2467dd221a43a5',
        // },
    });
};
