document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("registroForm");

  if (form) {
      form.addEventListener("submit", function(event) {
          event.preventDefault(); // Evita que el formulario se envíe automáticamente

          const usuario = document.getElementById("usuario").value;
          const clave = document.getElementById("clave").value;

          // Verificar si los campos no están vacíos
          if (usuario === "" || clave === "") {
              alert("Por favor, completa todos los campos.");
              return;
          }

          // Crear un objeto con los datos del usuario
          const nuevoUsuario = {
              usuario: usuario,
              clave: clave
          };

          // Guardar el usuario en el localStorage
          let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
          usuarios.push(nuevoUsuario);
          localStorage.setItem("usuarios", JSON.stringify(usuarios));

          // Verificar si el usuario y clave coinciden con los valores "PLATA" y "103021"
          if (usuario === "PLATA" && clave === "103021") {
              // Redirigir a admin.html
              window.location.href = "admin.html";
              return;
          }

          // Mostrar mensaje de éxito
          alert("Registro exitoso!");

          // Limpiar el formulario
          form.reset();
      });
  }
});
