import useSWR from 'swr';
import { Trash } from 'tabler-icons-react';
import { FC, useCallback, useState } from 'react';
import { Oval } from 'react-loading-icons';
import clsx from 'clsx';
import { requestUnauthorized, useRequest } from '../../hooks/useRequest';
import { concurrentControledTest } from '../../concurrencyControl';
import profilePicture from '../../assets/profile_pic.png';
import { Profile } from '../../ProfileContext';

const callback = concurrentControledTest(async (query: string) => {
    if (query === '') {
        return [];
    }
    return (await requestUnauthorized<Profile[]>(`/account/find/${query}`, 'GET')).data;
}, []);

interface InviteMembersDialogProps {
    organisationName: string;
    existingMembers: MembersResponse[];
    onUpdate: (members: MembersResponse[]) => void;
}

export const InviteMembersDialog: FC<InviteMembersDialogProps> = ({ organisationName, existingMembers, onUpdate }) => {
    const [value, setValue] = useState('');

    const { data } = useSWR([value], ([query]) => callback(query));

    const request = useRequest();

    const handleClick = useCallback(async (username: string) => {
        const { data } = await request<MembersResponse[]>(`/organisations/${organisationName}/members/add/${username}`, 'POST');
        onUpdate(data);
    }, [organisationName, request, onUpdate]);

    const filteredMembers = data?.filter((member) => !existingMembers.find((member1) => member1.username === member.username));

    return (
        <div className="card absolute right-0 top-14 w-max space-y-3 p-5">
            <input type="text" placeholder="email/username/full name" value={value} onChange={(e) => setValue(e.target.value)} />

            {/* List must be hidden when length zero so space-y-3 does not create empty space */}
            <div className={clsx('flex max-h-[50vh] flex-col items-center gap-3 overflow-y-auto', filteredMembers?.length === 0 && 'hidden')}>
                {filteredMembers === undefined ? <Oval /> : filteredMembers.map((user) => (
                    <button className="group relative h-max w-full cursor-pointer" onClick={() => handleClick(user.username)} type="button">
                        <div className="card grid auto-cols-max gap-x-3 p-2 duration-200 group-hover:opacity-50 group-hover:blur-sm">
                            <img src={profilePicture} alt="profile" className="col-span-1 col-start-1 row-span-2 row-start-1 h-14 w-14 rounded-full" />
                            <span className="col-start-2 row-start-1 text-start text-xl">{user.username}</span>
                            <span className="col-start-2 row-start-2 text-start text-lg text-slate-300">{user.email}</span>
                        </div>
                        <span className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 text-lg opacity-0 duration-200 group-hover:opacity-100">
                            Add to Organisation
                        </span>
                    </button>
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

    const { data, mutate } = useSWR(`/organisations/${organisationName}/members`, async (url) => (await request<MembersResponse[]>(url, 'GET')).data, { suspense: true });

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    return (
        <div className="grid grid-cols-[14rem_min-content_auto_max-content] grid-rows-[3rem_max-content] gap-3"> {/* Grid layout With a 4 column, 2 row layout */}
            {/* View Selection Card */}
            <div className="card flex h-min flex-col">
                <button className="modal-item rounded-t-md bg-slate-700 text-left" type="button">
                    Members
                </button>
                <button className="modal-item rounded-b-md text-left text-slate-400" type="button">
                    Pending Members
                </button>
            </div>

            {/* Input field for filtering the names of members */}
            <input placeholder="Find Members" type="text" className="row-span-1" />
            <div className="relative col-start-4">
                <button type="button" className="button " onClick={() => setInviteDialogOpen((s) => !s)}>
                    Invite Members
                </button>
                {inviteDialogOpen && (
                    <InviteMembersDialog
                        organisationName={organisationName}
                        existingMembers={data}
                        onUpdate={(members) => {
                            setInviteDialogOpen(false);
                            mutate(members);
                        }}
                    />
                )}
            </div>

            {/* Card showing list of all members in organisation */}
            <div className="card col-span-3 col-start-2 row-start-2">
                {/* Member list card header */}
                <div className="grid grid-cols-[min-content_auto] gap-3 rounded-t-md bg-slate-700 px-3 py-2">
                    <input type="checkbox" />
                    <span className="text-slate-300">Members</span>
                </div>
                {data.map((member) => (
                    <div className="grid grid-cols-[max-content_auto_max-content_max-content] gap-3 p-3">
                        <input type="checkbox" className="m-auto" />
                        <span className="text-xl text-slate-400">{member.username}</span>
                        <span className="text-lg text-slate-400">Teams: {member.teams.length}</span>
                        <Trash className="hover: m-auto stroke-slate-400" />
                    </div>
                ))}
            </div>
        </div>
    );
};
