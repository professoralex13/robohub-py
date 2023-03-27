import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Oval } from 'react-loading-icons';
import { useNavigate } from 'react-router';
import { TextField } from '../components/Form';
import { ErrorBox } from '../components/Notication';
import { getResponseErrorMessage, requestUnauthorized, useRequest } from '../hooks/useRequest';
import { concurrentControledTest } from '../concurrencyControl';

/**
 * Schema for validating the SignUp page fields
 */
const CreateOrganisationSchema = Yup.object().shape({
    name: Yup
        .string()
        .test('is-available', 'Name taken', concurrentControledTest(async (value) => !(await requestUnauthorized<boolean>(`/organisations/name-taken/${value}`, 'GET')).data, false))
        .required('Required'),
    description: Yup
        .string()
        .min(10, 'Too short'),
    location: Yup
        .string()
        .min(2, 'Too short'),
});

export const CreateOrganisation = () => {
    const navigate = useNavigate();

    const request = useRequest();

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-16">
            <span className="animate-fadein text-6xl">Create Organisation</span>
            <Formik
                initialValues={{ name: '', description: '', location: '' }}
                onSubmit={async ({ name, description, location }, { setStatus }) => request(
                    '/organisations/create',
                    'POST',
                    {
                        name,
                        description,
                        location,
                    },
                ).then(() => {
                    navigate(`/organisations/${name}`);
                }).catch((error) => {
                    setStatus(getResponseErrorMessage(error)[0]);
                })}
                validationSchema={CreateOrganisationSchema}
            >
                {({ submitForm, isSubmitting, status }) => (
                    <Form className="card animate-fadein flex flex-col items-center justify-around gap-5 p-10">
                        <TextField name="name" placeholder="Name" />
                        <TextField name="description" placeholder="Description" />
                        <TextField name="location" placeholder="Location" />

                        {status && (
                            <ErrorBox>{status}</ErrorBox>
                        )}

                        {isSubmitting ? <Oval stroke="#64a9e9" />
                            : <button type="submit" onClick={submitForm} className="button">Create</button>}
                    </Form>
                )}
            </Formik>
        </div>
    );
};
