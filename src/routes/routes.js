import { Router } from "express";

import { userRouter } from "./user.route.js";
import { artRouter } from "./art.route";
import { authentication } from "../middlewares/authentication.js";

const router = Router();

router.use(authentication);
router.use("/users", userRouter);
router.use("/arts", artRouter);

export { router };
