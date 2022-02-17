import { green, blue, red, grey } from '@mui/material/colors';

export const getAvailabilityColor = (availability: any) => {
  switch (availability) {
    case 'available':
      return green[500];
    case 'reserved':
      return blue[500];
    case 'occupied':
      return red[500];
    default:
      return grey[500];
  }
};
