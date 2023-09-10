# Product Backlog

## Historias de usuario

|ID|Título/Descripción|Prioridad|Criterios de aceptación|
|-|-|-|-|
|1|**Sistema de registro e inicio de sesión de usuarios:** Como usuario	quiero poder registrarme e iniciar sesión en la plataforma	para acceder a mis listas de reproducción personalizadas.|Baja|- El sistema redireccione al login si no está autenticado.|
|2|**Diseño básico de UI/UX para la página de inicio:** Como usuario	quiero encontrar una interfaz amigable y fácil de usar	para navegar por el sitio de manera intuitiva.|Baja|- El usuario entiende donde se encuentra cada funcionalidad.|
|3|**Crear una nueva lista de reproducción:** Como usuario, quiero poder crear una nueva lista de reproducción para organizar mi colección de música de una manera personalizada.|Alta|<ul><li>El usuario debe poder asignar un nombre a la lista.</li><li>El usuario debe poder asignar canciones a la lista.</li></ul>|
|4.1|**Agregar canciones a una lista de reproducción:** Como usuario, quiero poder agregar canciones a una lista de reproducción para enriquecer mis listas con mis selecciones favoritas.|Alta|<ul><li>El usuario debe poder buscar y seleccionar canciones para agregar a la lista.</li></ul>|
|4.2|**Buscar listas de reproducción por nombre:** Como usuario, quiero poder buscar listas de reproducción por nombre para encontrar rápidamente y acceder a mis listas creadas.|Baja|<ul><li>El sistema debe ofrecer resultados de búsqueda mientras el usuario está escribiendo.</li></ul>|
|5|**Funciones básicas del reproductor (reproducción, pausa, siguiente, anterior):** Como usuario	quiero utilizar funciones básicas del reproductor (reproducción, pausa, siguiente, anterior)	para controlar la reproducción de las canciones en mis listas.|Media|- El usuario puede escuchar música y controlar el reproductor.|

## Tareas

|ID|Historia de Usuario|	Tareas|Duración Estimada (días)|Prioridad|
|-|-|-|-|-|
|2|	Diseño básico de UI/UX para la página de inicio | Diseño de wireframes <br> - Selección de colores y tipografías <br> - Implementación del diseño en el frontend	|1|	Alta|
|3|	Crear una nueva lista de reproducción |- Crear la base de datos para almacenar listas de reproducción <br> - Implementar la funcionalidad de crear nuevas listas en el backend <br> - Crear una interfaz de usuario para la creación de listas	|0.5|	Alta|
|4|	Agregar canciones a una lista de reproducción	|- Diseñar e implementar una base de datos para almacenar canciones <br> - Implementar la funcionalidad de agregar canciones a una lista en el backend <br> - Crear una interfaz de usuario para agregar canciones a una lista	|0.5|	Alta|
|5|	Buscar listas de reproducción por nombre	|- Implementar la funcionalidad de búsqueda en el backend <br> - Crear una barra de búsqueda en el frontend	|0.5|	Media|
|6|	Funciones básicas del reproductor	|- Implementar un reproductor de música básico en el frontend <br> - Asegurar la integración fluida del reproductor con las listas de reproducción	|0.5|	Media|
|1|	Registro e inicio de sesión	|- Diseño de la base de datos para almacenar información de usuarios <br> - Implementar el registro y el inicio de sesión en el backend <br> - Crear páginas de registro e inicio de sesión en el frontend <br> - Implementar la redirección a la página de inicio de sesión para usuarios no autenticados	|1.5|	Alta|
|7|	Pruebas y ajustes finales	|- Realizar pruebas de todas las funcionalidades implementadas <br> - Hacer ajustes basados en los resultados de las pruebas	|1.5	|Alta|