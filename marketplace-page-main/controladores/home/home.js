import { usuariosServices } from "../../servicios/usuarios-servicios.js";
import { ventasServices } from "../../servicios/ventas-servicios.js";
import { productosServices } from "../../servicios/productos-servicios.js";
const htmlHome =
    ` <div class="row" >
    <div class="col-lg-3 col-6">
        <!-- small box -->
        <div class="small-box bg-info">
            <div class="inner">
            <h3 id="indVentas">150</h3>

            <p>Ventas</p>
            </div>
            <div class="icon">
                <i class="ion ion-bag"></i>
            </div>
            <a href="#/ventas" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
        <!-- small box -->
        <div class="small-box bg-success">
            <div class="inner">
            <h3 id="indSindespachar">53</h3>

            <p>Sin despachar</p>
            </div>
            <div class="icon">
            <i class="ion ion-stats-bars"></i>
            </div>
            <a href="#/ventas" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
        <!-- small box -->
        <div class="small-box bg-warning">
            <div class="inner">
            <h3 id="indUsuarios">44</h3>

            <p>Usuarios Registrados</p>
            </div>
            <div class="icon">
            <i class="ion ion-person-add"></i>
            </div>
            <a href="#/usuarios" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
        <!-- small box -->
        <div class="small-box bg-danger">
            <div class="inner">
            <h3 id="indProductos">65</h3>

            <p>Productos</p>
            </div>
            <div class="icon">
            <i class="ion ion-pie-graph"></i>
            </div>
            <a href="#/productos" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>
    <!-- ./col -->
</div>`

export async function Home() {
    let d = document
    let data;
    d.querySelector('.contenidoTitulo').innerHTML = 'Home';
    d.querySelector('.contenidoTituloSec').innerHTML = '';
    d.querySelector('.rutaMenu').innerHTML = "Home";
    d.querySelector('.rutaMenu').setAttribute('href', "#/home");
    let cP = d.getElementById('contenidoPrincipal');


    cP.innerHTML = htmlHome;

    let indVentas = d.getElementById("indVentas");
    let indSinDespachar = d.getElementById("indSindespachar");
    let indUsuarios = d.getElementById("indUsuarios");
    let indProductos = d.getElementById("indProductos");

    data = await usuariosServices.listar().then(respuesta => respuesta.json());
    //CANTIDAD DE USUARIOS
    indUsuarios.innerHTML = data.length.toString();

    //CANTIDAD DE VENTAS
    data = await ventasServices.listar().then(respuesta => respuesta.json());
    indVentas.innerHTML = data.length.toString();

    //CANTIDAD DE VENTAS SIN DESPACHAR (los valodata que espera para el campo despachado son true y false)
    data = await ventasServices.listarVentasDespachadas(false).then(respuesta => respuesta.json());;
    indSinDespachar.innerHTML = data.length.toString();

    //CANTIDAD DE PRODUCTOS
    data = await productosServices.listar().then(respuesta => respuesta.json());
    indProductos.innerHTML = data.length.toString();

}
