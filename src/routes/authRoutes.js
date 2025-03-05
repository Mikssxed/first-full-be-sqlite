import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const insertUser = db.prepare(`INSERT INTO users (username, password)
            VALUES (?, ?)`);
    const result = insertUser.run(username, hashedPassword);

    const defaultTodo = `Hello! Add your first todo!`;
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
        VALUES (?, ?)`);

    insertTodo.run(result.lastInsertRowid, defaultTodo);

    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.log(error.mesage);
    res.sendStatus(503);
  }
});

router.post("/login", (req, res) => {});

export default router;
