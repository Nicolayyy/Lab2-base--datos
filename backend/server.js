const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/productos", (req, res) => {
  const consulta = `
    SELECT
      productos.id,
      productos.nombre,
      productos.descripcion,
      productos.precio,
      productos.existencias,
      proveedores.nombre AS proveedor_nombre,
      proveedores.contacto AS proveedor_contacto
    FROM productos
    INNER JOIN proveedores
      ON productos.proveedor_id = proveedores.id
  `;

  db.all(consulta, [], (error, filas) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener los productos",
        error: error.message,
      });
    }

    const productos = filas.map((fila) => ({
      id: fila.id,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      precio: fila.precio,
      existencias: fila.existencias,
      proveedor: {
        nombre: fila.proveedor_nombre,
        contacto: fila.proveedor_contacto,
      },
    }));

    res.json(productos);
  });
});

app.get("/api/productos/:id", (req, res) => {
  const id = Number(req.params.id);

  const consulta = `
    SELECT
      productos.id,
      productos.nombre,
      productos.descripcion,
      productos.precio,
      productos.existencias,
      proveedores.nombre AS proveedor_nombre,
      proveedores.contacto AS proveedor_contacto
    FROM productos
    INNER JOIN proveedores
      ON productos.proveedor_id = proveedores.id
    WHERE productos.id = ?
  `;

  db.get(consulta, [id], (error, fila) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener el producto",
        error: error.message,
      });
    }

    if (!fila) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    const producto = {
      id: fila.id,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      precio: fila.precio,
      existencias: fila.existencias,
      proveedor: {
        nombre: fila.proveedor_nombre,
        contacto: fila.proveedor_contacto,
      },
    };

    res.json(producto);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});