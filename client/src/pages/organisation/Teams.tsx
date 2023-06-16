import { Notebook, User, X } from 'tabler-icons-react';
import { useDialogContext } from 'contexts/DialogContext';
import { FC } from 'react';
import { motion } from 'framer-motion';
import { Form, Formik, yupToFormErrors } from 'formik';
import { getResponseErrorMessage, requestUnauthorized, useRequest } from 'hooks/useRequest';
import { useNavigate } from 'react-router-dom';
import { concurrentControledTest } from 'concurrencyControl';
import * as yup from 'yup';
import { TextField } from 'components/TextField';
import { ErrorBox } from 'components/Notication';
import { Oval } from 'react-loading-icons';
import useSWR from 'swr';
import { MembershipType, useOrganisation } from '.';

/**
 * Schema for validating the SignUp page fields
 */
const CreateTeamSchema = yup.object().shape({
    id: yup
        .string()
        .matches(/^[1-9][0-9]{1,4}[A-Z]$/, 'Invalid ID, eg: 99999V')
        .required('Required')
        .test('is-available', 'Id taken', concurrentControledTest(async (value) => !(await requestUnauthorized<boolean>(`/teams/id-taken/${value}`, 'GET')).data, false)),
    name: yup
        .string()
        .min(4, 'Too short')
        .required('Required')
        .when('$organisation', ([organisationName], schema) => schema.test(
            'is-available',
            'Name taken in organisation',
            concurrentControledTest(async (value) => !(await requestUnauthorized<boolean>(`/organisations/${organisationName}/team-name-taken/${value}`, 'GET')).data, false),
        ))
    ,
});

interface TeamsResponse {
    id: string;
    name: string;
    notebookCount: string;
    memberCount: string;
}

interface NewTeamDialogProps {
    organisationName: string;
    mutateTeams: (teams: TeamsResponse[]) => void;
}

export const NewTeamDialog: FC<NewTeamDialogProps> = ({ organisationName, mutateTeams }) => {
    const openDialog = useDialogContext();

    const request = useRequest();

    return (
        <motion.div
            initial={{ y: 400 }}
            animate={{ y: 0 }}
            exit={{ y: 400 }}
            className="card absolute flex flex-col items-center gap-2 px-20 py-10"
        >
            <X className="absolute right-3 top-3 cursor-pointer duration-200 hover:stroke-red-500" size={30} onClick={() => openDialog(null)} />
            <span className="text-4xl">Create Team for <strong>{organisationName}</strong></span>
            <Formik
                initialValues={{ id: '', name: '' }}
                onSubmit={async ({ id, name }, { setStatus }) => request<TeamsResponse[]>(
                    `/organisations/${organisationName}/teams/create`,
                    'POST',
                    {
                        id,
                        name,
                    },
                ).then((data) => {
                    mutateTeams(data.data);
                    openDialog(null);
                }).catch((error) => {
                    setStatus(getResponseErrorMessage(error)[0]);
                })}
                validate={(values) => CreateTeamSchema.validate(values, { context: { organisation: organisationName } }).then(() => ({})).catch((error) => yupToFormErrors(error))}
                validateOnBlur
                validateOnChange
            >
                {({ submitForm, isSubmitting, status }) => (
                    <Form className="flex flex-col items-center justify-around gap-5 p-10">
                        <TextField name="id" placeholder="id" />
                        <TextField name="name" placeholder="Name" />

                        {status && (
                            <ErrorBox>{status}</ErrorBox>
                        )}

                        {isSubmitting ? <Oval stroke="#64a9e9" />
                            : <button type="submit" onClick={submitForm} className="button">Submit</button>}
                    </Form>
                )}
            </Formik>
        </motion.div>
    );
};

export const Teams = () => {
    const request = useRequest();

    const organisation = useOrganisation();

    const openDialog = useDialogContext();

    const { data, mutate } = useSWR(`/organisations/${organisation.name}/teams`, async (url) => (await request<TeamsResponse[]>(url, 'GET')).data, { suspense: true });

    return (
        <div className="grid grid-cols-[min-content_auto_min-content] grid-rows-[3rem_max-content] gap-3">

            {/* Input field for filtering the names of members */}
            <input placeholder="Find Teams" type="text" className="row-span-1" />
            {organisation.membershipType >= MembershipType.Admin && (
                <div className="relative col-start-3">
                    <button type="button" className="button w-max" onClick={() => openDialog(<NewTeamDialog mutateTeams={mutate} organisationName={organisation.name} />)}>
                        New Team
                    </button>
                </div>
            )}

            {/* Card showing list of all members in organisation */}
            <div className="col-span-3 row-start-2 grid grid-cols-4 gap-3">
                {data.map((team) => (
                    <div className="card hover:border-navy-300 cursor-pointer justify-between space-y-5 p-5 duration-150">
                        <div className="flex flex-wrap gap-5">
                            <strong className="text-3xl">{team.id}</strong>
                            <span className="text-3xl">{team.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-5">
                            <div className="flex items-center gap-2">
                                <User />
                                <span className="text-xl">Members</span>
                                <span className="rounded-full border-2 px-1 text-lg">{team.memberCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Notebook />
                                <span className="text-xl">Notebooks</span>
                                <span className="rounded-full border-2 px-1 text-lg">{team.notebookCount}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
