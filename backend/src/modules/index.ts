import { authModule } from './auth';
import { salonModule } from './salons';
import { appointmentsModule } from './appointments';
import { usersModule } from './users';
import { adminSalonsModule } from './admin-salons';

export const apiModules = [
  authModule,
  salonModule,
  appointmentsModule,
  usersModule,
  adminSalonsModule,
] as const;

