# Configuración de EmailJS para el Formulario de Contacto

## 📧 Pasos para Configurar el Envío Automático de Emails

### 1. Crear Cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar Servicio de Email
1. En el dashboard, ve a "Email Services"
2. Agrega un nuevo servicio (Gmail, Outlook, etc.)
3. Conecta tu cuenta de Gmail: `floresgabriel0705@gmail.com`
4. Copia el **Service ID** generado

### 3. Crear Template de Email
1. Ve a "Email Templates"
2. Crea un nuevo template con el siguiente contenido:

```
Asunto: Nuevo mensaje de contacto - {{from_name}}

Hola Gabriel,

Has recibido un nuevo mensaje de contacto desde tu sitio web:

Nombre: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}

Mensaje:
{{message}}

---
Este mensaje fue enviado desde tu sitio web de Gabriel Flores Marketing.
```

3. Copia el **Template ID** generado

### 4. Obtener Public Key
1. Ve a "Account" → "General"
2. Copia tu **Public Key**

### 5. Actualizar el Código
Reemplaza en `script.js` las siguientes líneas:

```javascript
// Línea 82: Reemplazar YOUR_PUBLIC_KEY
emailjs.init("TU_PUBLIC_KEY_AQUI");

// Línea 125: Reemplazar YOUR_SERVICE_ID y YOUR_TEMPLATE_ID
emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams)
```

### 6. Configuración Final
- **Public Key**: Tu clave pública de EmailJS
- **Service ID**: ID del servicio de Gmail configurado
- **Template ID**: ID del template creado
- **Email destino**: floresgabriel0705@gmail.com

### 7. Límites Gratuitos
- **200 emails/mes** en plan gratuito
- **Suficiente** para un sitio web personal

### 8. Prueba
1. Abre tu sitio web
2. Llena el formulario de contacto
3. Envía un mensaje de prueba
4. Verifica que llegue a floresgabriel0705@gmail.com

## 🔧 Alternativa: Formspree
Si prefieres una solución más simple, puedes usar Formspree:
1. Ve a [https://formspree.io/](https://formspree.io/)
2. Crea una cuenta
3. Obtén tu endpoint URL
4. Reemplaza el código de EmailJS con una petición fetch a Formspree
