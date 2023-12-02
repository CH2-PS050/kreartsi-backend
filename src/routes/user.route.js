import { Router } from "express";
import { authentication } from "../middlewares/authentication.js";
import { getUsers, getUserById, registerUser, loginUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(authentication);
router.get("/:user_id", getUserById);



export { router as userRouter };