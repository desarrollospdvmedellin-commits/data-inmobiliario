/* =========================================================
   APP.JS - Funciones compartidas por todas las páginas
   ---------------------------------------------------------
   - Dibuja el encabezado (menú) y el pie de página.
   - Maneja la sesión (quién inició sesión).
   - Funciones para dar formato a dinero y fechas.
   ========================================================= */

var CLAVE_SESION = "dataInmobiliario_sesion";
var PRECIO_CONSULTA = 15000; // pesos colombianos (valor simulado)

/* Datos de la empresa (TODOS FICTICIOS, solo para el prototipo) */
var EMPRESA = {
  nombre: "Data Inmobiliario",
  razonSocial: "Data Inmobiliario S.A.S.",
  nit: "901.000.123-4",
  direccion: "Carrera 43A # 61 Sur-152, Oficina 1205",
  edificio: "Torre Empresarial Aves María (ficticia)",
  ciudad: "Sabaneta, Antioquia, Colombia",
  pbx: "(604) 000 12 34",
  whatsapp: "+57 300 000 1234",
  correo: "contacto@datainmobiliario.co",
  correoJudicial: "notificaciones@datainmobiliario.co",
  horario: ["Lunes a viernes: 8:00 a.m. a 5:30 p.m.", "Sábados: 9:00 a.m. a 12:00 m.", "Domingos y festivos: cerrado"],
  redes: [["Facebook", "/DataInmobiliarioCo"], ["Instagram", "@datainmobiliario"], ["LinkedIn", "Data Inmobiliario S.A.S."]]
};

var Sesion = {
  usuario: function () {
    var id = Almacen.getItem(CLAVE_SESION);
    return id ? BD.usuarioPorId(id) : null;
  },
  iniciar: function (email, clave) {
    var u = BD.usuarioPorEmail(email);
    if (!u || u.clave !== clave) return null;
    Almacen.setItem(CLAVE_SESION, u.id);
    return u;
  },
  cerrar: function () {
    Almacen.removeItem(CLAVE_SESION);
    ir("index.html");
  },
  /* Si la página exige sesión y no hay, envía al login.
     tipos: lista opcional de tipos permitidos ("inmobiliaria", "persona") */
  exigir: function (tipos) {
    var u = this.usuario();
    if (!u) {
      ir("login.html?volver=" + encodeURIComponent(paginaActual() + busquedaActual()));
      throw new Error("Sin sesión");
    }
    if (tipos && tipos.indexOf(u.tipo) === -1) {
      document.querySelector("main .contenedor").innerHTML =
        '<div class="tarjeta"><h2>Acceso restringido</h2><p>Esta sección es solo para usuarios de tipo: <b>' +
        tipos.join(", ") + '</b>.</p><a class="boton" href="panel.html">Volver a mi panel</a></div>';
      throw new Error("Tipo no permitido");
    }
    return u;
  }
};

