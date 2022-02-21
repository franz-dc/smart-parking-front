import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { usersService } from 'services';
import { useSnackbar } from 'notistack';
import { useUserContext } from 'hooks';

const Profile = () => {
  const { user, setUser } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object()
    .shape({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      contactNumber: Yup.string().required('Required'),
    })
    .required();

  const handleSubmit = async (
    values: Yup.InferType<typeof validationSchema>
  ) => {
    try {
      await usersService.updateUser(values);
      if (user) {
        setUser({
          ...user,
          userDetails: {
            ...user.userDetails,
            ...values,
          },
        });
      }
      enqueueSnackbar('Account settings updated', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        firstName: user?.userDetails?.firstName || '',
        lastName: user?.userDetails?.lastName || '',
        contactNumber: user?.userDetails?.contactNumber || '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            component={TextField}
            id='firstName'
            name='firstName'
            label='First Name'
            autoComplete='given-name'
          />
          <Field
            component={TextField}
            id='lastName'
            name='lastName'
            label='Last Name'
            autoComplete='family-name'
          />
          <Field
            component={TextField}
            id='contactNumber'
            name='contactNumber'
            label='Contact Number'
            autoComplete='tel'
          />
          <LoadingButton
            type='submit'
            variant='contained'
            color='primary'
            loading={isSubmitting}
            fullWidth
          >
            Save
          </LoadingButton>
        </Form>
      )}
    </Formik>
  );
};

export default Profile;
