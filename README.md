# ROOM 404 — Night Desk

Juego original pixel-art de terror psicológico y decisiones ambientado en un hotel en 1998. **Demo jugable con tres noches, huéspedes, documentos, pistas, cámaras y varios finales.**

## Jugar

- Abre `index.html` en Chrome, Edge o Firefox. No requiere instalación ni servidor, dependencias o conexión a Internet.
- Pulsa **COMENZAR HISTORIA** para ver el prólogo narrado; después realiza o salta el tutorial y atiende a los huéspedes.
- Utiliza **IDENTIDAD**, **REGISTRO**, **CÁMARAS** y **PREGUNTAR** para encontrar contradicciones.
- Acepta huéspedes legítimos y rechaza las anomalías. Las decisiones cambian el desenlace.
- El audio ambiente usa Web Audio. La voz narrativa en español se incluye como grabaciones sintetizadas originales en `src/voices.js` y se reproduce tras pulsar «Comenzar historia». No necesita conexión a servicios de voz.

## Publicar en GitHub Pages

1. El repositorio es **MauriNiOr/Room404**; los archivos se han preparado para esa ruta.
2. En el repositorio, abre **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. El flujo `.github/workflows/pages.yml` publicará el juego en cada actualización de `main`.
4. La URL esperada una vez activado Pages es `https://MauriNiOr.github.io/Room404/`.

## Tecnología

HTML5 Canvas, CSS y JavaScript sin dependencias externas. Pixel art vectorizado a una resolución interna de 480×270. Los gráficos y audio se producen para este proyecto: sin recursos comerciales externos. Los tres turnos y los personajes están en `src/data.js`.

## Archivos

- `index.html`: interfaz y estructura.
- `style.css`: estética VHS, menú, consola y diseño adaptable.
- `src/data.js`: historia, huéspedes y pistas.
- `src/audio.js`: audio procedural (lluvia, zumbido y efectos).
- `src/game.js`: renderizador pixel art, cinemática, interfaz, tutorial y reglas.
- `src/voices.js`: voces narradas en español, codificadas como recursos locales Ogg/Opus.
- `.github/workflows/pages.yml`: despliegue de GitHub Pages.

## Estado

Versión `0.2` — demo. Pendiente de pruebas con jugadores, balance, accesibilidad adicional y optimizaciones. No es un lanzamiento comercial terminado. No se incluye licencia de reutilización del código.


## Noviembre de 2026: versión 0.2

- Interfaz en **pantalla completa**: botón ⛶, tecla F o petición al iniciar el juego. ESC sale de la pantalla completa según navegador.
- Historia animada de ~46 segundos con **subtítulos y narración sintética en español** mediante clips Ogg/Opus incluidos (con alternativa SpeechSynthesis si fuera necesaria). Voz con botón activable/desactivable.
- **Primer nivel tutorial** con Clara Martín: prueba identidad, libro de reservas, cámaras, pregunta y acepta. Se puede saltar en cualquier momento.
- El tutorial no cuenta como error ni afecta la puntuación del juego.
- Los subtítulos siguen disponibles aunque el audio esté desactivado. El resto de audio usa Web Audio.

### Notas sobre publicación
Tras subir el proyecto, entra en Settings → Pages y configura **Source: GitHub Actions**. Entonces el workflow publicará la página en https://MauriNiOr.github.io/Room404/.