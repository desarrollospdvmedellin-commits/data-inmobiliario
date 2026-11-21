/* =========================================================
   DATOS SEMILLA (100 % FICTICIOS)
   ---------------------------------------------------------
   Todos los nombres, cédulas, direcciones, inmobiliarias y
   aseguradoras de este archivo son INVENTADOS para fines
   académicos. Las cédulas usan el prefijo 99900 para que no
   coincidan con documentos reales (las cédulas colombianas de
   10 dígitos empiezan por 1).

   Los PAGOS mensuales no se escriben a mano: se generan
   automáticamente en almacen.js a partir del "perfil" de cada
   contrato (puntual, bueno, regular, moroso). Así hay años de
   historial sin escribir miles de líneas.
   ========================================================= */

var SEMILLA = {

  // Usuarios de demostración para iniciar sesión
  usuarios: [
    {
      id: "u1", tipo: "inmobiliaria", nombre: "Inmobiliaria Horizonte S.A.S.",
      documento: "900000001-1", email: "inmobiliaria@demo.co", clave: "demo123",
      ciudad: "Medellín", creditos: 5
    },
    {
      id: "u2", tipo: "persona", nombre: "Laura Marcela Restrepo Quintero",
      documento: "9990000101", email: "persona@demo.co", clave: "demo123",
      ciudad: "Medellín", creditos: 0
    },
    {
      id: "u3", tipo: "persona", nombre: "Propietario Demo (arrendador particular)",
      documento: "9990000900", email: "propietario@demo.co", clave: "demo123",
      ciudad: "Envigado", creditos: 2
    }
  ],

  // Aseguradoras de arrendamiento ficticias
  aseguradoras: [
    { id: "A1", nombre: "Amparo Arriendo Seguros S.A.", tarifa: 0.022, diasSiniestro: 30 },
    { id: "A2", nombre: "Garantía Hogar Aseguradora", tarifa: 0.025, diasSiniestro: 30 },
    { id: "A3", nombre: "Protección Canon Seguros", tarifa: 0.020, diasSiniestro: 45 }
  ],

  // Personas (inquilinos) registradas en la central
  inquilinos: [
    { cedula: "9990000101", nombres: "Laura Marcela", apellidos: "Restrepo Quintero", nacimiento: "1990-03-14", ciudad: "Medellín", telefono: "300 000 0101", email: "laura.r@correo-ficticio.co", ocupacion: "Contadora", autorizacion: "2018-01-20" },
    { cedula: "9990000102", nombres: "Andrés Felipe", apellidos: "Gómez Arango", nacimiento: "1987-07-02", ciudad: "Medellín", telefono: "300 000 0102", email: "andres.g@correo-ficticio.co", ocupacion: "Ingeniero de sistemas", autorizacion: "2017-05-03" },
    { cedula: "9990000103", nombres: "Carolina Andrea", apellidos: "Mejía Salazar", nacimiento: "1994-11-23", ciudad: "Bello", telefono: "300 000 0103", email: "carolina.m@correo-ficticio.co", ocupacion: "Diseñadora", autorizacion: "2019-02-11" },
    { cedula: "9990000104", nombres: "Jhon Fredy", apellidos: "Ospina Cárdenas", nacimiento: "1983-01-30", ciudad: "Bogotá", telefono: "300 000 0104", email: "jhon.o@correo-ficticio.co", ocupacion: "Comerciante", autorizacion: "2018-08-15" },
    { cedula: "9990000105", nombres: "Diana Patricia", apellidos: "Vélez Montoya", nacimiento: "1979-05-09", ciudad: "Envigado", telefono: "300 000 0105", email: "diana.v@correo-ficticio.co", ocupacion: "Docente", autorizacion: "2016-09-01" },
    { cedula: "9990000106", nombres: "Juan Camilo", apellidos: "Rendón Higuita", nacimiento: "1992-12-17", ciudad: "Cali", telefono: "300 000 0106", email: "juan.r@correo-ficticio.co", ocupacion: "Vendedor", autorizacion: "2019-06-20" },
    { cedula: "9990000107", nombres: "Natalia Isabel", apellidos: "Cardona Ruiz", nacimiento: "1996-04-05", ciudad: "Medellín", telefono: "300 000 0107", email: "natalia.c@correo-ficticio.co", ocupacion: "Enfermera", autorizacion: "2020-01-10" },
    { cedula: "9990000108", nombres: "Sebastián Alejandro", apellidos: "Muñoz Betancur", nacimiento: "1991-08-28", ciudad: "Pereira", telefono: "300 000 0108", email: "sebastian.m@correo-ficticio.co", ocupacion: "Chef", autorizacion: "2018-03-12" },
    { cedula: "9990000109", nombres: "Paula Andrea", apellidos: "Zapata Henao", nacimiento: "1999-10-11", ciudad: "Medellín", telefono: "300 000 0109", email: "paula.z@correo-ficticio.co", ocupacion: "Analista de datos", autorizacion: "2024-02-01" },
    { cedula: "9990000110", nombres: "Carlos Mario", apellidos: "Londoño Giraldo", nacimiento: "1985-06-21", ciudad: "Barranquilla", telefono: "300 000 0110", email: "carlos.l@correo-ficticio.co", ocupacion: "Independiente", autorizacion: "2017-11-30" },
    { cedula: "9990000111", nombres: "Valentina", apellidos: "Ríos Echeverri", nacimiento: "1997-02-14", ciudad: "Bucaramanga", telefono: "300 000 0111", email: "valentina.r@correo-ficticio.co", ocupacion: "Abogada", autorizacion: "2021-07-19" },
    { cedula: "9990000112", nombres: "Miguel Ángel", apellidos: "Torres Patiño", nacimiento: "1988-09-03", ciudad: "Bogotá", telefono: "300 000 0112", email: "miguel.t@correo-ficticio.co", ocupacion: "Conductor", autorizacion: "2018-12-04" },
    { cedula: "9990000113", nombres: "Luisa Fernanda", apellidos: "Arias Correa", nacimiento: "1993-03-27", ciudad: "Sabaneta", telefono: "300 000 0113", email: "luisa.a@correo-ficticio.co", ocupacion: "Odontóloga", autorizacion: "2019-09-09" },
    { cedula: "9990000114", nombres: "Esteban David", apellidos: "Herrera Mazo", nacimiento: "2002-01-15", ciudad: "Itagüí", telefono: "300 000 0114", email: "esteban.h@correo-ficticio.co", ocupacion: "Estudiante", autorizacion: "2026-10-01" }
  ],

  /* Contratos de arrendamiento.
     fechaFin = null  -> contrato vigente (se generan pagos hasta hoy)
     perfil           -> controla cómo se generan los pagos
     siniestro = true -> el inquilino dejó de pagar y la aseguradora
                         pagó al propietario los últimos meses        */
  contratos: [
    // Laura: excelente pagadora
    { id: "C001", cedula: "9990000101", inmobiliaria: "Arrendamientos La Ceiba", arrendador: "Arrendamientos La Ceiba", tipoArrendador: "Inmobiliaria", direccion: "Calle 10 # 40-21 Apto 302", barrio: "El Poblado", ciudad: "Medellín", estrato: 4, tipoInmueble: "Apartamento", fechaInicio: "2018-02-01", fechaFin: "2021-01-31", canon: 1150000, aseguradora: "A1", perfil: "puntual", motivoTerminacion: "Entrega voluntaria al terminar el contrato", calificacion: 5, observacion: "Entregó el inmueble en perfecto estado." },
    { id: "C002", cedula: "9990000101", inmobiliaria: "Inmobiliaria Horizonte S.A.S.", arrendador: "Inmobiliaria Horizonte S.A.S.", tipoArrendador: "Inmobiliaria", direccion: "Carrera 43A # 18 Sur-55 Apto 1104", barrio: "Castropol", ciudad: "Medellín", estrato: 5, tipoInmueble: "Apartamento", fechaInicio: "2021-02-01", fechaFin: null, canon: 1650000, aseguradora: "A2", perfil: "puntual", motivoTerminacion: "", calificacion: 5, observacion: "Contrato vigente sin novedades." },

    // Andrés: buen pagador con retrasos pequeños
    { id: "C003", cedula: "9990000102", inmobiliaria: "", arrendador: "Gloria Inés Pérez (particular)", tipoArrendador: "Persona natural", direccion: "Calle 50 # 70-12", barrio: "Laureles", ciudad: "Medellín", estrato: 4, tipoInmueble: "Casa", fechaInicio: "2017-06-01", fechaFin: "2019-12-31", canon: 950000, aseguradora: null, perfil: "bueno", motivoTerminacion: "Venta del inmueble por parte del propietario", calificacion: 4, observacion: "Algunos pagos con pocos días de retraso." },
    { id: "C004", cedula: "9990000102", inmobiliaria: "Propiedades del Valle Ltda.", arrendador: "Propiedades del Valle Ltda.", tipoArrendador: "Inmobiliaria", direccion: "Carrera 70 # 44-90 Apto 501", barrio: "Estadio", ciudad: "Medellín", estrato: 4, tipoInmueble: "Apartamento", fechaInicio: "2020-01-15", fechaFin: null, canon: 1300000, aseguradora: "A3", perfil: "bueno", motivoTerminacion: "", calificacion: 4, observacion: "" },

    // Carolina: pagadora regular
    { id: "C005", cedula: "9990000103", inmobiliaria: "Vivienda Segura Inmobiliaria", arrendador: "Vivienda Segura Inmobiliaria", tipoArrendador: "Inmobiliaria", direccion: "Diagonal 55 # 34-10 Apto 203", barrio: "Niquía", ciudad: "Bello", estrato: 3, tipoInmueble: "Apartamento", fechaInicio: "2019-03-01", fechaFin: "2022-02-28", canon: 780000, aseguradora: "A1", perfil: "regular", motivoTerminacion: "Terminación anticipada por la arrendataria con preaviso", calificacion: 3, observacion: "Pagos frecuentemente atrasados, sin llegar a cobro jurídico." },
    { id: "C006", cedula: "9990000103", inmobiliaria: "", arrendador: "Hernán Darío Ochoa (particular)", tipoArrendador: "Persona natural", direccion: "Calle 47 # 50-33 Int 201", barrio: "Centro", ciudad: "Bello", estrato: 3, tipoInmueble: "Apartaestudio", fechaInicio: "2022-03-10", fechaFin: null, canon: 850000, aseguradora: null, perfil: "regular", motivoTerminacion: "", calificacion: 3, observacion: "" },

    // Jhon Fredy: mal pagador, contrato vigente con meses sin pagar
    { id: "C007", cedula: "9990000104", inmobiliaria: "Bogotá Hogares Inmobiliaria", arrendador: "Bogotá Hogares Inmobiliaria", tipoArrendador: "Inmobiliaria", direccion: "Avenida Calle 80 # 69-40 Apto 702", barrio: "Las Ferias", ciudad: "Bogotá", estrato: 3, tipoInmueble: "Apartamento", fechaInicio: "2018-09-01", fechaFin: "2021-06-30", canon: 1050000, aseguradora: "A2", perfil: "moroso", siniestro: true, motivoTerminacion: "Restitución del inmueble por mora; la aseguradora indemnizó al propietario", calificacion: 1, observacion: "Proceso de restitución. Saldo recobrado por la aseguradora." },
    { id: "C008", cedula: "9990000104", inmobiliaria: "", arrendador: "Martha Lucía Rojas (particular)", tipoArrendador: "Persona natural", direccion: "Carrera 15 # 140-22", barrio: "Cedritos", ciudad: "Bogotá", estrato: 4, tipoInmueble: "Casa", fechaInicio: "2023-04-01", fechaFin: null, canon: 1600000, aseguradora: null, perfil: "moroso", motivoTerminacion: "", calificacion: 1, observacion: "Adeuda cánones recientes." },

    // Diana: excelente pagadora, historial largo
    { id: "C009", cedula: "9990000105", inmobiliaria: "Arrendamientos La Ceiba", arrendador: "Arrendamientos La Ceiba", tipoArrendador: "Inmobiliaria", direccion: "Transversal 32 Sur # 31-08", barrio: "Zúñiga", ciudad: "Envigado", estrato: 5, tipoInmueble: "Casa", fechaInicio: "2016-10-01", fechaFin: "2020-09-30", canon: 1800000, aseguradora: "A1", perfil: "puntual", motivoTerminacion: "Compra de vivienda propia", calificacion: 5, observacion: "Arrendataria ejemplar." },
    { id: "C010", cedula: "9990000105", inmobiliaria: "Inmobiliaria Horizonte S.A.S.", arrendador: "Inmobiliaria Horizonte S.A.S.", tipoArrendador: "Inmobiliaria", direccion: "Calle 37 Sur # 27-60 Apto 1501", barrio: "El Esmeraldal", ciudad: "Envigado", estrato: 5, tipoInmueble: "Apartamento", fechaInicio: "2023-01-01", fechaFin: null, canon: 2400000, aseguradora: "A2", perfil: "puntual", motivoTerminacion: "", calificacion: 5, observacion: "" },

    // Juan Camilo: siniestro con aseguradora
    { id: "C011", cedula: "9990000106", inmobiliaria: "Propiedades del Valle Ltda.", arrendador: "Propiedades del Valle Ltda.", tipoArrendador: "Inmobiliaria", direccion: "Calle 5 # 66-14 Apto 404", barrio: "El Ingenio", ciudad: "Cali", estrato: 4, tipoInmueble: "Apartamento", fechaInicio: "2019-07-01", fechaFin: "2023-03-31", canon: 1100000, aseguradora: "A3", perfil: "regular", siniestro: true, motivoTerminacion: "Abandono del inmueble con cánones en mora; siniestro pagado por la aseguradora", calificacion: 1, observacion: "La aseguradora pagó 3 cánones al propietario y adelanta cobro al inquilino y codeudor." },
    { id: "C012", cedula: "9990000106", inmobiliaria: "", arrendador: "Jairo Alberto Muñoz (particular)", tipoArrendador: "Persona natural", direccion: "Carrera 1 # 70-30", barrio: "Alfonso López", ciudad: "Cali", estrato: 2, tipoInmueble: "Habitación", fechaInicio: "2023-06-01", fechaFin: null, canon: 450000, aseguradora: null, perfil: "bueno", motivoTerminacion: "", calificacion: 4, observacion: "" },

    // Natalia: buena pagadora
    { id: "C013", cedula: "9990000107", inmobiliaria: "Inmobiliaria Horizonte S.A.S.", arrendador: "Inmobiliaria Horizonte S.A.S.", tipoArrendador: "Inmobiliaria", direccion: "Calle 65 # 45-21 Apto 302", barrio: "Prado Centro", ciudad: "Medellín", estrato: 3, tipoInmueble: "Apartamento", fechaInicio: "2020-02-01", fechaFin: null, canon: 900000, aseguradora: "A1", perfil: "bueno", motivoTerminacion: "", calificacion: 4, observacion: "" },

    // Sebastián: empezó regular y mejoró
    { id: "C014", cedula: "9990000108", inmobiliaria: "Eje Cafetero Arriendos", arrendador: "Eje Cafetero Arriendos", tipoArrendador: "Inmobiliaria", direccion: "Carrera 8 # 22-15 Apto 201", barrio: "Centro", ciudad: "Pereira", estrato: 3, tipoInmueble: "Apartamento", fechaInicio: "2018-04-01", fechaFin: "2021-03-31", canon: 700000, aseguradora: "A3", perfil: "regular", motivoTerminacion: "Entrega voluntaria", calificacion: 3, observacion: "Retrasos frecuentes durante 2020." },
    { id: "C015", cedula: "9990000108", inmobiliaria: "Eje Cafetero Arriendos", arrendador: "Eje Cafetero Arriendos", tipoArrendador: "Inmobiliaria", direccion: "Avenida 30 de Agosto # 40-11 Apto 803", barrio: "Álamos", ciudad: "Pereira", estrato: 4, tipoInmueble: "Apartamento", fechaInicio: "2021-04-01", fechaFin: null, canon: 1000000, aseguradora: "A3", perfil: "puntual", motivoTerminacion: "", calificacion: 5, observacion: "Mejoró notablemente su hábito de pago." },

    // Paula: historial corto y bueno
    { id: "C016", cedula: "9990000109", inmobiliaria: "Inmobiliaria Horizonte S.A.S.", arrendador: "Inmobiliaria Horizonte S.A.S.", tipoArrendador: "Inmobiliaria", direccion: "Calle 44 # 79-50 Apto 1203", barrio: "Belén", ciudad: "Medellín", estrato: 4, tipoInmueble: "Apartamento", fechaInicio: "2024-03-01", fechaFin: null, canon: 1350000, aseguradora: "A2", perfil: "puntual", motivoTerminacion: "", calificacion: 5, observacion: "" },

    // Carlos Mario: moroso reincidente
    { id: "C017", cedula: "9990000110", inmobiliaria: "Costa Inmobiliaria del Caribe", arrendador: "Costa Inmobiliaria del Caribe", tipoArrendador: "Inmobiliaria", direccion: "Carrera 53 # 79-120 Apto 6B", barrio: "El Prado", ciudad: "Barranquilla", estrato: 4, tipoInmueble: "Apartamento", fechaInicio: "2017-12-01", fechaFin: "2020-05-31", canon: 1200000, aseguradora: "A1", perfil: "moroso", siniestro: true, motivoTerminacion: "Restitución judicial por mora", calificacion: 1, observacion: "Siniestro pagado por la aseguradora." },
    { id: "C018", cedula: "9990000110", inmobiliaria: "", arrendador: "Rosa Elena Vargas (particular)", tipoArrendador: "Persona natural", direccion: "Calle 84 # 42F-18", barrio: "Riomar", ciudad: "Barranquilla", estrato: 5, tipoInmueble: "Casa", fechaInicio: "2020-09-01", fechaFin: "2022-08-31", canon: 1700000, aseguradora: null, perfil: "moroso", motivoTerminacion: "Terminación por incumplimiento en pagos", calificacion: 1, observacion: "Dejó saldo pendiente de servicios públicos." },
    { id: "C019", cedula: "9990000110", inmobiliaria: "Costa Inmobiliaria del Caribe", arrendador: "Costa Inmobiliaria del Caribe", tipoArrendador: "Inmobiliaria", direccion: "Carrera 46 # 90-15 Apto 302", barrio: "Altos de Riomar", ciudad: "Barranquilla", estrato: 4, tipoInmueble: "Apartamento", fechaInicio: "2024-01-01", fechaFin: null, canon: 1500000, aseguradora: "A2", perfil: "regular", motivoTerminacion: "", calificacion: 2, observacion: "" },

    // Valentina: buena
    { id: "C020", cedula: "9990000111", inmobiliaria: "Santander Propiedades", arrendador: "Santander Propiedades", tipoArrendador: "Inmobiliaria", direccion: "Carrera 27 # 48-30 Apto 904", barrio: "Cabecera del Llano", ciudad: "Bucaramanga", estrato: 5, tipoInmueble: "Apartamento", fechaInicio: "2021-08-01", fechaFin: null, canon: 1450000, aseguradora: "A1", perfil: "bueno", motivoTerminacion: "", calificacion: 4, observacion: "" },

    // Miguel Ángel: regular
    { id: "C021", cedula: "9990000112", inmobiliaria: "Bogotá Hogares Inmobiliaria", arrendador: "Bogotá Hogares Inmobiliaria", tipoArrendador: "Inmobiliaria", direccion: "Calle 1 Sur # 30-45", barrio: "Santa Isabel", ciudad: "Bogotá", estrato: 3, tipoInmueble: "Casa", fechaInicio: "2019-01-01", fechaFin: "2023-12-31", canon: 1000000, aseguradora: "A2", perfil: "regular", motivoTerminacion: "Entrega voluntaria al vencimiento", calificacion: 3, observacion: "" },
    { id: "C022", cedula: "9990000112", inmobiliaria: "", arrendador: "Pedro Pablo Castro (particular)", tipoArrendador: "Persona natural", direccion: "Carrera 68 # 12-40 Apto 101", barrio: "Marsella", ciudad: "Bogotá", estrato: 3, tipoInmueble: "Apartamento", fechaInicio: "2024-02-01", fechaFin: null, canon: 1250000, aseguradora: null, perfil: "regular", motivoTerminacion: "", calificacion: 3, observacion: "" },

    // Luisa: excelente
    { id: "C023", cedula: "9990000113", inmobiliaria: "Vivienda Segura Inmobiliaria", arrendador: "Vivienda Segura Inmobiliaria", tipoArrendador: "Inmobiliaria", direccion: "Calle 75 Sur # 43A-80 Apto 1802", barrio: "Aves María", ciudad: "Sabaneta", estrato: 4, tipoInmueble: "Apartamento", fechaInicio: "2019-10-01", fechaFin: null, canon: 1250000, aseguradora: "A3", perfil: "puntual", motivoTerminacion: "", calificacion: 5, observacion: "" }

    // Esteban (9990000114) no tiene contratos: sirve para mostrar
    // el caso "persona sin historial de arrendamiento".
  ]
};
