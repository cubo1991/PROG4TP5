import { Router } from "express";
import { pool } from "../db";

const router = Router();

// Helper: convierte la fila de la DB (snake_case) al objeto Participante que
// espera el frontend (camelCase).
function rowToParticipante(row: any) {
  return {
    id: Number(row.id),
    nombre: row.nombre,
    email: row.email,
    edad: row.edad,
    pais: row.pais,
    modalidad: row.modalidad,
    tecnologias: row.tecnologias ?? [],
    nivel: row.nivel,
    aceptaTerminos: row.acepta_terminos,
  };
}

// GET /participantes
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM participantes ORDER BY id ASC"
    );
    res.json(result.rows.map(rowToParticipante));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener participantes" });
  }
});

// POST /participantes
router.post("/", async (req, res) => {
  try {
    const {
      id,
      nombre,
      email,
      edad,
      pais,
      modalidad,
      tecnologias,
      nivel,
      aceptaTerminos,
    } = req.body;

    // Si no viene id desde el frontend generamos uno basado en el timestamp
    const nuevoId = id ?? Date.now();

    const result = await pool.query(
      `INSERT INTO participantes
        (id, nombre, email, edad, pais, modalidad, tecnologias, nivel, acepta_terminos)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        nuevoId,
        nombre,
        email,
        edad,
        pais,
        modalidad,
        tecnologias ?? [],
        nivel,
        aceptaTerminos ?? false,
      ]
    );

    res.status(201).json(rowToParticipante(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear participante" });
  }
});

// PUT /participantes/:id - Actualizar un participante existente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      email,
      edad,
      pais,
      modalidad,
      tecnologias,
      nivel,
      aceptaTerminos,
    } = req.body;

    const result = await pool.query(
      `UPDATE participantes 
       SET nombre = $1, email = $2, edad = $3, pais = $4, modalidad = $5, 
           tecnologias = $6, nivel = $7, acepta_terminos = $8
       WHERE id = $9
       RETURNING *`,
      [
        nombre,
        email,
        edad,
        pais,
        modalidad,
        tecnologias ?? [],
        nivel,
        aceptaTerminos ?? false,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Participante no encontrado" });
    }

    res.json(rowToParticipante(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar participante" });
  }
});

// DELETE /participantes/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM participantes WHERE id = $1", [id]);
    res.json({ mensaje: "Participante eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar participante" });
  }
});

// DELETE /participantes (extra: reset completo, útil para el botón "Resetear")
router.delete("/", async (_req, res) => {
  try {
    await pool.query("DELETE FROM participantes");
    res.json({ mensaje: "Todos los participantes fueron eliminados" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al resetear participantes" });
  }
});

export default router;
