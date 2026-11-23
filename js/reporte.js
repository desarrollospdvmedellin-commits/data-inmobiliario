/* =========================================================
   REPORTE.JS - Construye el reporte del arrendatario.
   Se separa en su propio archivo porque lo usan dos páginas:
   reporte.html (quien consulta) y mi-historial.html (titular).
   ========================================================= */

/* Medidor semicircular (SVG) para el puntaje de 0 a 1000 */
function medidorSVG(puntaje, color) {
  var f = puntaje === null ? 0 : puntaje / 1000;
  var ang = Math.PI * (1 - f);
  var x = 100 + 80 * Math.cos(ang), y = 100 - 80 * Math.sin(ang);
  var arco = f > 0 ? '<path d="M20 100 A80 80 0 0 1 ' + x.toFixed(1) + " " + y.toFixed(1) + '" fill="none" stroke="' + color + '" stroke-width="18" stroke-linecap="round"/>' : "";
  return '<svg viewBox="0 0 200 115" role="img" aria-label="Puntaje ' + puntaje + ' de 1000">' +
    '<path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#e3e8ee" stroke-width="18" stroke-linecap="round"/>' + arco +
    '<text x="20" y="114" font-size="9" fill="#6b7785" text-anchor="middle">0</text><text x="180" y="114" font-size="9" fill="#6b7785" text-anchor="middle">1000</text></svg>';
}

/* Vector de comportamiento: últimos 24 meses, sumando todos los contratos */
function vectorComportamiento(contratos) {
  var porPeriodo = {};
  contratos.forEach(function (c) {
    BD.pagosDe(c.id).forEach(function (p) { porPeriodo[p.periodo] = p; });
  });
  var html = '<div class="vector">';
  var f = new Date(); f.setDate(1); f.setMonth(f.getMonth() - 23);
  for (var i = 0; i < 24; i++) {
    var per = f.getFullYear() + "-" + dos(f.getMonth() + 1);
    var p = porPeriodo[per];
    if (p) {
      var cod = codigoMora(p);
      html += '<div class="mes ' + cod.clase + '" title="' + periodoTexto(per) + ": " + cod.nombre + '">' + cod.texto + "</div>";
    } else {
      html += '<div class="mes vacio" title="' + periodoTexto(per) + ': sin contrato reportado">–</div>';
    }
    f.setMonth(f.getMonth() + 1);
  }
  html += "</div>";
  html += '<div class="leyenda"><span><i style="background:var(--verde)"></i>N: al día</span><span><i style="background:var(--amarillo)"></i>1-29 días</span>' +
    '<span><i style="background:var(--naranja)"></i>30-59</span><span><i style="background:#b8452a"></i>60-89</span><span><i style="background:var(--rojo)"></i>90+</span>' +
    '<span><i style="background:#6d1a20"></i>S: siniestro (pagó la aseguradora)</span><span><i style="background:#e3e8ee"></i>sin contrato / en plazo</span></div>' +
    '<p class="ayuda">Del mes más antiguo (izquierda) al más reciente (derecha). Pase el mouse sobre cada cuadro para ver el detalle.</p>';
  return html;
}

function tablaPagos(resumen) {
  var html = '<div class="tabla-envoltura"><table><tr><th>Periodo</th><th>Fecha límite</th><th>Fecha de pago</th><th>Valor</th><th>Días de mora</th><th>Pagó</th></tr>';
  resumen.pagos.slice().reverse().forEach(function (p) {
    var d = diasMora(p), cod = codigoMora(p);
    var chip = cod.clase === "n" ? "verde" : cod.clase === "m1" ? "amarillo" : cod.clase === "vacio" ? "gris" : cod.clase === "m30" ? "naranja" : "rojo";
    html += "<tr><td>" + periodoTexto(p.periodo) + "</td><td>" + fechaCorta(p.fechaLimite) + "</td><td>" +
      (p.fechaPago ? fechaCorta(p.fechaPago) : '<span class="chip rojo">Sin pagar</span>') + "</td><td>" + pesos(p.valor) +
      '</td><td><span class="chip ' + chip + '">' + d + "</span></td><td>" + (p.pagadoPor || "—") + "</td></tr>";
  });
  return html + "</table></div>";
}

