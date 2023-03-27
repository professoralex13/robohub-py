import { NavLink, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Dashboard, Icon, List, Notes, Settings, User, Users } from 'tabler-icons-react';
import { FC, PropsWithChildren, Suspense, createContext, useContext } from 'react';
import clsx from 'clsx';
import { Oval } from 'react-loading-icons';
import useSWR from 'swr';
import teamLogo from 'assets/TeamLogo.png';
import { useRequest } from 'hooks/useRequest';
import { Overview } from './Overview';
import { Members } from './Members';

export enum MembershipType {
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

const OrganistionContext = createContext<OrganisationMeta>(undefined!);

export const useOrganisation = () => useContext(OrganistionContext);

interface HeaderLinkProps extends PropsWithChildren {
    symbol: Icon;
    count?: number;
    children: string;
    url?: string;
}

const HeaderLink: FC<HeaderLinkProps> = ({ symbol: Symbol, count, children, url = children.toLowerCase() }) => (
    <NavLink to={url} className={({ isActive }) => clsx('hover:border-navy-300 group flex cursor-pointer items-center gap-2 pb-1', isActive && '-mb-0.5 border-b-2')}>
        <Symbol size={25} className="group-hover:stroke-navy-300" />
        <span className="group-hover:text-navy-300 text-xl">{children}</span>
        {count !== undefined && <span className="group-hover:text-navy-300 group-hover:border-navy-300 rounded-full border-2 px-1 text-lg">{count}</span>}
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
        <OrganistionContext.Provider value={organisation}>
            <div className="space-y-2 p-2 pt-28">
                <div className="card grid auto-cols-max grid-rows-2 gap-3 p-2">
                    <img src={teamLogo} className="row-span-2 h-28" alt="organisation logo" />

                    <div className="col-start-2 mt-auto space-x-10">
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
                    <div className="flex items-center justify-center">
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
                            element={<Members />}
                        />
                    </Routes>
                </Suspense>
            </div>
        </OrganistionContext.Provider>
    );
};
