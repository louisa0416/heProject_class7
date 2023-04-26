const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/posts");
const handleErrorAsync = require("../service/handleErrorAsync");
router.get("/", handleErrorAsync(postControllers.getPosts));
router.post("/", handleErrorAsync(postControllers.createPost));
router.patch("/:id", handleErrorAsync(postControllers.updatePost));
router.delete("/:id", handleErrorAsync(postControllers.deletePost));

module.exports = router;
