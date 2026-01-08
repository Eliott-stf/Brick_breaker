// Import de la feuille de style
import '../assets/css/style.css';
// Import des assets de sprite
import ballImgSrc from '../assets/img/ball.png';
import paddleImgSrc from '../assets/img/paddle.png';
import brickImgSrc from '../assets/img/brick.png';
import CustomMath from './CustomMath';
import Ball from './Ball';
import Vector from './DataType/Vector';

class Game
{
    // Contexte de dessin du canvas
    ctx;

    // Images
    images = {
        ball: null,
        paddle: null,
        brick: null
    };

    // State (un objet qui décrit l'état actuel du jeu, les balles, les briques encore présentes, etc.)
    state = {
        // Balles (plusieurs car possible multiball)
        balls: [],
        // Paddle
        paddle: null
    };

    start() {
        console.log('Jeu démarré ...');
        // Initialisation de l'interface HTML
        this.initHtmlUI();
        // Initialisation des images
        this.initImages();
        // Initialisation des objets du jeu
        this.initGameObjects();
        // Lancement de la boucle
        requestAnimationFrame( this.loop.bind(this) );
        // Après la boucle
    }

    // Méthodes "privées"
    initHtmlUI() {
        const elH1 = document.createElement('h1');
        elH1.textContent = 'Arkanoïd';

        const elCanvas = document.createElement( 'canvas' );
        elCanvas.width = 800;
        elCanvas.height = 600;
        
        document.body.append( elH1, elCanvas );

        // Récupération du contexte de dessin
        this.ctx = elCanvas.getContext('2d');
    }

    // Création des images
    initImages() {
        // Balle
        const imgBall = new Image();
        imgBall.src = ballImgSrc;
        this.images.ball = imgBall;

        // Paddle
        const imgPaddle = new Image();
        imgPaddle.src = paddleImgSrc;
        this.images.paddle = imgPaddle;

        // Brique
        const imgBrick = new Image();
        imgBrick.src = brickImgSrc;
        this.images.brick = imgBrick;
    }

    // Mise en place des objets du jeu sur la scene
    initGameObjects() {
        // Balle
        const ball = new Ball(this.images.ball, 20, 20, 45, 4);
        ball.setPosition( 400, 300 );
        this.state.balls.push( ball );

        // Dessin des balles
        this.state.balls.forEach( theBall => {
            theBall.draw();
        });
    }

    // Boucle d'animation
    loop() {
        // On efface tous le canvas
        this.ctx.clearRect( 0, 0, 800, 600 );

        // Cycle des balles
        this.state.balls.forEach( theBall => {
            theBall.update();

            const bounds = theBall.getBounds();
            // TODO: en mieux : Détection des collisions
            // Collision avec le côté droite ou gauche de la scène : Inversion du X de la velocité
            if( bounds.right >= 800 || bounds.left <= 0 ) {
                theBall.reverseOrientationX();
            }
            // Collision avec le côté bas ou haut de la scène : Inversion du Y de la velocité
            if( bounds.bottom >= 600 || bounds.top <= 0 ) {
                theBall.reverseOrientationY();
            }

            theBall.draw();
        });

        // Appel de la frame suivante
        requestAnimationFrame( this.loop.bind(this) );
    }

    // Fonction de test inutile dans le jeu
    drawTest() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fc0';
        this.ctx.arc(400, 300, 100, 0, Math.PI * 2 - Math.PI / 3);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

const theGame = new Game();

export default theGame;