function construirReporte(cc, usuario) {
  var persona = BD.inquilino(cc);
  if (!persona) return '<div class="tarjeta"><h2>Sin información</h2><p>La cédula ' + esc(cc) + " no está registrada en la central.</p></div>";

  var contratos = BD.contratosDe(cc);
  var puntaje = calcularPuntaje(cc);
  var cat = categoriaPuntaje(puntaje);
  var resumenes = contratos.map(resumenContrato);

  var totalPagos = 0, aTiempo = 0, maxMora = 0, deuda = 0, siniestros = 0, sumaMora = 0, conMora = 0;
  resumenes.forEach(function (r, i) {
    totalPagos += r.total; aTiempo += r.aTiempo; deuda += r.deuda;
    if (r.maxMora > maxMora) maxMora = r.maxMora;
    if (contratos[i].siniestro) siniestros++;
    r.pagos.forEach(function (p) { var d = diasMora(p); if (d > 0) { sumaMora += d; conMora++; } });
  });
  var pct = totalPagos ? Math.round(aTiempo * 100 / totalPagos) : 0;
  var ultimo = contratos[contratos.length - 1];
  var rUltimo = resumenes[resumenes.length - 1];
  var edad = Math.floor((Date.now() - aFecha(persona.nacimiento)) / (365.25 * 86400000));

  var html = '<div class="tarjeta"><div class="reporte-cabecera"><div class="datos">' +
    '<p class="tenue" style="margin:0">REPORTE DE HISTORIAL DE ARRENDAMIENTO</p>' +
    "<h1>" + esc(persona.nombres + " " + persona.apellidos) + "</h1>" +
    "<p style='margin:.2rem 0'>C.C. <b>" + cc + "</b> · " + edad + " años · " + esc(persona.ocupacion) + " · " + esc(persona.ciudad) + "</p>" +
    "<p class='tenue' style='margin:.2rem 0'>Consultado por " + esc(usuario.nombre) + " el " + new Date().toLocaleString("es-CO") + "</p>" +
    "<p class='tenue' style='margin:.2rem 0'>Autorización de tratamiento de datos registrada el " + fechaCorta(persona.autorizacion) + "</p>" +
    '<p><span class="chip ' + cat.color + '" style="font-size:.95rem">' + cat.nombre + "</span></p><p>" + cat.texto + "</p></div>" +
    '<div class="medidor">' + medidorSVG(puntaje, cat.hex) + '<div class="puntaje" style="color:' + cat.hex + '">' + (puntaje === null ? "—" : puntaje) +
    '</div><div class="categoria" style="color:' + cat.hex + '">' + cat.nombre + "</div><div class='ayuda'>Puntaje de 0 a 1000</div></div></div></div>";

  if (!contratos.length) {
    return html + '<div class="alerta info">Esta persona está registrada pero <b>no tiene contratos de arrendamiento reportados</b>. No tener historial no es algo negativo: se recomienda pedir otras referencias o un codeudor.</div>';
  }

  // Alertas
  if (deuda > 0) html += '<div class="alerta error">⚠️ Tiene <b>' + pesos(deuda) + "</b> en cánones vencidos sin pagar actualmente.</div>";
  if (siniestros) html += '<div class="alerta error">⚠️ Registra <b>' + siniestros + "</b> siniestro(s): una aseguradora tuvo que pagarle al propietario por incumplimiento del inquilino.</div>";
  if (!deuda && !siniestros && pct >= 85) html += '<div class="alerta exito">✅ No registra deudas abiertas ni siniestros con aseguradoras.</div>';

  // Indicadores
  html += '<div class="grid grid-4">' +
    kpi(contratos.length, "Viviendas arrendadas") +
    kpi(duracion(contratos[0].fechaInicio, ultimo.fechaFin), "Tiempo con historial") +
    kpi(pct + "%", "Pagos a tiempo (" + aTiempo + " de " + totalPagos + ")") +
    kpi(conMora ? Math.round(sumaMora / conMora) + " días" : "0 días", "Promedio de mora cuando se atrasa") +
    kpi(maxMora + " días", "Mayor mora registrada") +
    kpi(pesos(deuda), "Deuda vencida actual") +
    kpi(pesos(rUltimo.ultimoCanon), "Último canon") +
    kpi(ultimo.fechaFin ? "Terminado" : "Vigente", "Contrato más reciente") + "</div>";

  // Último arrendamiento
  html += '<div class="tarjeta"><h2>Último arrendamiento</h2><div class="grid grid-3">' +
    "<div><b>Arrendador</b><br>" + esc(ultimo.arrendador) + "<br><span class='tenue'>" + ultimo.tipoArrendador + "</span></div>" +
    "<div><b>Inmueble</b><br>" + esc(ultimo.tipoInmueble + " · " + ultimo.direccion) + "<br><span class='tenue'>" + esc(ultimo.barrio + ", " + ultimo.ciudad) + " · Estrato " + ultimo.estrato + "</span></div>" +
    "<div><b>Último canon</b><br>" + pesos(rUltimo.ultimoCanon) + "<br><span class='tenue'>Desde " + fechaCorta(ultimo.fechaInicio) + (ultimo.fechaFin ? " hasta " + fechaCorta(ultimo.fechaFin) : " (vigente)") + "</span></div>" +
    '</div><p><span class="chip ' + rUltimo.resultado.chip + '">' + rUltimo.resultado.texto + "</span> " + estrellas(ultimo.calificacion) + " " + esc(ultimo.observacion || "") + "</p></div>";

  // Vector
  html += '<div class="tarjeta"><h2>Comportamiento de pago · últimos 24 meses</h2>' + vectorComportamiento(contratos) + "</div>";

  // Línea de tiempo
  html += '<div class="tarjeta"><h2>Historial de viviendas</h2><p class="tenue">Del contrato más reciente al más antiguo.</p><div class="linea-tiempo">';
  for (var i = contratos.length - 1; i >= 0; i--) {
    var c = contratos[i], r = resumenes[i], aseg = c.aseguradora ? BD.aseguradora(c.aseguradora) : null;
    html += '<div class="vivienda ' + r.resultado.clase + '">' +
      "<h3 style='margin:0'>" + esc(c.tipoInmueble + " · " + c.direccion) + "</h3>" +
      "<div class='tenue'>" + esc(c.barrio + ", " + c.ciudad) + " · Estrato " + c.estrato + "</div>" +
      "<p style='margin:.4rem 0'><b>" + fechaCorta(c.fechaInicio) + "</b> → <b>" + (c.fechaFin ? fechaCorta(c.fechaFin) : "Vigente") + "</b> (" + duracion(c.fechaInicio, c.fechaFin) + ")<br>" +
      "Arrendador: " + esc(c.arrendador) + " <span class='tenue'>(" + c.tipoArrendador + ")</span><br>" +
      "Canon inicial " + pesos(c.canon) + " · último canon " + pesos(r.ultimoCanon) + "<br>" +
      "Póliza de arrendamiento: " + (aseg ? esc(aseg.nombre) : "<span class='tenue'>Sin póliza</span>") +
      (c.siniestro ? ' <span class="chip rojo">Siniestro pagado por la aseguradora</span>' : "") + "<br>" +
      "Pagos a tiempo: <b>" + r.porcentaje + "%</b> · Mora promedio: " + r.promedioMora + " días · Mayor mora: " + r.maxMora + " días" +
      (r.deuda ? " · <b style='color:var(--rojo)'>Debe " + pesos(r.deuda) + "</b>" : "") + "</p>" +
      '<p style="margin:.2rem 0"><span class="chip ' + r.resultado.chip + '">' + r.resultado.texto + "</span> " + estrellas(c.calificacion) +
      (c.motivoTerminacion ? " <span class='tenue'>Terminación: " + esc(c.motivoTerminacion) + "</span>" : "") + "</p>" +
      (c.observacion ? "<p class='tenue' style='margin:.2rem 0'>Observación del arrendador: “" + esc(c.observacion) + "”</p>" : "") +
      "<details><summary>Ver los " + r.total + " pagos mes a mes</summary>" + tablaPagos(r) + "</details></div>";
  }
  html += "</div></div>";

  // Huella de consultas
  var huella = BD.datos.consultas.filter(function (q) { return q.cedula === cc; }).reverse().slice(0, 10);
  html += '<div class="tarjeta"><h2>Huella de consultas</h2><p class="tenue">Quién ha consultado este historial (la ley exige informarlo al titular).</p>';
  html += huella.length ? '<div class="tabla-envoltura"><table><tr><th>Fecha</th><th>Entidad</th><th>Motivo</th></tr>' + huella.map(function (q) {
    return "<tr><td>" + new Date(q.fecha).toLocaleString("es-CO") + "</td><td>" + esc(q.usuarioNombre) + "</td><td>" + esc(q.motivo) + "</td></tr>";
  }).join("") + "</table></div>" : "<p class='tenue'>Sin consultas registradas.</p>";
  html += "</div>";

  html += '<p class="ayuda">Este reporte es informativo y no constituye por sí solo una decisión de aprobar o negar un arriendo. El titular puede solicitar la corrección de datos inexactos en la sección "Mi historial". ' +
    '</p>';
  return html;
}

function kpi(valor, etiqueta) {
  return '<div class="tarjeta kpi"><div class="valor">' + valor + '</div><div class="etiqueta">' + etiqueta + "</div></div>";
}
function estrellas(n) {
  if (!n) return "";
  return '<span title="Calificación del arrendador: ' + n + ' de 5" style="color:#e0a800">' + "★★★★★".slice(0, n) + '<span style="color:#ccd3db">' + "★★★★★".slice(0, 5 - n) + "</span></span>";
}
