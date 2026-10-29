import { requestApi } from '../../../utils/request';
import { API_KEYS, API_HEADERS } from '../../../utils/apiConfig';

export const handleCategory = async () => {

    return await requestApi({
        url: '/api/v1/feed/GetSeeAllCategoryBucketList/9876264/2',
        method: 'GET',
        headers: {
            'device-os': API_HEADERS.DEVICE_OS,
            'API-KEY': API_KEYS.FEED_AUTH,
        },
    });
};

export const handleCategoryDetail = async (conId: any, lang: any, country: any) => {

    return await requestApi({
        url: `/api/v1/feed/GetCategoryBucket/${API_KEYS.FEED_AUTH}/web/${country || "ZA"}/${lang || 'en'}/${conId}`,
        method: 'GET',
    });
};