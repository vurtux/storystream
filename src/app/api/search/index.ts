import api from '../../../lib/axios';

export const handleDefaultSearchApi = async () => {

    const res = await api.get('/api/v1/feed/GetSearchSuggestions/eb3fb92a88badce847f88fb8c9bb9be6/web/IN/en');
    return res.data;
};

export const handleSearchApi = async (searchKey: any) => {

    const res = await api.get(`/api/v1/feed/GetSearchResults/eb3fb92a88badce847f88fb8c9bb9be6/web/IN/pl/${searchKey}`);
    return res.data;
};