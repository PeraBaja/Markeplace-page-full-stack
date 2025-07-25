import { ventasServices } from "../../servicios/ventas-servicios.js";

const htmlVentas =
    `<div class="card">
   <div class="card-header">
   
   <h3 class="card-title"> 
      
   </h3>

   </div>

   <!-- /.card-header -->
   <div class="card-body">            
   <table id="ventasTable" class="table table-bordered table-striped tableVenta" width="100%">
       <thead>
           <tr>
           <th># </th>
           <th>ID Usuario</th>
           <th>ID Producto</th>
           <th>Cantidad</th>
           <th>Despachado</th>
           </tr>
       </thead>
   
   </table>
   </div>
   <!-- /.card-body -->
</div> `;

export async function Ventas() {
    let d = document
    let res;
    d.querySelector('.contenidoTitulo').innerHTML = 'Ventas';
    d.querySelector('.contenidoTituloSec').innerHTML = '';
    d.querySelector('.rutaMenu').innerHTML = "Ventas";
    d.querySelector('.rutaMenu').setAttribute('href', "#/ventas");
    let cP = d.getElementById('contenidoPrincipal');

    res = await ventasServices.listar().then(respuesta => respuesta.json());
    /*Agrego el check box en la tabla para marcar los pedidos despachados*/
    res.forEach(element => {
        let estado = '';
        if (element.despachado == true)
            estado = "checked"; //Estado en HTML para que el check box se muestre con el tilde. 
        element.action = `<input type="checkbox" class="ckboxDespachado" data-idVenta=${element.id} ${estado} >`;
    });
    console.log(res)

    cP.innerHTML = htmlVentas;
    await new Promise(requestAnimationFrame)
    llenarTabla(res);
}


function chkBoxChange(event) {
    let id = this.getAttribute('data-idVenta');
    let check = event.target.checked;
    ventasServices.editar(id, check);
}

function enlazarEventos(oSettings) {
    let d = document;
    let chkBoxDespachado = d.querySelectorAll(".ckboxDespachado");

    for (let i = 0; i < chkBoxDespachado.length; i++) {
        chkBoxDespachado[i].addEventListener("change", chkBoxChange);

    }
}

function llenarTabla(res) {


    // @ts-ignore
    new DataTable('#ventasTable', {
        responsive: true,
        data: res,
        columns: [
            { data: 'id' },
            { data: 'id_usuario' },
            { data: 'id_producto' },
            { data: 'cantidad' },
            { data: 'action', "orderable": false }

        ],
        fnDrawCallback: function (oSettings) {
            enlazarEventos(oSettings);
        },
        deferRender: true,
        retrive: true,
        processing: true,
        language: {
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sSearch: "Buscar:",
            sUrl: "",
            sInfoThousands: ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior"
            },
            oAria: {
                sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente"
            }

        }
    });

}
