import api from '../../../lib/axios';

export const handleDefaultSearchApi = async (country: any) => {
    const selectedCountry = country || (typeof window !== "undefined" ? localStorage.getItem("country") : "") || "ZA";
    const res = await api.get(`/api/v1/feed/GetSearchSuggestions/eb3fb92a88badce847f88fb8c9bb9be6/web/${selectedCountry}/en`);
    return res.data;
};

export const handleSearchApi = async (searchKey: any, country: any) => {
    const selectedCountry = country || (typeof window !== "undefined" ? localStorage.getItem("country") : "") || "ZA";
    const res = await api.get(`/api/v1/feed/GetSearchResults/eb3fb92a88badce847f88fb8c9bb9be6/web/${selectedCountry}/pl/${encodeURIComponent(searchKey)}`);
    return res.data;
};