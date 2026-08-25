const express = require("express");
const cors = require("cors");
const conectarMongoDB = require("./mongo");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db;

async function iniciarServidor() {
  db = await conectarMongoDB();

  app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
  });
}

app.get("/api/productos", async (req, res) => {
  try {
    const productos = await db
      .collection("productos")
      .find({})
      .toArray();

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los productos",
      error: error.message,
    });
  }
});

app.get("/api/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const producto = await db
      .collection("productos")
      .findOne({ id: id });

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el producto",
      error: error.message,
    });
  }
});

iniciarServidor();