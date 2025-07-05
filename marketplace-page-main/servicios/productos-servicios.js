import manejarRespuesta from "./manejar-respuesta.js";
import obtenerToken from "./obtener-token-en-local-storage.js";
const url = "http://127.0.0.1:8000/productos";


async function listar(id) {
    let cadUrl;
    if (isNaN(id))
        cadUrl = url;
    else
        cadUrl = url + "/" + id;
    return await fetch(cadUrl)
        .then(manejarRespuesta);
}

async function obtenerFoto(id) {
    let cadUrl;

    cadUrl = url + "/obtener-foto/" + id;
    return await fetch(cadUrl)
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob))
}
async function subirFoto(id, archivo_foto) {
    let cadUrl;
    const data = new FormData()
    data.append("foto", archivo_foto)
    cadUrl = url + "/subir-foto/" + id;
    return await fetch(cadUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${obtenerToken()}`
        },
        body: data
    })
        .then(manejarRespuesta);
}

async function crear(nombre, precio, idCategoria) {

    return await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify({
            nombre: nombre,
            precio: precio,
            id_categoría: idCategoria
        })
    })
}

async function editar(id, nombre, precio, idCategoria) {

    let urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify({
            nombre: nombre,
            precio: precio,
            id_categoría: idCategoria
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
    })
}

async function listarPorCategoria(idCategoria) {
    const newUrl = new URL(url);
    newUrl.searchParams.append('idCategoria', idCategoria);
    return await fetch(newUrl)
        .then(manejarRespuesta);

}
export const productosServices = {
    listar,
    crear,
    editar,
    borrar,
    listarPorCategoria,
    subirFoto,
    obtenerFoto
}