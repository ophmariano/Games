let paddleWidth = 10;
let paddleHeight = 100;
let ballSize = 20;
let endSetScore = 5;

let player1Position, player2Position;
let player1Velocity, player2Velocity;
let player1SetScore, player2SetScore;
let player1Score, player2Score;


let ball, ballVelocity;

let continuousMode;

let gameWon;

let firstGame;


function logg(text, variable) {
    console.log(text + ' = ' + variable);
}

function initilizePlayers() {
    player1Position = player2Position = height / 2 - 50;
    player1Velocity = player2Velocity = 0;
    player1SetScore = player2SetScore = 0;

    if (firstGame) {
        player1Score = player2Score = 0;
        firstGame = false;
    }
}

function initializeBall(BallSpeed) {
    ball = createVector(width / 2, height / 2);
    ballVelocity = createVector(random(-1, 1), random(-1, 1));
    ballVelocity.setMag(BallSpeed);
}

function boardConfiguration() {
    textAlign(CENTER);
    fill(255);
}

function setup() {
    firstGame = true;
    createCanvas(600, 400);

    boardConfiguration();

    initilizePlayers();

    initializeBall(2);

    continuousMode = false;
    gameWon = false;
}

function reset() {
    if (continuousMode) {
        initializeBall(ballVelocity.x);
    } else {
        initializeBall(2);
    }

    if (gameWon) {
        initilizePlayers();
        initializeBall(2);
    }
}

function endOfGame(endSetScore) {

    if (player1SetScore >= endSetScore) {
        player1Score++
        gameWon = true;
    }

    if (player2SetScore >= endSetScore) {
        player2Score++
        gameWon = true;
    }

    if (gameWon) {
        continuousMode = false;
        reset();
        gameWon = false;
    }
}

function draw() {
    background(51)

    drawPaddles();

    drawBall();

    handlePaddles();

    handleBall();

    displayBoard();

    endOfGame();

    gameModeChanges();

    displayGameInfo();

    function displayBoard() {
        textSize(30);
        text("P1 | P2", width / 2, 30);
        text(player1SetScore + "  SET  " + player2SetScore, width / 2, 60);
        text(player1Score + "  GAME  " + player2Score, width / 2, 85);
    }
    function displayGameInfo() {
        textSize(10);
        text("Contine mode [C] : " + (continuousMode ? 'ON' : 'OFF') +
            " --  Set points [ + | - ] : " + endSetScore, width / 2, height - 5);

    }

    function drawPaddles() {
        rect(paddleWidth * 2, player1Position, paddleWidth, paddleHeight);
        rect(width - (paddleWidth * 3), player2Position, paddleWidth, paddleHeight);
    }

    function drawBall() {
        ellipse(ball.x, ball.y, ballSize);
    }

    function gameModeChanges() {
        if (keyIsDown(67)) {
            continuousMode = !continuousMode;
            gameWon = true;
            reset();
            gameWon = false;
        }
        if (keyIsDown(107)) {
            if (endSetScore < 9) {
                endSetScore++;
            }
        }
        if (keyIsDown(109)) {
            if (endSetScore > 1) {
                endSetScore--;
            }
        }
    }
}

function handleBall() {
    move();

    hitBonderies();

    rightPaddle();

    leftPaddle();

    function move() {
        ball.x += ballVelocity.x;
        ball.y += ballVelocity.y;
    }

    function hitBonderies() {
        if (ball.y > height - 10 || ball.y < 10) {
            ballRebot('y');
        }
    }

    function leftPaddle() {
        if (ball.x >= width - 40) {

            if (hitPaddle(player2Position)) {
                ballRebot('x');
                hitEffect(player2Position);
                return;
            }

            if (makePoint(width)) {
                player1SetScore++;

                if (continuousMode) {
                    ballRebot('x');
                    return;
                }
                reset();
            }
        }
    }

    function makePoint(distance) {
        return ball.x >= distance - 30;
    }

    function rightPaddle() {
        if (ball.x <= 40) {

            if (hitPaddle(player1Position)) {
                ballRebot('x');
                hitEffect(player1Position);
                return;
            }
            if (makePoint(60)) {
                player2SetScore++;

                if (continuousMode) {
                    ballRebot('x');
                    return;
                }
                reset();
            }
        }
    }

    function hitEffect(player) {
        if (ball.y < player + 50) {
            ballVelocity.y *= -1;
        }
    }

    function hitPaddle(player) {
        return ((ball.y > player) && (ball.y < player + 100) && (ball.x > 0));
    }

    function ballRebot(coordinate) {
        ballVelocity[coordinate] *= -1;
        if (ballVelocity.x < ballVelocity.x + 0.00000000000000340) {
            ballVelocity.mult(random(1, 1.1));
        }
    }
}

function handlePaddles() {

    moveUp();

    moveDown();

    changePosition();

    addFriction();

    constrainPaddles();

    function moveUp() {
        if (keyIsDown(83)) {
            player1Velocity += 5;
        }

        if (keyIsDown(DOWN_ARROW)) {
            player2Velocity += 5;
        }
    }

    function moveDown() {
        if (keyIsDown(87)) {
            player1Velocity -= 5;
        }

        if (keyIsDown(UP_ARROW)) {
            player2Velocity -= 5;
        }
    }

    function changePosition() {
        player1Position += player1Velocity;
        player2Position += player2Velocity;
    }

    function addFriction() {
        player1Velocity = Math.trunc(player1Velocity * 0.5);
        player2Velocity = Math.trunc(player2Velocity * 0.5);
    }

    function constrainPaddles() {
        player1Position = constrain(player1Position, 0, height - paddleHeight);
        player2Position = constrain(player2Position, 0, height - paddleHeight);
    }

}
