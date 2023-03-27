import { AxiosError } from 'axios';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

const PageNotFound = () => (
    <div className="flex h-screen flex-col items-center justify-center gap-10 text-4xl">
        Oops, unfortunately we couldnt find that page
        <Link className="button" to="/">Go Home</Link>
    </div>
);

const Unauthorized = () => (<div className="flex h-screen items-center justify-center text-4xl">Oops, you are unauthorized to view that page or complete that operation</div>);

const UnknownErrorCode = ({ code }: { code: number }) => (<div className="flex h-screen items-center justify-center text-4xl">Oops, we had an unexpected error, code: {code}</div>);

export const ErrorPage = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <PageNotFound />;
        }
        if (error.status === 401) {
            return <Unauthorized />;
        }
        return <UnknownErrorCode code={error.status} />;
    }

    if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
            return <PageNotFound />;
        }
        if (error.response?.status === 401) {
            return <Unauthorized />;
        }
        if (error.response?.status) {
            return <UnknownErrorCode code={error.response?.status} />;
        }
    }

    return (
        <div>
            Oops, something went wrong that we couldnt handle
        </div>
    );
};
