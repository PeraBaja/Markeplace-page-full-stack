import obtenerToken from "../servicios/obtener-token-en-local-storage.js";
import { usuariosServices } from "../servicios/usuarios-servicios.js";
import { App } from "./App.js";

document.addEventListener('DOMContentLoaded', App);
window.addEventListener("hashchange", App);
window.addEventListener("DOMContentLoaded", () => {
    chequearRutaYRedirigir();
});
window.addEventListener("hashchange", () => {
    chequearRutaYRedirigir();
});
async function chequearRutaYRedirigir() {
    const ruta = window.location.pathname;
    /**@type {any} */
    console.log([window.location.href, window.location.hash])
    const usuario = await usuariosServices.obtenerInfoDelAutenticado()
        .then(respuesta => respuesta.json())
        .catch(err => {
            if (window.location.hash === "") return null
            localStorage.removeItem("token")
            sessionStorage.setItem("autenticado", `${false}`)
            window.location.href = "/f/";
        })
    if (ruta.startsWith("/f") && (usuario.rol !== "administrador")) {
        console.log(window.location.href)
        window.location.href = "/f/tienda/tienda.html";
    }
}