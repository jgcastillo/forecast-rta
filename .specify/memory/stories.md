# Stories — forecast_rta

Este archivo es el Backlog Maestro del proyecto. Define "qué" hace el sistema a través de User Stories (US) y establece los criterios de aceptación mediante Gherkin.

## [cite_start]Módulo 01: Autenticación y Seguridad [cite: 167-170, 202]

### US-01: Registrar Usuario
**Como** Administrador, **quiero** registrar nuevos usuarios **para** delegar tareas de análisis y revisión.

* **Escenario: Registro exitoso**
    * **Given** que el Administrador ha iniciado sesión
    * [cite_start]**When** ingresa un nombre, un correo único y selecciona un rol (Analista/Revisor) [cite: 204]
    * [cite_start]**Then** el sistema crea la cuenta y muestra confirmación[cite: 206].

* **Escenario: Correo duplicado**
    * [cite_start]**Given** que el correo ya existe en la base de datos [cite: 204]
    * **When** el Administrador intenta registrarlo de nuevo
    * [cite_start]**Then** el sistema muestra un error de "Correo ya registrado"[cite: 206].

### [cite_start]US-02: Iniciar Sesión [cite: 208]
### [cite_start]US-03: Modificar datos de usuario [cite: 210]
### [cite_start]US-04: Restablecer contraseña [cite: 213]

---

## [cite_start]Módulo 02: Catálogo de Productos [cite: 174, 215]

### US-05: Registrar Producto
**Como** Analista, **quiero** dar de alta productos **para** incluirlos en el forecast.
* [cite_start]Atributos: Código verificado, descripción, cant x caja, precio Exworks, serie, vía de envío[cite: 217].

### [cite_start]US-06: Modificar Producto [cite: 218]
### [cite_start]US-07: Consultar Catálogo [cite: 221]

---

## [cite_start]Módulo 03: Ventas Históricas [cite: 178, 223]

### [cite_start]US-08: Registrar Ventas Mensuales (Manual) [cite: 225]
### [cite_start]US-09: Importar Histórico desde Excel [cite: 228]
### [cite_start]US-10: Consultar Histórico de Ventas [cite: 230]

---

## [cite_start]Módulo 04: Promedios y Proyecciones [cite: 180, 233]

### US-11: Calcular Promedios (12m y 6m)
**Como** Sistema, **debo** calcular los promedios de ventas **para** determinar el consumo mensual.
* [cite_start]Fórmulas: (13m/12) y (7m/6)[cite: 34, 35, 235].
* [cite_start]Regla: Si el denominador es 0, el resultado es 0[cite: 38].

### [cite_start]US-12: Definir Ventas Proyectadas (VENTAS_PRO-mes) [cite: 237]

---

## [cite_start]Módulo 05: Inventario Miami [cite: 185, 239]

### [cite_start]US-13: Registrar Inventario al Cierre (MYOB) [cite: 240]
### [cite_start]US-14: Calcular Disponibilidad Actual (DISP) [cite: 242]
### [cite_start]US-15: Registrar Tránsitos y Envíos Próximos [cite: 244]
### [cite_start]US-16: Calcular Inventario Proyectado a 2 Meses [cite: 247]
### US-17: Configurar Parámetros de Disponibilidad Objetivo
* [cite_start]Valores: 5 meses (Marítimo), 3.5 meses (Aéreo)[cite: 77, 78, 80, 250].

---

## [cite_start]Módulo 06: Inventario Puerto Rico [cite: 187, 253]

### [cite_start]US-18: Registrar Inventario DEP PR y Disponibilidad [cite: 255]

---

## [cite_start]Módulo 07: Órdenes de Compra y Logística [cite: 189, 256]

### [cite_start]US-19: Definir Criterio de Orden (Disponibilidad vs Mínimo) [cite: 72, 73, 258]
### [cite_start]US-20: Calcular Orden de Compra Sugerida [cite: 261]
### [cite_start]US-21: Ajustar y Confirmar Orden [cite: 263]
### [cite_start]US-22: Registrar Orden en Tránsito [cite: 267]
### [cite_start]US-23: Registrar Recepción de Mercancía [cite: 269]
### [cite_start]US-24: Registrar Envío a Puerto Rico [cite: 271, 273]
### [cite_start]US-25: Registrar Envío a Caracas [cite: 274]

---

## [cite_start]Módulo 08: Reportes y Dashboard [cite: 193, 276]

### [cite_start]US-26: Generar Reporte de Orden (Excel/PDF) [cite: 277]
### [cite_start]US-27: Generar Resumen de Envíos [cite: 281]
### [cite_start]US-28: Gráfico de Ventas por Producto [cite: 283]
### [cite_start]US-29: Gráfico de Disponibilidad [cite: 284]
### [cite_start]US-30: Reporte de Valor de Inventario [cite: 287]
### [cite_start]US-31: Dashboard de Alertas de Compra [cite: 289]
