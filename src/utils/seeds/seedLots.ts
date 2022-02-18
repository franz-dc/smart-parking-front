import { writeBatch, doc } from 'firebase/firestore';
import { db } from 'firebase-config';
import { ILot } from 'types';

interface ISeedLotsOptions {
  areas?: string[];
  floors?: string[];
}

export const seedLots = async (
  entries: number,
  { areas = ['A'], floors = ['1st floor'] }: ISeedLotsOptions = {}
) => {
  const batch = writeBatch(db);

  const data: Omit<ILot, 'id'>[] = [];

  floors.forEach((floor) => {
    areas.forEach((area) => {
      for (let entry = 0; entry < entries; entry++) {
        data.push({
          lotNumber: entry + 1,
          area,
          floor,
          available: true,
        });
      }
    });
  });

  data.forEach((item) => {
    const docId = `${item.floor.charAt(0)}${item.area}-${String(
      item.lotNumber
    ).padStart(3, '0')}`;
    const docRef = doc(db, 'lots', docId);
    batch.set(docRef, item);
  });

  await batch.commit();
};
