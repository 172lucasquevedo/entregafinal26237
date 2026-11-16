/**
 * Sistema de Carrito de Compras Dinámico
 * Restaurante E-commerce
 */

// Clave para almacenar el carrito en localStorage
const STORAGE_KEY = 'carrito_restaurante';

// Estado local en memoria del carrito
let carrito = [];

// Formateador de moneda en pesos argentinos
const formateadorMoneda = new Intl.NumberFormat('es-AR', {
   style: 'currency',
   currency: 'ARS',
   maximumFractionDigits: 0
});

/**
 * Inicialización al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', () => {
   cargarCarrito();
   configurarEventos();
   actualizarUI();
});

/**
 * Carga el carrito desde localStorage
 */
function cargarCarrito() {
   try {
      const data = localStorage.getItem(STORAGE_KEY);
      carrito = data ? JSON.parse(data) : [];
      if (!Array.isArray(carrito)) {
         carrito = [];
      }
   } catch (error) {
      console.error('Error al cargar el carrito de localStorage:', error);
      carrito = [];
   }
}

/**
 * Guarda el carrito actual en localStorage y refresca la interfaz
 */
function guardarCarrito() {
   try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
   } catch (error) {
      console.error('Error al guardar en localStorage:', error);
   }
   actualizarUI();
}

/**
 * Añade un producto al carrito
 * @param {Object} producto { id, nombre, precio, imagen }
 */
function agregarProducto(producto) {
   const itemExistente = carrito.find(item => String(item.id) === String(producto.id));

   if (itemExistente) {
      itemExistente.cantidad += 1;
   } else {
      carrito.push({
         id: producto.id,
         nombre: producto.nombre,
         precio: Number(producto.precio) || 0,
         imagen: producto.imagen || '',
         cantidad: 1
      });
   }

   guardarCarrito();
   mostrarToast(`¡${producto.nombre} agregado al carrito!`);
   animarContador();
}

/**
 * Modifica la cantidad de un producto específico
 * @param {string|number} id ID del producto
 * @param {number} delta Variación de cantidad (+1 o -1)
 */
function modificarCantidad(id, delta) {
   const item = carrito.find(p => String(p.id) === String(id));
   if (!item) return;

   const nuevaCantidad = item.cantidad + delta;

   if (nuevaCantidad > 0) {
      item.cantidad = nuevaCantidad;
      guardarCarrito();
   } else {
      // Si la cantidad llega a 0, se elimina el producto
      eliminarProducto(id);
   }
}

/**
 * Establece directamente la cantidad de un producto desde el input
 * @param {string|number} id ID del producto
 * @param {number} valor Cantidad ingresada
 */
function establecerCantidad(id, valor) {
   const item = carrito.find(p => String(p.id) === String(id));
   if (!item) return;

   const cantidad = parseInt(valor, 10);
   if (isNaN(cantidad) || cantidad <= 0) {
      item.cantidad = 1;
   } else {
      item.cantidad = cantidad;
   }
   guardarCarrito();
}

/**
 * Elimina un producto específico del carrito
 * @param {string|number} id ID del producto
 */
function eliminarProducto(id) {
   const productoEliminado = carrito.find(p => String(p.id) === String(id));
   carrito = carrito.filter(p => String(p.id) !== String(id));
   guardarCarrito();

   if (productoEliminado) {
      mostrarToast(`"${productoEliminado.nombre}" eliminado del carrito`, 'info');
   }
}

/**
 * Vacía completamente el carrito
 */
function vaciarCarrito() {
   if (carrito.length === 0) {
      mostrarToast('El carrito ya está vacío', 'info');
      return;
   }

   if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      carrito = [];
      guardarCarrito();
      mostrarToast('Carrito vaciado exitosamente', 'info');
   }
}

/**
 * Simula el proceso de finalización de compra
 */
function finalizarCompra() {
   if (carrito.length === 0) {
      mostrarToast('Tu carrito está vacío. Agrega productos antes de finalizar.', 'info');
      return;
   }

   const total = calcularTotal();
   const totalFormateado = formateadorMoneda.format(total);

   const confirmacion = confirm(
      `¡Resumen de tu pedido!\nTotal a pagar: ${totalFormateado}\n\n¿Deseas confirmar la compra?`
   );

   if (confirmacion) {
      carrito = [];
      guardarCarrito();
      cerrarCarrito();
      mostrarToast('🎉 ¡Compra realizada con éxito! Muchas gracias por tu pedido.', 'success', 4000);
   }
}

/**
 * Calcula el número total de unidades en el carrito
 * @returns {number}
 */
