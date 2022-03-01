import { useNavigate } from 'react-router-dom';
import { AuthBase } from 'components';
import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { authService } from 'services';
import { useSnackbar } from 'notistack';
import { IUserCredentials } from 'types';
import { useUserContext } from 'hooks';

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = useUserContext();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values: IUserCredentials) => {
    try {
      const data = await authService.signIn(values);
      setUser(data);
      navigate('/reservations');
    } catch (err: any) {
      let message = 'Something went wrong';

      switch (err?.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Invalid email or password';
          break;
        case 'auth/user-disabled':
          message = 'Account is disabled';
          break;
        default:
          console.error(err?.code || message);
          break;
      }

      enqueueSnackbar(message, { variant: 'error' });
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
