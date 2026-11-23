# Data Inmobiliario: prototipo académico

Central de información de **arrendatarios**, similar a una central de riesgo crediticio pero enfocada en el historial de arriendo.
Permite a inmobiliarias y propietarios saber, con autorización del titular, si una persona ha sido **buena o mala pagadora** de cánones.

> ⚠️ Proyecto de grado con fines académicos. **Todos los datos son ficticios** y **los pagos son simulados**: no se cobra dinero ni se conecta a ningún banco.

---

## 1. Cómo ejecutarlo

No necesita instalar nada.

1. Descargue la carpeta `data-inmobiliario` completa.
2. Abra el archivo **`index.html`** con doble clic (Chrome, Edge o Firefox).
3. Ingrese con un usuario de prueba (por presentación, estas cuentas ya no se muestran en el sitio; solo están aquí):

| Tipo | Correo | Clave | Para probar |
|---|---|---|---|
| Inmobiliaria | `inmobiliaria@demo.co` | `demo123` | Consultar cédulas, comprar consultas, ingresar datos |
| Persona (inquilina) | `persona@demo.co` | `demo123` | Ver su historial gratis, ver quién la consultó, poner reclamos |
| Propietario particular | `propietario@demo.co` | `demo123` | Consultar a un aspirante |

**Cédulas ficticias para la demostración** (todas empiezan por 99900, así no coinciden con cédulas reales):

| Cédula | Caso |
|---|---|
| 9990000101 | Buena pagadora (Laura) |
| 9990000102 | Buen pagador con retrasos cortos |
| 9990000103 | Buena pagadora con moras frecuentes |
| 9990000104 | **Mal pagador**: deuda abierta y siniestro con aseguradora |
| 9990000106 | Tuvo siniestro, luego mejoró |
| 9990000108 | Empezó regular y mejoró |
| 9990000110 | Moroso reincidente |
| 9990000114 | Registrado pero **sin historial** |

**Tarjeta de prueba para el pago simulado** (ya no se muestra en el sitio): `4111 1111 1111 1111` (aprobada), `4000 0000 0000 0002` (rechazada). Cualquier fecha futura y CVV de 3 dígitos.

Para volver a los datos iniciales: enlace **"Restablecer datos de demostración"** en el pie de cualquier página.

---

## 2. Recorrido sugerido para la sustentación

1. **Inicio** (`index.html`): explicar qué es y cómo funciona.
2. Entrar como **inmobiliaria**, ir a **Consultar cédula**, buscar `9990000104`. Se descuenta 1 consulta.
3. Mostrar el **reporte**: puntaje, calificación, alertas, último canon y arrendador, vector de 24 meses, historial de viviendas con fechas y pagos mes a mes.
4. Comparar con `9990000101` (buena pagadora).
5. Quedarse sin saldo y mostrar **Comprar consultas** (pasarela simulada con validación de tarjeta).
6. **Ingresar datos**: registrar un inquilino nuevo, su contrato con "generar historial simulado", registrar un pago con mora y ver cómo cambia el reporte.
7. **Aseguradoras**: cómo funciona y se paga la póliza, con calculadora de prima.
8. Salir y entrar como **persona**: ver el historial propio gratis, la huella de consultas (verá la consulta que hizo la inmobiliaria) y radicar un reclamo.
9. **Marco legal**: habeas data.

---

## 3. Estructura de archivos

```
data-inmobiliario/
├── index.html           Página de inicio (pública)
├── login.html           Inicio de sesión
├── registro.html        Registro de inmobiliarias y personas
├── panel.html           Panel del usuario (saldo, consultas, inquilinos reportados)
├── consulta.html        Búsqueda por cédula (descuenta 1 consulta)
├── comprar.html         Pago simulado: tarjeta o PSE, comprobante
├── reporte.html         Reporte del inquilino
├── mi-historial.html    El titular ve su reporte gratis y radica reclamos
├── ingreso-datos.html   Módulo para registrar inquilinos, contratos, pagos y terminaciones
├── aseguradoras.html    Cómo funcionan y se pagan las aseguradoras de arriendo
├── legal.html           Marco legal (habeas data) y política de tratamiento
├── css/estilos.css      Diseño visual (colores en variables al inicio)
└── js/
    ├── datos-semilla.js Datos ficticios iniciales (usuarios, inquilinos, contratos)
    ├── almacen.js       "Base de datos" (localStorage), generador de pagos y cálculo del puntaje
    ├── app.js           Menú, sesión, formatos de dinero y fechas
    └── reporte.js       Construcción del reporte (lo usan reporte.html y mi-historial.html)
```

### Modelo de datos (sirve para el diagrama entidad-relación del documento)

- **Usuario** (id, tipo: inmobiliaria/persona, nombre, documento, correo, clave, créditos)
- **Inquilino** (cédula, nombres, apellidos, nacimiento, ciudad, ocupación, fecha de autorización)
- **Contrato** (id, cédula → Inquilino, inmobiliaria, arrendador, dirección, ciudad, estrato, fecha inicio, fecha fin, canon, aseguradora → Aseguradora, siniestro, motivo de terminación, calificación)
- **Pago** (id, contrato → Contrato, periodo, fecha límite, fecha de pago, valor, pagado por)
- **Aseguradora** (id, nombre, tarifa, días para avisar siniestro)
- **Compra** (pago simulado de paquetes de consultas)
- **Consulta** (bitácora: quién consultó qué cédula, cuándo y por qué)
- **Reclamo** (radicado, cédula, tipo, detalle, estado)

Relaciones: un Inquilino tiene muchos Contratos; un Contrato tiene muchos Pagos; un Contrato puede tener una Aseguradora; un Usuario hace muchas Consultas y Compras.

### ¿Cómo se generan los datos?

