/** @type {HTMLInputElement|null} */
var inputEmail = null;
/** @type {HTMLInputElement|null} */
var inputPassword = null;
/** @type {HTMLInputElement|null} */
var frmLogin = null;

import obtenerToken from "../servicios/obtener-token-en-local-storage.js";
import { usuariosServices } from "../servicios/usuarios-servicios.js";


export function setLogin() {
    frmLogin = /** @type {HTMLInputElement|null} */ (document.getElementById('frmLogin'));
    const btnLogout = /** @type {HTMLInputElement|null} */ (document.getElementById('btnLogout'));
    btnLogout.addEventListener('click', logout);

    if (getUsuarioAutenticado()) {
        if (frmLogin)
            frmLogin.outerHTML = '';

    } else {
        document.getElementById("sitio").classList.add('d-none');
    }
    inputEmail = /** @type {HTMLInputElement|null} */ (document.getElementById('loginEmail'));
    inputPassword = /** @type {HTMLInputElement|null} */ (document.getElementById('loginPassword'));

    const btnLogin = document.getElementById('iniciar-sesion');
    if (!inputEmail || !inputPassword)
        return;
    inputEmail.addEventListener('blur', validarForm);
    inputPassword.addEventListener('blur', validarForm);

    btnLogin.addEventListener('click', usuarioExiste);


}


async function usuarioExiste() {

    const spinner = document.querySelector('#spinner');

    usuariosServices.login(inputEmail.value, inputPassword.value)
        .then(respuesta => respuesta.json())
        .then(data => {
            localStorage.setItem("token", data.access_token)
        })
        .catch(error => console.log(error));
    const usuario = await usuariosServices.obtenerInfoDelAutenticado().then(respuesta => respuesta.json())
    if (usuario === undefined) {
        mostrarMensaje('Email o contraseña incorrecto, intenta nuevamente');
    } else {
        //ocultar login
        frmLogin.outerHTML = '';
        document.getElementById("sitio").classList.remove('d-none');

        console.log(usuario)
        //guardar en sessionStorage
        sessionStorage.setItem('usuarioId', usuario.id);
        sessionStorage.setItem('usuarioActivo', usuario.apellido_nombre);
        sessionStorage.setItem('usuarioFoto', usuario.foto);

        setUsuarioAutenticado(true);
        window.location.href = "#/home";
    }
}




function validarForm(e) {

    return true;

}

function mostrarMensaje(msj) {
    alert(msj);
}


function setUsuarioAutenticado(booleano) {

    sessionStorage.setItem('autenticado', booleano);


}
function getUsuarioAutenticado() {

    return (sessionStorage.getItem('autenticado') === "true");


}

function logout() {
    setUsuarioAutenticado(false);
    localStorage.removeItem("token")
    window.location.replace("index.html")
}
