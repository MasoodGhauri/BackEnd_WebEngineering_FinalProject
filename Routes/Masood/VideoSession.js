const express = require("express");
const ioFunction = require("../../Controllers/Masood/Sessions");

const router = express.Router();

router.get("/session", ioFunction);

module.exports = router;
