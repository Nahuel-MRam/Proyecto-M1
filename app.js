// ============================================================
// APP.JS - Generador de Paletas de Colores
// ============================================================
// Este archivo maneja toda la LÓGICA de la aplicación.
// Recuerden: JavaScript es el que le da "vida" a la página.
// ============================================================

// ============================================================
//* BLOQUE 1: FUNCIÓN PARA GENERAR UN COLOR HEX ALEATORIO
// ============================================================
// Un color HEX tiene este formato: #A3F2C1
// El # va fijo, y después vienen 6 caracteres que pueden ser
// números del 0 al 9 o letras de la A a la F.
// Por eso se llama "hexadecimal" → base 16.

function hexadecimalAleatorio() {
  // Estos son todos los caracteres válidos en un color HEXADECIMAL
  const letras = "0123456789ABCDEF";

  // Empezamos el color con el símbolo #
  let hex = "#";

  // Repetimos 6 veces para conseguir los 6 caracteres del color
  for (let i = 0; i < 6; i++) {
    // Math.random() devuelve un número entre 0 y 1, ej: 0.743
    // Lo multiplicamos por 16 para tener un número entre 0 y 16
    // Math.floor() lo redondea hacia abajo para que sea entero
    // Con ese número usamos como índice para elegir un carácter
    hex += letras[Math.floor(Math.random() * 16)];
  }

  // Devolvemos el color completo, ej: "#A3F2C1"
  return hex;
}

// ============================================================
//* BLOQUE 2: FUNCIÓN PARA CONVERTIR HEXADECIMAL A FORMATO HSL
// ============================================================
// HSL significa: Hue (tono), Saturation (saturación), Lightness (luminosidad)
// Es otra forma de representar el mismo color.
// Ejemplo: hsl(120, 50%, 60%)
//
// Esta función es la más matemática del proyecto.
// No es necesario entenderla al 100% en una clase básica,
// pero es bueno saber que existe y para qué sirve.

function hexadecimalAHsl(hex) {
  // ── PASO 1: Separar el HEX en sus tres canales R, G y B ─────
  //
  // Un color HEX tiene este formato: #A3F2C1
  // Índice:  0  1  2  3  4  5  6
  // Color:   #  A  3  F  2  C  1
  //
  // slice(1, 3) toma los índices 1 y 2 → "A3" → canal Rojo
  // slice(3, 5) toma los índices 3 y 4 → "F2" → canal Verde
  // slice(5, 7) toma los índices 5 y 6 → "C1" → canal Azul
  // Regla de slice: el segundo número es el límite pero NO se incluye.
  //
  // parseInt(..., 16):
  //   El 16 le dice a parseInt que el texto está en base hexadecimal.
  //   Sin ese 16, no sabría qué hacer con letras como "A" o "F".
  //
  // / 255:
  //   El valor máximo de un canal HEX es "FF" que en decimal es 255.
  //   Dividimos por 255 para pasar a una escala de 0 a 1,
  //   que es la que necesitamos para los cálculos de HSL.
  //   Ejemplo: parseInt("A3", 16) = 163 → 163 / 255 = 0.63

  let red = parseInt(hex.slice(1, 3), 16) / 255;
  let green = parseInt(hex.slice(3, 5), 16) / 255;
  let blue = parseInt(hex.slice(5, 7), 16) / 255;

  // ── PASO 2: Encontrar el canal más alto y el más bajo ────────
  //
  // Necesitamos estos dos valores para calcular
  // la luminosidad, la saturación y el tono.

  let max = Math.max(red, green, blue);
  let min = Math.min(red, green, blue);

  // ── PASO 3: Calcular la Luminosidad ──────────────────────
  //
  // Es el promedio entre el valor más alto y el más bajo.
  // Resultado entre 0 (negro) y 1 (blanco).

  let luminosidad = (max + min) / 2;

  // ── PASO 4: Calcular Saturación y Tono ───────────────────────
  // Declaramos tono y saturacion
  let tono, saturacion;

  // Caso especial: si max === min, los tres canales son iguales.
  // Eso significa que el color es un gris (sin color, sin tono).
  if (max === min) {
    tono = 0;
    saturacion = 0;
  } else {
    // diferencia es la distancia entre el canal más alto y el más bajo.
    // Cuanto mayor es la diferencia, más "colorido" es el color.
    let diferencia = max - min;

    // Saturación:
    //   luminosidad > 0.5 significa que el color es más claro que el 50%.
    //   (recordá que luminosidad está en escala 0 a 1, entonces 0.5 = 50%)
    //   La fórmula cambia según si el color es más claro u oscuro
    //   porque la saturación se comporta distinto en cada mitad de la escala.
    saturacion =
      luminosidad > 0.5
        ? diferencia / (2 - max - min) // color más claro que 50%
        : diferencia / (max + min); // color más oscuro que 50%

    // Tono:
    //   El tono es un ángulo en el círculo de color (0° a 360°).
    //   Cada color primario ocupa una posición fija en ese círculo:
    //     Rojo  →   0° (posición 0 en escala 0-6)
    //     Verde → 120° (posición 2 en escala 0-6)
    //     Azul  → 240° (posición 4 en escala 0-6)
    //
    //   Calculamos en escala 0-6 y al final dividimos por 6
    //   para volver a la escala 0-1.
    //
    //   El +6 en el caso del rojo evita números negativos:
    //   si green < blue, la resta (green - blue) daría negativo,
    //   entonces sumamos 6 para mantenerlo en rango válido.

    if (max === red) {
      tono = ((green - blue) / diferencia + (green < blue ? 6 : 0)) / 6;
    } else if (max === green) {
      tono = ((blue - red) / diferencia + 2) / 6; // arrancamos desde 120°
    } else {
      tono = ((red - green) / diferencia + 4) / 6; // arrancamos desde 240°
    }
  }

  // ── PASO 5: Armar el string HSL final ────────────────────────
  //
  // Cada valor está en una escala distinta y hay que convertirlo:
  //
  //   tono        estaba en 0-1  → multiplicamos por 360 (grados del círculo)
  //   saturacion  estaba en 0-1  → multiplicamos por 100 (porcentaje)
  //   luminosidad estaba en 0-1  → multiplicamos por 100 (porcentaje)
  //
  // Math.round() evita decimales largos como 47.3333...
  //
  // Ejemplo final: hsl(119, 50%, 60%) → un verde medio

  return `hsl(${Math.round(tono * 360)}, ${Math.round(saturacion * 100)}%, ${Math.round(luminosidad * 100)}%)`;
}

