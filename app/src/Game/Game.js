// Import de la feuille de style
import '../assets/css/style.css';
// Import des assets de sprite
import ballImgSrc from '../assets/img/ball.png';
import paddleImgSrc from '../assets/img/paddle.png';
import brickImgSrc from '../assets/img/brick.png';
import CustomMath from './CustomMath';
import Ball from './Ball';
import Paddle from './Paddle';
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
        paddle: null,
        // Entrée utilisateur 
        userInput: {
            paddleRight: false,
            paddleLeft: false
        }
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

        //Ecouteur d'évenement du clavier
        document.addEventListener('keydown', this.handlerKeyboard.bind(this, true));
        document.addEventListener('keyup', this.handlerKeyboard.bind(this, false));
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
        edgeRight.tag = 'RightEdge';
        const edgeLeft = new GameObject(this.images.edge, 20, 610);
        edgeLeft.setPosition(0, 20);
        edgeLeft.tag = 'LeftEdge';

        this.state.bouncingEdges.push(edgeTop, edgeRight, edgeLeft);

        //Dessin des bordures
        this.state.bouncingEdges.forEach(theEdge => {
            theEdge.draw();
        });

        //Paddle
        const paddle = new Paddle(this.images.paddle, 100, 20, 0, 0);
        paddle.setPosition(350, 560);
        this.state.paddle = paddle;
    }

    // Boucle d'animation
    loop() {
        // On efface tous le canvas
        this.ctx.clearRect(0, 0, 800, 600);

        //Dessin des bordures
        this.state.bouncingEdges.forEach(theEdge => {
            theEdge.draw();
        });

        //Cycle du paddle
        //On analyse quel commande de mouvement est demandée pour le paddle
        // Droite
        if (this.state.userInput.paddleRight) {
            this.state.paddle.orientation = 0;
            this.state.paddle.speed = 7;
        }
        // Gauche
        if (this.state.userInput.paddleLeft) {
            this.state.paddle.orientation = 0;
            this.state.paddle.speed = -7;
        }
        // Ni gauche ni droite
        if (!this.state.userInput.paddleLeft && !this.state.userInput.paddleRight) {
            this.state.paddle.orientation = 0;
            this.state.paddle.speed = 0;
        }

        //Mise a jour de la position
        this.state.paddle.update();

        //Collision avec les bord, deplacement...
        this.state.bouncingEdges.forEach(theEdge => {
            const collisionType = this.state.paddle.getCollisionType(theEdge);

            //si aucune collision autre que HORIZONTALE, on passe au edge suivant
            if (collisionType !== CollisionType.HORIZONTAL) return;
            
            //Si la collision est horizontale, on arrete la vitesse du paddle
            this.state.paddle.speed = 0;
            const edgeBounds = theEdge.getBounds();

            //Si on a touché la bordure de droite
            if(theEdge.tag === "RightEdge"){
                this.state.paddle.position.x = edgeBounds.left - 1 - this.state.paddle.size.width;
            }
            //Si on a touché la bordure de gauche
            else if (theEdge.tag === "LeftEdge"){
                this.state.paddle.position.x = edgeBounds.right + 1;
            }
            //On remet a jour le paddle
            this.state.paddle.update();

        });

        //Dessin du paddle
        this.state.paddle.draw();

        // Cycle des balles
        //On creer un TAB pour stocker les balles non perdues
        const saveBalls = [];

        this.state.balls.forEach(theBall => {
            theBall.update();

            //Collision de la balle avec le bord de la mort 
            if (theBall.getCollisionType(this.state.deathEdge) !== CollisionType.NONE) {
                return;
            }

            //On sauvegarde la balle en cour
            saveBalls.push(theBall);

            //Collision de la balle avec les bord rebondissants
            this.state.bouncingEdges.forEach(theEdge => {
                const collisionType = theBall.getCollisionType(theEdge);

                switch (collisionType) {
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

        //Mise a jour du state.ball 
        this.state.balls = saveBalls;

        //S'il n'y a aucune balle, on a perdu 
        if (this.state.balls.length <= 0) {
            console.log("ECHOUEEEEEEEEEEEEE");
            //On sort de la loop
            return;

        }

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

    //Gestionnaire d'évenement DOM
    handlerKeyboard(isActive, evt) {

        //Fleche droite
        if (evt.key === 'Right' || evt.key === 'ArrowRight') {
            if (isActive && this.state.userInput.paddleLeft)
                this.state.userInput.paddleLeft = false;

            this.state.userInput.paddleRight = isActive;
        }
        //Fleche gauche
        else if (evt.key === 'Left' || evt.key === 'ArrowLeft') {
            if (isActive && this.state.userInput.paddleRight)
                this.state.userInput.paddleRight = false;

            this.state.userInput.paddleLeft = isActive;
        }
    }
}

const theGame = new Game();

export default theGame;