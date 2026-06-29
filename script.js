/* ==========================================================================
   VK-SYSTEM INTERACTIVE PRESENTATION LOGIC
   Features: Canvas Particles, Intersection Observer, Interactive POS Simulator,
             Inventory adjustments, financial audits, and backup simulations.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. DYNAMIC CANVAS PARTICLES BACKGROUND
    // ==========================================================================
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 25 : 60; // Optimizado para móviles
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2.5 + 1;
            // Intercambiar colores entre cian y verde esmeralda
            this.color = Math.random() > 0.5 ? 'rgba(0, 210, 255, 0.45)' : 'rgba(0, 255, 135, 0.45)';
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Inicializar partículas
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar y conectar partículas
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Si están cerca, trazar una fina línea de red
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Gradación de opacidad según distancia
                    const opacity = (1 - dist / 120) * 0.08;
                    ctx.strokeStyle = `rgba(0, 210, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ==========================================================================
    // 2. INTERSECTION OBSERVER PARA DIAPOSITIVAS & NAV BULLETS
    // ==========================================================================
    const slides = document.querySelectorAll(".slide");
    const navDots = document.querySelectorAll(".nav-dot");
    const btnPrev = document.getElementById("nav-btn-prev");
    const btnNext = document.getElementById("nav-btn-next");
    let currentSlideIndex = 0;
    
    // Opciones del observador: mayoritariamente visible en el viewport
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5
    };

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remover clase active-slide de todos
                slides.forEach(s => s.classList.remove("active-slide"));
                // Añadir a la visible
                entry.target.classList.add("active-slide");
                
                // Encontrar el índice de la diapositiva actual
                const slideArray = Array.from(slides);
                currentSlideIndex = slideArray.indexOf(entry.target);
                
                // Actualizar estado de los botones físicos
                updateNavigationButtons();
                
                // Actualizar bullets laterales
                const slideId = entry.target.id;
                navDots.forEach(dot => {
                    const href = dot.getAttribute("href").substring(1);
                    if (href === slideId) {
                        dot.classList.add("active");
                    } else {
                        dot.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    slides.forEach(slide => {
        slideObserver.observe(slide);
    });

    // Controlar la habilitación de los botones físicos
    function updateNavigationButtons() {
        if (!btnPrev || !btnNext) return;
        btnPrev.disabled = (currentSlideIndex === 0);
        btnNext.disabled = (currentSlideIndex === slides.length - 1);
    }

    // Eventos de clic para los botones de navegación física
    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (currentSlideIndex > 0) {
                slides[currentSlideIndex - 1].scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            if (currentSlideIndex < slides.length - 1) {
                slides[currentSlideIndex + 1].scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Desplazamiento Suave al hacer clic en Dots
    navDots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute("href");
            const targetSlide = document.querySelector(targetId);
            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Botón "Descubrir más" en Hero
    const btnDiscover = document.getElementById("btn-discover");
    if (btnDiscover) {
        btnDiscover.addEventListener("click", (e) => {
            e.preventDefault();
            const targetSlide = document.querySelector("#pos");
            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Efecto parallax sutil con el movimiento del ratón
    document.addEventListener("mousemove", (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        
        // Mover sutilmente los brillos flotantes
        const glows = document.querySelectorAll(".glow");
        glows.forEach((glow, idx) => {
            const speed = (idx + 1) * 15;
            glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });


    // ==========================================================================
    // 3. DIAPOSITIVA 1: LIVE SALES TICKER (Efecto de actividad)
    // ==========================================================================
    let currentLiveSales = 12450.00;
    const liveSalesVal = document.getElementById("live-sales-val");
    
    // Incrementar ventas del día sutilmente cada 8 segundos para simular transacciones reales
    setInterval(() => {
        if (liveSalesVal) {
            const increment = Math.random() * 150 + 20;
            currentLiveSales += increment;
            
            // Animación suave de cambio numérico
            liveSalesVal.classList.add("animate-pulse");
            liveSalesVal.textContent = `L ${currentLiveSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            setTimeout(() => {
                liveSalesVal.classList.remove("animate-pulse");
            }, 1000);
        }
    }, 8000);


    // ==========================================================================
    // 4. DIAPOSITIVA 2: SIMULADOR DE PUNTO DE VENTA (POS)
    // ==========================================================================
    let cart = [];
    const posCartList = document.getElementById("pos-cart-list");
    const posSubtotal = document.getElementById("pos-subtotal");
    const btnSimularVenta = document.getElementById("btn-simular-venta");
    const rtnToggle = document.getElementById("rtn-toggle");
    const rtnInputWrapper = document.getElementById("rtn-input-wrapper");
    const rtnField = document.getElementById("rtn-field");
    const ticketWrap = document.getElementById("printed-ticket-wrap");
    
    // Detalle de ticket impreso
    const ticketClientName = document.getElementById("ticket-client-name");
    const ticketClientRtnRow = document.getElementById("ticket-client-rtn-row");
    const ticketClientRtn = document.getElementById("ticket-client-rtn");
    const ticketItems = document.getElementById("ticket-items");
    const ticketSubtotal = document.getElementById("ticket-subtotal");
    const ticketTax = document.getElementById("ticket-tax");
    const ticketTotal = document.getElementById("ticket-total");
    const ticketDate = document.getElementById("ticket-date");

    // Evento al añadir productos
    const productButtons = document.querySelectorAll(".btn-product-add");
    productButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.getAttribute("data-name");
            const price = parseFloat(btn.getAttribute("data-price"));
            
            // Buscar si ya existe en el carrito
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }
            
            // Ocultar ticket previo si estaba abierto para obligar a nueva simulación
            ticketWrap.classList.remove("active");
            
            updateCartUI();
        });
    });

    function updateCartUI() {
        if (!posCartList) return;
        posCartList.innerHTML = "";
        
        if (cart.length === 0) {
            posCartList.innerHTML = `<div class="cart-empty-msg">El carrito está vacío. Toque productos arriba para agregarlos.</div>`;
            posSubtotal.textContent = "L 0.00";
            btnSimularVenta.disabled = true;
            return;
        }
        
        let subtotal = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            
            const row = document.createElement("div");
            row.className = "cart-row";
            row.innerHTML = `
                <span>${item.qty}x ${item.name}</span>
                <span>
                    L ${itemTotal.toFixed(2)}
                    <button class="cart-row-remove" data-index="${index}">&times;</button>
                </span>
            `;
            posCartList.appendChild(row);
        });
        
        posSubtotal.textContent = `L ${subtotal.toFixed(2)}`;
        btnSimularVenta.disabled = false;

        // Listener para botones de eliminar fila
        const removeButtons = document.querySelectorAll(".cart-row-remove");
        removeButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(btn.getAttribute("data-index"));
                cart.splice(idx, 1);
                ticketWrap.classList.remove("active");
                updateCartUI();
            });
        });
    }

    // Toggle de RTN Fiscal
    if (rtnToggle) {
        rtnToggle.addEventListener("change", () => {
            if (rtnToggle.checked) {
                rtnInputWrapper.classList.remove("hidden");
                rtnField.focus();
            } else {
                rtnInputWrapper.classList.add("hidden");
                rtnField.value = "";
            }
            ticketWrap.classList.remove("active");
        });
    }

    // Simular Cobro
    if (btnSimularVenta) {
        btnSimularVenta.addEventListener("click", () => {
            if (cart.length === 0) return;
            
            // 1. Obtener fecha y hora actual
            const now = new Date();
            const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            ticketDate.textContent = dateStr;

            // 2. Establecer nombre y RTN del cliente
            if (rtnToggle.checked && rtnField.value.trim() !== "") {
                ticketClientName.textContent = "CLIENTE REGISTRADO LEGAL";
                ticketClientRtn.textContent = rtnField.value;
                ticketClientRtnRow.classList.remove("hidden");
            } else {
                ticketClientName.textContent = "CONSUMIDOR FINAL";
                ticketClientRtnRow.classList.add("hidden");
            }

            // 3. Rellenar productos en ticket
            ticketItems.innerHTML = "";
            let subtotal = 0;
            cart.forEach(item => {
                const totalItem = item.price * item.qty;
                subtotal += totalItem;
                
                const itemDiv = document.createElement("div");
                itemDiv.className = "flex-between";
                itemDiv.innerHTML = `
                    <span>${item.name} (${item.qty})</span>
                    <span>L ${totalItem.toFixed(2)}</span>
                `;
                ticketItems.appendChild(itemDiv);
            });

            // 4. Calcular impuestos (ISV 15%)
            // Asumimos ISV ya incluido en el precio, desglosándolo
            const subtotalSinIsv = subtotal / 1.15;
            const isvCalculado = subtotal - subtotalSinIsv;

            ticketSubtotal.textContent = `L ${subtotalSinIsv.toFixed(2)}`;
            ticketTax.textContent = `L ${isvCalculado.toFixed(2)}`;
            ticketTotal.textContent = `L ${subtotal.toFixed(2)}`;

            // 5. Animación de salida del ticket
            ticketWrap.classList.add("active");

            // Opcional: Actualizar el acumulado total del día en el dashboard del hero
            currentLiveSales += subtotal;
            if (liveSalesVal) {
                liveSalesVal.textContent = `L ${currentLiveSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            // Limpiar el carrito para la próxima venta con un retraso estético
            setTimeout(() => {
                cart = [];
                updateCartUI();
            }, 1000);
        });
    }


    // ==========================================================================
    // 5. DIAPOSITIVA 3: CONTROL DE INVENTARIO (Simulator)
    // ==========================================================================
    const stockData = {
        p1: { name: "Arroz Premium (Libra)", qty: 120, max: 150, min: 20 },
        p2: { name: "Aceite de Cocina (1L)", qty: 12, max: 80, min: 15 },
        p3: { name: "Azúcar Refinada (Kg)", qty: 65, max: 130, min: 20 }
    };

    const invLogList = document.getElementById("inv-log-list");
    const stockAdjustButtons = document.querySelectorAll(".btn-stock-adjust");

    stockAdjustButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const pid = btn.getAttribute("data-id");
            const op = btn.getAttribute("data-op");
            const item = stockData[pid];
            const rowElement = btn.closest(".stock-item-row");
            
            let change = 0;
            
            if (op === "add") {
                change = 10;
                item.qty = Math.min(item.qty + change, item.max);
                addInventoryLog(item.name, `+${change} Unidades (Ingreso Proveedor)`, "positive");
            } else {
                change = 5;
                item.qty = Math.max(item.qty - change, 0);
                addInventoryLog(item.name, `-${change} Unidades (Salida por Merma)`, "negative");
            }

            // Actualizar visualizaciones del DOM
            const qtyLabel = rowElement.querySelector(".qty-val");
            const qtyTextNode = rowElement.querySelector(".stock-item-qty");
            const progressBar = rowElement.querySelector(".stock-bar");
            
            qtyLabel.textContent = item.qty;
            
            // Actualizar ancho de barra
            const pct = (item.qty / item.max) * 100;
            progressBar.style.width = `${pct}%`;
            
            // Validar límites críticos
            if (item.qty <= item.min) {
                rowElement.classList.add("alert-stock");
                qtyTextNode.innerHTML = `<strong class="qty-val">${item.qty}</strong> Unidades (Crítico)`;
                progressBar.className = "stock-bar bg-orange";
            } else {
                rowElement.classList.remove("alert-stock");
                qtyTextNode.innerHTML = `<strong class="qty-val">${item.qty}</strong> Unidades`;
                
                // Color normal
                if (pid === "p1") progressBar.className = "stock-bar bg-emerald";
                if (pid === "p3") progressBar.className = "stock-bar bg-cyan";
            }
        });
    });

    function addInventoryLog(productName, actionText, type) {
        if (!invLogList) return;
        
        // Quitar mensaje de log vacío si existe
        const emptyMsg = invLogList.querySelector(".log-empty");
        if (emptyMsg) emptyMsg.remove();

        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        
        const row = document.createElement("div");
        row.className = "log-row";
        row.innerHTML = `
            <span class="log-time">[${time}]</span>
            <span class="log-action">${productName}</span>
            <span class="log-change ${type === 'positive' ? 'positive' : 'negative'}">${actionText}</span>
        `;
        
        // Insertar al inicio de la lista de logs
        invLogList.insertBefore(row, invLogList.firstChild);
        
        // Mantener solo los últimos 4 logs
        if (invLogList.children.length > 4) {
            invLogList.removeChild(invLogList.lastChild);
        }
    }


    // ==========================================================================
    // 6. DIAPOSITIVA 4: CORTES Y AUDITORÍAS
    // ==========================================================================
    const btnRunAudit = document.getElementById("btn-run-audit");
    const auditReportOutput = document.getElementById("audit-report-output");
    const reportTimestamp = document.getElementById("report-timestamp");
    const auditCashBar = document.getElementById("audit-cash-bar");
    const auditCardBar = document.getElementById("audit-card-bar");
    const auditCashText = document.getElementById("audit-cash-text");
    const auditCardText = document.getElementById("audit-card-text");
    const auditTotalText = document.getElementById("audit-total-text");

    if (btnRunAudit) {
        btnRunAudit.addEventListener("click", () => {
            // Actualizar datos del reporte en vivo basados en la venta total actual del hero
            // Simular corte
            const now = new Date();
            const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
            reportTimestamp.textContent = `Generado el: ${dateStr}`;
            
            // Simulación financiera basada en el valor acumulado del día
            const totalVentas = currentLiveSales;
            const efectivo = totalVentas * 0.60;
            const tarjeta = totalVentas * 0.40;
            
            const subtotalNeto = totalVentas / 1.15;
            const isv15 = totalVentas - subtotalNeto;
            
            // Actualizar paneles visuales de caja
            auditCashText.textContent = `L ${efectivo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            auditCardText.textContent = `L ${tarjeta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            auditTotalText.textContent = `L ${totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            // Actualizar barras
            auditCashBar.style.width = "60%";
            auditCardBar.style.width = "40%";

            // Rellenar la boleta de auditoría
            const reportDetails = auditReportOutput.querySelector(".report-details");
            reportDetails.innerHTML = `
                <li class="flex-between"><span>Transacciones Realizadas:</span><strong>${Math.floor(totalVentas / 350) + 12} Ventas</strong></li>
                <li class="flex-between"><span>Subtotal Neto:</span><strong>L ${subtotalNeto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></li>
                <li class="flex-between"><span>Impuesto ISV 15%:</span><strong>L ${isv15.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></li>
                <li class="flex-between"><span>Fondo de Caja Inicial:</span><strong>L 1,000.00</strong></li>
                <li class="flex-between font-bold border-top"><span>Efectivo Esperado:</span><strong>L ${(efectivo + 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></li>
                <li class="flex-between font-bold"><span>Venta Tarjeta Registrada:</span><strong>L ${tarjeta.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></li>
                <li class="flex-between font-bold border-top text-emerald"><span>Cuadre de Caja:</span><strong>DIFERENCIA L 0.00 (OK)</strong></li>
            `;

            // Mostrar el reporte impreso administrativamente
            auditReportOutput.classList.remove("hidden");
            
            // Desplazar levemente para que sea visible en dispositivos pequeños
            auditReportOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    }


    // ==========================================================================
    // 7. DIAPOSITIVA 5: SEGURIDAD (BackupService Simulation)
    // ==========================================================================
    const btnRunBackup = document.getElementById("btn-run-backup");
    const progressWrapper = document.getElementById("backup-progress-wrapper");
    const backupBar = document.getElementById("backup-bar");
    const backupPercentage = document.getElementById("backup-percentage");
    const backupStatusText = document.getElementById("backup-status-text");
    const backupConsole = document.getElementById("backup-console");
    const shieldIcon = document.getElementById("shield-icon");
    const shieldStatusLabel = document.getElementById("shield-status-label");

    if (btnRunBackup) {
        btnRunBackup.addEventListener("click", () => {
            // Deshabilitar botón para evitar multi-clicks
            btnRunBackup.disabled = true;
            btnRunBackup.style.opacity = 0.5;
            
            // Reiniciar y mostrar progreso
            progressWrapper.classList.remove("hidden");
            backupBar.style.width = "0%";
            backupPercentage.textContent = "0%";
            shieldIcon.classList.add("active");
            
            // Limpiar consola
            backupConsole.innerHTML = "";
            
            const logs = [
                { time: 0, text: "> Conectando con VK BackupService..." },
                { time: 600, text: "> Localizando archivos de base de datos local (VK_DB.sqlite)..." },
                { time: 1300, text: "> Comprimiendo registros del sistema (15.4 MB compressed)..." },
                { time: 2000, text: "> Encriptando paquete con algoritmo de seguridad SHA-256..." },
                { time: 2600, text: "> Generando firma hash digital de validación única..." },
                { time: 3300, text: "> Guardando copia local segura en disco de respaldo local C:/VK-Backups/..." },
                { time: 4000, text: "> ¡Éxito! Copia local creada: VK_Backup_26_06_2026.zip" }
            ];

            let progress = 0;
            const totalDuration = 4000; // 4 segundos
            const intervalTime = 80;
            const step = (intervalTime / totalDuration) * 100;

            // Timer para registrar logs progresivamente
            logs.forEach(log => {
                setTimeout(() => {
                    printConsoleLine(log.text);
                    if (log.text.includes("Comprimiendo")) {
                        backupStatusText.textContent = "Comprimiendo base de datos...";
                    } else if (log.text.includes("Encriptando")) {
                        backupStatusText.textContent = "Encriptando datos...";
                    } else if (log.text.includes("Guardando")) {
                        backupStatusText.textContent = "Guardando respaldo local...";
                    }
                }, log.time);
            });

            // Loop de progreso de la barra
            const progressInterval = setInterval(() => {
                progress += step;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    
                    // Finalizar simulación
                    backupStatusText.textContent = "¡Copia de seguridad completada con éxito!";
                    shieldIcon.classList.remove("active");
                    shieldIcon.style.borderColor = "var(--emerald)";
                    shieldIcon.style.background = "rgba(0, 255, 135, 0.1)";
                    shieldStatusLabel.textContent = "Respaldo Realizado Exitosamente";
                    shieldStatusLabel.style.color = "var(--emerald)";

                    // Restaurar botón después de unos segundos
                    setTimeout(() => {
                        btnRunBackup.disabled = false;
                        btnRunBackup.style.opacity = 1;
                    }, 2000);
                }
                
                backupBar.style.width = `${progress.toFixed(0)}%`;
                backupPercentage.textContent = `${progress.toFixed(0)}%`;
            }, intervalTime);
        });
    }

    function printConsoleLine(text) {
        if (!backupConsole) return;
        const line = document.createElement("div");
        line.className = "console-line";
        
        // Agregar color especial de éxito
        if (text.includes("¡Éxito!")) {
            line.classList.add("text-emerald");
        } else {
            line.classList.add("text-cyan");
        }
        
        line.textContent = text;
        backupConsole.appendChild(line);
        backupConsole.scrollTop = backupConsole.scrollHeight; // Auto-scroll consola
    }

});
