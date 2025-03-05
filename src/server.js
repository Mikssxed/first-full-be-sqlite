import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "public", "index.html");
    const data = await fs.readFile(filePath);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Routes
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