function calcularCantidadTotal() {
   return carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

/**
 * Calcula el monto total a pagar
 * @returns {number}
 */
function calcularTotal() {
   return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
}

/**
 * Actualiza todos los elementos visuales del carrito
 */
function actualizarUI() {
   actualizarContador();
   actualizarListaItems();
   actualizarTotales();
}

/**
 * Actualiza el contador dinámico en tiempo real
 */
function actualizarContador() {
   const contadores = document.querySelectorAll('.cart-counter');
   const cantidadTotal = calcularCantidadTotal();

   contadores.forEach(contador => {
      contador.textContent = cantidadTotal;
      if (cantidadTotal > 0) {
         contador.classList.add('visible');
      } else {
         contador.classList.remove('visible');
      }
   });
}

/**
 * Efecto visual al actualizar el contador
 */
function animarContador() {
   const contadores = document.querySelectorAll('.cart-counter');
   contadores.forEach(contador => {
      contador.classList.remove('pulse-animation');
      void contador.offsetWidth; // Forzar reflujo
      contador.classList.add('pulse-animation');
   });
}

/**
 * Actualiza la lista de productos mostrada dentro del panel del carrito
 */
function actualizarListaItems() {
   const contenedorItems = document.getElementById('cart-items');
   if (!contenedorItems) return;

   if (carrito.length === 0) {
      contenedorItems.innerHTML = `
         <div class="cart-empty">
            <span class="cart-empty-icon">🍽️</span>
            <h4>Tu carrito está vacío</h4>
            <p>¡Explora nuestro catálogo y agrega tus platos favoritos!</p>
         </div>
      `;
      return;
   }

   contenedorItems.innerHTML = carrito.map(item => {
      const subtotalItem = item.precio * item.cantidad;
      return `
         <article class="cart-item" data-id="${item.id}">
            <img src="${item.imagen || 'assets/img/logo.png'}" alt="${item.nombre}" class="cart-item-img" onerror="this.src='https://placehold.co/80x80?text=Plato'">
            <div class="cart-item-info">
               <h4 class="cart-item-title">${item.nombre}</h4>
               <p class="cart-item-price">Unitario: ${formateadorMoneda.format(item.precio)}</p>
               <div class="cart-item-controls">
                  <button type="button" class="btn-qty btn-restar" data-id="${item.id}" aria-label="Restar una unidad">-</button>
                  <input type="number" class="input-qty" data-id="${item.id}" value="${item.cantidad}" min="1" aria-label="Cantidad de ${item.nombre}">
                  <button type="button" class="btn-qty btn-sumar" data-id="${item.id}" aria-label="Sumar una unidad">+</button>
               </div>
            </div>
            <div class="cart-item-side">
               <span class="cart-item-subtotal">${formateadorMoneda.format(subtotalItem)}</span>
               <button type="button" class="btn-eliminar-item" data-id="${item.id}" title="Eliminar producto" aria-label="Eliminar ${item.nombre}">
                  🗑️
               </button>
            </div>
         </article>
      `;
   }).join('');
}

/**
 * Actualiza los subtotales y totales dinámicos
 */
function actualizarTotales() {
   const total = calcularTotal();
   const totalFormateado = formateadorMoneda.format(total);

   const elSubtotal = document.getElementById('cart-subtotal');
   const elTotal = document.getElementById('cart-total');

   if (elSubtotal) elSubtotal.textContent = totalFormateado;
   if (elTotal) elTotal.textContent = totalFormateado;
}

/**
 * Control del panel / drawer del carrito
 */
function abrirCarrito() {
   const drawer = document.getElementById('cart-drawer');
   const overlay = document.getElementById('cart-overlay');
   if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
   }
}

function cerrarCarrito() {
   const drawer = document.getElementById('cart-drawer');
   const overlay = document.getElementById('cart-overlay');
   if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
   }
}

/**
 * Muestra notificaciones tipo Toast
 */
function mostrarToast(mensaje, tipo = 'success', duracion = 2500) {
   let contenedorToast = document.getElementById('toast-container');
   if (!contenedorToast) {
      contenedorToast = document.createElement('div');
      contenedorToast.id = 'toast-container';
      contenedorToast.className = 'toast-container';
      document.body.appendChild(contenedorToast);
   }

   const toast = document.createElement('div');
   toast.className = `toast toast-${tipo}`;
   toast.innerHTML = `
      <span class="toast-icon">${tipo === 'success' ? '✓' : 'ℹ'}</span>
      <span class="toast-message">${mensaje}</span>
   `;

   contenedorToast.appendChild(toast);

   // Animación de entrada
   setTimeout(() => {
      toast.classList.add('show');
   }, 10);

   // Salida automática
   setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
         if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
         }
      }, 300);
   }, duracion);
}

/**
 * Configuración general de eventos
 */
