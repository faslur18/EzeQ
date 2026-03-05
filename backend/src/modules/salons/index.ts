import salonRoutes from '../../salons/salons.routes';
import serviceRoutes from '../../services/services.routes';
import hourRoutes from '../../hours/hours.routes';

export const salonModule = {
  path: '/salons',
  routers: [salonRoutes, serviceRoutes, hourRoutes],
};

