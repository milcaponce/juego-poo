class Game {
constructor(){
    this.container = document.getElementById("game-container");
    this.personaje = null;
    this.monedas = [];
    this.puntuacion = 0;
    this.crearEscenario();
    this.agregarEventos();
    this.puntosElement = document.getElementById("puntaje");
}
crearEscenario() {
    this.personaje = new Personaje();
    this.container.appendChild(this.personaje.element);
    for (let i = 0; i < 5; i++) {
        const moneda = new Moneda();
        this.monedas.push(moneda);
        this.container.appendChild(moneda.element);
    }
}
agregarEventos() {
    window.addEventListener("keydown", (e) => this.personaje.mover(e));
    this.checkColisiones();
}
checkColisiones() {
    setInterval(() => {
        this.monedas.forEach((moneda, index) => {
            if  (this.personaje.colisionaCon(moneda)) {
                this.container.removeChild(moneda.element);
                this.monedas.splice(index, 1);
                this.actualizarPuntiacion(10);
                }
        });
    },100);
}
actualizarPuntiacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = this.puntuacion;
    
    if (this.puntuacion %50 === 0) {
        alert("¡Nivel superado!");
        this.generarMonedasExtra();
    }
}
generarMonedasExtra() {
    for (let i = 0; i <3; i++) {
        const nueva = new Moneda();
        this.monedas.push(nueva);
        this.container.appendChild(nueva.element);
    }
}
}


class Personaje {
    constructor() {
        this.x = 50;
        this.y = 300;
        this.width = 128;
        this.height = 128;
        this.velocidad = 10;
        this.saltando = false;
        this.estado = "idle"; //quieto
        this.direccion = "derecha";
        this.frameActual = 0;
        
        
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
        this.actualizarAnimacion();
    }

    mover(evento) {
        if (this.saltando) return; 

        const contenedorAncho = 1000;
        const margen = 0;

        if (evento.key === "ArrowRight") {
            if (this.x + this.width + this.velocidad <= contenedorAncho - margen) {
                this.x += this.velocidad;
            }
            this.direccion = "derecha";
            this.estado = evento.shiftKey ? "corriendo" : "caminando";

        } else if (evento.key === "ArrowLeft") {
            if (this.x - this.velocidad >= 0 + margen) {
                this.x -= this.velocidad;
            }
            this.direccion = "izquierda";
            this.estado = evento.shiftKey ? "corriendo" : "caminando";

        }  else if (evento.key === "ArrowUp") {
            this.saltar();
            return; //Para que no vuelva a "idle"
        }

        this.actualizarAnimacion();
        this.actualizarPosicion();
        
        //Volver a "idle" si no está saltando
        clearTimeout(this.restEstado);
        this.restEstado = setTimeout(() => {
        this.estado = "idle";
        this.actualizarAnimacion();
        }, 300);
    }

    
    saltar() {
        if (this.saltando) return; //Evita salto doble

        this.saltando = true;
        this.estado = "saltando";
        this.actualizarAnimacion(); //Para volver a "idle" al aterrizar

        let alturaMaxima = this.y - 300;

        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 25;
            } else {
                clearInterval(salto);
                this.caer();
            }

            this.actualizarPosicion();
        }, 20);
    }

    caer() {
        const gravedad = setInterval(() => {
            if (this.y < 300) {
                this.y += 20;
                this.actualizarPosicion();
            } else {
                clearInterval(gravedad);
                this.saltando = false;
                this.estado = "idle";
                this.actualizarAnimacion();
            }
        }, 20);
    }


    actualizarAnimacion() {
    const ruta = "img/LVL-1-Egipto/Personaje/";

    if (this.estado === "idle") {
        this.element.style.width = "128px";
        this.element.style.height = "128px";
        this.element.style.backgroundImage = `url("${ruta}Idle.png")`;
        this.element.style.backgroundSize = "640px auto";
        this.element.style.animation = "animarIdle 0.8s steps(5) infinite";

    } else if (this.estado === "caminando") {
        this.element.style.width = "128px";
        this.element.style.height = "128px";
        this.element.style.backgroundImage = `url("${ruta}Walk.png")`;
        this.element.style.backgroundSize = "927px auto";
        this.element.style.animation = "animarWalk 0.8s steps(8) infinite";

    } else if (this.estado === "corriendo") {
        this.element.style.width = "128px";
        this.element.style.height = "128px";
        this.element.style.backgroundImage = `url("${ruta}Run.png")`;
        this.element.style.backgroundSize = "927px auto";
        this.element.style.animation = "animarRun 0.6s steps(8) infinite";

    } else if (this.estado === "saltando") {
        this.element.style.width = "128px";
        this.element.style.height = "128px";
        this.element.style.backgroundImage = `url("${ruta}Jump.png")`;
        this.element.style.backgroundSize = "869px auto";
        this.element.style.animation = "animarJump 0.6s steps(7) 1";
    }

    this.element.style.transform = this.direccion === "izquierda" ? "scaleX(-1)" : "scaleX(1)";
}


    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    

colisionaCon(objeto) {
        return (
            this.x < objeto.x + objeto.width &&
            this.x + this.width > objeto.x &&
            this.y < objeto.y + objeto.height &&
            this.y + this.height > objeto.y
        );
    }
    
    }


class Moneda {
    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
    }

    actualizarPosicion(puntos) {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

}

const juego = new Game(); 
