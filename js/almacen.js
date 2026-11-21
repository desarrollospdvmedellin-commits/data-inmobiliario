/* =========================================================
   ALMACÉN DE DATOS (la "base de datos" del prototipo)
   ---------------------------------------------------------
   En un sistema real, estos datos vivirían en un servidor
   con base de datos (por ejemplo PostgreSQL o MySQL). En este
   prototipo se guardan en el localStorage del navegador, así
   el sitio funciona sin instalar nada.

   Tablas (colecciones):
     usuarios, aseguradoras, inquilinos, contratos, pagos,
     compras (pagos simulados), consultas (bitácora de quién
     consultó a quién), accesos (consultas ya pagadas) y
     reclamos (solicitudes de corrección del titular).
   ========================================================= */

var CLAVE_BD = "dataInmobiliario_bd_v1";

/* Si el navegador bloquea localStorage, se usa memoria temporal (los datos
   se pierden al recargar, pero el prototipo sigue funcionando). */
var Almacen = (function () {
  try {
    localStorage.setItem("_prueba", "1"); localStorage.removeItem("_prueba");
    return localStorage;
  } catch (e) {
    var m = {};
    return {
      getItem: function (k) { return k in m ? m[k] : null; },
      setItem: function (k, v) { m[k] = String(v); },
      removeItem: function (k) { delete m[k]; }
    };
  }
})();

var BD = {
  datos: null,

  /* Carga la base de datos; si no existe, la crea con la semilla */
  cargar: function () {
    var texto = Almacen.getItem(CLAVE_BD);
    if (texto) {
      try { this.datos = JSON.parse(texto); return; } catch (e) { /* se regenera */ }
    }
    this.restablecer();
  },

  guardar: function () {
    Almacen.setItem(CLAVE_BD, JSON.stringify(this.datos));
  },

  /* Borra todo y vuelve a crear los datos ficticios de demostración */
  restablecer: function () {
    var copia = JSON.parse(JSON.stringify(SEMILLA));
    var rng = crearAleatorio(20261121); // semilla fija: siempre los mismos datos
    var pagos = [];
    copia.contratos.forEach(function (c) {
      pagos = pagos.concat(generarPagos(c, c.perfil, rng));
    });
    this.datos = {
      usuarios: copia.usuarios,
      aseguradoras: copia.aseguradoras,
      inquilinos: copia.inquilinos,
      contratos: copia.contratos,
      pagos: pagos,
      compras: [],
      consultas: [],
      accesos: [],
      reclamos: []
    };
    this.guardar();
  },

  nuevoId: function (prefijo) {
    return prefijo + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  },

  /* ---------- Consultas de lectura ---------- */
  inquilino: function (cedula) {
    return this.datos.inquilinos.find(function (i) { return i.cedula === cedula; });
  },
  contratosDe: function (cedula) {
    return this.datos.contratos
      .filter(function (c) { return c.cedula === cedula; })
      .sort(function (a, b) { return a.fechaInicio < b.fechaInicio ? -1 : 1; });
  },
  pagosDe: function (contratoId) {
    return this.datos.pagos
      .filter(function (p) { return p.contratoId === contratoId; })
      .sort(function (a, b) { return a.periodo < b.periodo ? -1 : 1; });
  },
  aseguradora: function (id) {
    return this.datos.aseguradoras.find(function (a) { return a.id === id; });
  },
  usuarioPorEmail: function (email) {
    email = (email || "").trim().toLowerCase();
    return this.datos.usuarios.find(function (u) { return u.email.toLowerCase() === email; });
  },
  usuarioPorId: function (id) {
    return this.datos.usuarios.find(function (u) { return u.id === id; });
  }
};

/* =========================================================
   GENERADOR DE PAGOS SIMULADOS
   ========================================================= */

/* Generador pseudoaleatorio con semilla (algoritmo mulberry32).
   Con la misma semilla produce siempre la misma secuencia, por eso
   los datos de demostración son idénticos en todos los equipos. */
