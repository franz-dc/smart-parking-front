import { Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { seedLots } from 'utils';

interface ISeeder {
  name: string;
  func: () => Promise<void>;
}

const Seed = () => {
  const { enqueueSnackbar } = useSnackbar();

  const seeders: ISeeder[] = [
    {
      name: 'lots',
      func: () => seedLots(32),
    },
  ];

  const seed = async (seeder: ISeeder) => {
    try {
      await seeder.func();
      enqueueSnackbar(`Seeding successful: ${seeder.name}`, {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(`Seeding failed: ${seeder.name}`, { variant: 'error' });
    }
  };

  return (
    <>
      <Typography variant='h1' gutterBottom>
        Seeders
      </Typography>
      {seeders.map((seeder) => (
        <Button key={seeder.name} onClick={() => seed(seeder)}>
          {seeder.name}
        </Button>
      ))}
    </>
  );
};

export default Seed;
