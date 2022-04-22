import { FC } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { serverTimestamp } from 'firebase/firestore';
import { useUserContext } from '~/hooks';
import { topUpsService } from '~/services';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  topUpMethod: {
    name: string;
    instructionComponent: JSX.Element;
  };
}

const TopUpModal: FC<TopUpModalProps> = ({ open, onClose, topUpMethod }) => {
  const { user } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object()
    .shape({
      amount: Yup.number()
        .min(1, 'Amount must be greater than 0')
        .required('Required'),
      referenceNumber: Yup.string().required('Required'),
    })
    .required();

  const handleSubmit = async (
    values: Yup.InferType<typeof validationSchema>
  ) => {
    try {
      if (user) {
        const body = {
          ...values,
          platform: topUpMethod.name,
          userId: user.uid,
          createdAt: serverTimestamp(),
          status: 'pending',
        };

        await topUpsService.addTopUp(body);
        enqueueSnackbar('Top-up request created', { variant: 'success' });
      } else {
        enqueueSnackbar('Please log in to create a top-up request', {
          variant: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Error creating top-up request', { variant: 'error' });
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        amount: '',
        referenceNumber: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm }) => (
        <Dialog
          open={open}
          onClose={() => {
            resetForm();
            onClose();
          }}
        >
          <Form>
            <DialogTitle sx={{ fontSize: '1.5rem' }}>
              Top-up ({topUpMethod.name})
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>{topUpMethod.instructionComponent}</Box>
              <Field
                component={TextField}
                type='number'
                name='amount'
                label='Amount'
                required
                InputProps={{
                  inputProps: {
                    min: 1,
                    step: 0.01,
                  },
                }}
              />
              <Field
                component={TextField}
                name='referenceNumber'
                label='Reference Number'
                required
                margin='none'
              />
            </DialogContent>
            <DialogActions>
              <LoadingButton
                fullWidth
                size='large'
                type='submit'
                loading={isSubmitting}
              >
                Create Request
              </LoadingButton>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
};

export default TopUpModal;