function crearAleatorio(semilla) {
  var a = semilla >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function entero(rng, min, max) { return min + Math.floor(rng() * (max - min + 1)); }

/* Días de mora según el perfil de comportamiento */
function moraSegunPerfil(perfil, rng) {
  var r = rng();
  switch (perfil) {
    case "puntual": return r < 0.93 ? 0 : entero(rng, 1, 3);
    case "bueno":   return r < 0.80 ? 0 : (r < 0.97 ? entero(rng, 1, 8) : entero(rng, 9, 20));
    case "regular": return r < 0.50 ? 0 : (r < 0.82 ? entero(rng, 1, 15) : (r < 0.95 ? entero(rng, 16, 35) : entero(rng, 36, 60)));
    case "moroso":  return r < 0.25 ? 0 : (r < 0.55 ? entero(rng, 5, 25) : (r < 0.85 ? entero(rng, 26, 60) : entero(rng, 61, 95)));
    default: return 0;
  }
}

/* Crea los pagos mes a mes de un contrato.
   - Fecha límite de pago: día 5 de cada mes (supuesto).
   - El canon sube cada año en el aniversario del contrato (≈ IPC).
   - Si el contrato tuvo siniestro, los últimos 3 meses los paga la aseguradora.
   - Si es moroso y está vigente, los 2 últimos meses quedan sin pagar. */
function generarPagos(contrato, perfil, rng, desdePeriodo) {
  var hoy = new Date();
  var inicio = aFecha(contrato.fechaInicio);
  var fin = contrato.fechaFin ? aFecha(contrato.fechaFin) : hoy;
  var pagos = [];
  var anio = inicio.getFullYear(), mes = inicio.getMonth();
  var canon = contrato.canon;
  var mesesTranscurridos = 0;

  while (true) {
    var limite = new Date(anio, mes, 5);
    if (limite > fin) break;
    if (mesesTranscurridos > 0 && mesesTranscurridos % 12 === 0) {
      canon = Math.round(canon * 1.06 / 1000) * 1000; // incremento anual ~6 %
    }
    var periodo = anio + "-" + dos(mes + 1);
    if (!desdePeriodo || periodo >= desdePeriodo) {
      var mora = moraSegunPerfil(perfil, rng);
      var fechaPago = new Date(limite.getTime() + mora * 86400000);
      pagos.push({
        id: "P" + contrato.id + "-" + periodo,
        contratoId: contrato.id,
        periodo: periodo,
        fechaLimite: aTexto(limite),
        fechaPago: fechaPago <= hoy ? aTexto(fechaPago) : null,
        valor: canon,
        pagadoPor: fechaPago <= hoy ? "Inquilino" : null
      });
    }
    mesesTranscurridos++;
    mes++; if (mes > 11) { mes = 0; anio++; }
  }

  var n = pagos.length;
  if (contrato.siniestro && n >= 3) {
    for (var i = n - 3; i < n; i++) {
      var lim = aFecha(pagos[i].fechaLimite);
      pagos[i].fechaPago = aTexto(new Date(lim.getTime() + entero(rng, 40, 75) * 86400000));
      pagos[i].pagadoPor = "Aseguradora";
    }
  } else if (perfil === "moroso" && !contrato.fechaFin && n >= 2) {
    pagos[n - 1].fechaPago = null; pagos[n - 1].pagadoPor = null;
    pagos[n - 2].fechaPago = null; pagos[n - 2].pagadoPor = null;
  }
  return pagos;
}

/* =========================================================
   CÁLCULOS DEL REPORTE (lógica de negocio)
   ========================================================= */

/* Días de mora de un pago. Si no se ha pagado, cuenta hasta hoy. */
function diasMora(pago) {
  var limite = aFecha(pago.fechaLimite);
  var hasta = pago.fechaPago ? aFecha(pago.fechaPago) : new Date();
  var d = Math.floor((hasta - limite) / 86400000);
  return d > 0 ? d : 0;
}

/* Clasifica un pago en la categoría del "vector de comportamiento" */
function codigoMora(pago) {
  if (pago.pagadoPor === "Aseguradora") return { clase: "np", texto: "S", nombre: "Siniestro: pagó la aseguradora" };
  var d = diasMora(pago);
  var pendiente = !pago.fechaPago;
  if (pendiente && d === 0) return { clase: "vacio", texto: "·", nombre: "Pendiente, aún dentro del plazo" };
  if (d === 0) return { clase: "n", texto: "N", nombre: "Al día" };
  if (d <= 29) return { clase: "m1", texto: d, nombre: d + " días de mora" + (pendiente ? " (sin pagar)" : "") };
  if (d <= 59) return { clase: "m30", texto: "30", nombre: d + " días de mora" + (pendiente ? " (sin pagar)" : "") };
  if (d <= 89) return { clase: "m60", texto: "60", nombre: d + " días de mora" + (pendiente ? " (sin pagar)" : "") };
  return { clase: "m90", texto: "90", nombre: d + " días de mora" + (pendiente ? " (sin pagar)" : "") };
}

/* PUNTAJE (0 a 1000) - modelo SIMPLIFICADO y ACADÉMICO.
   1) Cada mes recibe una nota según los días de mora:
        al día = 1000 · 1-5 días = 700 · 6-15 = 450 · 16-30 = 300
        31-60 = 150 · más de 60 o siniestro = 0
   2) Se promedian las notas; los últimos 24 meses pesan el doble
      (lo reciente dice más del hábito actual que lo antiguo).
   3) Se restan castigos: 150 por cada siniestro con aseguradora y
      80 por cada mes vencido que siga sin pagar (máximo 300).      */
function notaMes(pago) {
  if (pago.pagadoPor === "Aseguradora") return 0;
  var d = diasMora(pago);
  if (!pago.fechaPago && d === 0) return null; // aún en plazo: no cuenta
  if (d === 0) return 1000;
  if (d <= 5) return 700;
  if (d <= 15) return 450;
  if (d <= 30) return 300;
  if (d <= 60) return 150;
  return 0;
}

function calcularPuntaje(cedula) {
  var contratos = BD.contratosDe(cedula);
  if (contratos.length === 0) return null;
  var hace24 = new Date(); hace24.setMonth(hace24.getMonth() - 24);
  var suma = 0, pesos = 0, castigo = 0, deudaMeses = 0;

  contratos.forEach(function (c) {
    BD.pagosDe(c.id).forEach(function (p) {
      var nota = notaMes(p);
      if (nota === null) return;
      var peso = aFecha(p.fechaLimite) >= hace24 ? 2 : 1;
      suma += nota * peso; pesos += peso;
      if (!p.fechaPago && diasMora(p) > 0) deudaMeses++;
    });
    if (c.siniestro) castigo += 150;
  });
  if (pesos === 0) return null;
  castigo += Math.min(300, deudaMeses * 80);
  var puntaje = suma / pesos - castigo;
  return Math.max(0, Math.min(1000, Math.round(puntaje)));
}

function categoriaPuntaje(puntaje) {
  if (puntaje === null) return { nombre: "Sin historial", color: "gris", hex: "#6b7785", texto: "No hay información de arrendamientos para esta persona." };
  if (puntaje >= 940) return { nombre: "Excelente pagador", color: "verde", hex: "#1e9e5a", texto: "Paga sus cánones a tiempo de forma consistente." };
  if (puntaje >= 800) return { nombre: "Buen pagador", color: "verde", hex: "#5aa83a", texto: "Mayormente cumplido, con retrasos ocasionales y cortos." };
  if (puntaje >= 600) return { nombre: "Pagador regular", color: "amarillo", hex: "#d89b00", texto: "Presenta moras frecuentes. Se recomienda pedir garantías adicionales." };
  return { nombre: "Mal pagador", color: "rojo", hex: "#c8313a", texto: "Tiene moras altas, deudas abiertas o siniestros con aseguradoras." };
}

/* Resumen de un contrato: cuántos meses, puntualidad, mora... */
function resumenContrato(contrato) {
  var pagos = BD.pagosDe(contrato.id);
  var aTiempo = 0, sumaMora = 0, maxMora = 0, pendientes = 0, deuda = 0, conMora = 0;
  pagos.forEach(function (p) {
    var d = diasMora(p);
    if (d === 0 && p.fechaPago) aTiempo++;
    if (d > 0) { conMora++; sumaMora += d; }
    if (d > maxMora) maxMora = d;
    if (!p.fechaPago) { pendientes++; if (d > 0) deuda += p.valor; }
  });
  var pct = pagos.length ? Math.round(aTiempo * 100 / pagos.length) : 0;
  var ultimo = pagos.length ? pagos[pagos.length - 1] : null;
  var resultado;
  if (contrato.siniestro || maxMora > 90 || deuda > 0 && maxMora > 30) resultado = { texto: "Le fue mal", clase: "mala", chip: "rojo" };
  else if (pct >= 85 && maxMora <= 10) resultado = { texto: "Le fue bien", clase: "buena", chip: "verde" };
  else resultado = { texto: "Cumplimiento regular", clase: "regular", chip: "amarillo" };
  return {
    pagos: pagos, total: pagos.length, aTiempo: aTiempo, porcentaje: pct,
    promedioMora: conMora ? Math.round(sumaMora / conMora) : 0, maxMora: maxMora,
    pendientes: pendientes, deuda: deuda, ultimoCanon: ultimo ? ultimo.valor : contrato.canon,
    resultado: resultado
  };
}

/* ---------- Utilidades de fechas ---------- */
function dos(n) { return (n < 10 ? "0" : "") + n; }
function aFecha(texto) { var p = texto.split("-"); return new Date(+p[0], +p[1] - 1, +(p[2] || 1)); }
function aTexto(f) { return f.getFullYear() + "-" + dos(f.getMonth() + 1) + "-" + dos(f.getDate()); }

BD.cargar();
