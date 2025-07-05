export default async function manejarRespuesta(respuesta) {

    if (!respuesta.ok) {
        respuesta.json().then(data => {
            console.log(data.detail)
            alert(data.detail)
        }
        )

    }
    else return respuesta;
}