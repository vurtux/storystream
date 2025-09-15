import { requestApi } from '../../../utils/request';

export const handleCategory = async () => {

    return await requestApi({
        url: '/api/v1/feed/GetSeeAllCategoryBucketList/9876264/2',
        method: 'GET',
        headers: {
            'device-os': 'web',
            'API-KEY': '3ab0242fb7a6f01b9c2467dd221a43a5',
        },
    });
};

export const handleCategoryDetail = async (conId: any, lang: any) => {

    return await requestApi({
        url: `/api/v1/feed/GetCategoryBucket/3ab0242fb7a6f01b9c2467dd221a43a5/web/IN/${lang || 'en'}/${conId}`,
        method: 'GET',
    });
};