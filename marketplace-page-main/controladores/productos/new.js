import { categoriasServices } from "../../servicios/categorias-servicios.js";
import { productosServices } from "../../servicios/productos-servicios.js";


const htmlAmProductos = `
<div class="card card-dark card-outline">

	<form  class="needs-validation frmAmProducto"  enctype="multipart/form-data">
	
		<div class="card-header">
               
			<div class="col-md-8 offset-md-2">	
               
				<!--=====================================
                Nombre
                ======================================-->
				
				<div class="form-group mt-5">
					
					<label>Nombre</label>

					<input 
					type="text" 
					class="form-control"
					
					onchange="validateJS(event,'t&n')"
					name="nombre"
                    id="productoNombre"
					required>

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
							
							<img src="../../img/usuarios/default/anonymous.png" class="img-fluid  changePicture" style="width:150px">

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
                Precio
                ======================================-->
				
				<div class="form-group mt-5">
					
					<label>Precio</label>

					<input 
					type="number" 
                    step="0.01"
					class="form-control"
					name="precio"
                    id="productoPrecio"
					required>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>

				<!--=====================================
                País
                ======================================-->

             	<div class="form-group mt-2">
					
					<label>Categoria</label>
				

					<select class="form-control select2" name="categoria" id="productoCategoria" required>
						<option value="">Seleccionar Categoría</option>
						
					</select>

					<div class="valid-feedback">Valid.</div>
            		<div class="invalid-feedback">Please fill out this field.</div>

				</div>  

				
			
			</div>
		

		</div>

		<div class="card-footer">
			
			<div class="col-md-8 offset-md-2">
	
				<div class="form-group mt-3">

					<a href="#/productos" class="btn btn-light border text-left">Cancelar</a>
					
					<button type="submit" class="btn bg-dark float-right">Guardar</button>

				</div>

			</div>

		</div>


	</form>


</div> `;
var formulario;

var txtNombre;
var fileFoto;
var selCategoria;
var txtPrecio;
var archivo_foto;
var idProducto;

export async function newRegister() {
    let d = document;

    d.querySelector('.contenidoTitulo').innerHTML = 'Agregar Producto';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Agregar';
    crearFormulario();

    formulario = d.querySelector(".frmAmProducto")
    formulario.addEventListener("submit", guardar);
}

export async function editRegister(id) {
    let d = document;
    idProducto = id;
    d.querySelector('.contenidoTitulo').innerHTML = 'Editar Producto';
    d.querySelector('.contenidoTituloSec').innerHTML += 'Editar';
    crearFormulario();

    formulario = d.querySelector(".frmAmProducto")
    formulario.addEventListener("submit", modificar);
    let producto = await productosServices.listar(id).then(respuesta => respuesta.json());

    txtNombre.value = producto.nombre;

    if (producto.foto !== undefined)
        fileFoto.src = await productosServices.obtenerFoto(id)
    selCategoria.value = producto.id_categoría;
    txtPrecio.value = producto.precio;

}

async function crearFormulario() {
    let d = document;
    d.querySelector('.rutaMenu').innerHTML = "Productos";
    d.querySelector('.rutaMenu').setAttribute('href', "#/productos");

    let cP = d.getElementById('contenidoPrincipal');
    cP.innerHTML = htmlAmProductos;

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = './controladores/validaciones.js';
    cP.appendChild(script);
    await new Promise(requestAnimationFrame)
    txtNombre = d.getElementById('productoNombre');
    fileFoto = d.querySelector('.changePicture');
    txtPrecio = d.getElementById('productoPrecio');
    selCategoria = d.getElementById('productoCategoria');
    archivo_foto = d.getElementById("customFile")

    /*Cargar categorías en select*/
    let res = await categoriasServices.listar().then(respuesta => respuesta.json());
    res.forEach(element => {
        let opcion = d.createElement('option');
        opcion.value = element.id;
        opcion.text = element.descripción;
        selCategoria.appendChild(opcion);
    });
}

async function guardar(e) {

    e.preventDefault();

    const categoria = selCategoria.options[selCategoria.selectedIndex];
    const usuario = await productosServices.crear(txtNombre.value, txtPrecio.value,
        categoria.value)
        .then(respuesta => {
            return respuesta.json()
        })
        .catch(error => console.log(error))
    console.log(`usuario a subir ${usuario} archivo: ${archivo_foto.files[0]}, elemento: ${archivo_foto}`)
    if (archivo_foto.files[0] === undefined) {
        formulario.reset();
        window.location.href = "#/productos";
        return;
    }
    await productosServices.subirFoto(usuario.id, archivo_foto.files[0])
    formulario.reset();
    window.location.href = "#/productos";
}

async function modificar(e) {

    e.preventDefault();

    const categoria = selCategoria.options[selCategoria.selectedIndex];
    await productosServices.editar(idProducto, txtNombre.value, txtPrecio.value,
        categoria.value)
        .then(respuesta => {
            return respuesta.json()
        })
        .catch(error => console.log(error))
    if (archivo_foto.files[0] === undefined) {
        formulario.reset();
        window.location.href = "#/productos";
        return;
    }
    console.log(`${archivo_foto.files[0]}, elemento: ${archivo_foto}, id ${idProducto}`)
    await productosServices.subirFoto(idProducto, archivo_foto.files[0])
    formulario.reset();
    window.location.href = "#/productos";
}