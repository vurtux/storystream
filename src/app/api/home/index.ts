import api from '../../../lib/axios';

export const handleHome = async (lang: any, country: any) => {

    const selectedCountry = country || (typeof window !== "undefined" ? localStorage.getItem("country") : "") || "ZA";
    const res = await api.get(`/api/v1/feed/GetHome/a995570eea6c716c8305ea42213a853d/web/${selectedCountry}/${lang || 'en'}`);
    return res.data;
};