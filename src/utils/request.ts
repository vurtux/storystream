// utils/request.ts
import api from '../lib/axios';
import { Method } from 'axios';

interface RequestOptions {
    url: string;
    method?: Method;
    data?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

export const requestApi = async ({
    url,
    method = 'GET',
    data,
    params,
    headers = {},
}: RequestOptions) => {
    try {
        const response = await api({
            url,
            method,
            data,
            params,
            headers,
        });

        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response: { data: unknown } };
            console.error('API Error:', err.response.data);
        } else {
            console.error('API Error:', (error as Error).message);
        }
        throw error;
    }
};
