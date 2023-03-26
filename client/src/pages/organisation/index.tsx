import { NavLink, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Dashboard, Icon, List, Notes, Settings, User, Users } from 'tabler-icons-react';
import { FC, PropsWithChildren, Suspense } from 'react';
import clsx from 'clsx';
import { Oval } from 'react-loading-icons';
import useSWR from 'swr';
import teamLogo from '../../assets/TeamLogo.png';
import { useRequest } from '../../hooks/useRequest';
import { Overview } from './Overview';
import { Members } from './Members';

enum MembershipType {
    None,
    Member,
    Admin
}

interface OrganisationMeta {
    name: string;
    description: string;
    location: string;
    memberCount: number;
    teamCount: number;

    membershipType: MembershipType;
}

interface HeaderLinkProps extends PropsWithChildren {
    symbol: Icon;
    count?: number;
    children: string;
    url?: string;
}

const HeaderLink: FC<HeaderLinkProps> = ({ symbol: Symbol, count, children, url = children.toLowerCase() }) => (
    <NavLink to={url} className={({ isActive }) => clsx('flex gap-2 items-center cursor-pointer group hover:border-navy-300 pb-1', isActive && 'border-b-2 -mb-0.5')}>
        <Symbol size={25} className="group-hover:stroke-navy-300" />
        <span className="text-xl group-hover:text-navy-300">{children}</span>
        {count !== undefined && <span className="border-2 rounded-full text-lg px-1 group-hover:text-navy-300 group-hover:border-navy-300">{count}</span>}
    </NavLink>
);

export const OrganisationRoot = () => {
    const { organisationName } = useParams();

    if (!organisationName) {
        throw new Error('OrganisationRoot cannot be rendered without `organisationName` as a url param');
    }

    const request = useRequest();

    const { data: { data: organisation } } = useSWR(`/organisations/${organisationName}/meta`, (url) => request<OrganisationMeta>(url, 'GET'), { suspense: true });

    return (
        <div className="p-2 pt-28 space-y-2">
            <div className="card grid grid-rows-2 auto-cols-max p-2 gap-3">
                <img src={teamLogo} className="h-28 row-span-2" alt="organisation logo" />

                <div className="mt-auto space-x-10 col-start-2">
                    <span className="text-4xl"><strong>{organisation.name}</strong></span>
                    <span className="text-3xl">{organisation.location}</span>
                </div>

                <div className="flex flex-row items-center gap-10 gap-y-5">
                    <HeaderLink symbol={Dashboard}>Overview</HeaderLink>
                    <HeaderLink symbol={Notes}>Blogs</HeaderLink>
                    <HeaderLink symbol={List}>Parts</HeaderLink>
                    <HeaderLink symbol={User} count={organisation.memberCount}>Members</HeaderLink>
                    <HeaderLink symbol={Users} count={organisation.teamCount}>Teams</HeaderLink>
                    <HeaderLink symbol={Settings}>Settings</HeaderLink>
                </div>
            </div>

            <Suspense fallback={(
                <div className="flex justify-center items-center">
                    <Oval />
                </div>
            )}
            >
                <Routes>
                    <Route
                        path="overview"
                        element={<Overview />}
                    />
                    <Route
                        index
                        element={<Navigate to="overview" />}
                    />
                    <Route
                        path="members"
                        element={<Members organisationName={organisationName} />}
                    />
                </Routes>
            </Suspense>
        </div>
    );
};
