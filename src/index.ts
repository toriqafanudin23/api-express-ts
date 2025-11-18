import type { Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/client.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("Headers:", req.headers);
  console.log("Body before routes:", req.body);
  next();
});

// root
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// prisma user
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.$queryRaw`SELECT * FROM "User"`;
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    // const user = await prisma.user.create({
    //   data: { name, email, password, role },
    // });
    const user =
      await prisma.$queryRaw`INSERT INTO "User" (name, email, password, role) VALUES (${name}, ${email}, ${password}, ${role}) RETURNING *`;

    res.status(201).json({
      message: "Berhasil menambahkan data!",
      data: user,
    });
  } catch (err) {
    console.error("Error post users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId: number = Number(req.params.id);
    await prisma.$queryRaw`DELETE FROM "User" WHERE id = ${userId}`;
  } catch (err) {
    console.log("Gagal menghapus data user!");
    res.status(500).send({ error: "Internal server error:", err });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId: number = Number(req.params.id);
    const { name, email, password, role } = req.body;
    // const user = await prisma.user.update({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     name,
    //     email,
    //     password,
    //     role,
    //   },
    // });
    const user =
      await prisma.$queryRaw`UPDATE "User" SET name=${name}, email=${email}, password=${password}, role=${role} WHERE id=${userId} RETURNING name, email, password, role;`;
    res.status(200).json({
      message: "Berhasil mengedit data user!",
      data: user,
    });
  } catch (err) {
    console.log("Gagal mengubah data user!");
    res.status(500).send({ error: "Internal server error:", err });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
