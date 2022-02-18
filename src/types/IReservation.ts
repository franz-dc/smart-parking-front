export interface IReservation {
  id: string;
  dateTime: Date;
  duration: number;
  floor: string;
  area: string;
  lotNumber: number;
  reserver: string;
  plateNumber: string;
  earlyEnd: boolean;
  createdAt: Date;
}
