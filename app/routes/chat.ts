import express from 'express';

const router = express.Router();

// TODO: not sure why this endpoints is called /drift
// router.post('/drift', async (req, res) => {
//   res.send([{ companyName: '', hasDrift: false }]);
// });

router.post('/find', async (req, res) => {
  res.send([{ companyName: '', hasDrift: false }]);
});

export default router;
