import { Duration } from 'date-fns';

export const DEFAULT_RATES = {
  id: 'default',
  parkingRate: 2,
  reservationFee: 50,
  createdAt: new Date(),
};

export const MAX_DURATION = 86400; // 24 hours

export const DATE_RANGE_START: Duration = {
  days: 30,
};
