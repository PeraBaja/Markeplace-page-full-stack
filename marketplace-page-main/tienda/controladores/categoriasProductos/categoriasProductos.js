import { categoriasServices } from "../../../servicios/categorias-servicios.js";

const htmlCategorias = await fetch("assets/modulos/categorías.html").then(respuesta => respuesta.text())

export async function categoriasProductos() {
    let d = document;
    let seccionCategorias = d.querySelector('.seccionCategorias');

    // Insertamos el HTML de las categorías en el contenedor
    if (seccionCategorias === undefined) return;

    seccionCategorias.innerHTML = htmlCategorias;
    const categorías = await categoriasServices.listar().then(respuesta => respuesta.json());
    const elementoCategorías = document.querySelector(".categories")
    categorías.forEach(categoría => {
        console.log(categoría)
        elementoCategorías.innerHTML += `<a href="#${categoría.descripción}" class="category-box category-${categoría.id}">
        <p>${categoría.descripción}</p>`

    })
}
