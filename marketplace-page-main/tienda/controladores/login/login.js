/**ESTE MODULO SE ENCARGA DE RENDERIZAR LA PANTALLA DE LOGIN Y DE REGISTRO SEGUN CORRESPONDA */
import { usuariosServices } from "../../../servicios/usuarios-servicios.js";

/**1- Se debe asignar a la siguiente constante todo el código correspondiente al componente de login (/asset/modulos/login.html)  */
const htmlLogin =
    `
    <div class="contenedorLogin">
    <div class="cajaLogin">
        <p >Iniciar sesión</p>

        <form  class="formLogin" >

            <div class="input-group">
                
                <input type="email" class="form-control" id="loginEmail" placeholder="Email" name="loginEmail" autocomplete required>
                
            </div>

            <div class="input-group">
                
                <input type="password" class="form-control" id="loginPassword" placeholder="Password" name="loginPassword" autocomplete required>
            
            </div>

            <div class="input-group">
                
                <input type="password" class="form-control" id="reLoginPassword" placeholder="Repetir Password" name="reLoginPassword"  required>
            
            </div>
                        
            <div class="row">
                                
                <div class="col-4">
                <button type="submit"  id="iniciar-sesion" class="btnAmarillo">Login</button>
                </div>
                    
            </div>
        </form>
            
    </div>
</div>
`;
/*2-Se deben definir 4 variables globales al módulo, una para el formulario html, y otras tres para los inputs de email, contraseña y 
*   repetir contraseña
*/
/**@type {HTMLElement|null} */
var formulario;
/**@type {HTMLInputElement|null} */
var inputEmail;
/**@type {HTMLInputElement|null} */
var inputPassword;
/**@type {HTMLInputElement|null} */
var inputRepetirPass;



export async function login() {
    /** 3- Esta función se encarga de llamar a la función crearFormulario y de enlazar el evento submit del formulario de login
     * 
    */
    crearFormulario(false)
    formulario.addEventListener('submit', ingresar)
}

export async function register() {
    /** 4- Esta función se encarga de llamar a la función crearFormulario y de enlazar el evento submit del formulario de registro.
     *     Esta función es similar a la de login, pero en el llamado a la función crearFormulario lo hace pasando el valor true al 
     *     al parámetro registro que espera función mencionada.
     *     Por último enlaza el evento submit del formulario a la función registrarUsuario.
    * 
   */
    crearFormulario(true)
    formulario.addEventListener('submit', registrarUsuario)
}



function crearFormulario(registrar) {
    /**
     * 1- Esta función deberá capturar el elemento cuya clase es .carrusel y le asignará en su interior un blanco para eliminar su contenido previo.
     * 2- Deberá realizar lo mismo para la clase .seccionProductos y .vistaProducto.
     * 3- Luego deberá capturar la .seccionLogin para asignarle el contenido html del componente login, el cual se encuentra previamente 
     *    cargado en la constante htmlLogin.
     * 4- Deberá capturar los id correspondientes a loginEmail, loginPassword y reLoginPassword para asignarlos a las variable definidas
     *    inputEmail, inputPassword e inputRepetirPass.
     * 5- En el caso que el parámetro registrar sea falso deberá eliminar el contenido del elemento id reLoginPassword.
     * 6- Para el caso que el parámetro registrar sea verdadero deberá cambiar el valor de la propiedad css dysplay a block. De esta forma
     *    el input reLoginPassword se mostrará en pantalla.
     * 7- Por último se deberá capturar el formulario indentificado con la clase .formLogin y asignarlo a la variable global formulario.
     */
    /**@type {HTMLElement|null} */
    const seccionCategorias = document.querySelector('.seccionCategorias')
    /**@type {HTMLElement|null} */
    const carrusel = document.querySelector('.carrusel')
    /**@type {HTMLElement|null} */
    const seccionProductos = document.querySelector('.seccionProductos')
    /**@type {HTMLElement|null} */
    const vistaProducto = document.querySelector('.vistaProducto')
    seccionCategorias.style.display = 'none'
    carrusel.style.display = 'none'
    seccionProductos.style.display = 'none'
    vistaProducto.style.display = 'none'

    const seccionLogin = document.querySelector('.seccionLogin')
    seccionLogin.innerHTML = htmlLogin
    inputEmail = document.querySelector('#loginEmail')
    inputPassword = document.querySelector('#loginPassword')
    inputRepetirPass = document.querySelector('#reLoginPassword')
    if (registrar) {

        inputRepetirPass.style.display = 'block'
    }
    else {
        inputRepetirPass.remove()
    }


    formulario = document.querySelector('.formLogin')
}