/* ---------- Encabezado y pie comunes ---------- */
function dibujarPlantilla() {
  var u = Sesion.usuario();
  var actual = paginaActual();
  ["plantillaCab", "plantillaPie"].forEach(function (id) { var v = document.getElementById(id); if (v) v.remove(); });

  var enlaces = [["index.html", "Inicio"], ["aseguradoras.html", "Aseguradoras"], ["legal.html", "Marco legal"]];
  if (u) {
    enlaces = [["panel.html", "Mi panel"], ["consulta.html", "Consultar cédula"]];
    if (u.tipo === "inmobiliaria") enlaces.push(["ingreso-datos.html", "Ingresar datos"]);
    if (u.tipo === "persona") enlaces.push(["mi-historial.html", "Mi historial"]);
    enlaces.push(["comprar.html", "Comprar consultas"], ["aseguradoras.html", "Aseguradoras"], ["legal.html", "Marco legal"]);
  }
  var menu = enlaces.map(function (e) {
    return '<a href="' + e[0] + '"' + (actual === e[0] ? ' class="activo"' : "") + ">" + e[1] + "</a>";
  }).join("");
  menu += u
    ? '<span class="usuario">' + esc(u.nombre.split(" ").slice(0, 2).join(" ")) + "</span>" +
      '<a href="#" id="btnSalir">Salir</a>'
    : '<a href="login.html"' + (actual === "login.html" ? ' class="activo"' : "") + '>Ingresar</a>' +
      '<a href="registro.html"' + (actual === "registro.html" ? ' class="activo"' : "") + '>Registrarse</a>';

  var cab = document.createElement("div");
  cab.id = "plantillaCab";
  cab.innerHTML =
    '<div class="aviso-academico">Prototipo académico · Datos ficticios · Pagos simulados</div>' +
    '<header class="encabezado"><div class="contenedor">' +
    '<a class="marca" href="index.html"><span class="logo">' + svgLogo() + '</span><span>Data Inmobiliario<span class="sub">Central de información de arrendatarios</span></span></a>' +
    '<nav class="menu">' + menu + "</nav></div></header>";
  document.body.insertBefore(cab, document.body.firstChild);

  var pie = document.createElement("footer");
  pie.className = "pie";
  pie.id = "plantillaPie";
  var E = EMPRESA;
  pie.innerHTML = svgSkyline() +
    '<div class="contenedor pie-columnas">' +
      '<div><div class="pie-marca"><span class="logo">' + svgLogo() + '</span> ' + E.nombre + '</div>' +
        '<p>' + E.razonSocial + '<br>NIT ' + E.nit + '</p>' +
        '<p>Central de información de arrendatarios. Ayudamos a inmobiliarias y propietarios a arrendar con confianza.</p>' +
        '<div class="redes">' + E.redes.map(function (r) { return '<span title="' + r[0] + ' (cuenta ficticia)">' + r[0] + ' ' + r[1] + '</span>'; }).join("") + '</div></div>' +
      '<div><h4>Sede principal</h4><p>' + E.direccion + '<br>' + E.edificio + '<br>' + E.ciudad + '</p>' +
        '<h4>Horario de atención</h4><p>' + E.horario.join("<br>") + '</p></div>' +
      '<div><h4>Contáctenos</h4><p>PBX ' + E.pbx + '<br>WhatsApp ' + E.whatsapp + '<br>' + E.correo + '<br>Notificaciones judiciales:<br>' + E.correoJudicial + '</p></div>' +
      '<div><h4>Enlaces</h4><p><a href="index.html#contacto">Quiénes somos</a><br><a href="index.html#contacto">PQRS</a><br>' +
        '<a href="legal.html">Política de tratamiento de datos</a><br><a href="legal.html">Términos y condiciones</a><br><a href="aseguradoras.html">Aseguradoras de arriendo</a></p></div>' +
    '</div>' +
    '<div class="contenedor pie-legal">© ' + new Date().getFullYear() + ' ' + E.razonSocial + ' · Empresa, NIT, direcciones y teléfonos ficticios: proyecto académico sin fines comerciales' +
    ' · <a href="#" id="btnReset">Restablecer datos de demostración</a></div>';
  document.body.appendChild(pie);

  var salir = document.getElementById("btnSalir");
  if (salir) salir.onclick = function (e) { e.preventDefault(); Sesion.cerrar(); };
  document.getElementById("btnReset").onclick = function (e) {
    e.preventDefault();
    // Doble clic de confirmación (algunos visores bloquean confirm())
    var a = e.target;
    if (!a.dataset.seguro) { a.dataset.seguro = "1"; a.textContent = "¿Seguro? Haga clic otra vez para borrar todo"; return; }
    BD.restablecer();
    Almacen.removeItem(CLAVE_SESION);
    ir("index.html");
  };
  pintarIlustraciones();
}

/* ---------- Formatos ---------- */
function pesos(valor) {
  return "$" + Math.round(valor).toLocaleString("es-CO");
}
var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function fechaCorta(texto) {
  if (!texto) return "—";
  var f = aFecha(texto);
  return dos(f.getDate()) + " " + MESES[f.getMonth()] + " " + f.getFullYear();
}
function periodoTexto(periodo) {
  var p = periodo.split("-");
  return MESES[+p[1] - 1] + " " + p[0];
}
function duracion(inicio, fin) {
  var a = aFecha(inicio), b = fin ? aFecha(fin) : new Date();
  var meses = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
  var anios = Math.floor(meses / 12), m = meses % 12;
  var partes = [];
  if (anios) partes.push(anios + (anios === 1 ? " año" : " años"));
  if (m) partes.push(m + (m === 1 ? " mes" : " meses"));
  return partes.join(" y ") || "menos de 1 mes";
}
function parametro(nombre) {
  return new URLSearchParams(busquedaActual()).get(nombre);
}
/* Navegación. En la versión de varias páginas cambia de archivo;
   la versión de un solo archivo (para Claude) redefine estas funciones. */
function ir(url) { location.href = url; }
function paginaActual() { return location.pathname.split("/").pop() || "index.html"; }
function busquedaActual() { return location.search; }
/* Escapa texto antes de insertarlo como HTML (evita inyección de código) */
function esc(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function mensaje(contenedorId, tipo, html) {
  var el = document.getElementById(contenedorId);
  el.innerHTML = '<div class="alerta ' + tipo + '">' + html + "</div>";
}

/* ---------- Accesos pagados ---------- */
/* Una consulta pagada da acceso al reporte de esa cédula por 24 horas */
function tieneAcceso(usuario, cedula) {
  if (usuario.tipo === "persona" && usuario.documento === cedula) return true; // el titular siempre ve lo suyo
  var limite = Date.now() - 24 * 3600 * 1000;
  return BD.datos.accesos.some(function (a) {
    return a.usuarioId === usuario.id && a.cedula === cedula && a.fecha > limite;
  });
}

dibujarPlantilla();
