import express from 'express';
import cors from 'cors';
import signRouter from './signup.js';
import logRouter from './login.js';

const router = express.Router();
router.use(express.json());

router.use('/root', signRouter);
router.use('/root', logRouter);

export default router;