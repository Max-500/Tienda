function validarSesion(){
	usuario = 'root';
    clave = '123456';
  
  var usuarioIngresado = $("#user").val();
  var claveIngresado = $("#pass").val();
  if((usuario == usuarioIngresado) && (clave == claveIngresado )){
  	MENSAJE = "ACCESO CORRECTO ..!!";
       $("#mensaje").html(MENSAJE);
    $("#modalMensaje").modal('show');
  }else{
   MENSAJE = "ACCESO INCORRECTO ..!!";
   $("#mensaje").html(MENSAJE);
   $("#modalMensaje").modal('show');
  }
}//end function validarSesion


let identificadorTiempoDeEspera;

function temporizadorDeRetraso() {
  identificadorTiempoDeEspera = setTimeout(funcionConRetraso, 5000);
}

function funcionConRetraso() {
    alert('entro')
  window.location('http://127.0.0.1:5501/index.html');
}

