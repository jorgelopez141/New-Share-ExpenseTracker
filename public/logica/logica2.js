/*Haciendo listas para pre-popular */
var BofA = ["BofA-TC-6930"]
var WF = ["WF-checking-1189106519","WF-TD-8167","WF-TC-38163"]
var Aspire = ["Aspire-TC-8645","Aspire-TC-2540"]
var Milestone = ["Milestone-TC-6585"]
var CapOne = ["CapOne-TC-6231"]
var PremierBank = ["Premier-TC-7453"]
var CreditOne = ["CreditOne-CC-2340","CreditOne-CC-6192"]
var MerrickBank = ["MerrickBank-CC-0147"]

/*Esto es para quitar las categorias y empezar de 0*/
var listadoOpcionesCatEspecifica2 = document.querySelector("#browsers2")
var listadoOpcionesCatEspecifica3 = document.querySelector("#browsers3") /*para banco destino*/

var quitoCategorias1 = function(){
    conteoHijos = listadoOpcionesCatEspecifica2.childElementCount

    if(conteoHijos > 0) {
        for(var i = conteoHijos; i >= 1; i--){
        listadoOpcionesCatEspecifica2.removeChild(listadoOpcionesCatEspecifica2.childNodes[i]) }
    }
}

/*quita categorias de banco destino*/
var quitoCategorias3 = function(){
    conteoHijos = listadoOpcionesCatEspecifica3.childElementCount

    if(conteoHijos > 0) {
        for(var i = conteoHijos; i >= 1; i--){
        listadoOpcionesCatEspecifica3.removeChild(listadoOpcionesCatEspecifica3.childNodes[i]) }
    }
}


/*banco_destino*/
/*funcion de que sucede al cambiar la categoria*/
document.forms['demoForm'].elements['banco_origen'].onchange = function (){

    if (document.forms['demoForm'].elements['banco_origen'].value=="Bank of America") {
                /*aqui voy a agregar las opciones a categorias especificas*/
                quitoCategorias1()
                //quitoOtrasCategoriasMadre()

                for(var i = 0; i < BofA.length ; i++){
                var option = document.createElement("option")
                option.text = BofA[i]
                option.value = BofA[i]
                listadoOpcionesCatEspecifica2.appendChild(option)           
                }       
    } else if (document.forms['demoForm'].elements['banco_origen'].value=="Wells Fargo") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

           quitoCategorias1()
           //quitoOtrasCategoriasMadre()

            for(var i = 0; i < WF.length ; i++){
                                var option = document.createElement("option")
                                option.text = WF[i]
                                option.value = WF[i]
                                listadoOpcionesCatEspecifica2.appendChild(option)
                        }
            
    } else if (document.forms['demoForm'].elements['banco_origen'].value=="Aspire") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

           quitoCategorias1()
           //quitoOtrasCategoriasMadre()

            for(var i = 0; i < Aspire.length ; i++){
                                var option = document.createElement("option")
                                option.text = Aspire[i]
                                option.value = Aspire[i]
                                listadoOpcionesCatEspecifica2.appendChild(option)
                        }
            
    }else if (document.forms['demoForm'].elements['banco_origen'].value=="Milestone") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias1()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < Milestone.length ; i++){
                             var option = document.createElement("option")
                             option.text = Milestone[i]
                             option.value = Milestone[i]
                             listadoOpcionesCatEspecifica2.appendChild(option)
                     }
         
    }else if (document.forms['demoForm'].elements['banco_origen'].value=="Capital One") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias1()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < CapOne.length ; i++){
                             var option = document.createElement("option")
                             option.text = CapOne[i]
                             option.value = CapOne[i]
                             listadoOpcionesCatEspecifica2.appendChild(option)
                     }
         
    }else if (document.forms['demoForm'].elements['banco_origen'].value=="Premier Bank") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias1()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < PremierBank.length ; i++){
                             var option = document.createElement("option")
                             option.text = PremierBank[i]
                             option.value = PremierBank[i]
                             listadoOpcionesCatEspecifica2.appendChild(option)
                     }
         
    }else if (document.forms['demoForm'].elements['banco_origen'].value=="Credit One") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias1()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < CreditOne.length ; i++){
                             var option = document.createElement("option")
                             option.text = CreditOne[i]
                             option.value = CreditOne[i]
                             listadoOpcionesCatEspecifica2.appendChild(option)
                     }
         
    }else if (document.forms['demoForm'].elements['banco_origen'].value=="Merrick Bank") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias1()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < MerrickBank.length ; i++){
                             var option = document.createElement("option")
                             option.text = MerrickBank[i]
                             option.value = MerrickBank[i]
                             listadoOpcionesCatEspecifica2.appendChild(option)
                     }
         
    }else {

                /*aqui voy a quitar las categorias de madre cuando no sean madre */
            quitoCategorias1()
            //quitoOtrasCategoriasMadre()
        }
    }


