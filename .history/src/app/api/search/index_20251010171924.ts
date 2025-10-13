import api from '../../../lib/axios';

export const handleDefaultSearchApi = async (country: any) => {

    const res = await api.get(`/api/v1/feed/GetSearchSuggestions/eb3fb92a88badce847f88fb8c9bb9be6/web/${country || "ZA"}/en`);
    return res.data;
};

export const handleSearchApi = async (searchKey: any, country: any) => {

    const res = await api.get(`/api/v1/feed/GetSearchResults/eb3fb92a88badce847f88fb8c9bb9be6/web/${country || "ZA"}/pl/${encodeURIComponent(searchKey)}`);
    return res.data;
};