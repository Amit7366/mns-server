import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionsController {
  constructor(private svc = new TransactionService()) {}

  ingest = async (req: Request, res: Response) => {
    try {
      const stats = await this.svc.ingest(req.body);
      res.status(200).json({ status: true, message: 'Ingest complete', stats });
    } catch (e: any) {
      res.status(400).json({ status: false, message: e?.message ?? 'Bad request' });
    }
  };
}
