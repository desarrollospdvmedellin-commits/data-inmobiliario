# Une todas las páginas del prototipo en un solo HTML navegable (para verlo dentro de Claude)
import re, os
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+'/'
paginas=['index','login','registro','panel','consulta','comprar','reporte','mi-historial','ingreso-datos','aseguradoras','legal']
css=open(D+'css/estilos.css').read()
js=lambda f: open(D+'js/'+f).read()
app=js('app.js').replace('\ndibujarPlantilla();\n','\n')
plantillas=[]; funciones=[]; titulos={}
for p in paginas:
    s=open(D+p+'.html').read()
    titulos[p]=re.search(r'<title>(.*?)</title>',s).group(1)
    main=re.search(r'<main>(.*?)</main>',s,re.S).group(1)
    scripts=re.findall(r'<script>(.*?)</script>',s,re.S)
    plantillas.append('<template id="v-%s">%s</template>'%(p,main))
    funciones.append('"%s.html": function () {%s}'%(p,scripts[0] if scripts else ''))
html='''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Inmobiliario · Prototipo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap">
<style>%s</style>
</head>
<body>
<main id="vista"></main>
%s
<script>%s</script>
<script>%s</script>
<script>%s</script>
<script>%s</script>
<script>%s</script>
<script>
/* ===== Enrutador de la versión de un solo archivo ===== */
var ACTUAL = "index.html", PARAMS = "";
var VISTAS = {%s};
var TITULOS = %s;
function paginaActual() { return ACTUAL; }
function busquedaActual() { return PARAMS ? "?" + PARAMS : ""; }
function ir(url) {
  var ancla = url.split("#")[1]; url = url.split("#")[0];
  var partes = url.split("?");
  ACTUAL = VISTAS[partes[0]] ? partes[0] : "index.html";
  PARAMS = partes[1] || "";
  var main = document.getElementById("vista");
  main.innerHTML = document.getElementById("v-" + ACTUAL.replace(".html", "")).innerHTML;
  document.title = TITULOS[ACTUAL.replace(".html", "")];
  dibujarPlantilla();
  window.scrollTo(0, 0);
  if (ancla) setTimeout(function () { var el = document.getElementById(ancla); if (el) el.scrollIntoView(); }, 0);
  try { VISTAS[ACTUAL](); } catch (e) { if (!/Sin sesión|Tipo no permitido/.test(e.message)) console.error(e); }
}
window.print = function () { alertaPantalla("La impresión no está disponible dentro de Claude. Use la versión descargable para imprimir o guardar en PDF."); };
function alertaPantalla(t) { var m = document.createElement("div"); m.className = "alerta aviso"; m.textContent = t; document.querySelector("#vista .contenedor").prepend(m); }
document.addEventListener("click", function (e) {
  var a = e.target.closest("a[href]");
  if (!a) return;
  var href = a.getAttribute("href");
  if (/^[a-z-]+\\.html/.test(href)) { e.preventDefault(); ir(href); }
});
ir("index.html");
</script>
</body>
</html>'''%(css,'\n'.join(plantillas),js('datos-semilla.js'),js('almacen.js'),js('ilustraciones.js'),app,js('reporte.js'),',\n'.join(funciones),repr(titulos).replace("'",'"'))
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'data-inmobiliario.html'),'w').write(html)
print(len(html))