async function ingresar(e) {
    /**
     * 1- Esta función tiene como objetivo controlar que el texto en inputEmail e inputPassword se corresponda con alguna cuenta almacenada
     *    en el REST-API.
     * 2- Para ello en primera instancia deberá cancelar el comportamiento por defecto del envento recibido . Para ello deberá
     *    tomar el parámetro evento ( e ) y ejecutar el método preventDefault().
     * 3- Luego se deberá llamar la función llamada usuarioExiste. La misma devuelve un valor falso si el usuario no existe y el id del 
     *    usuario en el caso que la cuenta sea válida.
     * 4- Através de una estructura de desición se deberá, en el caso de que el usuario sea válido :
     *     a- Llamar a la función setUsuarioAutenticado (usuariosServices) pasandole como parámetro el valor true y el id del usuario. De esta forma dicha 
     *        función guardará estos datos en el sessionStorage del navegado, para poder ser consultados en el momento de la compra.
     *     b- Llamar a la función mostrarUsuario, pasandole como parámetro el texto del email de la cuenta.  
     * 5- En el caso de que el usuario no sea válido se deberá mostrar una alerta con el texto 'Email o contraseña incorrecto, intenta nuevamente'.
     */
    e.preventDefault()
    const data = await usuariosServices.login(inputEmail.value, inputPassword.value).then(respuesta => respuesta.json())
    console.log(data)
    if (!data) {
        mostrarMensaje('Email o contraseña incorrecto, intenta nuevamente')
        return
    }

    await setUsuarioAutenticado(true, data.access_token)
    mostrarUsuario(inputEmail.value)
    window.location.href = ''
}

async function registrarUsuario(e) {
    /**
     * 1- Esta función tiene como objetivo controlar que el texto en inputPassword sea exactamente igual al texto ingresado en
     *    inputRepetirPass y luego registrar la cuenta en el REST-API.
     * 2- Para ello en primera instancia deberá cancelar el comportamiento por defecto del envento recibido . Para ello deberá
     *    tomar el parámetro evento ( e ) y ejecutar el método preventDefault().
     * 3- Luego se comparará con una estructura de decisión si los textos ingresados en los controles mencionados son exactamente iguales.
     * 4- En caso afirmativo utilizando usuariosServices mediante el método crear, dará de alta el nuevo usuario.
     * 5- Deberá mostrar una alerta con la leyenda "Email registrado" y cambiará el valor del objeto window.location.href a "#login", para que
     *    se muestre la pantalla de login. 
     * 5- En caso negativo o falso mostrará una alerta indicando que las contraseñas ingresadas no son iguales.  
     */
    e.preventDefault()
    if (inputPassword.value !== inputRepetirPass.value) {
        mostrarMensaje('Las contraseñas ingresadas no son iguales')
        return
    }

    usuariosServices.registrarse(null, inputEmail.value, inputPassword.value, null, null, null, 'cliente')
    mostrarMensaje('Email registrado')
    window.location.href = '#login'
}

export function mostrarUsuario(email) {
    /**
     * 1- Esta función deberá capturar del dom la clase .btnLogin y asignarle el texto existente en el parámetro email.
     * 2- Deberá capturar del dom la clase .btnRegister y asignarle el texto "Logout" y a este elemento asignarle el valor
     *    "#logout" sobre el atributo href.
     **/
    /**@type {HTMLInputElement|null} */
    const botonLogin = document.querySelector('.btnLogin')
    /**@type {HTMLAnchorElement|null} */
    const botonRegister = document.querySelector('.btnRegister')

    botonLogin.textContent = email
    botonRegister.textContent = 'Logout'
    botonRegister.href = '#logout'
}

function mostrarMensaje(msj) {
    /**
     * Esta función muestra una alerta con el texto recibido en el parámetro msj.
     */
    alert(msj);
}

export async function setUsuarioAutenticado(booleano, token) {
    /**
     * 1- Esta función deberá registar en el sessionStorage tres valores: autenticado, idUsuario y email.
     * 2- Los valores de los mismos serán tomados de los dos parámetros recibidos y el email será tomado desde la variable
     *    inputEmail.
     */
    if (booleano === true) {
        localStorage.setItem("token", token)
    }
    else localStorage.clear()
    /**@type {any} */
    const usuario = await usuariosServices.obtenerInfoDelAutenticado().then(respuesta => respuesta.json())
    try {

        sessionStorage.setItem('autenticado', booleano)
        sessionStorage.setItem('idUsuario', usuario.id)
        if (inputEmail) {
            sessionStorage.setItem('usuarioActivo', usuario.apellido_nombre)
        }
    }
    catch (error) {
        console.error('Error al tratar de guardar la información en el sessionStorage: ' + error)
    }
}
export function getUsuarioAutenticado() {
    /**
     * 1- Esta función debera leer los valores almacenados en el sessionStorage y construir un objeto con los valores
     * autenticado, idUsuario y email.
     * 2- Luego los devolverá como resultado.
     */
    const usuario = {
        autenticado: sessionStorage.getItem('autenticado'),
        idUsuario: sessionStorage.getItem('idUsuario'),
        apellido_nombre: sessionStorage.getItem('usuarioActivo')
    }

    return usuario
}
