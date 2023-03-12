import axios from 'axios';
import * as yup from 'yup';
import { useAuthenticationContext } from '../AuthenticationContext';

const API_URL: string = import.meta.env.VITE_API_URL;

const TokenResponseSchema = yup.object().shape({
    token: yup.string().required(),
});

/**
 * A hook for making requests to the backend.
 * Automatically adds authorization headers and handles updating bearer tokens
 */
export const useRequest = () => {
    const { token, setToken } = useAuthenticationContext();

    async function request<T>(url: string, method: string, data: any) {
        const response = await axios<T>(`${API_URL}/${url}`, {
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
