import { Router } from "express";
import { getArts, getMyArts, uploadArt, donation } from "../controllers/art.controller";

const router = Router();

router.get("/", getArts);
router.post("/upload", uploadArt);
router.get("/myarts", getMyArts);
router.post("/donate/:user_id", donation); // user_id = recipient_user_id (yg nerima koin)

export { router as artRouter };