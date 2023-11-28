import { Router } from "express";

import { userRouter } from "./user.route.js";
import { artRouter } from "./art.route";

const router = Router()

router.use("/users", userRouter);
router.use("/arts", artRouter);

export { router };