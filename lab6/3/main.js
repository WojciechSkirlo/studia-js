const canvas = document.querySelector('#canvas');
const start = document.querySelector('#start');
const stop = document.querySelector('#stop');

const ctx = canvas.getContext('2d');

const X = 10;
const Y = 100;

const ballRadius = 10;

let balls = [];
let requestID = null;

class Ball {
    constructor(x, y, vx, vy, radius = ballRadius, color = 'black') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // When the ball hits the wall, it should bounce back
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach((ball) => {
        ball.move();
        ball.draw();

        // Draw line between balls if they are close enough
        balls.forEach((otherBall) => {
            if (ball !== otherBall) {
                const dx = ball.x - otherBall.x;
                const dy = ball.y - otherBall.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < Y) {
                    ctx.beginPath();
                    ctx.moveTo(ball.x, ball.y);
                    ctx.lineTo(otherBall.x, otherBall.y);
                    ctx.strokeStyle = 'black';
                    ctx.stroke();
                }
            }
        });
    });

    requestID = window.requestAnimationFrame(draw);
}

function generateNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function init() {
    balls = Array.from({ length: X }, () => {
        const x = generateNumber(ballRadius, canvas.width - ballRadius);
        const y = generateNumber(ballRadius, canvas.height - ballRadius);
        const vx = generateNumber(1, 3);
        const vy = generateNumber(1, 3);

        return new Ball(x, y, vx, vy);
    });

    start.addEventListener('click', () => {
        start.setAttribute('disabled', true);
        stop.removeAttribute('disabled');

        requestID = window.requestAnimationFrame(draw);
    });

    stop.addEventListener('click', () => {
        stop.setAttribute('disabled', true);
        start.removeAttribute('disabled');

        window.cancelAnimationFrame(requestID);
    });

    start.setAttribute('disabled', true);

    requestID = window.requestAnimationFrame(draw);
}

init();
