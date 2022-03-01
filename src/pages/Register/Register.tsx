import { useNavigate } from 'react-router-dom';
import { AuthBase } from 'components';
import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { authService } from 'services';
import { useSnackbar } from 'notistack';
import { useUserContext } from 'hooks';

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = useUserContext();

  const validationSchema = Yup.object()
    .shape({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Required'),
      confirmPassword: Yup.string()
        .required('Required')
        .test('passwordsMatch', 'Passwords must match', function (value) {
          return this.parent.password === value;
        }),
    })
    .required();

  const handleSubmit = async ({
    confirmPassword,
    ...userCredentials
  }: Yup.InferType<typeof validationSchema>) => {
    try {
      const data = await authService.register(userCredentials);
      setUser(data);
      navigate('/account-settings');
    } catch (err: any) {
      let message = 'Something went wrong';

      switch (err?.code) {
        case 'auth/email-already-in-use':
          message = 'Email already exists';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email';
          break;
        default:
          console.error(err?.code || message);
          break;
      }

      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <AuthBase type='register'>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
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
            <Field
              component={TextField}
              id='confirmPassword'
              name='confirmPassword'
              label='Confirm Password'
              type='password'
            />
            <LoadingButton type='submit' fullWidth loading={isSubmitting}>
              Register
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </AuthBase>
  );
};

export default Login;
