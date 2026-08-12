import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ListaProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((respuesta) => respuesta.json())
      .then((datos) => setProductos(datos))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <section>
      <h2>Productos</h2>

      <div className="lista-productos">
        {productos.map((producto) => (
          <article className="tarjeta" key={producto.id}>
            <h3>{producto.nombre}</h3>

            <p>{producto.descripcion}</p>

            <p>
              <strong>Precio:</strong>{" "}
              ${producto.precio.toLocaleString("es-CO")}
            </p>

            {producto.existencias > 0 ? (
              <p className="disponible">
                Disponible: {producto.existencias} unidades
              </p>
            ) : (
              <p className="agotado">Producto agotado</p>
            )}

            <Link className="boton-detalle" to={`/producto/${producto.id}`}>
              Ver detalle
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ListaProductos;