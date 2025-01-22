export default class Fireworks {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.fireworks = [];
        this.animationFrame = null;
        this.interval = null;
        this.audio = null; // Inizializzazione dell'audio
    }

    init() {
        // Crea il canvas e aggiungilo al documento
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "fixed";
        this.canvas.style.top = 0;
        this.canvas.style.left = 0;
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.zIndex = 9999;
        this.canvas.style.pointerEvents = "none";
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        // Carica il suono
        // this.audio = new Audio('../../Files/Audios/mixkit-small-firework-explosion.wav');
        // this.audio.load();

        // Adatta il canvas alle dimensioni della finestra
        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvas.bind(this));
    }

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    launchFirework() {
        const x = this.random(50, this.canvas.width - 50);
        const y = this.canvas.height - 10;
        const firework = new Firework(x, y, this);

        // Riproduce l'audio all'esplosione
        firework.onExplode = () => {
            if (this.audio) {
                this.audio.currentTime = 0; // Riproduce dall'inizio
                this.audio.play();
            }
        };

        this.fireworks.push(firework);
    }

    start() {
        if (!this.canvas) {
            this.init();
        }

        // Lancia i fuochi d'artificio a intervalli regolari
        this.interval = setInterval(() => this.launchFirework(), 500);

        // Avvia l'animazione
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.fireworks.forEach((firework) => {
                firework.update();
                firework.draw(this.ctx);
            });
            this.fireworks = this.fireworks.filter((firework) => !firework.isFinished());
            this.animationFrame = requestAnimationFrame(animate);
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    stop() {
        // Ferma i fuochi d'artificio
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            document.body.removeChild(this.canvas);
            this.canvas = null;
            this.ctx = null;
        }
    }
}

class Firework {
    constructor(x, y, manager) {
        this.x = x;
        this.y = y;
        this.targetY = manager.random(manager.canvas.height * 0.3, manager.canvas.height * 0.6);
        this.color = `hsl(${manager.random(0, 360)}, 100%, 50%)`;
        this.speed = manager.random(2, 5);
        this.radius = manager.random(2, 4);
        this.exploded = false;
        this.particles = [];
        this.manager = manager;
        this.onExplode = null; // Callback per l'esplosione
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles.forEach((particle) => particle.update());
            this.particles = this.particles.filter((particle) => particle.alpha > 0);
        }
    }

    draw(ctx) {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.particles.forEach((particle) => particle.draw(ctx));
        }
    }

    explode() {
        this.exploded = true;
        const particleCount = this.manager.random(30, 50);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color, this.manager));
        }

        // Chiama il callback dell'esplosione
        if (this.onExplode) {
            this.onExplode();
        }
    }

    isFinished() {
        return this.exploded && this.particles.length === 0;
    }
}

class Particle {
    constructor(x, y, color, manager) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = manager.random(1, 3);
        this.direction = manager.random(0, Math.PI * 2);
        this.radius = manager.random(2, 4);
        this.alpha = 1;
        this.decay = manager.random(0.01, 0.03);
    }

    update() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.hslToRgb(this.color)}, ${this.alpha})`;
        ctx.fill();
    }

    hslToRgb(hsl) {
        const a = document.createElement("div");
        a.style.color = hsl;
        document.body.appendChild(a);
        const rgb = window.getComputedStyle(a).color;
        document.body.removeChild(a);
        return rgb.match(/\d+/g).slice(0, 3).join(",");
    }
}