/**************para el banco destino*********************/

document.forms['demoForm'].elements['banco_destino'].onchange = function (){

    if (document.forms['demoForm'].elements['banco_destino'].value=="Bank of America") {
                /*aqui voy a agregar las opciones a categorias especificas*/
                quitoCategorias3()
                //quitoOtrasCategoriasMadre()

                for(var i = 0; i < BofA.length ; i++){
                var option = document.createElement("option")
                option.text = BofA[i]
                option.value = BofA[i]
                listadoOpcionesCatEspecifica3.appendChild(option)           
                }       
    } else if (document.forms['demoForm'].elements['banco_destino'].value=="Wells Fargo") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

           quitoCategorias3()
           //quitoOtrasCategoriasMadre()

            for(var i = 0; i < WF.length ; i++){
                                var option = document.createElement("option")
                                option.text = WF[i]
                                option.value = WF[i]
                                listadoOpcionesCatEspecifica3.appendChild(option)
                        }
            
    } else if (document.forms['demoForm'].elements['banco_destino'].value=="Aspire") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

           quitoCategorias3()
           //quitoOtrasCategoriasMadre()

            for(var i = 0; i < Aspire.length ; i++){
                                var option = document.createElement("option")
                                option.text = Aspire[i]
                                option.value = Aspire[i]
                                listadoOpcionesCatEspecifica3.appendChild(option)
                        }
            
    }else if (document.forms['demoForm'].elements['banco_destino'].value=="Milestone") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias3()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < Milestone.length ; i++){
                             var option = document.createElement("option")
                             option.text = Milestone[i]
                             option.value = Milestone[i]
                             listadoOpcionesCatEspecifica3.appendChild(option)
                     }
         
    }else if (document.forms['demoForm'].elements['banco_destino'].value=="Capital One") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias3()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < CapOne.length ; i++){
                             var option = document.createElement("option")
                             option.text = CapOne[i]
                             option.value = CapOne[i]
                             listadoOpcionesCatEspecifica3.appendChild(option)
                     }
         
    }else if (document.forms['demoForm'].elements['banco_destino'].value=="Premier Bank") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias3()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < PremierBank.length ; i++){
                             var option = document.createElement("option")
                             option.text = PremierBank[i]
                             option.value = PremierBank[i]
                             listadoOpcionesCatEspecifica3.appendChild(option)
                     }
         
    }else if (document.forms['demoForm'].elements['banco_destino'].value=="Credit One") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias3()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < CreditOne.length ; i++){
                             var option = document.createElement("option")
                             option.text = CreditOne[i]
                             option.value = CreditOne[i]
                             listadoOpcionesCatEspecifica3.appendChild(option)
                     }
         
    }else if (document.forms['demoForm'].elements['banco_destino'].value=="Merrick Bank") { /*este else indica que el valor de la categoria no es Gastos para Madres*/

        quitoCategorias3()
        //quitoOtrasCategoriasMadre()

         for(var i = 0; i < MerrickBank.length ; i++){
                             var option = document.createElement("option")
                             option.text = MerrickBank[i]
                             option.value = MerrickBank[i]
                             listadoOpcionesCatEspecifica3.appendChild(option)
                     }
         
    }else {

                /*aqui voy a quitar las categorias de madre cuando no sean madre */
            quitoCategorias3()
            //quitoOtrasCategoriasMadre()
        }
}