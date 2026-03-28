import { Router, type IRouter } from "express";
import healthRouter from "./health";
import surveyRouter from "./survey";
import diagnosticRouter from "./diagnostic";

const router: IRouter = Router();

router.use(healthRouter);
router.use(surveyRouter);
router.use(diagnosticRouter);

export default router;
