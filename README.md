# RESM móvil

Aplicación para residentes de RESM construida con React Native, Expo SDK 57,
Expo Router y TypeScript estricto.

## Funcionalidades

- Inicio de sesión con JWT almacenado mediante `expo-secure-store`.
- Registro por condominio, torre y apartamento.
- Consulta de espacios comunes y sus reglas.
- Creación y cancelación de reservas, incluidos horarios que terminan al día
  siguiente.
- Perfil del residente y cierre seguro de sesión.

## Requisitos

- Node.js 22.13 o superior.
- Android Studio con un emulador iniciado, o un dispositivo Android conectado.
- Backend de RESM ejecutándose en el puerto `8080`.

## Configuración local

```powershell
Copy-Item .env.example .env
npm.cmd install
npm.cmd run android
```

`10.0.2.2` permite que el emulador Android acceda al `localhost` de Windows.
Para usar un teléfono físico, cambia `EXPO_PUBLIC_API_URL` por la IP local del
computador y conecta ambos dispositivos a la misma red.

## Calidad y compilación

```powershell
npm.cmd run format
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run check
```

`check` valida el formato, ejecuta ESLint y TypeScript, y genera el bundle de
producción para Android sin requerir un emulador.

## Arquitectura

- `src/app`: rutas y composición de pantallas mediante Expo Router.
- `src/components`: componentes visuales reutilizables.
- `src/core`: infraestructura transversal como HTTP, almacenamiento de token y
  configuración de React Query.
- `src/features/auth`: autenticación, validaciones y repositorio de sesión.
- `src/features/resident`: consultas, reglas y transformaciones del dominio.
- `src/types`: contratos compartidos con la API.

La capa `core` no depende de las pantallas ni del store. La autenticación expone
el token mediante un adaptador pequeño, el repositorio encapsula la persistencia
y React Query centraliza las claves y la caché remota.

## iOS

El mismo código fuente funciona en iOS. Para generar y probar localmente el
binario final se requiere macOS con Xcode; también se puede utilizar EAS Build
para compilaciones remotas.
