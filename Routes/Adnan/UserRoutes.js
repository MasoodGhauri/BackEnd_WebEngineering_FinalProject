const {
  Signup,
  Login,
  GetAllUsers,
  GetAllStudents,
  GetAllTeachers,
  GetUserProfilebyID,
  UpdateUserProfilebyID,
  UpdateUserPasswordbyID,
} = require("../../Controllers/Adnan/UserController");
const { AuthenticateUser } = require("./../../utils");
const express = require("express");
const router = express.Router();

router.get("/allusers", AuthenticateUser, GetAllUsers);

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/allstudents", AuthenticateUser, GetAllStudents);
router.get("/allteachers", AuthenticateUser, GetAllTeachers);
router.get("/profile/:userId", GetUserProfilebyID);
router.put("/updateprofile/:userId", UpdateUserProfilebyID);
router.put("/updatepassword/:userId", UpdateUserPasswordbyID);
module.exports = router;
