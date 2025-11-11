/**
 * ========================================
 * NAVEGACIÓN MÓVIL
 * ========================================
 * Maneja el menú hamburguesa para dispositivos móviles
 * Permite abrir/cerrar el menú de navegación
 */

// Obtener elementos del menú móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Función: Abrir/cerrar menú hamburguesa
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Función: Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/**
 * ========================================
 * NAVEGACIÓN SUAVE
 * ========================================
 * Permite navegar entre secciones con scroll suave
 * Calcula la posición correcta considerando la altura del header
 */

// Función: Navegación suave entre secciones
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevenir comportamiento por defecto
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            // Scroll suave a la sección objetivo
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * ========================================
 * EFECTO DE DESLIZAMIENTO DEL HEADER
 * ========================================
 * Oculta el header al hacer scroll hacia abajo
 * Muestra el header al hacer scroll hacia arriba
 * Mejora la experiencia de usuario en móviles
 */

// Variables para controlar el scroll
let lastScrollTop = 0;
const header = document.querySelector('.header');

// Función: Controlar visibilidad del header según dirección del scroll
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling hacia abajo - ocultar header
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling hacia arriba - mostrar header
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

/**
 * ========================================
 * ANIMACIONES AL HACER SCROLL
 * ========================================
 * Crea animaciones de entrada para elementos cuando son visibles
 * Utiliza Intersection Observer para mejor rendimiento
 */

// Configuración del observador de intersección
const observerOptions = {
    threshold: 0.1, // Activar cuando 10% del elemento sea visible
    rootMargin: '0px 0px -50px 0px' // Margen adicional para activación
};

// Función: Observador de elementos que entran en viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animar entrada del elemento
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Función: Aplicar animaciones a elementos específicos
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .about-text, .about-image, .gallery-item');
    
    animatedElements.forEach(el => {
        // Estado inicial: invisible y desplazado
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Observar elemento para animación
        observer.observe(el);
    });
});

/**
 * ========================================
 * FORMULARIO DE CONTACTO CON EMAILJS
 * ========================================
 * Maneja el envío automático de emails a través del formulario
 * Incluye validación, indicadores de carga y notificaciones
 */

// Función: Inicializar EmailJS con clave pública
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Reemplazar con tu clave pública de EmailJS
})();

// Función: Manejar envío del formulario de contacto
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevenir envío por defecto
        
        // Obtener datos del formulario
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validar campos requeridos
        if (!data.nombre || !data.email || !data.mensaje) {
            showNotification('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        // Mostrar indicador de carga en el botón
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Configurar parámetros para EmailJS
        const templateParams = {
            from_name: data.nombre,
            from_email: data.email,
            phone: data.telefono || 'No proporcionado',
            message: data.mensaje,
            to_email: 'floresgabriel0705@gmail.com',
            reply_to: data.email
        };
        
        // Función: Enviar email usando EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                console.log('Email enviado exitosamente:', response.status, response.text);
                showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
                contactForm.reset(); // Limpiar formulario
            }, function(error) {
                console.error('Error al enviar email:', error);
                showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
            })
            .finally(function() {
                // Restaurar estado del botón
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

/**
 * ========================================
 * SISTEMA DE NOTIFICACIONES
 * ========================================
 * Crea notificaciones toast dinámicas para feedback al usuario
 * Soporta diferentes tipos: success, error, info
 */

// Función: Mostrar notificación toast
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos dinámicos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Estilos para el contenido de la notificación
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    // Función: Animar entrada de la notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Función: Auto-remover notificación después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/**
 * ========================================
 * EFECTO PARALLAX Y CONTROL DE FONDO
 * ========================================
 * Maneja el efecto parallax del hero y controla el espacio/color
 * Incluye funciones para personalizar y resetear el fondo
 */

// Función: Efecto parallax suave en el hero con control de espacio
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.3; // Reducido para menos movimiento
        hero.style.transform = `translateY(${rate}px)`;
        
        // Controlar el espacio y color del fondo
        controlHeroBackground(scrolled);
    }
});

