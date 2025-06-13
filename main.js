const musicaFondo = new Audio("sound/music-egypt.wav");
musicaFondo.loop = true;
musicaFondo.volume = 0.5;

const sonidoSalto = new Audio("sound/jump.wav");
const sonidoMoneda = new Audio("sound/coin.wav");
const sonidoWin = new Audio("sound/win.wav");

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("intro").style.display = "activo";
});
class Game {
constructor(){
    this.container = document.getElementById("game-container");
    this.personaje = null;
    this.monedas = [];
    this.puntuacion = 0;
    this.puntosElement = document.getElementById("puntaje");
    this.crearEscenario();
    this.agregarEventos();
    this.nivelCompletado = false;
    this.scarabInterval = setInterval(() => this.generarScarab(),10000);
}
crearEscenario() {
    this.personaje = new Personaje();
    this.container.appendChild(this.personaje.element);
    
    const objetos = ["papyrus", "ankh", "scarab", "papyrus", "papyrus", "ankh", "scarab"];
        objetos.forEach(tipo => {
    
    const objeto = new Moneda(tipo);
        this.monedas.push(objeto);
        this.container.appendChild(objeto.element);
    });

}

agregarEventos() {
    window.addEventListener("keydown", e => this.personaje.mover(e));
    this.checkColisiones();
}

checkColisiones() {
    this.intervaloColisiones = setInterval(() => {
        this.monedas.forEach((moneda, index) => {
            if  (this.personaje.colisionaCon(moneda)) {
                sonidoMoneda.play();
                this.container.removeChild(moneda.element);
                this.monedas.splice(index, 1);
                this.actualizarPuntiacion(moneda.puntaje);
                }
        });
    },100);
}

actualizarPuntiacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = this.puntuacion;
    
    if (this.puntuacion >= 100) {
    clearInterval(this.intervaloColisiones); // detener colisiones
    document.getElementById("nivel-superado").classList.add("mostrar");       
    sonidoWin.play();
}
}

generarScarab() {
    const scarab = new Moneda("scarab");
    this.monedas.push(scarab);
    this.container.appendChild(scarab.element);
    setTimeout(() => {
    if (scarab.element.parentElement) {
        scarab.element.remove();
    }
    }, 5000);
}

limpiarIntervalos() {
        clearInterval(this.scarabInterval);
        clearInterval(this.intervaloColisiones);
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
        this.estado = "idle"; 
        this.direccion = "derecha";
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
        this.actualizarAnimacion();
        
        this.contenedorAncho = 1000;
        this.margen = 0;
    }

    mover(e) {
        if (this.saltando) return; 
        const contenedorAncho = 1000;
        const margen = 0;
        

        if (e.key === "ArrowRight") {
            if (this.x + this.width + this.velocidad <= contenedorAncho - margen) {
                this.x += this.velocidad;
            }
            this.direccion = "derecha";
            this.estado = e.shiftKey ? "corriendo" : "caminando";

        } else if (e.key === "ArrowLeft") {
            if (this.x - this.velocidad >= 0 + margen) {
                this.x -= this.velocidad;
            }
            this.direccion = "izquierda";
            this.estado = e.shiftKey ? "corriendo" : "caminando";

        }  else if (e.key === "ArrowUp") {
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
        sonidoSalto.play();
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
    constructor(tipo = "papyrus") {
        this.tipo = tipo;
        this.puntaje = this.definirPuntaje();
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda", tipo);
        this.actualizarPosicion();

        if (tipo === "scarab") {
            this.element.classList.add("animado");
            setTimeout(() => {
                if (this.element.parentElement) {
                    this.element.remove(); // se borra después de 5s
                }
            }, 5000);
        }
    }

    definirPuntaje() {
        switch (this.tipo) {
        case "ankh": return 20;
        case "scarab": return 30;
        default: return 10;
        }
    }
    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    }

let pasoIntro = 0;

function mostrarPasoIntro() {
    const historia = document.getElementById("historia");
    const instrucciones = document.getElementById("instrucciones");

    if (pasoIntro === 0) {
    historia.classList.add("activa");
    instrucciones.classList.remove("activa");
    } else if (pasoIntro === 1) {
    historia.classList.remove("activa");
    instrucciones.classList.add("activa");
    }
}

function avanzarIntro() {
    pasoIntro++;

    if (pasoIntro === 1) {
        mostrarPasoIntro();
    } else if (pasoIntro === 2) {
        document.getElementById("intro").style.display = "none";
        iniciarJuego(); //  inicia el cronómetro
    }
}

// Se muestra Historia
mostrarPasoIntro();


document.addEventListener("keydown", avanzarIntro);
document.addEventListener("click", avanzarIntro);


const juego = new Game(); 

//Cronometro
let segundos = 0;
let intervaloTiempo;

function iniciarJuego() {
    segundos = 0;
    document.getElementById("tiempo").textContent = segundos;
    document.getElementById("puntaje").textContent = 0;

    intervaloTiempo = setInterval(() => {
    segundos++;
    document.getElementById("tiempo").textContent = segundos;
    }, 1000);

    musicaFondo.play();
    document.getElementById("game-container").style.display = "block";
    document.getElementById("intro").style.display = "none";

    juego = new Game();
}

function siguienteNivel() {
    alert("🎉 ¡Próximamente desbloquearás nuevos mundos!");
}