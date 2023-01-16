import Router from "express";

import chat from "./chat";
import room from "./room";
import user from "./user";

const router = Router();

router.use('/chat', chat);
router.use('/user',user);
router.use('/room',room);

export default router;
