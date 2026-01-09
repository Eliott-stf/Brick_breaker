// Import de la feuille de style
import '../assets/css/style.css';
// Import des assets de sprite
import ballImgSrc from '../assets/img/ball.png';
import paddleImgSrc from '../assets/img/paddle.png';
import brickImgSrc from '../assets/img/brick.png';
import CustomMath from './CustomMath';
import Ball from './Ball';
import Vector from './DataType/Vector';
import edgeImgSrc from '../assets/img/edge.png'
import GameObject from './GameObject';
import CollisionType from './DataType/CollisionType';

class Game {
    // Contexte de dessin du canvas
    ctx;

    // Images
    images = {
        ball: null,
        paddle: null,
        brick: null,
        edge: null
    };

    // State (un objet qui décrit l'état actuel du jeu, les balles, les briques encore présentes, etc.)
    state = {
        // Balles (plusieurs car possible multiball)
        balls: [],
        //Bordure de la mort
        deathEdge: null,
        //Bordure à rebond
        bouncingEdges: [],
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
        requestAnimationFrame(this.loop.bind(this));
        // Après la boucle
    }

    // Méthodes "privées"
    initHtmlUI() {
        const elH1 = document.createElement('h1');
        elH1.textContent = 'Arkanoïd';

        const elCanvas = document.createElement('canvas');
        elCanvas.width = 800;
        elCanvas.height = 600;

        document.body.append(elH1, elCanvas);

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

        //Bord
        const imgEdge = new Image();
        imgEdge.src = edgeImgSrc;
        this.images.edge = imgEdge;
    }

    // Mise en place des objets du jeu sur la scene
    initGameObjects() {
        // Balle
        const ball = new Ball(this.images.ball, 20, 20, 45, 4);
        ball.setPosition(400, 300);
        this.state.balls.push(ball);

        // Dessin des balles
        this.state.balls.forEach(theBall => {
            theBall.draw();
        });

        //Bordure de la mort
        const deathEdge = new GameObject(this.images.edge, 800, 20);
        deathEdge.setPosition(0, 630);
        this.state.deathEdge = deathEdge;

        //On le dessine ou pas ? 

        //Bordure a rebond
        const edgeTop = new GameObject(this.images.edge, 800, 20);
        edgeTop.setPosition(0, 0);
        const edgeRight = new GameObject(this.images.edge, 20, 610);
        edgeRight.setPosition(780, 20);
        const edgeLeft = new GameObject(this.images.edge, 20, 610);
        edgeLeft.setPosition(0, 20);
        this.state.bouncingEdges.push(edgeTop, edgeRight, edgeLeft);

        //Dessin des bordures
        this.state.bouncingEdges.forEach(theEdge => {
            theEdge.draw();
        });
    }

    // Boucle d'animation
    loop() {
        // On efface tous le canvas
        this.ctx.clearRect(0, 0, 800, 600);

        //Dessin des bordures
        this.state.bouncingEdges.forEach(theEdge => {
            theEdge.draw();
        });

        // Cycle des balles
        this.state.balls.forEach(theBall => {
            theBall.update();

            //Collision de la balle avec le bord de la mort 

            //Collision de la balle avec les bord rebondissants
            this.state.bouncingEdges.forEach(theEdge => {
                const collisionType = theBall.getCollisionType(theEdge);

                switch( collisionType ){
                    case CollisionType.NONE:
                        return;

                    case CollisionType.HORIZONTAL:
                        theBall.reverseOrientationX();
                        break;
                        
                    case CollisionType.VERTICAL:
                        theBall.reverseOrientationY();
                        break;
                    
                    default:
                        break;
                }
            });
            theBall.draw();
        });

        // Appel de la frame suivante
        requestAnimationFrame(this.loop.bind(this));
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