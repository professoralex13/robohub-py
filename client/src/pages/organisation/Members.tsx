import useSWR from 'swr';
import { Trash } from 'tabler-icons-react';
import { FC } from 'react';
import { useRequest } from '../../hooks/useRequest';

interface MembersResponse {
    fullName: string | null;
    isAdmin: boolean;
    teams: string[];
    username: string;
}

interface MembersProps {
    organisationName: string;
}

export const Members: FC<MembersProps> = ({ organisationName }) => {
    const request = useRequest();

    const { data: { data } } = useSWR(`/organisations/${organisationName}/members`, (url) => request<MembersResponse[]>(url, 'GET'), { suspense: true });

    return (
        <div className="grid grid-cols-[14rem_min-content_auto_max-content] grid-rows-[3rem_max-content] gap-3"> {/* Grid layout With a 4 column, 2 row layout */}
            {/* View Selection Card */}
            <div className="card flex flex-col h-min">
                <button className="modal-item text-left rounded-t-md bg-slate-700" type="button">
                    Members
                </button>
                <button className="modal-item text-left rounded-b-md text-slate-400" type="button">
                    Pending Members
                </button>
            </div>

            {/* Input field for filtering the names of members */}
            <input placeholder="Find Members" type="text" className="row-span-1" />
            <button type="button" className="button col-start-4">Invite Members</button>

            {/* Card showing list of all members in organisation */}
            <div className="card col-start-2 col-span-3 row-start-2">
                {/* Member list card header */}
                <div className="grid grid-cols-[min-content_auto] gap-3 rounded-t-md bg-slate-700 px-3 py-2">
                    <input type="checkbox" />
                    <span className="text-slate-300">Members</span>
                </div>
                {data.map((member) => (
                    <div className="grid grid-cols-[max-content_auto_max-content_max-content] gap-3 p-3">
                        <input type="checkbox" className="m-auto" />
                        <span className="text-slate-400 text-xl">{member.username}</span>
                        <span className="text-lg text-slate-400">Teams: {member.teams.length}</span>
                        <Trash className="m-auto stroke-slate-400 hover:" />
                    </div>
                ))}
            </div>
        </div>
    );
};
