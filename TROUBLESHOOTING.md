# 🔧 Troubleshooting Guide

## ❌ "Error loading videos" en index.html

### Causa más común: Archivo abierto directamente (file://)

**El problema:** Los navegadores bloquean `fetch()` cuando abres archivos directamente con `file://` por razones de seguridad.

**La solución:** DEBES usar un servidor web local.

### ✅ Soluciones:

#### Opción 1: Python (Recomendado)
```bash
# Abre terminal en la carpeta del proyecto
cd /ruta/a/tu/proyecto

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Luego abre: **http://localhost:8000**

#### Opción 2: Node.js
```bash
# Instalar http-server (solo la primera vez)
npm install -g http-server

# Ejecutar
http-server
```

#### Opción 3: PHP
```bash
php -S localhost:8000
```

#### Opción 4: VS Code (si usas VS Code)
1. Instala extensión "Live Server"
2. Click derecho en index.html → "Open with Live Server"

#### Opción 5: Otros editores
- **Brackets**: Tiene servidor integrado
- **WebStorm**: Click derecho → "Open in Browser"
- **Atom**: Instala package "atom-live-server"

---

## ❌ Videos no se muestran después de abrir con servidor

### Verifica estos pasos:

1. **¿El JSON es válido?**
   ```bash
   # En terminal
   cat videodata.json
   ```
   O valida en: https://jsonlint.com

2. **¿Está en la carpeta correcta?**
   ```
   tu-proyecto/
   ├── index.html          ✓
   ├── videodata.json      ✓ (debe estar aquí)
   └── ...
   ```

3. **Abre la consola del navegador:**
   - Chrome/Edge: F12 o Ctrl+Shift+I
   - Firefox: F12
   - Safari: Cmd+Option+I
   
   **Busca errores en rojo**

4. **Prueba manualmente el fetch:**
   Abre consola y escribe:
   ```javascript
   fetch('videodata.json')
     .then(r => r.json())
     .then(d => console.log('Videos:', d.length))
     .catch(e => console.error('Error:', e))
   ```

---

## ❌ "CORS policy" error

**Causa:** Intentando cargar desde `file://`

**Solución:** Usa un servidor local (ver arriba)

---

## ❌ Widget no muestra videos

### Posibles causas:

1. **videodata.json no existe**
   - Verifica que el archivo esté presente
   - Verifica el nombre (case-sensitive)

2. **Ruta incorrecta en páginas de videos**
   - En `/videos/video.html` debe cargar `../videodata.json`
   - Verifica que los scripts usen rutas relativas correctas

3. **JavaScript deshabilitado**
   - Verifica en configuración del navegador

---

## ❌ Favoritos no guardan

### Verifica:

1. **localStorage disponible:**
   ```javascript
   // En consola del navegador
   console.log(typeof(Storage))
   // Debe devolver "function"
   ```

2. **Navegación privada:** 
   - El modo incógnito puede bloquear localStorage
   - Prueba en ventana normal

3. **Permisos del navegador:**
   - Algunos navegadores requieren permiso para localStorage

---

## ❌ Búsqueda no funciona

### Verifica:

1. **videodata.json cargado:**
   ```javascript
   // En consola
   console.log(window.videosData)
   // Debe mostrar array de videos
   ```

2. **search.js cargado:**
   - Abre DevTools → Sources/Debugger
   - Busca `search.js`

---

## ❌ Template no se aplica (sin header/footer)

### Verifica:

1. **template.js cargado:**
   ```html
   <script src="template.js"></script>
   ```

2. **Ruta correcta:**
   - En `/videos/`: `<script src="../template.js"></script>`
   - En raíz: `<script src="template.js"></script>`

3. **Orden de scripts:**
   ```html
   <!-- Correcto: template.js primero -->
   <script src="template.js"></script>
   <script src="search.js"></script>
   <script src="widget.js"></script>
   ```

---

## ❌ Imágenes no cargan

### Verifica:

1. **URLs correctas en videodata.json:**
   - Deben empezar con `http://` o `https://`
   - Verifica que los enlaces funcionen

2. **CORS de la imagen:**
   - Algunos sitios bloquean imágenes externas
   - Prueba abriendo la URL directamente

3. **Lazy loading:**
   - Las imágenes cargan al hacer scroll
   - Es normal que no todas carguen inmediatamente

---

## ❌ Páginas de video en blanco

### Verifica:

1. **Embed URL correcta:**
   ```html
   <iframe src="https://ejemplo.com/embed/VIDEO_ID"></iframe>
   ```

2. **Scripts cargados:**
   ```html
   <script src="../template.js"></script>
   <script src="../search.js"></script>
   <script src="../widget.js"></script>
   ```
   ⚠️ Nota el `../` para subir un nivel

3. **Consola del navegador:**
   - Busca errores 404

---

## 🔍 Comandos útiles para diagnóstico

### Ver todos los archivos necesarios:
```bash
ls -la
# Debe mostrar:
# index.html
# favorites.html
# template.js
# search.js
# widget.js
# videodata.json
# videos/
```

### Verificar JSON válido:
```bash
python -m json.tool videodata.json > /dev/null && echo "JSON válido" || echo "JSON inválido"
```

### Contar videos en JSON:
```bash
grep -c '"title":' videodata.json
```

---

## 📋 Checklist antes de hacer deploy

- [ ] Probado localmente con servidor (no file://)
- [ ] videodata.json es JSON válido
- [ ] template.js tiene configuración correcta
- [ ] Todos los archivos están presentes
- [ ] Videos/ carpeta existe con páginas
- [ ] Consola del navegador sin errores
- [ ] Favoritos funcionan
- [ ] Búsqueda funciona
- [ ] Widget muestra videos

---

## 🆘 Aún no funciona?

1. **Limpia caché del navegador:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

2. **Prueba en otro navegador**

3. **Verifica permisos de archivos:**
   ```bash
   chmod 644 *.html *.js *.json *.css
   chmod 755 videos/
   ```

4. **Revisa el código en consola:**
   - F12 → Console
   - Copia y pega cualquier error en rojo

---

## 💡 Tips para evitar problemas

1. **Siempre usa servidor local para probar**
2. **Valida JSON antes de subir cambios**
3. **Mantén copias de respaldo de videodata.json**
4. **Usa rutas relativas, no absolutas**
5. **Prueba en múltiples navegadores**

---

## 📞 Información para reportar bugs

Si encuentras un error, recopila esta info:

```
Sistema Operativo: [Windows/Mac/Linux]
Navegador: [Chrome/Firefox/Safari] versión X
Servidor usado: [Python/Node/PHP/otro]
URL de prueba: [localhost:8000]
Error en consola: [copia el error completo]
Archivos presentes: [lista de archivos en carpeta]
```
