import { Router } from 'express';
import { TransactionsController } from '../controllers/transactions.controller';
import { GameTxnRecordsController } from '../controllers/gametxnrecords.controller';
import { USER_ROLE } from '../../User/user.constant';
import auth from '../../middleware/auth';

const router = Router();
const tx = new TransactionsController();
const gameTxnController = new GameTxnRecordsController();
router.post('/api/transactions/ingest', tx.ingest);
// All routes here start with /api/gametxnrecords
router.get("/gametxnrecords/user-bets", auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user), gameTxnController.getUserBets);

export const gametxnrecordsRoute = router;
