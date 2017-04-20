/**
 * Created by YSingh on 20/04/17.
 */

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 50;
var paddleX = (canvas.width / 2) - (paddleWidth / 2); //easy to understand this way
var rightPressed = false;
var leftPressed = false;
var x = canvas.width / 2;
var y = canvas.height - ballRadius - paddleHeight;
var dx = 2;
var dy = 2;
var brickGap = 10;
var c = 4;
var r = 4;
var brickWidth = (canvas.width / 4) - brickGap;
var brickHeight = 20;
var score = 0;

function detectCollision() {
    var x1 = 0;
    var y1 = 0;
    for(var i = 0; i < r; i++) {
        for(var j = 0; j < c; j++) {
            x1 = i*(brickWidth + brickGap) + brickGap / 2;
            y1 = j*(brickHeight + brickGap) + brickGap / 2;

            if(x + ballRadius > x1
                && x + ballRadius < x1 + brickWidth
                && y + ballRadius > y1
                && y + ballRadius < y1 + brickHeight
                && collisionArray[i][j] == 0) {
                dy = - dy;
                collisionArray[i][j] = 1;
                document.getElementById("scoreValue").innerHTML = ++score;
                if(score == r*c) {
                    alert("Congratulations, You won!");
                }
            }
        }
    }
}

function drawBricks() {
    ctx.beginPath();
    for(var i = 0; i < r; i++) {
        for(var j = 0; j < c; j++) {
            if(collisionArray[i][j] == 0) {
                ctx.rect(i*(brickWidth + brickGap) + brickGap / 2,
                    j*(brickHeight + brickGap) + brickGap / 2, brickWidth, brickHeight);
                ctx.fillStyle = "#FF0000";
            }
        }
    }
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    detectCollision();
    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
    if(y - dy < ballRadius || y - dy > canvas.height - ballRadius) {
        if(y - dy > canvas.height - ballRadius) {
            if(x < paddleX) {
                if(paddleX - x > ballRadius) {
                    alert("Game Over");
                    reset();
                }
            }
            else {
                if(x - paddleX > paddleWidth + ballRadius) {
                    alert("Game Over");
                    reset();
                }
            }
        }
        dy = -dy;
    }
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x = x + dx;
    y = y - dy;
    requestAnimationFrame(draw);
}

function reset() {
    document.location.reload();
    // paddleX = (canvas.width / 2) - (paddleWidth / 2);
    // x = canvas.width / 2;
    // y = canvas.height - ballRadius - paddleHeight;
    // score = 0;
    // document.getElementById("scoreValue").innerHTML = score;
    // for (var i = 0; i < r; i++) {
    //     for(var j = 0; j < c; j++) {
    //         collisionArray[i][j] = 0;
    //     }
    // }
    // requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

var collisionArray = new Array(r);
for (var i = 0; i < r; i++) {
    collisionArray[i] = new Array(c);
    for(var j = 0; j < c; j++) {
        collisionArray[i][j] = 0;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
draw();
