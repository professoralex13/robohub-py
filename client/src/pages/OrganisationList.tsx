import useSWR from 'swr';
import { Settings } from 'tabler-icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRequest } from '../hooks/useRequest';

export const OrganisationList = () => {
    const request = useRequest();

    const navigate = useNavigate();

    const { data } = useSWR('/organisations/list', (url) => request<string[]>(url, 'GET'), { suspense: true });

    const organisations = data.data;

    return (
        <div className="flex flex-col items-center justify-between h-screen p-5 pt-36">
            <div className="flex flex-col items-center gap-16">
                <span className="text-6xl">Your Organisations</span>
                <div className="flex flex-col card p-5 gap-5 w-[33vw]">
                    {organisations.map((organisation) => (
                        <button
                            type="button"
                            onClick={() => navigate(`/organisations/${organisation}`)}
                            className="flex flex-row items-center justify-between p-2 hover:bg-slate-700 duration-100 rounded-lg cursor-pointer"
                        >
                            <span className="text-4xl">{organisation}</span>

                            <Settings size={30} className="hover:stroke-navy-300" onClick={() => null} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-row gap-24">
                <Link to="/organisations/create" className="button">Create Organisation</Link>
                <Link to="/organisations/join" className="button">Join Organisation</Link>
            </div>
        </div>
    );
};
