import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { authService } from '~/services';
import { useSnackbar } from 'notistack';

const Security = () => {
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object()
    .shape({
      currentPassword: Yup.string()
        .required('Required')
        .min(8, 'Password must be at least 8 characters'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Required'),
      confirmNewPassword: Yup.string()
        .required('Required')
        .test('passwordsMatch', 'Passwords must match', function (value) {
          return this.parent.newPassword === value;
        }),
    })
    .required();

  const handleSubmit = async (
    values: Yup.InferType<typeof validationSchema>
  ) => {
    try {
      await authService.updatePassword(values);
      enqueueSnackbar('Account settings updated', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            component={TextField}
            id='currentPassword'
            name='currentPassword'
            label='Current Password'
            type='password'
          />
          <Field
            component={TextField}
            id='newPassword'
            name='newPassword'
            label='New Password'
            type='password'
          />
          <Field
            component={TextField}
            id='confirmNewPassword'
            name='confirmNewPassword'
            label='Confirm Password'
            type='password'
          />
          <LoadingButton type='submit' fullWidth loading={isSubmitting}>
            Save
          </LoadingButton>
        </Form>
      )}
    </Formik>
  );
};

export default Security;
