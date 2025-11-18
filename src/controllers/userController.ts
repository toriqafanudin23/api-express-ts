import type { Request, Response } from "express";
import prisma from "../database/prisma.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.$queryRaw`SELECT * FROM "User"`;
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
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
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId: number = Number(req.params.id);
    await prisma.$queryRaw`DELETE FROM "User" WHERE id = ${userId}`;
    res.status(200).json({ message: "Berhasil menghapus data user!" });
  } catch (err) {
    console.log("Gagal menghapus data user!");
    res.status(500).send({ error: "Internal server error:", err });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId: number = Number(req.params.id);
    const { name, email, password, role } = req.body;
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
};
