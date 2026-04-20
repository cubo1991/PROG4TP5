import express from "express";
import cors from "cors";
import participantesRoutes from "./routes/participantes";
import { initDB } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/participantes", participantesRoutes);

const PORT = Number(process.env.PORT) || 3000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error inicializando la base de datos:", err);
    process.exit(1);
  });
