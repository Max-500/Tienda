const ventanaCarga = document.getElementById('carga');
const ventanaPrincipal = document.getElementById('main');

function reveal (){
    ventanaPrincipal.style.display='block';
    ventanaCarga.style.display='none';
}
function ready(){
    document.body.addEventListener('keydown',reveal);
}setTimeout(ready,1000);
