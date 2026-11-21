/* =========================================================
   ILUSTRACIONES.JS - Dibujos vectoriales (SVG) del sitio
   ---------------------------------------------------------
   El edificio, el logo, el horizonte del pie de página y los
   íconos se dibujan con código SVG. Ventajas: no dependen de
   imágenes externas, se ven nítidos en cualquier pantalla y no
   tienen problemas de derechos de autor.

   Uso en el HTML:  <div data-ilustracion="edificio"></div>
                    <span data-icono="escudo"></span>
   ========================================================= */

var ORO = "#b08d57", ORO_CLARO = "#d9c29a";

/* Número pseudoaleatorio fijo a partir de dos enteros (para que
   las ventanas encendidas siempre sean las mismas) */
function ruido(a, b) {
  var x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function ventanas(x0, y0, cols, filas, ancho, alto, sepX, sepY, densidad, semilla) {
  var s = "";
  for (var f = 0; f < filas; f++) {
    for (var c = 0; c < cols; c++) {
      var r = ruido(c + semilla, f + semilla * 3);
      var color = r < densidad ? ORO_CLARO : "#1c3555";
      var op = r < densidad ? (0.55 + r) : 0.9;
      s += '<rect x="' + (x0 + c * sepX) + '" y="' + (y0 + f * sepY) + '" width="' + ancho + '" height="' + alto +
        '" fill="' + color + '" opacity="' + Math.min(op, 1).toFixed(2) + '"/>';
    }
  }
  return s;
}

/* Torre corporativa principal (portada) */
function svgEdificio() {
  var estrellas = "";
  for (var i = 0; i < 40; i++) {
    estrellas += '<circle cx="' + (ruido(i, 1) * 400).toFixed(0) + '" cy="' + (ruido(i, 2) * 220).toFixed(0) +
      '" r="' + (ruido(i, 3) * 1.1 + 0.3).toFixed(1) + '" fill="#fff" opacity="' + (ruido(i, 4) * 0.6 + 0.2).toFixed(2) + '"/>';
  }
  return '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Ilustración de un edificio corporativo">' +
    '<defs>' +
    '<linearGradient id="gTorre" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#162c47"/><stop offset=".55" stop-color="#10223a"/><stop offset="1" stop-color="#0a1828"/></linearGradient>' +
    '<linearGradient id="gOro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + ORO_CLARO + '"/><stop offset="1" stop-color="' + ORO + '"/></linearGradient>' +
    '<radialGradient id="gLuna" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f4e9d3" stop-opacity=".9"/><stop offset="1" stop-color="#f4e9d3" stop-opacity="0"/></radialGradient>' +
    '</defs>' +
    estrellas +
    '<circle cx="330" cy="70" r="46" fill="url(#gLuna)"/><circle cx="330" cy="70" r="14" fill="#efe3c8" opacity=".85"/>' +
    // Edificios de fondo
    '<rect x="10" y="250" width="85" height="250" fill="#0f1f33"/>' + ventanas(20, 265, 4, 14, 9, 6, 18, 16, 0.18, 5) +
    '<rect x="95" y="190" width="55" height="310" fill="#0c1a2c"/>' + ventanas(103, 205, 3, 18, 8, 6, 15, 16, 0.12, 9) +
    '<rect x="300" y="290" width="90" height="210" fill="#0f1f33"/>' + ventanas(310, 305, 4, 12, 10, 6, 20, 16, 0.2, 13) +
    '<rect x="282" y="220" width="30" height="280" fill="#0b1828"/>' +
    // Torre principal
    '<line x1="220" y1="8" x2="220" y2="58" stroke="url(#gOro)" stroke-width="2"/>' +
    '<circle cx="220" cy="8" r="2.5" fill="' + ORO_CLARO + '"/>' +
    '<polygon points="180,95 220,55 260,95" fill="#132840" stroke="' + ORO + '" stroke-width="1"/>' +
    '<rect x="175" y="95" width="90" height="55" fill="url(#gTorre)" stroke="' + ORO + '" stroke-width=".8"/>' +
    ventanas(185, 105, 5, 3, 10, 9, 15, 14, 0.5, 21) +
    '<rect x="155" y="150" width="130" height="350" fill="url(#gTorre)"/>' +
    '<line x1="155" y1="150" x2="155" y2="500" stroke="' + ORO + '" stroke-width="1.2"/>' +
    '<line x1="285" y1="150" x2="285" y2="500" stroke="' + ORO + '" stroke-width="1.2"/>' +
    '<line x1="150" y1="150" x2="290" y2="150" stroke="url(#gOro)" stroke-width="2.5"/>' +
    '<line x1="220" y1="150" x2="220" y2="440" stroke="' + ORO + '" stroke-width=".5" opacity=".6"/>' +
    ventanas(166, 162, 7, 18, 11, 9, 16, 15, 0.38, 31) +
    // Franjas horizontales doradas (pisos técnicos)
    '<line x1="155" y1="300" x2="285" y2="300" stroke="' + ORO + '" stroke-width=".8" opacity=".7"/>' +
    '<line x1="155" y1="436" x2="285" y2="436" stroke="' + ORO + '" stroke-width="1.5"/>' +
    // Lobby / entrada
    '<rect x="165" y="446" width="110" height="54" fill="#0a1626"/>' +
    '<rect x="200" y="458" width="40" height="42" fill="' + ORO_CLARO + '" opacity=".35"/>' +
    '<line x1="220" y1="458" x2="220" y2="500" stroke="' + ORO + '" stroke-width="1"/>' +
    '<rect x="190" y="446" width="60" height="5" fill="url(#gOro)"/>' +
    '<rect x="172" y="462" width="20" height="30" fill="#d9c29a" opacity=".18"/><rect x="248" y="462" width="20" height="30" fill="#d9c29a" opacity=".18"/>' +
    // Suelo
    '<rect x="0" y="498" width="400" height="2" fill="url(#gOro)"/>' +
    '</svg>';
}

/* Horizonte de ciudad para el pie de página */
function svgSkyline() {
  var s = "", x = 0, i = 0;
  while (x < 1200) {
    var ancho = 30 + Math.floor(ruido(i, 7) * 60);
    var alto = 18 + Math.floor(ruido(i, 8) * 50);
    s += '<rect x="' + x + '" y="' + (70 - alto) + '" width="' + (ancho - 3) + '" height="' + alto + '" fill="#0a1726"/>';
    for (var v = 0; v < 3; v++) {
      if (ruido(i, v + 20) < 0.5) s += '<rect x="' + (x + 6 + v * 8) + '" y="' + (76 - alto + ruido(i, v) * 20).toFixed(0) + '" width="3" height="3" fill="' + ORO_CLARO + '" opacity=".6"/>';
    }
    x += ancho; i++;
  }
  return '<svg class="skyline" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true">' + s +
    '<rect x="0" y="69" width="1200" height="1" fill="' + ORO + '"/></svg>';
}

/* Logo: tres torres doradas */
function svgLogo() {
  return '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="' + ORO + '" stroke-width="1.4">' +
    '<rect x="4" y="14" width="7" height="15"/><rect x="12.5" y="4" width="7" height="25"/><rect x="21" y="10" width="7" height="19"/>' +
    '<line x1="16" y1="1" x2="16" y2="4"/><line x1="2" y1="29.5" x2="30" y2="29.5"/></svg>';
}

/* Íconos de línea fina */
var ICONOS = {
  estrella: '<path d="M20 4l4.7 10.2 11.1 1.2-8.3 7.5 2.4 11L20 28.3 10.1 33.9l2.4-11-8.3-7.5 11.1-1.2z"/>',
  casa: '<path d="M5 19L20 6l15 13"/><path d="M9 16v18h22V16"/><path d="M17 34v-9h6v9"/>',
  tarjeta: '<rect x="4" y="10" width="32" height="21" rx="2"/><line x1="4" y1="16" x2="36" y2="16"/><line x1="9" y1="25" x2="18" y2="25"/>',
  documento: '<path d="M10 4h14l7 7v25H10z"/><path d="M24 4v7h7"/><line x1="14" y1="19" x2="27" y2="19"/><line x1="14" y1="24" x2="27" y2="24"/><line x1="14" y1="29" x2="22" y2="29"/>',
  escudo: '<path d="M20 4l13 5v9c0 8-5.5 14-13 18C12.5 32 7 26 7 18V9z"/><path d="M14 19l4 4 8-8"/>',
  balanza: '<line x1="20" y1="5" x2="20" y2="35"/><line x1="8" y1="10" x2="32" y2="10"/><path d="M8 10l-5 11h10z"/><path d="M32 10l-5 11h10z"/><line x1="13" y1="35" x2="27" y2="35"/>',
  edificio: '<rect x="11" y="5" width="18" height="31"/><line x1="5" y1="36" x2="35" y2="36"/><path d="M16 11h2M22 11h2M16 17h2M22 17h2M16 23h2M22 23h2"/><path d="M18 36v-6h4v6"/>',
  candado: '<rect x="9" y="17" width="22" height="17" rx="2"/><path d="M14 17v-5a6 6 0 0 1 12 0v5"/><line x1="20" y1="24" x2="20" y2="28"/>',
  ubicacion: '<path d="M20 36s11-10.5 11-19a11 11 0 0 0-22 0c0 8.5 11 19 11 19z"/><circle cx="20" cy="17" r="4"/>',
  telefono: '<path d="M10 5h6l3 8-4 3a20 20 0 0 0 9 9l3-4 8 3v6a3 3 0 0 1-3 3C17 33 7 23 7 8a3 3 0 0 1 3-3z"/>',
  correo: '<rect x="5" y="9" width="30" height="22" rx="2"/><path d="M5 11l15 11 15-11"/>',
  reloj: '<circle cx="20" cy="20" r="15"/><path d="M20 11v9l6 4"/>',
  lupa: '<circle cx="17" cy="17" r="10"/><line x1="24.5" y1="24.5" x2="35" y2="35"/>'
};
function svgIcono(nombre) {
  return '<svg class="icono-lujo" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + (ICONOS[nombre] || "") + "</svg>";
}

/* Reemplaza los marcadores data-ilustracion y data-icono por los dibujos */
function pintarIlustraciones() {
  document.querySelectorAll("[data-ilustracion]").forEach(function (el) {
    var tipo = el.getAttribute("data-ilustracion");
    el.innerHTML = tipo === "edificio" ? svgEdificio() : tipo === "skyline" ? svgSkyline() : "";
  });
  document.querySelectorAll("[data-icono]").forEach(function (el) { el.innerHTML = svgIcono(el.getAttribute("data-icono")); });
}