// ============================================================
//* BLOQUE 3: FUNCIÓN PARA MOSTRAR EL TOAST (microfeedback)
// ============================================================
// Un "toast" es ese pequeño mensaje que aparece y desaparece solo.
// Le avisa al usuario que algo pasó, sin interrumpirlo con un alert().
// Es mucho más amigable que un alert() para experiencia de usuario.

function mostrarToast(mensaje) {
  // Buscamos el elemento #toast en el HTML con getElementById
  const toast = document.getElementById("toast");

  // Le ponemos el texto que queremos mostrar
  toast.textContent = mensaje;

  // Le agregamos la clase "visible" que en el CSS le da opacity: 1
  // Sin esa clase, el toast tiene opacity: 0 (invisible)
  toast.classList.add("visible");

  // setTimeout ejecuta una función después de un tiempo (en milisegundos)
  // 2000 milisegundos = 2 segundos
  // Después de 2 segundos, le sacamos la clase "visible" → se oculta solo
  setTimeout(function () {
    toast.classList.remove("visible");
  }, 2000);
}

// ============================================================
//* BLOQUE 4: FUNCIÓN PRINCIPAL - GENERAR LA PALETA
// ============================================================
// Esta es la función más importante del proyecto.
// Hace tres cosas: lee el DOM, crea elementos nuevos, y los inserta.

