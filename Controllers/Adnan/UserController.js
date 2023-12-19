const { response } = require("express");
const user = require("../../Modals/Adnan/UserSchema");

const jwt = require("jsonwebtoken");

const Signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, expertise } = req.body;
    console.log(firstname, lastname, email, password, role, expertise);
    const newUser = {
      firstname,
      lastname,
      email,
      password,
      role,
      expertise
    };
    const createduser = await user.create(newUser);
    if (!createduser) {
      res.status(404).json({ message: "User not created" });
    }
    res.status(200).json({
      message: "User registered successfully.",
      createduser: createduser,
      firstname: firstname,
      lastname: lastname,
      email: email,
      role: role,
      expertise: expertise,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
};

const Login = async (req, res) => {
  let { email, password } = req.body;
  try {
    let users = await user.findOne({ email });
    if (users) {
      if (users.password === password) {
        let role = users.role;
        let { password, ...rest } = users;
        let id = users._id;
        let token = await jwt.sign({ id, role }, process.env.SECRET_KEY, {
          expiresIn: "10h",
        });
        res.json({ rest, Success: true, token });
      } else {
        res.json({ Success: false, Message: "Invalid password" });
      }
    } else {
      res.json({ Success: false, Message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.json({ Success: false, Message: "Error in finding user", err });
  }
};

const GetAllUsers = async (req, res) => {
  let users = await user.find({});
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ Message: "Error", err: err });
  }
};

const GetAllStudents = async (req, res) => {
  try {
    let students = await user.find({ role: 'student' });
    if (students) {
      res.status(200).json(students);
    } else {
      res.status(404).json({ Message: "No students found" });
    }
  } catch (err) {
    res.status(500).json({ Message: "Error", err: err });
  }
};

const GetAllTeachers = async (req, res) => {
  try {
    let teachers = await user.find({ role: 'teacher' });
    if (teachers) {
      res.status(200).json(teachers);
    } else {
      res.status(404).json({ Message: "No students found" });
    }
  } catch (err) {
    res.status(500).json({ Message: "Error", err: err });
  }
};

let GetUserProfilebyID = async (req, res) => {
  let userId = req.params.userId;
  try {
    let users = await user.findById(userId);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getting user profile:", error);
    res.status(500).json({ error: "Server Crashed" });
  }
};

let UpdateUserProfilebyID = async (req, res) => {
  let userId = req.params.userId;
  let { firstname, lastname, email, expertise } = req.body;

  try {
    let users = await user.findById(userId);
    if (!users) {
      return res.status(200).json({ error: "User not found" });
    }

    users.firstName = firstname;
    users.lastName = lastname;
    users.email = email;
    users.expertise = expertise;

    await users.save();

    res.json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error in updating user profile:", error);
    res.status(500).json({ error: "Server Crashed" });
  }
};

let UpdateUserPasswordbyID = async (req, res) => {
  let userId = req.params.userId;
  let { oldpassword, newpassword } = req.body;

  try {
    let users = await user.findById(userId);
    if (!users) {
      return res.status(200).json({ error: "User not found" });
    }

    if(oldpassword === users.password)
    {
      users.password = newpassword;
      await users.save();
      res.json({ message: "User profile updated successfully" });
    }
    else{
      res.json({ message: "Old password is incorrect" });
    }
  } catch (error) {
    console.error("Error in updating user password:", error);
    res.status(500).json({ error: "Server Crashed" });
  }
};
module.exports = { Signup, Login, GetAllUsers, GetAllStudents, GetAllTeachers, GetUserProfilebyID, UpdateUserProfilebyID, UpdateUserPasswordbyID };
