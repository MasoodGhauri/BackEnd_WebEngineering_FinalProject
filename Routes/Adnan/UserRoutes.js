const {
  Signup,
  Login,
  GetAllUsers,
  GetAllStudents,
  GetAllTeachers,
  GetUserProfilebyID,
  UpdateUserProfilebyID,
  UpdateUserPasswordbyID,
  BlockUserByAdmin,
  UNBlockUserByAdmin,
  UpdateTeacherLevel,
  DeleteUserByAdmin,
} = require("../../Controllers/Adnan/UserController");
const { AuthenticateUser, requireAdmin } = require("./../../utils");
const express = require("express");
const router = express.Router();

router.get("/allusers", AuthenticateUser, GetAllUsers);

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/allstudents", AuthenticateUser, requireAdmin, GetAllStudents);
router.get("/allteachers", AuthenticateUser, requireAdmin, GetAllTeachers);
router.get("/profile/:userId", GetUserProfilebyID);
router.put("/updateprofile/:userId", AuthenticateUser, UpdateUserProfilebyID);
router.put("/updatepassword/:userId", AuthenticateUser, UpdateUserPasswordbyID);
router.put("/:userId/block", AuthenticateUser, requireAdmin, BlockUserByAdmin);
router.put("/:userId/unblock", AuthenticateUser, requireAdmin, UNBlockUserByAdmin);
router.put("/updatelevel/:userId", AuthenticateUser, requireAdmin, UpdateTeacherLevel);
router.put("/deleteuser/:userId", AuthenticateUser, requireAdmin, DeleteUserByAdmin);
module.exports = router;
