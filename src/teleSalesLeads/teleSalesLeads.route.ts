import express from 'express';
import { TeleSalesLeadsController } from './teleSalesLeads.controller';
import { USER_ROLE } from '../app/User/user.constant';
import auth from '../app/middleware/auth';


const router = express.Router();

// ✅ Fetch all new leads (admin/superAdmin only)
router.get(
    '/tele-sales-leads',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    TeleSalesLeadsController.getLeads
);

// ✅ Update lead call info
router.put(
    '/tele-sales-leads/officer/:id',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    TeleSalesLeadsController.updateLeadCall
);

// ✅ Schedule follow-up
router.get(
    '/tele-sales-leads/follow-up/byAdmin',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    TeleSalesLeadsController.getFollowUpLeads
);

// ✅ Fetch lead history
router.get(
    '/tele-sales-leads/AllAdmin/history',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    TeleSalesLeadsController.getAllHistory
);

// ✅ Fetch my customers (leads handled by current admin)
router.get(
    '/tele-sales-leads/my-customer',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    TeleSalesLeadsController.getMyCustomers
);

export const TeleSalesLeadsRoutes = router;