function generarPaleta() {
  // ── Paso 1: Leer cuántos colores eligió el usuario ──────────
  // getElementById busca el elemento con ese id en el HTML
  // .value nos da el valor seleccionado en el <select>
  // parseInt() lo convierte de texto a número entero
  const cantidad = parseInt(document.getElementById("select-cantidad").value);

  // ── Paso 2: Obtener el contenedor de la paleta ──────────────
  // Es el <div id="paleta"> del HTML donde vamos a insertar las tarjetas
  const contenedor = document.getElementById("paleta");

  // ── Paso 3: Limpiar la paleta anterior ──────────────────────
  // innerHTML = '' borra todo el contenido HTML que había adentro
  // Así cada vez que generamos, empezamos desde cero
  contenedor.innerHTML = "";

  // ── Paso 4: Crear una tarjeta por cada color ─────────────────
  // El bucle for se repite "cantidad" veces (6, 8 o 9)
  for (let i = 0; i < cantidad; i++) {
    // Generamos un color HEX aleatorio usando nuestra función
    const hex = hexadecimalAleatorio();

    // Lo convertimos a HSL para mostrarlo también en la tarjeta
    const hsl = hexadecimalAHsl(hex);

    // ── Códigos HEX y HSL ────────────────────────────────────
    // Leemos el estado del toggle DENTRO del bucle,
    // para que cada tarjeta se cree con el formato correcto
    const mostrarHsl = document.getElementById("toggle-formato").checked;

    // ── Creamos la tarjeta (div.color-card) ──────────────────
    // createElement crea un elemento HTML nuevo pero todavía NO está en la página
    const card = document.createElement("div");

    // classList.add agrega una clase CSS al elemento
    card.classList.add("color-card");

    // setAttribute agrega atributos HTML al elemento
    // role="listitem" es para accesibilidad (lectores de pantalla)
    card.setAttribute("role", "listitem");

    // tabindex="0" permite navegar hasta esta tarjeta con la tecla Tab
    card.setAttribute("tabindex", "0");

    // title muestra un tooltip cuando el mouse pasa por encima
    card.setAttribute("title", "Clic para copiar " + hex);

    // ── Creamos el bloque de color (div.muestra) ─────────────
    const muestra = document.createElement("div");
    muestra.classList.add("muestra");

    // style.backgroundColor aplica el color de fondo directamente
    // Esto es CSS inline aplicado desde JavaScript
    muestra.style.backgroundColor = hex;

    // ── Creamos el texto con el código HEX ──────────────────
    const codigoHex = document.createElement("div");
    codigoHex.classList.add("codigo-hex");
    // Si el toggle está en HSL, ocultamos el HEX y viceversa
    if (mostrarHsl) codigoHex.classList.add("oculto");
    // textContent inserta texto plano dentro del elemento
    codigoHex.textContent = hex;

    // ── Creamos el texto con el código HSL ──────────────────
    // Misma estructura que el HEX, pero mostramos el formato HSL
    const codigoHsl = document.createElement("div");
    codigoHsl.classList.add("codigo-hsl");
    // Si el toggle está en HEX, ocultamos el HSL
    if (!mostrarHsl) codigoHsl.classList.add("oculto");
    codigoHsl.textContent = hsl;

    // ── Armamos la tarjeta juntando las piezas ───────────────
    // appendChild inserta un elemento ADENTRO de otro
    // Orden: bloque de color → código HEX → código HSL
    card.appendChild(muestra);
    card.appendChild(codigoHex);
    card.appendChild(codigoHsl);

    // ── Agregamos el evento de clic para copiar ──────────────
    // addEventListener "escucha" un evento (en este caso 'click')
    // Cuando ocurre, ejecuta la función que le pasamos
    card.addEventListener("click", function () {
      // navigator.clipboard.writeText() copia texto al portapapeles
      // Devuelve una Promesa (.then) que se ejecuta cuando termina
      navigator.clipboard.writeText(hex).then(function () {
        mostrarToast("¡Copiado: " + hex + "!");
      });
    });

    //* Para copiar segun sea el formato

    card.addEventListener("click", function () {
      // Revisamos el estado actual del toggle
      const mostrarHsl = document.getElementById("toggle-formato").checked;

      // Elegimos qué código copiar
      const codigoACopiar = mostrarHsl ? hsl : hex;

      // Copiamos el formato que se está mostrando
      navigator.clipboard.writeText(codigoACopiar).then(function () {
        // Mostramos un toast con el valor copiado
        mostrarToast("¡Copiado: " + codigoACopiar + "!");
      });
    });

    // ── Insertamos la tarjeta en la página ───────────────────
    // Recién acá el elemento aparece en el HTML visible
    contenedor.appendChild(card);
  }

  // Avisamos que la paleta fue generada
  mostrarToast("¡Paleta generada!");
}

// ============================================================
//* BLOQUE 5: EVENTOS
// ============================================================
// Los eventos conectan las acciones del usuario con nuestras funciones.
// Sin esto, las funciones existen pero nunca se ejecutan.

// Cuando el usuario hace clic en el botón, llamamos a generarPaleta()
document.getElementById("btn-generar").addEventListener("click", generarPaleta);

// Cuando el usuario mueve el toggle, recorremos todas las tarjetas
// y mostramos u ocultamos los códigos según el formato elegido
document
  .getElementById("toggle-formato")
  .addEventListener("change", function () {
    const mostrarHsl = this.checked;

    // querySelectorAll devuelve todas las tarjetas de la paleta
    document.querySelectorAll(".codigo-hex").forEach(function (el) {
      // toggle('oculto', condicion) agrega la clase si la condicion es true
      // y la saca si es false
      el.classList.toggle("oculto", mostrarHsl);
    });

    document.querySelectorAll(".codigo-hsl").forEach(function (el) {
      el.classList.toggle("oculto", !mostrarHsl);
    });
  });

// Generamos una paleta apenas carga la página,
// para que no aparezca vacía al entrar
generarPaleta();
