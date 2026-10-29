import api from '../../../lib/axios';
import { API_KEYS } from '../../../utils/apiConfig';

export const handleDefaultSearchApi = async (country: any) => {

    const res = await api.get(`/api/v1/feed/GetSearchSuggestions/${API_KEYS.CONTENT_FEED}/web/${country || "ZA"}/en`);
    return res.data;
};

export const handleSearchApi = async (searchKey: any, country: any) => {

    const res = await api.get(`/api/v1/feed/GetSearchResults/${API_KEYS.CONTENT_FEED}/web/${country || "ZA"}/pl/${encodeURIComponent(searchKey)}`);
    return res.data;
};