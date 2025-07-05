import manejarRespuesta from "./manejar-respuesta.js";
import obtenerToken from "./obtener-token-en-local-storage.js";
const url = "http://127.0.0.1:8000/usuarios";

//API-REST USUARIOS//

async function listar(id) {
    let cadUrl;
    if (isNaN(id))
        cadUrl = url;
    else
        cadUrl = url + "/" + id;
    return await fetch(cadUrl, {
        headers:
            { "Authorization": `Bearer ${obtenerToken()}` }
    })
        .then(manejarRespuesta);
}

async function crear(apellido_nombre, correo, password, pais, ciudad, telefono, role = "cliente") {

    return await fetch(url, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${obtenerToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apellido_nombre: apellido_nombre,
            dirección_correo: correo,
            contraseña: password,
            país: pais,
            ciudad: ciudad,
            teléfono: telefono,
            rol: role
        })
    }).then(manejarRespuesta);
}
async function registrarse(apellido_nombre, correo, password, pais, ciudad, telefono, role = "cliente") {

    return await fetch(url + "/registarse", {
        method: 'POST',
        headers: {

            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apellido_nombre: apellido_nombre,
            dirección_correo: correo,
            contraseña: password,
            país: pais,
            ciudad: ciudad,
            teléfono: telefono,
            rol: role
        })
    }).then(manejarRespuesta);
}

async function editar(id, apellido_nombre, correo, password, pais, ciudad, telefono, role = "cliente") {

    let urlPut = url + "/" + id;
    return await fetch(urlPut, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${obtenerToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            apellido_nombre: apellido_nombre,
            dirección_correo: correo,
            contraseña: password,
            país: pais,
            ciudad: ciudad,
            teléfono: telefono,
            rol: role
        })
    }).then(manejarRespuesta);
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
/**
 * Hace login con OAuth2.
 * @param {string} dirección_correo
 * @param {string} contraseña
 * @returns {Promise<any>}
 */
async function login(dirección_correo, contraseña) {
    let urlPut = url + "/token";
    return await fetch(urlPut, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "grant_type": "password",
            "password": contraseña,
            "username": dirección_correo,
            "scope": "",
            "client_id": "",
            "client_secret": ""
        }).toString()
    }).then(manejarRespuesta);
}

async function obtenerInfoDelAutenticado() {
    if (!localStorage.token) return
    let urlPut = url + "/yo";
    return await fetch(urlPut, {
        headers: {
            "Authorization": `Bearer ${obtenerToken()}`
        },
    }).then(manejarRespuesta);
}
async function obtenerFotoPerfil(id) {
    let cadUrl;

    cadUrl = url + "/obtener-foto/" + id;
    return await fetch(cadUrl, {
        headers: {
            "Authorization": `Bearer ${obtenerToken()}`
        }
    })
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob))
}
async function subirFotoPerfil(id, archivo_foto) {
    let cadUrl;
    const data = new FormData()
    data.append("foto_perfil", archivo_foto)
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

export const usuariosServices = {
    listar,
    crear,
    editar,
    borrar,
    login,
    obtenerInfoDelAutenticado,
    registrarse,
    obtenerFotoPerfil,
    subirFotoPerfil
}