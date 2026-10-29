import api from '../../../lib/axios';
import { API_KEYS } from '../../../utils/apiConfig';

export const handleHome = async (lang: any, country: any) => {

    const res = await api.get(`/api/v1/feed/GetHome/${API_KEYS.HOME_FEED}/web/${country || "ZA"}/${lang || 'en'}`);
    return res.data;
};