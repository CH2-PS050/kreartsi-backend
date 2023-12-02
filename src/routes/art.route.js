import { Router } from "express";
import { getArts, getMyArts, likeArt, unlikeArt, uploadArt, donation } from "../controllers/art.controller";

const router = Router();

router.get("/", getArts);
router.post("/upload", uploadArt);
router.get("/myarts", getMyArts);
router.post("/like/:artwork_id", likeArt);
router.post("/unlike/:artwork_id", unlikeArt);
router.post("/donate/:user_id", donation); // user_id = recipient_user_id (yg nerima koin)

export { router as artRouter };