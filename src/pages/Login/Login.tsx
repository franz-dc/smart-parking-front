import { useNavigate } from 'react-router-dom';
import { AuthBase } from 'components';
import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { authService } from 'services';
import { useSnackbar } from 'notistack';
import { IUserCredentials } from 'types';

const Login = () => {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values: IUserCredentials) => {
    try {
      await authService.signIn(values);
      navigate('/reservations');
    } catch (err: any) {
      switch (err?.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          enqueueSnackbar('Invalid email or password', { variant: 'error' });
          break;
        default:
          enqueueSnackbar('Something went wrong', { variant: 'error' });
          break;
      }
    }
  };

  return (
    <AuthBase type='login'>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              component={TextField}
              id='email'
              name='email'
              label='Email'
            />
            <Field
              component={TextField}
              id='password'
              name='password'
              label='Password'
              type='password'
            />
            <LoadingButton type='submit' fullWidth loading={isSubmitting}>
              Sign in
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </AuthBase>
  );
};

export default Login;
