import { usuariosServices } from "../../servicios/usuarios-servicios.js";


const htmlAmUsuarios = `
<div class="card card-dark card-outline">

	<form  class="needs-validation frmAmUsuario"  enctype="multipart/form-data">
	
		<div class="card-header">
               
			<div class="col-md-8 offset-md-2">	
               
				<!--=====================================
                Nombre
                ======================================-->
				
				<div class="form-group mt-5">
					
					<label>Apellido y Nombre</label>

					<input 
					type="text" 
					class="form-control"
					pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}"
					onchange="validateJS(event,'text')"
					name="nombre"
                    id="usuarioNombre"
					required>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>

				<!--=====================================
                Correo electrónico
                ======================================-->

				<div class="form-group mt-2">
					
					<label>Email</label>

					<input 
					type="email" 
					class="form-control"
					onchange="validateRepeat(event,'email')"
					name="email"
                    id="usuarioEmail"
					required>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>


				<!--=====================================
                Contraseña
                ======================================-->

				<div class="form-group mt-2">
					
					<label>Password</label>

					<input 
					type="password" 
					class="form-control"
					onchange="validateJS(event,'pass')"
					name="password"
                    id="usuarioPassword" 
					required
					>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>


				<!--=====================================
                Foto
                ======================================-->

				<div class="form-group mt-2">
					
					<label>Foto</label>
			
					<label for="customFile" class="d-flex justify-content-center">
						
						<figure class="text-center py-3">
							
							<img src="../../img/usuarios/default/anonymous.png" class="img-fluid rounded-circle changePicture" style="width:150px">

						</figure>

					</label>

					<div class="custom-file">
						
						<input 
						type="file" 
						id="customFile" 
						class="custom-file-input"
						accept="image/*"
						onchange="validateImageJS(event,'changePicture')"
						name="picture"
                       	>

						<div class="valid-feedback">Valid.</div>
            			<div class="invalid-feedback">Please fill out this field.</div>

						<label for="customFile" class="custom-file-label">Elegir imágen</label>

					</div>

				</div>

				<!--=====================================
                País
                ======================================-->

             	<div class="form-group mt-2">
					
					<label>País</label>

					

					<select class="form-control select2 changeCountry" name="pais" id="usuarioPais" required>
						
						<option value>Seleccionar país</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Chile">Chile</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Perú">Perú</option>
                        <option value="Uruguay">Chile</option>

					</select>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>  

				<!--=====================================
                Ciudad
                ======================================-->

                <div class="form-group mt-2">
					
					<label>Ciudad</label>

					<input 
					type="text" 
					class="form-control"
					onchange="validateJS(event,'text')"
					name="ciudad"
                    id="usuarioCiudad"
					required>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>


				<!--=====================================
                Teléfono
                ======================================-->

                <div class="form-group mt-2 mb-5">
					
					<label>Teléfono</label>

					<div class="input-group">

						<div class="input-group-append">
							<span class="input-group-text dialCode">+54</span>
						</div>

						<input 
						type="text" 
						class="form-control"
						onchange="validateJS(event,'phone')"
						name="telefono"
                        id="usuarioTelefono"
						required>

					</div>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>

			
			</div>
		

		</div>

		<div class="card-footer">
			
			<div class="col-md-8 offset-md-2">
	
				<div class="form-group mt-3">

					<a href="#/usuarios" class="btn btn-light border text-left">Cancelar</a>
					
					<button type="submit" class="btn bg-dark float-right">Guardar</button>

				</div>

			</div>

		</div>


	</form>


</div> `;
var formulario;
var inputNombre;
var inputCorreo;
var inputPass;
var imgAvatar;
var archivo_foto;
var selPais;
var inputCiudad;
var inputTelefono;
var idUsuario;
var rolUsuario;
export async function newRegister() {
    let d = document;

    d.querySelector('.contenidoTitulo').innerHTML = 'Agregar Usuario';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Agregar';

    crearFormulario();

    formulario = d.querySelector(".frmAmUsuario")
    formulario.addEventListener("submit", guardar);
}

export async function editRegister(id) {
    let d = document;
    idUsuario = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Usuario';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Editar';
    crearFormulario();

    formulario = d.querySelector(".frmAmUsuario")
    formulario.addEventListener("submit", modificar);
    let usuario = await usuariosServices.listar(id).then(respuesta => respuesta.json());


    inputNombre.value = usuario.apellido_nombre;
    inputCorreo.value = usuario.dirección_correo;
    if (usuario.foto_perfil !== undefined)
        imgAvatar.src = await usuariosServices.obtenerFotoPerfil(id)
    selPais.value = usuario.país;
    inputCiudad.value = usuario.ciudad;
    inputTelefono.value = usuario.teléfono;
    rolUsuario = usuario.rol;
}

function crearFormulario() {
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Usuarios";
    d.querySelector('.rutaMenu').setAttribute('href', "#/usuarios");

    let cP = d.getElementById('contenidoPrincipal');
    cP.innerHTML = htmlAmUsuarios;

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = './controladores/validaciones.js';
    cP.appendChild(script);

    inputNombre = d.getElementById('usuarioNombre');
    inputCorreo = d.getElementById('usuarioEmail');
    inputPass = d.getElementById('usuarioPassword');
    imgAvatar = d.querySelector('.changePicture');
    selPais = d.getElementById('usuarioPais');
    inputCiudad = d.getElementById('usuarioCiudad');
    inputTelefono = d.getElementById('usuarioTelefono');
    archivo_foto = d.getElementById("customFile")
}

async function guardar(e) {

    e.preventDefault();

    var pais = selPais.options[selPais.selectedIndex];
    const usuario = await usuariosServices.crear(inputNombre.value, inputCorreo.value, inputPass.value,
        pais.value, inputCiudad.value, inputTelefono.value, rolUsuario)
        .then(respuesta => {
            return respuesta.json()
        })
        .catch(error => console.log(error))
    console.log(`usuario a subir foto: ${usuario} archivo: ${archivo_foto.files[0]}, elemento: ${archivo_foto}`)
    if (archivo_foto.files[0] === undefined) {
        formulario.reset();
        window.location.href = "#/usuarios";
        return;
    }
    await usuariosServices.subirFotoPerfil(usuario.id, archivo_foto.files[0])
    formulario.reset();
    window.location.href = "#/usuarios";
}

async function modificar(e) {

    e.preventDefault();

    var pais = selPais.options[selPais.selectedIndex];
    await usuariosServices.editar(idUsuario, inputNombre.value, inputCorreo.value, inputPass.value,
        pais.value, inputCiudad.value, inputTelefono.value, rolUsuario)
        .then(respuesta => {
            return respuesta.json()
        })
        .catch(error => console.log(error))
    console.log(`usuario a subir foto: archivo: ${archivo_foto.files[0]}, elemento: ${archivo_foto}`)
    for (let i = 0; i < archivo_foto.files.length; i++) {
        console.log(archivo_foto.files[i])
    }
    if (archivo_foto.files[0] === undefined) {
        formulario.reset();
        window.location.href = "#/usuarios";
        return;
    }
    await usuariosServices.subirFotoPerfil(idUsuario, archivo_foto.files[0])
    formulario.reset();
    window.location.href = "#/usuarios";
}