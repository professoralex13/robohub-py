import useSWR from 'swr';
import { Settings } from 'tabler-icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRequest } from 'hooks/useRequest';

export const OrganisationList = () => {
    const request = useRequest();

    const navigate = useNavigate();

    const { data } = useSWR('/organisations/list', (url) => request<string[]>(url, 'GET'), { suspense: true });

    const organisations = data.data;

    return (
        <div className="flex h-screen flex-col items-center justify-between overflow-hidden p-5 pt-36">
            <div className="animate-fadeUp flex flex-col items-center gap-16">
                <span className="text-6xl">Your Organisations</span>
                <div className="card flex w-[33vw] flex-col gap-5 p-5">
                    {organisations.map((organisation) => (
                        <button
                            type="button"
                            onClick={() => navigate(`/organisations/${organisation}`)}
                            className="flex cursor-pointer flex-row items-center justify-between rounded-lg p-2 duration-100 hover:bg-slate-700"
                        >
                            <span className="text-4xl">{organisation}</span>

                            <Settings size={30} className="hover:stroke-navy-300" onClick={() => null} />
                        </button>
                    ))}
                    {organisations.length === 0 && (
                        <span className="text-center text-3xl">You are not a member of any organisations</span>
                    )}
                </div>
            </div>

            <div className="animate-fadeUp flex flex-row gap-24">
                <Link to="/organisations/create" className="button">Create Organisation</Link>
                <Link to="/organisations/join" className="button">Join Organisation</Link>
            </div>
        </div>
    );
};
