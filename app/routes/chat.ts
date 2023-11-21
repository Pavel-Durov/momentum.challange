import express from 'express';
import { CompanyStore } from '../store';
import { CompanyInfo } from '../domain';
import { StatusCodes } from 'http-status-codes';

export default function (store: CompanyStore) {
  const router = express.Router();

  router.get('/find', async (req, res) => {
    const result = store.getAll();
    const companies: CompanyInfo[] = result.map(({ companyName, chatType }) => ({ companyName, chatType }));
    res.status(StatusCodes.OK).json(companies).send();
  });
  return router;
}
