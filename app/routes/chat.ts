import express from 'express';

const router = express.Router();

router.post('/drift', async (req, res) => {
  res.send([{ companyName: '', hasDrift: false }]);
});

export default router;
