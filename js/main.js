// Definición de objetos y funciones
const seguros = {
    automovil: {
        valor: 140,
        iva: 0.10
    },
    moto: {
        valor: 120,
        iva: 0.05
    }
};

// Constructor de usuarios
function Usuario(nombre) {
    this.nombre = nombre;
    this.total = 0;

    this.actualizarTotal = function(total) {
        this.total = total;
    };
}

//Array para almacenar usuarios y compras
const usuarios = [];
const compras = [];

//Funcion para calcular el total con iva
const calcularTotal = (base, iva) => base + (base * iva);

window.onload = () => {
    let numUsuarios;
    let currentUser;

    //Recuperar usuarios y compras desde ls
    const usuariosStorage = JSON.parse(localStorage.getItem("usuarios")) || [];
    const comprasStorage = JSON.parse(localStorage.getItem("compras")) || [];

    usuariosStorage.forEach(userData => {
        const usuario = new Usuario(userData.nombre);
        usuario.total = userData.total;
        usuarios.push(usuario);
    });
    compras.push(...comprasStorage);

    //Mostrar el popup para ingresar el num de usuarios
    document.getElementById("popup").style.display = "flex";

    //Capturar el num de usuarios
    document.getElementById("submit-num-usuarios").onclick = () => {
        numUsuarios = parseInt(document.getElementById("num-usuarios").value);

        if (numUsuarios && numUsuarios > 0) {
            document.getElementById("popup").style.display = "none";
            document.getElementById("usuario-popup").style.display = "flex";
        } else {
            const errorMessage = document.getElementById("error-message");
            errorMessage.innerText = "Por favor, ingresa un número válido.";
            errorMessage.style.color = "red";
        }
    };

    //Función para validar nombre de usuario que no tengan espacios en blanco, si tiene darle error y no dejarlo guardar
    const validarNombreUsuario = nombre => nombre.trim() !== "";

    //Evento keydown para validar mientras se escribe
    document.getElementById("nombre-usuario-input").addEventListener("keydown", () => {
        const errorMessage = document.getElementById("usuario-error-message");
        const nombre = document.getElementById("nombre-usuario-input").value.trim();

        errorMessage.innerText = validarNombreUsuario(nombre) 
            ? "" 
            : "El nombre no puede estar vacío o contener solo espacios.";
        errorMessage.style.color = validarNombreUsuario(nombre) 
            ? "" 
            : "red";
    });

    //Crear a los usuarios
    document.getElementById("submit-usuario").onclick = () => {
        const errorMessage = document.getElementById("usuario-error-message");
        let nombre = document.getElementById("nombre-usuario-input").value.trim();

        //Validar el nombre del usuario
        if (!validarNombreUsuario(nombre)) {
            errorMessage.innerText = "El nombre no puede estar vacío o contener solo espacios.";
            errorMessage.style.color = "red";
            return; 
        }

        //Asegurar que el nombre del usuario sea unico
        if (usuarios.some(user => user.nombre === nombre)) {
            errorMessage.innerText = "Nombre inválido o ya existe. Intenta con otro nombre.";
            errorMessage.style.color = "red";
        } else {
            //Si el nombre es unico se  crea el usuario - guarda en ls y salir del ciclo
            const nuevoUsuario = new Usuario(nombre);
            usuarios.push(nuevoUsuario);
            numUsuarios--;

            //Guardar usuarios en ls
            localStorage.setItem("usuarios", JSON.stringify(usuarios.map(user => ({
                nombre: user.nombre,
                total: user.total
            }
        )
    )
)
);

            //Actualizar el combobox con el nuevo usuario
            const selectUsuario = document.getElementById("select-usuario");
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            selectUsuario.appendChild(option);

            //Mostrar mensaje de exito
            errorMessage.innerText = "Usuario creado con éxito.";
            errorMessage.style.color = "green";

            if (numUsuarios > 0) {
                //limpia el campo para el siguiente usuario
                document.getElementById("nombre-usuario-input").value = ""; 
            } else {
                document.getElementById("usuario-popup").style.display = "none";
                document.getElementById("verificar-popup").style.display = "flex";
            }
        }
    };

    //Verificar usuario
    document.getElementById("submit-verificar").onclick = () => {
        const nombreVerificar = document.getElementById("nombre-verificar").value.trim();
        const usuarioEncontrado = usuarios.find(user => user.nombre === nombreVerificar);
        const errorMessage = document.getElementById("verificar-error-message");

        //si el usuario existe
        if (usuarioEncontrado) {
            currentUser = usuarioEncontrado;

            document.getElementById("nombre-usuario").innerText = `¡Bienvenido ${nombreVerificar}!`;
            document.getElementById("nombre-usuario").style.display = "block";

            document.getElementById("verificar-popup").style.display = "none";
            document.getElementById("insurance-section").style.display = "block";
        } else {
            errorMessage.innerText = "Usuario no encontrado. Intenta nuevamente.";
            errorMessage.style.color = "red";
        }
    };

    //Comprar seguro
    document.getElementById("insurance-form").onsubmit = e => {
        e.preventDefault();
        const vehicleType = document.getElementById("vehicle-type").value;
        const selectedInsurance = seguros[vehicleType];
        const total = calcularTotal(selectedInsurance.valor, selectedInsurance.iva);

        //Actualizar el total del usuario seleccionado
        const selectedUserName = document.getElementById("select-usuario").value;
        const selectedUser = usuarios.find(user => user.nombre === selectedUserName);

        if (selectedUser) {
            selectedUser.actualizarTotal(total);

            //Agregar compra al array de compras
            compras.push({
                nombre: selectedUser.nombre,
                tipoSeguro: vehicleType,
                total: total
            });

            //Ordenar las compras por nombre
            compras.sort((a, b) => a.nombre.localeCompare(b.nombre));

            //Guardar compras en ls
            localStorage.setItem("compras", JSON.stringify(compras));

            //Mostrar el total
            document.getElementById("total").innerText = `Total a pagar para ${selectedUser.nombre}: $ ${total}`;

            //Mostrar las compras realizadas
            const comprasDiv = document.getElementById("compras");
            comprasDiv.innerHTML = ""; // Limpiar las compras existentes
            compras.forEach(compra => {
                const p = document.createElement("p");
                p.textContent = `${compra.nombre} compró un seguro de ${compra.tipoSeguro} por $${compra.total}`;
                comprasDiv.appendChild(p);
            });
        }
    };

    // Mostrar el nombre guardado en la carga de la página
    const nombreGuardado = localStorage.getItem("usuarioNombre");
    if (nombreGuardado) {
        document.getElementById("nombre-usuario").innerText = `¡Bienvenido ${nombreGuardado}!`;
        document.getElementById("nombre-usuario").style.display = "block";
    }
};
