# 🪟 Guía de Instalación para Windows

Esta guía te ayudará a configurar y ejecutar **ACompañ.Ar** en Windows, usando Anaconda Prompt o cualquier terminal de Windows.

## 📋 Requisitos Previos

### 1. Node.js
Necesitas tener Node.js instalado en tu sistema:

- **Descarga:** https://nodejs.org/
- **Versión recomendada:** LTS (Long Term Support)
- **Verifica la instalación:** Abre Anaconda Prompt o CMD y ejecuta:
  ```bash
  node --version
  npm --version
  ```

### 2. Git (Opcional)
Si quieres clonar el repositorio:
- **Descarga:** https://git-scm.com/download/win

---

## 🚀 Opción 1: Inicio Rápido con Script (Recomendado)

### Paso 1: Abre Anaconda Prompt
1. Presiona `Win + R`
2. Escribe `cmd` o busca "Anaconda Prompt" en el menú inicio
3. Navega a la carpeta del proyecto:
   ```bash
   cd ruta\a\Acompa.ar
   ```

### Paso 2: Ejecuta el Script de Inicio
```bash
start.bat
```

El script automáticamente:
- ✅ Verificará que Node.js esté instalado
- ✅ Instalará las dependencias (primera vez)
- ✅ Te ayudará a configurar tu API key de Gemini
- ✅ Iniciará el servidor de desarrollo

### Paso 3: Configura tu API Key
Si es la primera vez:
1. El script copiará `.env.local.example` a `.env.local`
2. Se abrirá el archivo en el Bloc de notas
3. Reemplaza `tu_api_key_aqui` con tu API key real de Google Gemini
4. Obtén tu API key gratis en: https://aistudio.google.com/apikey

**Ejemplo de `.env.local`:**
```
GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvw
```

### Paso 4: Abre tu Navegador
El servidor se iniciará automáticamente en:
```
http://localhost:3000
```

---

## 🛠️ Opción 2: Instalación Manual

### Paso 1: Instalar Dependencias
Abre Anaconda Prompt o CMD en la carpeta del proyecto:

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno
1. Copia el archivo de ejemplo:
   ```bash
   copy .env.local.example .env.local
   ```

2. Edita `.env.local` con tu editor favorito (Notepad, VS Code, etc.):
   ```bash
   notepad .env.local
   ```

3. Agrega tu API key de Gemini:
   ```
   GEMINI_API_KEY=TU_API_KEY_AQUI
   ```

### Paso 3: Iniciar el Servidor
```bash
npm run dev
```

### Paso 4: Acceder a la Aplicación
Abre tu navegador en:
```
http://localhost:3000
```

---

## 🐍 Usando Anaconda Prompt

Si prefieres usar Anaconda Prompt específicamente:

### Opción A: Usar Node.js del Sistema
Anaconda Prompt puede acceder a Node.js si lo instalaste en el sistema. Simplemente sigue los pasos anteriores.

### Opción B: Instalar Node.js en Anaconda
Si quieres mantener todo dentro de Anaconda:

```bash
# Crear un nuevo entorno (opcional pero recomendado)
conda create -n acompanar nodejs
conda activate acompanar

# Navegar al proyecto
cd ruta\a\Acompa.ar

# Instalar dependencias
npm install

# Configurar .env.local (ver arriba)

# Iniciar servidor
npm run dev
```

---

## 🔧 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera una build de producción |
| `npm run preview` | Previsualiza la build de producción |
| `start.bat` | Script automático de inicio para Windows |

---

## ❓ Solución de Problemas

### Error: "node no se reconoce como comando"
- Node.js no está instalado o no está en el PATH
- **Solución:** Instala Node.js desde https://nodejs.org/ y reinicia la terminal

### Error: "Cannot find module"
- Las dependencias no están instaladas
- **Solución:** Ejecuta `npm install`

### Error: "API Key inválida"
- La API key de Gemini no está configurada correctamente
- **Solución:**
  1. Verifica que `.env.local` existe
  2. Verifica que la API key sea correcta
  3. Obtén una nueva en https://aistudio.google.com/apikey

### El puerto 3000 está en uso
- Otro proceso está usando el puerto
- **Solución:**
  - Cierra otras aplicaciones que puedan usar el puerto 3000
  - O modifica el puerto en `vite.config.ts`

### Problemas con permisos
- **Solución:** Ejecuta Anaconda Prompt como Administrador:
  1. Click derecho en "Anaconda Prompt"
  2. Selecciona "Ejecutar como administrador"

---

## 🌐 Integraciones Futuras

El proyecto está preparado para integrar múltiples proveedores de IA:

- **Google Gemini** ✅ (Activo)
- **DeepInfra** 🔜 (Para modelos más económicos)
- **OpenAI** 🔜 (GPT-4, etc.)
- **Anthropic Claude** 🔜
- **Modelos locales** 🔜 (Ollama, LM Studio)

Para agregar más APIs, simplemente añade las keys en `.env.local`:
```
DEEPINFRA_API_KEY=tu_key_aqui
OPENAI_API_KEY=tu_key_aqui
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía de nuevo
2. Verifica los errores en la terminal
3. Consulta el archivo `README.md` principal
4. Abre un issue en GitHub

---

## 🎉 ¡Listo!

Tu aplicación **ACompañ.Ar** debería estar funcionando en Windows. Ahora puedes:
- Chatear con el asistente de IA
- Explorar la biblioteca de sustancias
- Ver el observatorio territorial

**¡Buen acompañamiento!** 💜
