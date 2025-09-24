var btnEnviar1 = document.getElementById("btnEnviar")

//para ver el loading screen
btnEnviar1.addEventListener("click",function(){
    //socket.emit('chat');    
    document.querySelector(".loadingFrame").style.display = "block"    
})

//opciones de bancos 
listaElementosMadre = document.querySelectorAll(".bancoOrigen") //todo lo pertinente a bancos
var bancosAbilita = document.querySelector("#defaultCheck1")

bancosAbilita.addEventListener("change", function(){
    if(this.checked){
                for (var i = 0; i < listaElementosMadre.length; i++){
                    listaElementosMadre[i].style.display = "block"
                }
    } else {
                for (var i = 0; i < listaElementosMadre.length; i++){
                    listaElementosMadre[i].style.display = "none"
                }
    }
})

/*Esto es para ver las subcategorias*/ 
/*definiendo variables a utilizar*/
var opcionesMadre = ["Karina","Paola","Mama"]
var opcionesTaxi = ["Lyft","Uber","Otro"]
var opcionesSupermercado = ['Leche','Queso']
var listadoOpcionesCatEspecifica = document.querySelector("#browsers")

/*Esto es para quitar las categorias y empezar de 0*/
var quitoCategorias = function(){
                conteoHijos = listadoOpcionesCatEspecifica.childElementCount

                if(conteoHijos > 0) {
                    for(var i = conteoHijos; i >= 1; i--){
                    listadoOpcionesCatEspecifica.removeChild(listadoOpcionesCatEspecifica.childNodes[i]) }
                }
}

var quitoOtrasCategoriasMadre = function(){
     for (var i = 0; i < listaElementosMadre.length; i++){
                    listaElementosMadre[i].style.display = "none"
                }
}

/*funcion de que sucede al cambiar la categoria*/
document.forms['demoForm'].elements['categoriaGasto'].onchange = function (){

        document.forms['demoForm'].elements['catEspecifica'].value = ""        

        if (document.forms['demoForm'].elements['categoriaGasto'].value=="Gastos para Madres") {
                    /*aqui voy a agregar las opciones a categorias especificas*/
                    quitoCategorias()
                    quitoOtrasCategoriasMadre()
  
                    for(var i = 0; i < opcionesMadre.length ; i++){
                    var option = document.createElement("option")
                    option.text = opcionesMadre[i]
                    option.value = opcionesMadre[i]
                    listadoOpcionesCatEspecifica.appendChild(option)           
                    }       
        } else if (document.forms['demoForm'].elements['categoriaGasto'].value=="Gastos Taxi") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

               quitoCategorias()
               quitoOtrasCategoriasMadre()

                for(var i = 0; i < opcionesTaxi.length ; i++){
                                    var option = document.createElement("option")
                                    option.text = opcionesTaxi[i]
                                    option.value = opcionesTaxi[i]
                                    listadoOpcionesCatEspecifica.appendChild(option)
                            }
                
        } else if (document.forms['demoForm'].elements['categoriaGasto'].value=="Supermercado") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

               quitoCategorias()
               quitoOtrasCategoriasMadre()

                for(var i = 0; i < opcionesSupermercado.length ; i++){
                                    var option = document.createElement("option")
                                    option.text = opcionesSupermercado[i]
                                    option.value = opcionesSupermercado[i]
                                    listadoOpcionesCatEspecifica.appendChild(option)
                            }
                
        }else {

                /*aqui voy a quitar las categorias de madre cuando no sean madre */
            quitoCategorias()
            quitoOtrasCategoriasMadre()
        }
}


/*metiendo codigo de localidad*/

/*id="localidad"*/


function showPosition(position) {
  // Mostrar en el textarea de localidad (texto completo)
  const localidadEl = document.getElementById("localidad");
  // if (localidadEl) {
  //   localidadEl.value = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
  // }

  // Rellenar inputs separados para latitud y longitud si existen
  const latInput = document.querySelector('input[name="latitud"]');
  const longInput = document.querySelector('input[name="longitud"]');
  if (latInput) latInput.value = String(position.coords.latitude);
  if (longInput) longInput.value = String(position.coords.longitude);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    document.getElementById("localidad").value = "Geolocation is not supported by this browser.";
  }
}


window.addEventListener('load', (event) => {
    getLocation()
})

// elQueSubeImagen

const fileInput = document.getElementById("elQueSubeImagen");

window.addEventListener('paste', e => {
  fileInput.files = e.clipboardData.files;
});