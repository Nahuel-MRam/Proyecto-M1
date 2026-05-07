//*PARTE 1: FUNCION PARA GENERAR EL HEXADECIMAL ALEATORIO
/*
un color hexa #A3F2C1
Esta formado por el # y 6 caracteres
que estan constituidos por numeros del 0 al 9 y letras de A a la F
Esto es hexadecimal que seria base 16
*/

/*
dos formas de escribir variables
camelCase: colorHexadecimal
snake_case: color_hexadecimal
*/
function generarHexadecimalAleatorio(){
    const caracteresHexadecimal= '0123456789ABCDEF'
    let hex= "#"

    for(let i=0; i<6; i++){
        /*
        Math.random()devolver un numero entre 0 y 1 por ej 0.723
        lo multiplicamos por 16 para obtener un numero entre 0 y 16 por ej 11.57
        Math.floor() redondea hacia abajo el numero por ej 11.57 se convierte en 11
        */
       hex +=caracteresHexadecimal[Math.floor(Math.random()*16)]
    }

    return hex
}


//*PARTE 2: FUNCION PARA GENERAR LA PALETA DE COLORES
function generarPaleta(){
//paso 1: leer cuantos colores quiere el usuario
//getElementById() buscar el elemento con ese id en el html
//.value para obtener el valore seleccionado
//parseInt() convertir el string a numero entero


    const cantidad=parseInt(document.getElementById("select-cantidad").value)
    
    //paso 2: obtener el contenedor donde se van a mostrar los colores
    const contenedor=document.getElementById("paleta")
    
    //paso 3: limpiar la paleta anterior
    //innerHTML es una propiedad que nos permite modificar el contenido html de un elemento
    contenedor.innerHTML=""
    
    //paso 4: crear las tarjetas de colores
    //el bucle for se va a repetir la cantidad de veces que el usuario selecciono
    for(let i=0; i < cantidad; i++){
        //generar un color hexadecimal aleatorio
        const colorHexadecimal=generarHexadecimalAleatorio()
    
        //crear la tarjeta de color(div-carta_color)
        //createElement() crear un nuevo elemento html
        const cartaColor=document.createElement("div")
    
        //carta le agreges la clase de estilo color_carta
        cartaColor.classList.add("color_carta")
    
        //setAttribute() agregar un atributo a un elemento html
        cartaColor.setAttribute("role", "listitem")
    
        //crear el texto con el codigo HEXADECIMAL
        const codigoHexadecimal=document.createElement("div")
        codigoHexadecimal.classList.add("codigo_hexadecimal")  
    
        codigoHexadecimal.textContent=colorHexadecimal
    
        //armar la tarjeta juntando las piezas
        //appendChild() agregar un elemento como hijo de otro elemento 
        cartaColor.appendChild(codigoHexadecimal)
    
        //agregar la tarjeta al contenedor
        contenedor.appendChild(cartaColor)
    }
}

//*PARTE 3: mostrar la carta
//cuando el usuario haga click en el boton "Generar Paleta" se va a ejecutar la funcion generarPaleta
//addEventListener() es un metodo que nos permite escuchar un evento en un elemento html

document.getElementById("btn-generar").addEventListener("click", generarPaleta)

generarPaleta()

