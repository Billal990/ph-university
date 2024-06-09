import { Router } from 'express';
import { adminControllers } from './admin.controller';
import { validateRequest } from '../../utils/validateRequest';
import { adminValidations } from './admin.validation';

const router = Router();

router.get('/get-all-admins', adminControllers.getAllAdmins);

router.get('/get-single-admin/:id', adminControllers.getSingleAdmin);

router.patch(
  '/update-admin/:id',
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateAdmin,
);

router.delete('/delete-admin/:id', adminControllers.deleteAdmin);

export const adminRoutes = router;
