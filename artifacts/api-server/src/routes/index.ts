import { Router, type IRouter } from "express";
import healthRouter from "./health";
import simuladoRouter from "./simulado";

const router: IRouter = Router();

router.use(healthRouter);
router.use(simuladoRouter);

export default router;
