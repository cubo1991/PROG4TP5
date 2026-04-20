import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "tp4_db",
  password: process.env.DB_PASSWORD || "root",
  port: Number(process.env.DB_PORT) || 5432,
});

// Crea la tabla si no existe y agrega las columnas que falten.
// Esto permite que si la tabla ya existía de una versión anterior
// (ej: solo con nombre y email), se actualice sin perder datos.
export async function initDB() {
  // 1. Crear tabla con la estructura completa si no existe.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS participantes (
      id BIGINT PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      edad TEXT NOT NULL DEFAULT '',
      pais TEXT NOT NULL DEFAULT '',
      modalidad TEXT NOT NULL DEFAULT '',
      tecnologias TEXT[] NOT NULL DEFAULT '{}',
      nivel TEXT NOT NULL DEFAULT '',
      acepta_terminos BOOLEAN NOT NULL DEFAULT false
    );
  `);

  // 2. Para tablas viejas: agregar columnas que falten.
  await pool.query(`
    ALTER TABLE participantes
      ADD COLUMN IF NOT EXISTS edad TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS pais TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS modalidad TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS tecnologias TEXT[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS nivel TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS acepta_terminos BOOLEAN NOT NULL DEFAULT false;
  `);

  // 3. Asegurar que id sea BIGINT (Date.now() no entra en INTEGER).
  //    Si ya era BIGINT no hace nada; si era INTEGER/SERIAL lo promueve.
  await pool.query(
    `ALTER TABLE participantes ALTER COLUMN id TYPE BIGINT USING id::bigint;`
  );
}
