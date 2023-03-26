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
        <div className="absolute right-0 top-14 card p-5 w-max space-y-3">
            <input type="text" placeholder="email/username/full name" value={value} onChange={(e) => setValue(e.target.value)} />

            {/* List must be hidden when length zero so space-y-3 does not create empty space */}
            <div className={clsx('flex flex-col gap-3 max-h-[50vh] overflow-y-auto items-center', filteredMembers?.length === 0 && 'hidden')}>
                {filteredMembers === undefined ? <Oval /> : filteredMembers.map((user) => (
                    <button className="group h-max relative cursor-pointer w-full" onClick={() => handleClick(user.username)} type="button">
                        <div className="grid auto-cols-max gap-x-3 card p-2 group-hover:blur-sm group-hover:opacity-50 duration-200">
                            <img src={profilePicture} alt="profile" className="h-14 w-14 rounded-full col-start-1 row-start-1 row-span-2 col-span-1" />
                            <span className="text-xl col-start-2 row-start-1 text-start">{user.username}</span>
                            <span className="text-slate-300 text-lg col-start-2 row-start-2 text-start">{user.email}</span>
                        </div>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 duration-200 text-lg w-max">
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