// Función: Controlar el fondo del hero y el espacio
function controlHeroBackground(scrollPosition) {
    const hero = document.querySelector('.hero');
    const services = document.querySelector('.services');
    
    if (hero && services) {
        // Calcular la opacidad basada en el scroll
        const maxScroll = 500; // Punto donde el efecto se estabiliza
        const opacity = Math.min(scrollPosition / maxScroll, 1);
        
        // Aplicar color de fondo que se mezcle con la siguiente sección
        const heroHeight = hero.offsetHeight;
        const scrollProgress = Math.min(scrollPosition / heroHeight, 1);
        
        // Crear un gradiente que se adapte al scroll
        const backgroundColor = `linear-gradient(135deg, 
            rgba(27, 86, 144, ${1 - scrollProgress * 0.3}) 0%, 
            rgba(9, 48, 81, ${1 - scrollProgress * 0.3}) 100%)`;
        
        hero.style.background = backgroundColor;
        
        // Ajustar el padding inferior para compensar el espacio
        if (scrollPosition > 100) {
            hero.style.paddingBottom = `${scrollPosition * 0.1}px`;
        } else {
            hero.style.paddingBottom = '80px';
        }
    }
}

// Función: Resetear el fondo del hero al estado original
function resetHeroBackground() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.background = 'linear-gradient(135deg, #1b5690 0%, #093051 100%)';
        hero.style.paddingBottom = '80px';
    }
}

// Función: Personalizar el color del espacio del hero
function setHeroSpaceColor(color) {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.setProperty('--hero-space-color', color);
    }
}

/**
 * ========================================
 * CONTADORES ANIMADOS
 * ========================================
 * Crea animaciones de conteo para las estadísticas
 * Se activan cuando las estadísticas son visibles
 */

// Función: Animar contador desde 0 hasta el número objetivo
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Función: Observador para activar contadores cuando sean visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                if (!isNaN(target)) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target); // Dejar de observar después de activar
        }
    });
}, { threshold: 0.5 });

// Función: Activar contadores en la sección de estadísticas
const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

/**
 * ========================================
 * GALERÍA CON LIGHTBOX
 * ========================================
 * Crea una galería interactiva con lightbox para ver imágenes
 * Incluye navegación por teclado y cierre con clic
 */

// Función: Inicializar galería con eventos de clic
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            createLightbox(item);
        });
    });
}

// Función: Crear lightbox modal para mostrar imagen
function createLightbox(item) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-image">
                ${item.innerHTML}
            </div>
        </div>
    `;
    
    // Estilos para el lightbox
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        background: white;
        border-radius: 8px;
        overflow: hidden;
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 30px;
        cursor: pointer;
        z-index: 10001;
        color: white;
        background: rgba(0, 0, 0, 0.5);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(lightbox);
    
    // Función: Animar entrada del lightbox
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
    
    // Función: Cerrar lightbox
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            if (lightbox.parentNode) {
                lightbox.parentNode.removeChild(lightbox);
            }
        }, 300);
    };
    
    // Eventos para cerrar lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Función: Cerrar con tecla Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Función: Inicializar galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initGallery);

/**
 * ========================================
 * EFECTO DE ESCRITURA (TYPEWRITER)
 * ========================================
 * Crea efecto de máquina de escribir para el título principal
 * Se activa cuando el título es visible
 */

// Función: Efecto de escritura letra por letra
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Función: Observador para activar efecto de escritura
const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const title = entry.target;
            const originalText = title.textContent;
            typeWriter(title, originalText, 50);
            titleObserver.unobserve(entry.target); // Dejar de observar después de activar
        }
    });
}, { threshold: 0.5 });

// Función: Aplicar efecto de escritura al título del hero
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    titleObserver.observe(heroTitle);
}

/**
 * ========================================
 * PRELOADER Y UTILIDADES
 * ========================================
 * Funciones auxiliares para mejorar la experiencia de usuario
 * Incluye preloader, scroll suave y lazy loading
 */

// Función: Preloader para indicar carga completa
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Función: Scroll suave programático a una sección
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Función: Lazy loading para imágenes (cuando se añadan imágenes reales)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Función: Inicializar lazy loading cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initLazyLoading);

/**
 * ========================================
 * VALIDACIÓN DE FORMULARIO EN TIEMPO REAL
 * ========================================
 * Valida campos del formulario mientras el usuario escribe
 * Muestra errores específicos y limpia errores automáticamente
 */

// Función: Inicializar validación en tiempo real
function initFormValidation() {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField); // Validar al salir del campo
        input.addEventListener('input', clearErrors); // Limpiar errores al escribir
    });
}

// Función: Validar campo individual
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remover errores previos
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Ingresa un email válido');
            return false;
        }
    }
    
    return true;
}

// Función: Mostrar error en campo específico
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    field.style.borderColor = '#ef4444';
    field.parentNode.appendChild(errorDiv);
}

// Función: Limpiar error de campo específico
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '#e5e7eb';
}

// Función: Limpiar errores al escribir
function clearErrors(e) {
    clearFieldError(e.target);
}

// Función: Inicializar validación de formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initFormValidation);
