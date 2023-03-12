import axios, { AxiosError } from 'axios';
import * as yup from 'yup';
import { useAuthenticationContext } from '../AuthenticationContext';

const API_URL: string = import.meta.env.VITE_API_URL;

const TokenResponseSchema = yup.object().shape({
    token: yup.string().required(),
});

export function getResponseErrorMessage(error: any): [string, number] {
    if (error instanceof AxiosError) {
        if (error.message === 'Network Error') {
            return ['Network Error', 0];
        }
        switch (error.response?.status) {
            case 400: return ['Bad Request', 400];
            case 401: return ['Unauthorized', 401];
            case 403: return ['Forbidden', 403];
            case 404: return ['Not Found', 404];
            case 405: return ['Method Not Allowed', 405];
            case 415: return ['Bad Content Type', 415];
            case 500: return ['Server Error', 500];
        }
    }
    throw error;
}

/**
 * A hook for making requests to the backend.
 * Automatically adds authorization headers and handles updating bearer tokens
 */
export const useRequest = () => {
    const { token, setToken } = useAuthenticationContext();

    async function request<T>(url: string, method: string, data?: any) {
        const response = await axios<T>(`${API_URL}${url}`, {
            method,
            data,
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });

        if (TokenResponseSchema.isValidSync(response.data)) {
            setToken(response.data.token);
        }

        return response;
    }

    return request;
};

export function requestUnauthorized<T>(url: string, method: string, data?: any) {
    return axios<T>(`${API_URL}${url}`, {
        method,
        data,
    });
}
