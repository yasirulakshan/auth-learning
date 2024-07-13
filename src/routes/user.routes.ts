import express from "express";

const router = express.Router();

router.post("/api/users", (req, res) => {
  res.send("POST /api/users");
});

export default router;
