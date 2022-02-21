import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { authService } from 'services';
import { useSnackbar } from 'notistack';
import { useUserContext } from 'hooks';

const Profile = () => {
  const user = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object()
    .shape({
      displayName: Yup.string().required('Required'),
    })
    .required();

  const handleSubmit = async (
    values: Yup.InferType<typeof validationSchema>
  ) => {
    try {
      await authService.updateUser(values);
      enqueueSnackbar('Account settings updated', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        displayName: user?.displayName || '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            component={TextField}
            id='displayName'
            name='displayName'
            label='Full Name'
          />
          <LoadingButton type='submit' fullWidth loading={isSubmitting}>
            Save
          </LoadingButton>
        </Form>
      )}
    </Formik>
  );
};

export default Profile;
