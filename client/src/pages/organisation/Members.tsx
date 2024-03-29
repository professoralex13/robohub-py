import useSWR from 'swr';
import { Trash } from 'tabler-icons-react';
import { FC, useState } from 'react';
import { Oval } from 'react-loading-icons';
import clsx from 'clsx';
import { Formik } from 'formik';
import { useHover } from 'use-events';
import { API_URL, requestUnauthorized, useRequest } from 'hooks/useRequest';
import { concurrentControledTest } from 'concurrencyControl';
import { Profile } from 'contexts/ProfileContext';
import { useConfirmation } from 'contexts/ConfirmationContext';
import { LayoutGroup, motion } from 'framer-motion';
import { useProtectedRouteProfile } from 'components/ProtectedRoute';
import { AnimatedContainer } from 'components/AnimatedContainer';
import { ModalWrapper } from 'components/ModalWrapper';
import { MembershipType, useOrganisation } from '.';

interface UserCardProps {
    user: Profile;
    onAdded: (members: MembersResponse[]) => void;
}

const UserCard: FC<UserCardProps> = ({ user, onAdded }) => {
    const request = useRequest();

    const confirm = useConfirmation();

    const [hovered, hoverProps] = useHover();

    const organisation = useOrganisation();

    return (
        <Formik
            initialValues={{}}
            onSubmit={async () => {
                const { data } = await request<MembersResponse[]>(`/organisations/${organisation.name}/members/add/${user.username}`, 'POST');
                onAdded(data);
            }}
        >
            {({ submitForm, isSubmitting }) => (
                <button
                    className="relative h-max w-full cursor-pointer"
                    onClick={!isSubmitting ? (async () => {
                        if (await confirm(<span>Add <strong>{user.username}</strong> to <strong>{organisation.name}</strong></span>)) {
                            submitForm();
                        }
                    }) : undefined}
                    type="button"
                    {...hoverProps}
                >
                    <div className={clsx(
                        'card grid auto-cols-max gap-x-3 p-2 duration-200',
                        (isSubmitting || hovered) && 'opacity-50 blur-sm',
                    )}
                    >
                        <img src={`${API_URL}/content/avatar/users/${user.id}`} alt="profile" className="col-span-1 col-start-1 row-span-2 row-start-1 h-14 w-14 rounded-full" />
                        <span className="col-start-2 row-start-1 text-start text-xl">{user.username}</span>
                        <span className="col-start-2 row-start-2 text-start text-lg text-slate-300">{user.email}</span>
                    </div>

                    <div
                        className={clsx(
                            'absolute top-0 left-0 flex h-full w-full items-center justify-center p-2 opacity-0 duration-200',
                            (isSubmitting || hovered) && 'opacity-100',
                        )}
                    >
                        {isSubmitting ? <Oval /> : <span className="text-lg">Add to Organisation</span>}
                    </div>
                </button>
            )}
        </Formik>
    );
};

const callback = concurrentControledTest(async (query: string) => {
    if (query === '') {
        return [];
    }
    return (await requestUnauthorized<Profile[]>(`/account/find/${query}`, 'GET')).data;
}, []);

interface InviteMembersDialogProps {
    existingMembers: MembersResponse[];
    onUpdate: (members: MembersResponse[]) => void;
}

export const InviteMembersDialog: FC<InviteMembersDialogProps> = ({ existingMembers, onUpdate }) => {
    const [value, setValue] = useState('');

    const { data } = useSWR([value], ([query]) => callback(query));

    const filteredMembers = data?.filter((member) => !existingMembers.find((member1) => member1.username === member.username));

    return (
        <motion.div
            className="card absolute right-0 top-14 w-max space-y-3 p-5"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
        >
            <input type="text" placeholder="email/username/full name" value={value} onChange={(e) => setValue(e.target.value)} />

            {/* List must be hidden when length zero so space-y-3 does not create empty space */}
            <div className={clsx('flex max-h-[50vh] flex-col items-center gap-3 overflow-y-auto', filteredMembers?.length === 0 && 'hidden')}>
                {filteredMembers === undefined ? <Oval /> : filteredMembers.map((user) => (
                    <UserCard key={user.username} user={user} onAdded={onUpdate} />
                ))}
            </div>
        </motion.div>
    );
};

interface MemberRowProps {
    member: MembersResponse;
    onRemoved: (members: MembersResponse[]) => void;
}

export const MemberRow: FC<MemberRowProps> = ({ member, onRemoved }) => {
    const request = useRequest();

    const confirm = useConfirmation();

    const organisation = useOrganisation();

    const profile = useProtectedRouteProfile();

    const showRemoveButton = organisation.membershipType >= MembershipType.Admin && profile.username !== member.username;

    return (
        <Formik
            initialValues={{}}
            onSubmit={async () => {
                const { data } = await request<MembersResponse[]>(`/organisations/${organisation.name}/members/remove/${member.username}`, 'POST');
                onRemoved(data);
            }}
        >
            {({ submitForm, isSubmitting }) => (
                <motion.div
                    className="grid grid-cols-[max-content_auto_max-content_5%] gap-3 overflow-hidden p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout="position"
                    transition={{ layout: { duration: 0.2 } }}
                >
                    <input type="checkbox" className="m-auto" />
                    <span className="text-xl text-slate-400">{member.username}</span>
                    <span className="text-lg text-slate-400">Teams: {member.teams.length}</span>
                    {showRemoveButton && (isSubmitting ? <Oval className="my-auto ml-auto h-7" /> : (
                        <Trash
                            className="my-auto ml-auto cursor-pointer stroke-slate-400 duration-200 hover:stroke-red-500"
                            onClick={async () => {
                                if (await confirm(<span>Remove <strong>{member.username}</strong> from <strong>{organisation.name}</strong></span>)) {
                                    submitForm();
                                }
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </Formik>
    );
};

interface MembersResponse {
    fullName: string | null;
    isAdmin: boolean;
    teams: string[];
    username: string;
}

export const Members = () => {
    const request = useRequest();

    const organisation = useOrganisation();

    const { data, mutate } = useSWR(`/organisations/${organisation.name}/members`, async (url) => (await request<MembersResponse[]>(url, 'GET')).data, { suspense: true });

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    /* Grid layout With a 4 column, 2 row layout */
    return (
        <div className="grid grid-cols-[14rem_min-content_auto_max-content] grid-rows-[3rem_max-content] gap-3">
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
            {organisation.membershipType >= MembershipType.Admin && (
                <div className="relative col-start-4">
                    <button type="button" className="button" onClick={() => setInviteDialogOpen(true)}>
                        Invite Members
                    </button>
                    <ModalWrapper open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                        <InviteMembersDialog
                            existingMembers={data}
                            onUpdate={(members) => {
                                setInviteDialogOpen(false);
                                mutate(members);
                            }}
                        />
                    </ModalWrapper>
                </div>
            )}

            {/* Card showing list of all members in organisation */}
            <div className="card col-span-3 col-start-2 row-start-2">
                <AnimatedContainer duration={0.2}>
                    {/* Member list card header */}
                    <div className="grid grid-cols-[min-content_auto] gap-3 rounded-t-md bg-slate-700 px-3 py-2">
                        <input type="checkbox" />
                        <span className="text-slate-300">Members</span>
                    </div>
                    <LayoutGroup>
                        {data.map((member) => (
                            <MemberRow key={member.username} member={member} onRemoved={mutate} />
                        ))}
                    </LayoutGroup>
                </AnimatedContainer>
            </div>
        </div>
    );
};
