import useSWR from 'swr';
import { Trash } from 'tabler-icons-react';
import { FC, useEffect, useState } from 'react';
import { requestUnauthorized, useRequest } from '../../hooks/useRequest';
import { concurrentControledTest } from '../../concurrencyControl';
import { Profile } from '../../AuthenticationContext';
import profilePicture from '../../assets/profile_pic.png';

const callback = concurrentControledTest(async (query: string) => {
    if (query === '') {
        return [];
    }
    return (await requestUnauthorized<Profile[]>(`/account/find/${query}`, 'GET')).data;
}, []);

export const InviteMembersDialog = () => {
    const [value, setValue] = useState('');

    const [users, setUsers] = useState<Profile[]>([]);

    useEffect(() => {
        callback(value).then(setUsers);
    }, [value]);

    return (
        <div className="absolute right-0 top-14 card p-5 w-max space-y-3">
            <input type="text" placeholder="email/username/full name" value={value} onChange={(e) => setValue(e.target.value)} />
            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
                {users.map((user) => (
                    <div className="grid auto-cols-max auto-rows-max gap-x-2 gap-y-0 card hover:bg-slate-700 p-2 rounded-md cursor-pointer">
                        <img src={profilePicture} alt="profile" className="h-12 w-12 rounded-full col-start-1 row-start-1 row-span-2 col-span-1" />
                        <span className="text-xl col-start-2 row-start-1">{user.username}</span>
                        <span className="text-lg col-start-2 row-start-2">{user.email}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

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

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

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
            <div className="col-start-4 relative">
                <button type="button" className="button " onClick={() => setInviteDialogOpen((s) => !s)}>
                    Invite Members
                </button>
                {inviteDialogOpen && <InviteMembersDialog />}
            </div>

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
