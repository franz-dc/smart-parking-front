import { useState } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { TopUpModal } from '../Modals';

// assets
import gcashQR from '~/assets/images/gcash-qr.png';
import payMayaQR from '~/assets/images/paymaya-qr.jpg';
import coinsphQR from '~/assets/images/coinsph-qr.jpg';

interface ITopUpMethod {
  name: string;
  instructionComponent: JSX.Element;
}

const qrTopUpMethods = [
  {
    name: 'GCash',
    image: gcashQR,
  },
  {
    name: 'PayMaya',
    image: payMayaQR,
  },
  {
    name: 'Coins.ph',
    image: coinsphQR,
  },
];

const SelectTopUp = () => {
  const topUpMethods: ITopUpMethod[] = qrTopUpMethods.map((qrTopUpMethod) => ({
    name: qrTopUpMethod.name,
    instructionComponent: (
      <>
        <Typography variant='body2' sx={{ mb: 2 }}>
          Scan the QR code below and pay the desired amount to{' '}
          {qrTopUpMethod.name}. After, fill up the <b>exact</b> amount paid and
          its reference number generated from the transaction. Your credit will
          be added to your account once the transaction is confirmed.
        </Typography>
        <Typography variant='body2' sx={{ mb: 2 }}>
          Failure to fill up the correct amount and reference number will void
          your top-up request and the amount sent cannot be refunded.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src={qrTopUpMethod.image}
            alt={`${qrTopUpMethod.name} QR code`}
            style={{
              width: 200,
              height: 200,
            }}
          />
        </Box>
      </>
    ),
  }));

  const [modalOpen, setModalOpen] = useState(false);
  const [currentTopUpMethod, setCurrentTopUpMethod] = useState(topUpMethods[0]);

  const openModal = (topUpMethod: ITopUpMethod) => {
    setModalOpen(true);
    setCurrentTopUpMethod(topUpMethod);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <Paper sx={{ p: 2, pb: 0, mb: 2 }}>
        <Typography variant='h5' sx={{ mb: 2 }}>
          Select one of the available top-up methods below.
        </Typography>
        {topUpMethods.map((topUpMethod) => (
          <Button
            key={topUpMethod.name}
            onClick={() => openModal(topUpMethod)}
            fullWidth
            sx={{
              mb: 2,
            }}
          >
            {topUpMethod.name}
          </Button>
        ))}
      </Paper>
      <TopUpModal
        open={modalOpen}
        onClose={closeModal}
        topUpMethod={currentTopUpMethod}
      />
    </>
  );
};

export default SelectTopUp;