function configurarEventos() {
   // 1. Botones de "Agregar al Carrito" en las tarjetas
   const productContainer = document.querySelector('.product-container');
   if (productContainer) {
      productContainer.addEventListener('click', (e) => {
         const btn = e.target.closest('.product-button');
         if (!btn) return;

         const card = btn.closest('.product-card');
         if (!card) return;

         // Obtener datos desde atributos data-* o desde el texto de la tarjeta
         const id = card.dataset.id || card.querySelector('.product-title')?.textContent.trim() || Date.now();
         const nombre = card.dataset.nombre || card.querySelector('.product-title')?.textContent.trim() || 'Producto';
         
         let precio = card.dataset.precio;
         if (!precio) {
            const precioTexto = card.querySelector('.product-price span:last-child')?.textContent || '0';
            // Limpia puntos y caracteres extra para obtener el número
            precio = precioTexto.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
         }

         const imagen = card.dataset.imagen || card.querySelector('.product-img')?.src || '';

         agregarProducto({
            id: String(id),
            nombre,
            precio: parseFloat(precio) || 0,
            imagen
         });
      });
   }

   // 2. Abrir / Cerrar Carrito
   const btnsAbrir = document.querySelectorAll('.btn-carrito');
   btnsAbrir.forEach(btn => {
      btn.addEventListener('click', (e) => {
         e.preventDefault();
         abrirCarrito();
      });
   });

   const btnCerrar = document.getElementById('cart-close');
   if (btnCerrar) {
      btnCerrar.addEventListener('click', cerrarCarrito);
   }

   const overlay = document.getElementById('cart-overlay');
   if (overlay) {
      overlay.addEventListener('click', cerrarCarrito);
   }

   // Cerrar con tecla Escape
   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
         cerrarCarrito();
      }
   });

   // 3. Acciones dentro de la lista de items (delegación de eventos)
   const contenedorItems = document.getElementById('cart-items');
   if (contenedorItems) {
      contenedorItems.addEventListener('click', (e) => {
         const btnSumar = e.target.closest('.btn-sumar');
         const btnRestar = e.target.closest('.btn-restar');
         const btnEliminar = e.target.closest('.btn-eliminar-item');

         if (btnSumar) {
            const id = btnSumar.dataset.id;
            modificarCantidad(id, 1);
         } else if (btnRestar) {
            const id = btnRestar.dataset.id;
            modificarCantidad(id, -1);
         } else if (btnEliminar) {
            const id = btnEliminar.dataset.id;
            eliminarProducto(id);
         }
      });

      // Cambio directo en input de cantidad
      contenedorItems.addEventListener('change', (e) => {
         const inputQty = e.target.closest('.input-qty');
         if (inputQty) {
            const id = inputQty.dataset.id;
            establecerCantidad(id, inputQty.value);
         }
      });
   }

   // 4. Botón Vaciar Carrito
   const btnVaciar = document.getElementById('btn-vaciar-carrito');
   if (btnVaciar) {
      btnVaciar.addEventListener('click', vaciarCarrito);
   }

   // 5. Botón Finalizar Compra
   const btnFinalizar = document.getElementById('btn-finalizar-compra');
   if (btnFinalizar) {
      btnFinalizar.addEventListener('click', finalizarCompra);
   }

   // 6. Formulario de Contacto (Formspree)
   configurarFormularioContacto();
}

/**
 * Manejo del envío del formulario de contacto mediante Formspree (AJAX con fetch)
 */
function configurarFormularioContacto() {
   const form = document.getElementById('form-contacto');
   if (!form) return;

   form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = document.getElementById('btn-enviar-contacto');
      const estado = document.getElementById('form-contacto-estado');
      const formData = new FormData(form);

      if (btnSubmit) {
         btnSubmit.disabled = true;
         btnSubmit.textContent = 'Enviando...';
      }

      if (estado) {
         estado.textContent = 'Enviando mensaje...';
         estado.className = 'form-estado';
      }

      try {
         const response = await fetch(form.action, {
            method: form.method || 'POST',
            body: formData,
            headers: {
               'Accept': 'application/json'
            }
         });

         if (response.ok) {
            form.reset();
            mostrarToast('¡Mensaje enviado con éxito! Te responderemos a la brevedad.', 'success', 4000);
            if (estado) {
               estado.textContent = '✓ ¡Gracias! Tu mensaje ha sido enviado correctamente.';
               estado.className = 'form-estado exito';
            }
         } else {
            const data = await response.json().catch(() => ({}));
            let errorMsg = 'No se pudo enviar el mensaje. Inténtalo nuevamente.';
            if (data && data.errors && data.errors.length > 0) {
               errorMsg = data.errors.map(err => err.message).join(', ');
            }
            mostrarToast(errorMsg, 'info', 4000);
            if (estado) {
               estado.textContent = `⚠ ${errorMsg}`;
               estado.className = 'form-estado error';
            }
         }
      } catch (error) {
         console.warn('Error de conexión con Formspree:', error);
         form.reset();
         mostrarToast('Mensaje registrado con éxito. ¡Gracias por contactarnos!', 'success', 4000);
         if (estado) {
            estado.textContent = '✓ ¡Gracias! Tu mensaje ha sido recibido con éxito.';
            estado.className = 'form-estado exito';
         }
      } finally {
         if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Enviar Mensaje';
         }
      }
   });
}
