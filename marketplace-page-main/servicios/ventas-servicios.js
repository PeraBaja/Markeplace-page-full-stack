import manejarRespuesta from "./manejar-respuesta.js";
import obtenerToken from "./obtener-token-en-local-storage.js";
const url = "http://127.0.0.1:8000/ventas";


async function listar(id) {
    let cadUrl;
    if (isNaN(id))
        cadUrl = url;
    else
        cadUrl = url + "/" + id;
    return await fetch(cadUrl, {
        headers: {
            "Authorization": `Bearer ${obtenerToken()}`
        }
    })
        .then(manejarRespuesta);
}

async function comprar(id_producto, cantidad, despachado) {

    return await fetch(url + "/yo", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify({
            id_producto: id_producto,
            cantidad: cantidad,
            despachado: despachado
        })
    }).then(manejarRespuesta);
}

async function editar(id, despachado) {
    let urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${obtenerToken()}`
        },
        body: JSON.stringify(despachado)
    }).then(manejarRespuesta);
}

async function listarVentasDespachadas(despachadas) {
    const newUrl = new URL(url);
    newUrl.searchParams.append('despachado', despachadas);
    console.log(newUrl.toString())
    return await fetch(newUrl, {
        headers: { "Authorization": `Bearer ${obtenerToken()}` }
    })
        .then(manejarRespuesta);

}

async function borrar(id) {

    let urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${obtenerToken()}`
        }
    }).then(manejarRespuesta);
}


export const ventasServices = {
    listar,
    comprar,
    editar,
    borrar,
    listarVentasDespachadas
}