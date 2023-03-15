import useSWR from 'swr';
import { Settings } from 'tabler-icons-react';
import { useRequest } from '../hooks/useRequest';

export const OrganisationList = () => {
    const request = useRequest();

    const { data } = useSWR('/organisations/list', (url) => request<string[]>(url, 'GET'), { suspense: true });

    const organisations = data.data;

    return (
        <div className="flex flex-col items-center justify-between h-screen p-5 pt-36">
            <div className="flex flex-col items-center gap-16">
                <span className="text-6xl">Your Organisations</span>
                <div className="flex flex-col card p-5 gap-5 w-[33vw]">
                    {organisations.map((organisation) => (
                        <div className="flex flex-row items-center justify-between p-2 hover:bg-slate-700 duration-100 rounded-lg cursor-pointer">
                            <span className="text-4xl">{organisation}</span>

                            <Settings size={30} className="hover:stroke-navy-300" onClick={() => null} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-row gap-24">
                <button type="button" className="button">Create Organisation</button>
                <button type="button" className="button">Join Organisation</button>
            </div>
        </div>
    );
};
