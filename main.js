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
        this.width = 50;
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
    }

    mover(evento) {
        if (evento.key === "ArrowRight") {
            this.x += this.velocidad;
        } else if (evento.key === "ArrowLeft") {
            this.x -= this.velocidad;
        } else if (evento.key === "ArrowUp") {
            this.saltar();
        }
        this.actualizarPosicion();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    
    saltar() {
        this.saltando = true;
        let alturaMaxima = this.y - 100;
        const salto = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -=10;
            }else {
                clearInterval(salto);
                this.caer();
            }
            this.actualizarPosicion();
        }, 20);
    }

    caer() {
        const gravedad = setInterval(() => {
            if (this.y < 300) {
                this.y += 10;
            } else {
                clearInterval(gravedad);
            }
            this.actualizarPosicion();
        }, 20);
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
