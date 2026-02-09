// 1. Efecto Scroll: Navbar y Botón Subir
const nav = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    // Navbar
    if (window.scrollY > 80) {
        nav.style.padding = "10px 5%";
        nav.style.background = "rgba(0,0,0,1)";
    } else {
        nav.style.padding = "20px 5%";
        nav.style.background = "rgba(0,0,0,0.95)";
    }

    // Botón Subir (se activa al bajar el 10% de la página)
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > 10) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 2. Menú Móvil Hamburguesa
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

menuToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace (móvil)
document.querySelectorAll('#navbar ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
    });
});

// 3. Manejo de Formulario y Popup
const form = document.getElementById("my-form");
const popup = document.getElementById("status-popup");
const popupTitle = document.getElementById("popup-title");
const popupMsg = document.getElementById("popup-message");
const popupIcon = document.getElementById("popup-icon");

async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const btn = document.getElementById("submit-btn");
    
    btn.innerHTML = "ENVIANDO...";
    btn.disabled = true;

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        btn.disabled = false;
        btn.innerHTML = "ENVIAR SOLICITUD";
        
        if (response.ok) {
            showPopup("¡SOLICITUD ENVIADA!", "Hemos recibido tu mensaje correctamente. Nuestro equipo técnico contactará contigo pronto.", "🎬");
            form.reset();
        } else {
            showPopup("HUBO UN PROBLEMA", "No hemos podido procesar el envío. Por favor, inténtalo de nuevo.", "⚠️");
        }
    }).catch(error => {
        btn.disabled = false;
        btn.innerHTML = "ENVIAR SOLICITUD";
        showPopup("ERROR DE CONEXIÓN", "Revisa tu conexión a internet e inténtalo de nuevo.", "❌");
    });
}

function showPopup(title, msg, icon) {
    popupTitle.innerText = title;
    popupMsg.innerText = msg;
    popupIcon.innerText = icon;
    popup.classList.add("active"); // Agrega la clase CSS que pusimos en style.css
}

function closePopup() {
    popup.classList.remove("active");
}

form.addEventListener("submit", handleSubmit);

// 4. Animación de entrada de secciones
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "all 0.8s ease-out";
    observer.observe(section);
});

// 5. Carrusel Infinito: Auto-scroll suave + Arrastre Pro
const slider = document.getElementById('portfolio-grid');
const container = slider.parentElement;

if (slider) {
    // Triplicamos contenido
    const content = slider.innerHTML;
    slider.innerHTML = content + content + content;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let xPos = 0;
    let speed = 0.5; // Velocidad auto-scroll (ajusta a tu gusto)

    // Función de animación principal
    function animation() {
        if (!isDragging) {
            xPos -= speed;
            setSliderPosition();
        }
        checkBounds();
        requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${xPos}px)`;
    }

    function checkBounds() {
        const halfWidth = slider.scrollWidth / 3;
        if (xPos <= -halfWidth * 2) xPos = -halfWidth;
        if (xPos >= 0) xPos = -halfWidth;
    }

    // Eventos de ratón
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - xPos;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.pageX;
        xPos = currentX - startX;
        setSliderPosition();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    // Eventos táctiles (Móvil)
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - xPos;
    }, {passive: true});

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].pageX;
        xPos = currentX - startX;
        setSliderPosition();
    }, {passive: true});

    container.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Iniciar en el centro
    const initialPos = slider.scrollWidth / 3;
    xPos = -initialPos;
    animation();
}

// 6. Visor rotativo de imágenes en Servicios (sin recorte)
const servicesScreen = document.querySelector('.services-screen');

if (servicesScreen) {
    const serviceSlides = Array.from(servicesScreen.querySelectorAll('.service-photo'));

    if (serviceSlides.length > 1) {
        let currentIndex = 0;
        let paused = false;

        function showSlide(index) {
            serviceSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            if (paused) return;
            currentIndex = (currentIndex + 1) % serviceSlides.length;
            showSlide(currentIndex);
        }

        // Cambio automático cada 5 segundos
        setInterval(nextSlide, 3000);

        // Pausa al pasar el ratón por encima del panel
        const servicesMedia = document.querySelector('.services-media');
        if (servicesMedia) {
            servicesMedia.addEventListener('mouseenter', () => paused = true);
            servicesMedia.addEventListener('mouseleave', () => paused = false);
        }
    }
}