import manejarRespuesta from "./manejar-respuesta.js";
import obtenerToken from "./obtener-token-en-local-storage.js";
const url = "http://127.0.0.1:8000/categorias";


async function listar(id) {
    let cadUrl;
    if (isNaN(id))
        cadUrl = url;
    else
        cadUrl = url + "/" + id;
    return await fetch(cadUrl)
        .then(manejarRespuesta);
}

async function crear(descripcion) {

    return await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify({
            descripción: descripcion
        })
    }).then(manejarRespuesta);
}

async function editar(id, descripcion) {

    let urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify({
            descripción: descripcion
        })
    })
}

async function borrar(id) {

    let urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${obtenerToken()}`
        }
    }).then(manejarRespuesta)
}

export const categoriasServices = {
    listar,
    crear,
    editar,
    borrar
}