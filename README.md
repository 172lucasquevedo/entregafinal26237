# Sitio Web E-commerce Restaurante

Proyecto desarrollado para la pre-entrega del curso de Desarrollo Web / CSS.

## 🌐 Enlace al Sitio Web (GitHub Pages)
👉 [Ver Sitio Online](https://172lucasquevedo.github.io/Pre-entrega26237/)

---

## 📋 Descripción del Proyecto
Sitio web para un restaurante y e-commerce gastronómico con diseño responsivo, catálogo de platos destacados, sección de reseñas de clientes e información de contacto y reservas.

### Características:
- **Estructura semántica en HTML5**: Encabezado, navegación, sección principal, catálogo de productos y pie/contacto.
- **Estilos con CSS3**: Maquetación moderna, diseño adaptativo (responsive design), flexbox, efectos hover y transiciones.
- **Páginas del sitio**:
  - `index.html`: Página principal con presentación del restaurante, menú/catálogo interactivo de productos y sección de contacto.
  - `pages/resenia.html`: Sección con testimonios y reseñas de clientes.
- **Recursos multimedia**: Integración de imágenes y optimización de carga diferida (`loading="lazy"`).
- **Carrito de compras dinámico (JavaScript)**:
  - **Agregar productos**: Añadir platos al carrito directamente desde las tarjetas del catálogo.
  - **Persistencia con `localStorage`**: El estado del carrito y sus cantidades se conservan al recargar o cerrar la página.
  - **Contador dinámico en tiempo real**: Indicador con badge animado que refleja la cantidad total de unidades añadidas.
  - **Visualización y edición**: Panel lateral deslizable (drawer) con lista detallada (imagen, nombre, precio unitario, subtotal).
  - **Modificación y eliminación**: Controles de incremento (`+`), decremento (`-`), ingreso numérico manual y botón de eliminación individual (`🗑️`), más opción de vaciar carrito.
  - **Total dinámico**: Cálculo automático y en tiempo real del monto total en pesos argentinos (`ARS`).
  - **Notificaciones Toast**: Mensajes flotantes de confirmación visual inmediata al interactuar con el carrito.
- **Formulario de contacto funcional (Formspree)**:
  - Campos de entrada para nombre, correo electrónico y mensaje con validaciones requeridas en HTML5.
  - Integración con el servicio Formspree mediante envío asíncrono (`fetch` / AJAX) y fallback nativo `POST`.
  - Mensajes de estado visual en tiempo real (enviando, éxito y error) y notificaciones toast.

---

## 🚀 Tecnologías Utilizadas
- **HTML5**
- **CSS3** (Flexbox, CSS Nesting, Transiciones y Animaciones)
- **JavaScript (ES6+)** (Manipulación del DOM, Web Storage API / `localStorage`, Event Delegation, Fetch API)
- **Formspree** (Manejo de envíos de formularios backend sin servidor)
- **Git & GitHub** (con GitHub Pages para el despliegue)


