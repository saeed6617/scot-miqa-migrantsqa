const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../services/database/users");

/**
 * Users Login
 */
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(`Login attempt ${email}`);
  try {
    const user = await db.getUserByEmail(email);

    if (!email || !password || !user || password !== user.password) {
      return res.sendStatus(403);
    }

    const secret = process.env.JWT_SECRET || "your_jwt_secret";
    const token = jwt.sign({ userId: user.id }, secret);
    delete user.password;
    delete user.salt;
    return res.send({ token, user });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

/**
 * Users Registration
 */
router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = {
    username,
    email,
    password
  };

  db.createUser(user)
    .then(() => {
      res.send({
        success: true,
        message: "Account created"
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

/**
 *  User Profile Password Update
 */
router.put('/change-password', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log('req', req);
  const { password, email } = req.body;

  const user = {
    password,
    email,
  };

  db.updatePassword(user)
    .then(() => {
      res.send({
        success: true,
        message: "Password changed"
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
})

module.exports = router;