Los pagos no están escritos a mano. `almacen.js` los genera mes a mes según el **perfil** de cada contrato (puntual, bueno, regular, moroso) usando un generador aleatorio con semilla fija, así todos los equipos ven los mismos datos. El módulo **Ingresar datos** puede hacer lo mismo para contratos nuevos (casilla "Generar historial de pagos automáticamente").

### ¿Cómo se calcula el puntaje? (modelo académico simplificado)

1. Cada mes recibe una nota según sus días de mora: al día = 1000, 1 a 5 días = 700, 6 a 15 = 450, 16 a 30 = 300, 31 a 60 = 150, más de 60 o siniestro = 0.
2. Se promedian las notas. Los **últimos 24 meses pesan el doble**.
3. Se restan castigos: 150 por cada siniestro con aseguradora y 80 por cada mes vencido sin pagar (máximo 300).

| Puntaje | Calificación |
|---|---|
| 700 a 1000 | Buen pagador |
| 0 a 699 | Mal pagador |

Estas reglas son una propuesta para el prototipo. En el documento puede justificarlas o proponer otro modelo (por ejemplo, regresión logística entrenada con datos históricos).

---

## 4. Supuestos que tomé (revíselos)

- La fecha límite de pago es el **día 5** de cada mes.
- El canon sube **6 % anual** en el aniversario del contrato (aproximación al IPC; la Ley 820 de 2003 limita el reajuste al IPC del año anterior).
- Precios simulados: consulta individual $15.000, paquete de 10 por $120.000, paquete de 50 por $500.000 (IVA incluido). Cada cuenta nueva recibe 1 consulta de regalo.
- Una consulta pagada da acceso al reporte de esa cédula durante **24 horas**. Si la cédula no existe, no se cobra.
- El **titular siempre ve su propio reporte gratis**.
- La prima de la aseguradora se modela entre 2 % y 2,5 % mensual del canon + administración, más IVA. Las aseguradoras son inventadas.
- Una inmobiliaria solo puede registrar pagos y terminaciones de los contratos que ella misma reportó.

---

## 5. Limitaciones del prototipo (y cómo sería en producción)

| Prototipo | Sistema real |
|---|---|
| Datos en el `localStorage` del navegador | Servidor con base de datos (PostgreSQL/MySQL) y API (Node.js, Python/Django, PHP/Laravel) |
| Contraseñas sin cifrar | Hash con bcrypt o argon2, HTTPS, doble factor |
| Pago simulado | Pasarela certificada (Wompi, PayU, Mercado Pago…), sin guardar datos de tarjeta |
| Autorización por casilla | Firma electrónica de la autorización y almacenamiento de la prueba |
| Reclamos sin flujo de respuesta | Flujo para la fuente: aceptar o rechazar, corregir, notificar al titular |
| Sin notificación previa ni borrado | Aviso 20 días antes del reporte negativo y borrado automático según Ley 2157 de 2021 |

---

## 6. Sugerencias para el documento de grado

**Estructura posible**

1. Planteamiento del problema: el riesgo de impago en arrendamientos y la falta de una fuente de información especializada.
2. Objetivos (general y específicos).
3. Justificación: beneficio para propietarios, inmobiliarias e inquilinos cumplidos (un buen historial es un activo).
4. Marco teórico: centrales de riesgo, scoring, seguros de arrendamiento.
5. **Marco legal**:
   - Constitución Política, art. 15 (habeas data).
   - **Ley 1266 de 2008**: habeas data financiero, comercial y de servicios (roles de fuente, operador, usuario y titular; consulta gratuita; plazos de 10 y 15 días hábiles).
   - **Ley 2157 de 2021** (Borrón y cuenta nueva): notificación previa y permanencia del dato negativo.
   - **Ley 1581 de 2012** y Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015): protección de datos personales, autorización, política de tratamiento, Registro Nacional de Bases de Datos.
   - **Ley 820 de 2003**: arrendamiento de vivienda urbana.
   - Superintendencia de Industria y Comercio como autoridad.
6. Metodología de desarrollo (por ejemplo Scrum o prototipado evolutivo), requisitos funcionales y no funcionales, casos de uso, diagrama entidad-relación (ver sección 3).
7. Resultados: capturas del prototipo y recorrido.
8. Conclusiones y trabajo futuro (ver sección 5).

**Casos de uso que ya tiene el prototipo**: registrarse, iniciar sesión, comprar consultas, consultar por cédula, ver reporte, registrar inquilino, registrar contrato, registrar pago, terminar contrato, consultar historial propio, radicar reclamo, calcular prima de aseguradora.

**Antes de citar las leyes**, verifique el texto vigente en fuentes oficiales (Secretaría del Senado, SUIN-Juriscol, SIC). El resumen del prototipo es didáctico.

---

## 7. Cómo modificarlo

- **Cambiar colores**: variables al inicio de `css/estilos.css`.
- **Agregar inquilinos o contratos de ejemplo**: `js/datos-semilla.js` y luego "Restablecer datos de demostración".
- **Cambiar las reglas del puntaje**: funciones `notaMes`, `calcularPuntaje` y `categoriaPuntaje` en `js/almacen.js`.
- **Cambiar datos de la empresa** (NIT, dirección en Sabaneta, teléfonos, horario, redes; todos ficticios): objeto `EMPRESA` en `js/app.js`.
- **Cambiar precios**: arreglo `PLANES` en `comprar.html`.

---

## 8. Versión de un solo archivo

La carpeta `version-un-archivo/` tiene `data-inmobiliario.html`, que reúne todas las páginas en un único archivo (útil para enviarlo por correo o abrirlo dentro de Claude). Si cambia las páginas, regenérelo con:

```
python3 version-un-archivo/empaquetar.py
```
