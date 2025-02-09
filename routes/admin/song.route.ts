import { Router } from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/song.controller";
import { uploadFields } from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.fields(
    [
      { name: 'avatar', maxCount: 1 },
      { name: 'audio', maxCount: 1 }
    ]
  ),
  uploadFields,
  controller.createPost
);

export const songRoutes: Router = router;
