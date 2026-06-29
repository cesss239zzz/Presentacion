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
    let selectedDocType = "factura"; // factura | orden
    let selectedPayMethod = "efectivo"; // efectivo | tarjeta | transferencia
    let deliveryOrderCounter = 1;

    // Totales financieros acumulados del día para cierre
    let salesCash = 7470.00;
    let salesCard = 4980.00;
    let salesTransfer = 0.00;
    let salesDelivery = 0.00;

    const posCartList = document.getElementById("pos-cart-list");
    const posSubtotal = document.getElementById("pos-subtotal");
    const btnSimularVenta = document.getElementById("btn-simular-venta");
    const rtnToggle = document.getElementById("rtn-toggle");
    const rtnInputWrapper = document.getElementById("rtn-input-wrapper");
    const rtnField = document.getElementById("rtn-field");
    const ticketWrap = document.getElementById("printed-ticket-wrap");
    
    // Detalle de ticket impreso
    const ticketMainTitle = document.getElementById("ticket-main-title");
    const ticketEstablishmentRtn = document.getElementById("ticket-establishment-rtn");
    const ticketClientName = document.getElementById("ticket-client-name");
    const ticketClientRtnRow = document.getElementById("ticket-client-rtn-row");
    const ticketClientRtn = document.getElementById("ticket-client-rtn");
    const ticketPayMethodRow = document.getElementById("ticket-pay-method-row");
    const ticketPayMethodVal = document.getElementById("ticket-pay-method-val");
    const ticketDocIdRow = document.getElementById("ticket-doc-id-row");
    const ticketItems = document.getElementById("ticket-items");
    const ticketSubtotalRow = document.getElementById("ticket-subtotal-row");
    const ticketTaxRow = document.getElementById("ticket-tax-row");
    const ticketSubtotal = document.getElementById("ticket-subtotal");
    const ticketTax = document.getElementById("ticket-tax");
    const ticketTotal = document.getElementById("ticket-total");
    const ticketDate = document.getElementById("ticket-date");
    const ticketFooterText = document.getElementById("ticket-footer-text");

    // Selectores de tipo de documento y método de pago
    const docTypeBtns = document.querySelectorAll("#doc-type-control .segment-btn");
    const payMethodBtns = document.querySelectorAll("#pay-method-control .segment-btn");
    const payMethodRow = document.getElementById("pay-method-row");
    const posRtnBox = document.getElementById("pos-rtn-box");
    const posOrderInfo = document.getElementById("pos-order-info");

    if (docTypeBtns) {
        docTypeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                docTypeBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedDocType = btn.getAttribute("data-type");
                
                if (selectedDocType === "orden") {
                    if (payMethodRow) payMethodRow.classList.add("hidden");
                    if (posRtnBox) posRtnBox.classList.add("hidden");
                    if (posOrderInfo) posOrderInfo.classList.remove("hidden");
                } else {
                    if (payMethodRow) payMethodRow.classList.remove("hidden");
                    if (posRtnBox) posRtnBox.classList.remove("hidden");
                    if (posOrderInfo) posOrderInfo.classList.add("hidden");
                }
                if (ticketWrap) ticketWrap.classList.remove("active");
            });
        });
    }

    if (payMethodBtns) {
        payMethodBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                payMethodBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedPayMethod = btn.getAttribute("data-method");
                if (ticketWrap) ticketWrap.classList.remove("active");
            });
        });
    }

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
            if (ticketWrap) ticketWrap.classList.remove("active");
            
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
                if (ticketWrap) ticketWrap.classList.remove("active");
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
            if (ticketWrap) ticketWrap.classList.remove("active");
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

            let saleTotal = 0;
            cart.forEach(item => {
                saleTotal += item.price * item.qty;
            });

            // 2. Ajustar formato según Tipo de Documento
            if (selectedDocType === "factura") {
                ticketMainTitle.textContent = "VK-SYSTEM RETAIL";
                if (ticketEstablishmentRtn) ticketEstablishmentRtn.classList.remove("hidden");
                ticketDocIdRow.textContent = "Factura #: 000-001-01-000" + Math.floor(Math.random() * 900 + 100);
                
                if (rtnToggle && rtnToggle.checked && rtnField.value.trim() !== "") {
                    ticketClientName.textContent = "CLIENTE REGISTRADO LEGAL";
                    ticketClientRtn.textContent = rtnField.value;
                    ticketClientRtnRow.classList.remove("hidden");
                } else {
                    ticketClientName.textContent = "CONSUMIDOR FINAL";
                    ticketClientRtnRow.classList.add("hidden");
                }
                
                // Mostrar método de pago
                if (ticketPayMethodRow) ticketPayMethodRow.classList.remove("hidden");
                let payMethodName = "Efectivo";
                if (selectedPayMethod === "tarjeta") payMethodName = "Tarjeta de Crédito";
                if (selectedPayMethod === "transferencia") payMethodName = "Transferencia Bancaria";
                ticketPayMethodVal.textContent = payMethodName;
                
                // Mostrar desgloses de impuestos
                if (ticketSubtotalRow) ticketSubtotalRow.classList.remove("hidden");
                if (ticketTaxRow) ticketTaxRow.classList.remove("hidden");
                
                const subtotalSinIsv = saleTotal / 1.15;
                const isvCalculado = saleTotal - subtotalSinIsv;
                ticketSubtotal.textContent = `L ${subtotalSinIsv.toFixed(2)}`;
                ticketTax.textContent = `L ${isvCalculado.toFixed(2)}`;
                ticketFooterText.textContent = "¡Gracias por su compra!";

                // Acumular ventas en categoría correspondiente
                if (selectedPayMethod === "efectivo") salesCash += saleTotal;
                else if (selectedPayMethod === "tarjeta") salesCard += saleTotal;
                else if (selectedPayMethod === "transferencia") salesTransfer += saleTotal;

            } else {
                // ORDEN DE ENTREGA
                ticketMainTitle.textContent = "ORDEN DE ENTREGA";
                if (ticketEstablishmentRtn) ticketEstablishmentRtn.classList.add("hidden");
                ticketDocIdRow.innerHTML = `Número de Entrega: <strong style="font-size:0.8rem;color:#000;">#${String(deliveryOrderCounter).padStart(4, '0')}</strong>`;
                
                ticketClientName.textContent = "CONTROL INTERNO - BODEGA";
                ticketClientRtnRow.classList.add("hidden");
                
                // Pago: Interno
                if (ticketPayMethodRow) ticketPayMethodRow.classList.remove("hidden");
                ticketPayMethodVal.textContent = "Nota de Entrega (Pendiente)";
                
                // Ocultar subtotal/ISV desglosados para orden de despacho limpio
                if (ticketSubtotalRow) ticketSubtotalRow.classList.add("hidden");
                if (ticketTaxRow) ticketTaxRow.classList.add("hidden");
                ticketFooterText.textContent = "APTO PARA DESPACHO EN BODEGA";

                // Acumular a notas de entrega
                salesDelivery += saleTotal;
                deliveryOrderCounter++;
            }

            // 3. Rellenar productos en ticket
            ticketItems.innerHTML = "";
            cart.forEach(item => {
                const totalItem = item.price * item.qty;
                const itemDiv = document.createElement("div");
                itemDiv.className = "flex-between";
                itemDiv.innerHTML = `
                    <span>${item.name} (${item.qty})</span>
                    <span>L ${totalItem.toFixed(2)}</span>
                `;
                ticketItems.appendChild(itemDiv);
            });

            ticketTotal.textContent = `L ${saleTotal.toFixed(2)}`;

            // 4. Animación de salida del ticket
            if (ticketWrap) ticketWrap.classList.add("active");

            // 5. Actualizar el acumulado total del día en el hero
            currentLiveSales += saleTotal;
            if (liveSalesVal) {
                liveSalesVal.textContent = `L ${currentLiveSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            // 6. Actualizar panel de reportes de cierre de caja en vivo
            updateClosingDashboard();

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

    // Configurar controladores de eventos para los botones de cargo/merma
    function setupStockAdjustBtn(btn) {
        btn.addEventListener("click", () => {
            const pid = btn.getAttribute("data-id");
            const op = btn.getAttribute("data-op");
            const item = stockData[pid];
            const rowElement = btn.closest(".stock-item-row");
            if (!item || !rowElement) return;
            
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
                if (pid.startsWith("p1")) progressBar.className = "stock-bar bg-emerald";
                else if (pid.startsWith("p3")) progressBar.className = "stock-bar bg-cyan";
                else progressBar.className = "stock-bar bg-cyan";
            }
        });
    }

    // Inicializar botones preexistentes de inventario
    stockAdjustButtons.forEach(btn => setupStockAdjustBtn(btn));

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

    // REGISTRO DE NUEVOS PRODUCTOS DINÁMICOS
    const productRegisterForm = document.getElementById("product-register-form");
    if (productRegisterForm) {
        productRegisterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const prodNameField = document.getElementById("prod-name");
            const prodPriceField = document.getElementById("prod-price");
            const prodStockField = document.getElementById("prod-stock");
            
            if (!prodNameField || !prodPriceField || !prodStockField) return;
            
            const name = prodNameField.value.trim();
            const price = parseFloat(prodPriceField.value);
            const stock = parseInt(prodStockField.value);
            
            if (!name || isNaN(price) || isNaN(stock)) return;
            
            // Generar nuevo ID único
            const newPid = "p" + (Object.keys(stockData).length + 1);
            
            // Añadir al mapa de datos
            stockData[newPid] = {
                name: name,
                qty: stock,
                max: Math.round(stock * 1.5) || 100,
                min: Math.round(stock * 0.15) || 5
            };
            
            // 1. Agregar visualmente al catálogo de inventario (Slide 3)
            const stockList = document.querySelector(".stock-list");
            if (stockList) {
                const newRow = document.createElement("div");
                newRow.className = "stock-item-row glow-new-item";
                newRow.setAttribute("data-id", newPid);
                
                const item = stockData[newPid];
                const pct = (item.qty / item.max) * 100;
                const isCritical = item.qty <= item.min;
                
                if (isCritical) newRow.classList.add("alert-stock");
                
                newRow.innerHTML = `
                    <div class="stock-item-info">
                        <span class="stock-item-name">${item.name}</span>
                        <span class="stock-item-qty"><strong class="qty-val">${item.qty}</strong> Unidades${isCritical ? ' (Crítico)' : ''}</span>
                    </div>
                    <div class="stock-bar-wrapper">
                        <div class="stock-bar bg-cyan" style="width: ${pct}%"></div>
                    </div>
                    <div class="stock-item-actions">
                        <button class="btn-stock-adjust plus" data-id="${newPid}" data-op="add">+ Cargo</button>
                        <button class="btn-stock-adjust minus" data-id="${newPid}" data-op="sub">- Merma</button>
                    </div>
                `;
                
                stockList.appendChild(newRow);
                
                // Enlazar eventos de los nuevos botones
                newRow.querySelectorAll(".btn-stock-adjust").forEach(btn => setupStockAdjustBtn(btn));
                
                // Registrar en la bitácora
                addInventoryLog(name, `Art. creado con stock inicial: ${stock}`, "positive");
            }
            
            // 2. Agregar visualmente como opción de compra al Punto de Venta (Slide 2)
            const productsShelf = document.querySelector(".sim-products-shelf");
            if (productsShelf) {
                const newProductBtn = document.createElement("button");
                newProductBtn.className = "btn-product-add";
                newProductBtn.setAttribute("data-name", name);
                newProductBtn.setAttribute("data-price", price.toFixed(2));
                newProductBtn.innerHTML = `
                    <span>${name}</span>
                    <strong>L ${price.toFixed(2)}</strong>
                `;
                
                productsShelf.appendChild(newProductBtn);
                
                // Enlazar evento para añadir al carrito
                newProductBtn.addEventListener("click", () => {
                    // Buscar si ya existe en el carrito
                    const existingItem = cart.find(item => item.name === name);
                    if (existingItem) {
                        existingItem.qty += 1;
                    } else {
                        cart.push({ name, price, qty: 1 });
                    }
                    if (ticketWrap) ticketWrap.classList.remove("active");
                    updateCartUI();
                });
            }
            
            // Resetear el formulario
            productRegisterForm.reset();
            
            // Animación feedback temporal en el botón
            const saveBtn = document.getElementById("btn-save-product");
            if (saveBtn) {
                const origText = saveBtn.innerHTML;
                saveBtn.innerHTML = "<span>✓ ¡Registrado!</span>";
                saveBtn.style.background = "var(--emerald)";
                saveBtn.style.boxShadow = "0 0 15px var(--emerald-glow)";
                setTimeout(() => {
                    saveBtn.innerHTML = origText;
                    saveBtn.style.background = "";
                    saveBtn.style.boxShadow = "";
                }, 1500);
            }
        });
    }

    // MODAL IMPRESIÓN REPORTE INVENTARIO (CONTROL FÍSICO)
    const btnPrintInventory = document.getElementById("btn-print-inventory");
    const modalInventoryReport = document.getElementById("modal-inventory-report");
    const btnCloseInventoryModal = document.getElementById("btn-close-inventory-modal");
    const btnCancelPrint = document.getElementById("btn-cancel-print");
    const btnExecutePrint = document.getElementById("btn-execute-print");
    const printTableBody = document.getElementById("print-table-body");
    const printDate = document.getElementById("print-date");

    if (btnPrintInventory && modalInventoryReport) {
        btnPrintInventory.addEventListener("click", () => {
            // Establecer fecha
            if (printDate) printDate.textContent = new Date().toLocaleDateString();
            
            // Generar tabla limpia
            if (printTableBody) {
                printTableBody.innerHTML = "";
                let index = 1;
                for (const key in stockData) {
                    const item = stockData[key];
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>VK-${1000 + index}</td>
                        <td style="font-weight: bold;">${item.name}</td>
                        <td class="text-right" style="font-family: monospace;">${item.qty} Unidades</td>
                        <td class="text-center" style="width: 100px;"><span style="display:inline-block; width: 60px; height: 16px; border: 1px solid #999; vertical-align: middle;"></span></td>
                        <td class="text-center" style="width: 100px;"><span style="display:inline-block; width: 60px; height: 16px; border: 1px solid #999; vertical-align: middle;"></span></td>
                        <td style="color: #666; font-size: 0.65rem;">Sist. OK</td>
                    `;
                    printTableBody.appendChild(tr);
                    index++;
                }
            }
            
            modalInventoryReport.classList.remove("hidden");
        });
    }

    // Controladores de cierre del modal de reporte
    [btnCloseInventoryModal, btnCancelPrint].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                if (modalInventoryReport) modalInventoryReport.classList.add("hidden");
            });
        }
    });

    if (btnExecutePrint) {
        btnExecutePrint.addEventListener("click", () => {
            window.print();
        });
    }


    // ==========================================================================
    // 6. DIAPOSITIVA 4: CIERRE DIARIO DE CAJA Y REPORTES
    // ==========================================================================
    const btnRunClosingModal = document.getElementById("btn-run-closing-modal");
    const modalCashClosing = document.getElementById("modal-cash-closing");
    const btnCloseClosingModal = document.getElementById("btn-close-closing-modal");
    const btnCancelClosing = document.getElementById("btn-cancel-closing");
    const btnExecuteClosing = document.getElementById("btn-execute-closing");
    const closingInitialCashInput = document.getElementById("closing-initial-cash");
    const closingReportOutput = document.getElementById("closing-report-output");
    
    // Elementos del desglose del modal
    const closingLblInitial = document.getElementById("closing-lbl-initial");
    const closingLblCash = document.getElementById("closing-lbl-cash");
    const closingLblCard = document.getElementById("closing-lbl-card");
    const closingLblTransfer = document.getElementById("closing-lbl-transfer");
    const closingLblDelivery = document.getElementById("closing-lbl-delivery");
    const closingLblGrandTotal = document.getElementById("closing-lbl-grand-total");

    let transactionCount = 24; // Transacciones iniciales ficticias del día

    // Función global para actualizar el Dashboard de Cierre en Slide 4
    function updateClosingDashboard() {
        const totalVentas = salesCash + salesCard + salesTransfer + salesDelivery;
        
        // Actualizar total neto en la tarjeta del Slide 4
        const reportSalesTotal = document.getElementById("report-sales-total");
        if (reportSalesTotal) {
            reportSalesTotal.textContent = `L ${totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        
        // Calcular porcentajes
        const pctCash = totalVentas > 0 ? (salesCash / totalVentas) * 100 : 0;
        const pctCard = totalVentas > 0 ? (salesCard / totalVentas) * 100 : 0;
        const pctTransfer = totalVentas > 0 ? (salesTransfer / totalVentas) * 100 : 0;
        const pctDelivery = totalVentas > 0 ? (salesDelivery / totalVentas) * 100 : 0;
        
        // Actualizar etiquetas en barra de progreso
        const lblCash = document.getElementById("lbl-bar-cash");
        const lblCard = document.getElementById("lbl-bar-card");
        const lblTransfer = document.getElementById("lbl-bar-transfer");
        const lblDelivery = document.getElementById("lbl-bar-delivery");
        
        if (lblCash) lblCash.textContent = `L ${salesCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pctCash.toFixed(0)}%)`;
        if (lblCard) lblCard.textContent = `L ${salesCard.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pctCard.toFixed(0)}%)`;
        if (lblTransfer) lblTransfer.textContent = `L ${salesTransfer.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pctTransfer.toFixed(0)}%)`;
        if (lblDelivery) lblDelivery.textContent = `L ${salesDelivery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${pctDelivery.toFixed(0)}%)`;
        
        // Actualizar anchos de barra
        const fillCash = document.getElementById("bar-fill-cash");
        const fillCard = document.getElementById("bar-fill-card");
        const fillTransfer = document.getElementById("bar-fill-transfer");
        const fillDelivery = document.getElementById("bar-fill-delivery");
        
        if (fillCash) fillCash.style.width = `${pctCash}%`;
        if (fillCard) fillCard.style.width = `${pctCard}%`;
        if (fillTransfer) fillTransfer.style.width = `${pctTransfer}%`;
        if (fillDelivery) fillDelivery.style.width = `${pctDelivery}%`;
    }

    // Función para calcular y renderizar el desglose financiero del cierre
    function calculateClosingBreakdown() {
        const initialCash = parseFloat(closingInitialCashInput.value) || 0;
        const totalClosingAmount = initialCash + salesCash + salesCard + salesTransfer + salesDelivery;
        
        if (closingLblInitial) closingLblInitial.textContent = `L ${initialCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        if (closingLblCash) closingLblCash.textContent = `L ${salesCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        if (closingLblCard) closingLblCard.textContent = `L ${salesCard.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        if (closingLblTransfer) closingLblTransfer.textContent = `L ${salesTransfer.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        if (closingLblDelivery) closingLblDelivery.textContent = `L ${salesDelivery.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        if (closingLblGrandTotal) closingLblGrandTotal.textContent = `L ${totalClosingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }

    // Escuchar apertura de modal de cierre
    if (btnRunClosingModal && modalCashClosing) {
        btnRunClosingModal.addEventListener("click", () => {
            calculateClosingBreakdown();
            modalCashClosing.classList.remove("hidden");
        });
    }

    // Escuchar entrada de teclado en Fondo de Caja
    if (closingInitialCashInput) {
        closingInitialCashInput.addEventListener("input", calculateClosingBreakdown);
    }

    // Controladores de cierre del modal de Cierre
    [btnCloseClosingModal, btnCancelClosing].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                if (modalCashClosing) modalCashClosing.classList.add("hidden");
            });
        }
    });

    // Confirmar y generar recibo de Cierre de Caja
    if (btnExecuteClosing) {
        btnExecuteClosing.addEventListener("click", () => {
            const initialCash = parseFloat(closingInitialCashInput.value) || 0;
            const totalClosingAmount = initialCash + salesCash + salesCard + salesTransfer + salesDelivery;
            const totalVentas = salesCash + salesCard + salesTransfer + salesDelivery;
            const now = new Date();
            const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
            
            // Ocultar modal
            if (modalCashClosing) modalCashClosing.classList.add("hidden");
            
            // Rellenar reporte administrativo final de Cierre Z
            const closingReportTimestamp = document.getElementById("closing-report-timestamp");
            if (closingReportTimestamp) closingReportTimestamp.textContent = `Generado el: ${dateStr}`;
            
            const closingReportDetails = document.getElementById("closing-report-details");
            if (closingReportDetails) {
                closingReportDetails.innerHTML = `
                    <li class="flex-between"><span>Transacciones en Turno:</span><strong>${transactionCount} Ventas</strong></li>
                    <li class="flex-between"><span>Fondo de Caja Inicial:</span><strong>L ${initialCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                    <li class="flex-between"><span>Subtotal Ventas del Día:</span><strong>L ${totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                    <li class="flex-between border-top"><span>Efectivo Recaudado:</span><strong>L ${salesCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                    <li class="flex-between"><span>Tarjeta Recaudada:</span><strong>L ${salesCard.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                    <li class="flex-between"><span>Transferencias Recibidas:</span><strong>L ${salesTransfer.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                    <li class="flex-between"><span>Notas / Órdenes de Entrega:</span><strong>L ${salesDelivery.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                    <li class="flex-between font-bold border-top text-emerald"><span>MONTO TOTAL EN CAJA:</span><strong>L ${totalClosingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></li>
                    <li class="flex-between font-bold text-emerald"><span>Diferencia de Cuadre:</span><strong>L 0.00 (Cuadrado OK)</strong></li>
                `;
            }
            
            // Mostrar reporte
            if (closingReportOutput) {
                closingReportOutput.classList.remove("hidden");
                closingReportOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
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
