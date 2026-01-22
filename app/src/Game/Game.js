// Import de la feuille de style
import '../assets/css/style.css';
//Import de données de configuration et levels
import customConfig from '../config.json'
import levelsConfig from '../levels.json'
// Import des assets de sprite
import { THEMES } from '../Themes.js';
import paddleImgSrc from '../assets/img/padSprite.png';
import edgeImgSrc from '../assets/img/edge.png';
import projectileImgSrc from '../assets/img/projectile.png';
//import des classes des elements du canvas
import Ball from './MovingObjects/Ball';
import GameObject from './GameObjects/GameObject';
import CollisionType from './DataType/CollisionType';
import Paddle from './MovingObjects/Paddle';
import Brick from './GameObjects/Brick';
import Bonus from './MovingObjects/Bonus';
//Import des classes de bonus
import ExtendPad from './Bonus/ExtendPad';
import MultiBall from './Bonus/MultiBall';
import ExtraLife from './Bonus/ExtraLife';
import ConfusePad from './Bonus/ConfusePad';
import SuperBall from './Bonus/SuperBall';
import StickyBall from './Bonus/StickyBall';
import Laser from './Bonus/Laser';



class Game {

    //Config
    config = {
        canvasSize: {
            width: 800,
            height: 600
        },
        ball: {
            radius: 10,
            orientation: 45,
            speed: 3,
            angleAlteration: 30,
            position: {
                x: 400,
                y: 300
            }
        },
        paddleSize: {
            width: 100,
            height: 20
        },
        bonus: {
            width: 30,
            height: 15,
            speed: 1,
            spawnrate: 0.1
        },
        projectiles: {
            width: 5,
            height: 18,
            speed: 10,
        }
    };

    //Data des niveaux 
    levels;
    levelIndex = 0;

    //Theme PAR DEFAULT 
    selectedTheme = 'space'

    // Contexte de dessin du canvas
    ctx;

    // Élément du score
    scoreElement;

    // Références des modales et scores
    scoreTextVictory;
    scoreTextDefeat;
    lifeElement;

    //Animation
    previousLoupStamp;
    currentLoopStamp;

    // Images
    images = {
        ball: null,
        paddle: null,
        brick: null,
        edge: null,
        bonus: null,
        projectile: null
    };

    // State (un objet qui décrit l'état actuel du jeu, les balles, les briques encore présentes, etc.)
    state = {
        //Score
        score: 0,
        //Vie
        life: 3,
        // Balles (plusieurs car possible multiball)
        balls: [],
        //Les briques
        bricks: [],
        // Bordure de la mort
        deathEdge: null,
        // Bordures à rebond
        bouncingEdges: [],
        // Paddle
        paddle: null,
        //Bonus
        bonus: [],
        //Projectiles
        projectiles: [],
        // Entrées utilisateur
        userInput: {
            paddleLeft: false,
            paddleRight: false,
            paddleUp: false
        }
    };

    constructor(customConfig = {}, levelsConfig = []) {
        Object.assign(this.config, customConfig);
        this.levels = levelsConfig;

        // On instancie les effets 
        this.bonusEffect = {
            multiball: new MultiBall(),
            extralife: new ExtraLife(),
            extendpad: new ExtendPad(),
            confusepad: new ConfusePad(),
            superball: new SuperBall(),
            stickyball: new StickyBall(),
            laser: new Laser()
        };
    }

    // Méthodes "privées"
    initHtmlUI() {

        // Créer le canva
        const elCanvas = document.createElement('canvas');
        elCanvas.width = this.config.canvasSize.width;
        elCanvas.height = this.config.canvasSize.height;
        this.ctx = elCanvas.getContext('2d');
        document.body.append(elCanvas);

        // Récupération du span du score
        const elScore = document.getElementById('score');
        this.scoreElement = elScore;

        // Récupération du span des vies
        const elLife = document.getElementById('life');
        this.lifeElement = elLife;

        // Récupération des Modales
        //-- Victoire
        const elModalV = document.getElementById('modal-win');
        const elScoreTextV = document.getElementById('score-victory');
        this.scoreTextVictory = elScoreTextV;
        //-- Defaite
        const elModalD = document.getElementById('modal-loose');
        const elScoreTextD = document.getElementById('score-defeat');
        this.scoreTextDefeat = elScoreTextD;
        //-- Menu
        const elModalM = document.getElementById('modal-menu');

        //Récupération des Btn
        const elBtnContinue = document.getElementById('btn-continue');
        const elBtnRetry = document.getElementById('btn-retry');
        const elBtnMenuVictory = document.getElementById('btn-menu-victory');
        const elBtnMenuLoose = document.getElementById('btn-menu-loose');
        const elBtnPlay = document.getElementById('btn-play');

        // Récupération des cartes de thème
        const themeCards = document.querySelectorAll('.theme-card');

        // Écouteur d'évènements du clavier
        document.addEventListener('keydown', this.handlerKeyboard.bind(this, true));
        document.addEventListener('keyup', this.handlerKeyboard.bind(this, false));

        // Gestion de la sélection des thèmes
        themeCards.forEach(card => {
            card.addEventListener('click', () => {
                // Retire la classe active de toutes les cartes
                themeCards.forEach(c => c.classList.remove('active'));
                // Ajoute la classe active à la carte cliquée
                card.classList.add('active');
                // Stocke le thème sélectionné
                this.selectedTheme = card.dataset.theme;
                // Mets à jour le background du canvas selon le thème
                const themeBg = THEMES[this.selectedTheme].bg;
                document.documentElement.style.setProperty('--canvas-bg', themeBg);
            });
        });

        // Écouteur de click sur Boutons des modales
        // -- Btn de Victory
        elBtnContinue.addEventListener('click', () => {
            //On passe au prochain niveau
            this.levelIndex++;

            //On restart notre jeu avec le niveau niveau 
            this.start();

            //On cache la modale
            elModalV.classList.add('hidden');
        });

        // -- Btn de Loose
        elBtnRetry.addEventListener('click', () => {
            //On restart notre jeu au niveau 1 
            this.start(this.levelIndex = 0);

            //On cache la modale
            elModalD.classList.add('hidden');
        });

        //Btn du menu (victoire)
        elBtnMenuVictory.addEventListener('click', () => {
            //On affiche la modale MENU
            this.showMenuModal();

            //On cache les modales
            elModalD.classList.add('hidden');
            elModalV.classList.add('hidden');
        });

        //Btn du menu (défaite)
        elBtnMenuLoose.addEventListener('click', () => {
            //On affiche la modale MENU
            this.showMenuModal();

            //On cache les modales
            elModalD.classList.add('hidden');
            elModalV.classList.add('hidden');
        });

        //Btn qui lance le jeu 
        elBtnPlay.addEventListener('click', () => {
            //On cache la modale du menu 
            elModalM.classList.add('hidden');

            //On lance le jeu au niveau 1 
            this.start(this.levelIndex = 0);
        });
    }

    start() {
        //On 'ré' initialise le state et on charge le niveau
        this.initGame();
        //On clear le canvas si il existe 
        this.clearCanvas();
        // Initialisation des images
        this.initImages();
        // Initialisation des objets du jeu
        this.initGameObjects(this.levelIndex);
        // Lancement de la boucle
        requestAnimationFrame(this.loop.bind(this));
    }

    //Initialisation 
    initGame() {
        //On clear le state 
        this.state.score = 0;
        this.state.life = 3;
        this.state.balls = [];
        this.state.bricks = [];
        this.state.bouncingEdges = [];
        this.state.bonus = [];
        this.state.projectiles = [];
    }

    // Réinitialisation d'une manche en gardant les vies
    resetRound() {
        this.state.bouncingEdges = [];
        this.initGameObjects(this.levelIndex, false);
    }

    // Update de l'affichage des vies 
    updateLife() {
        if (this.lifeElement) {
            this.lifeElement.textContent = this.state.life;
        }
    }

    //On remet le canva au propre
    clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.config.canvasSize.width, this.config.canvasSize.height);
        }
    }

    // Création des images
    initImages() {
        // Balle 
        this.images.ball = new Image();

        // Paddle
        const imgPaddle = new Image();
        imgPaddle.src = paddleImgSrc;
        this.images.paddle = imgPaddle;

        // Brique
        const imgBrick = new Image();
        imgBrick.src = THEMES[this.selectedTheme].brick;
        this.images.brick = imgBrick;

        // Bordure
        const imgEdge = new Image();
        imgEdge.src = edgeImgSrc;
        this.images.edge = imgEdge;


        //Projectile
        const imgProjectile = new Image();
        imgProjectile.src = projectileImgSrc;
        this.images.projectile = imgProjectile;
    }

    // Mise à jour de l'image de la balle selon les bonus actifs
    updateBallImage() {
        let newSrc;

        if (this.bonusEffect.superball.isSuper) {
            newSrc = THEMES[this.selectedTheme].ballSuper;
        } else if (this.bonusEffect.stickyball.isSticky) {
            newSrc = THEMES[this.selectedTheme].ballSticky;
        } else {
            newSrc = THEMES[this.selectedTheme].ball;
        }

        // Ne change l'image que si le src a changé
        if (this.images.ball.src !== newSrc) {
            this.images.ball.src = newSrc;

            // Mise à jour de l'image pour toutes les balles existantes
            this.state.balls.forEach(ball => {
                ball.image.src = newSrc;
            });
        }
    }

    // Mise en place des objets du jeu sur la scene
    initGameObjects(levelIndex, isNewLevel = true) {
        // Balle
        const ballDiamater = this.config.ball.radius * 2;
        const ball = new Ball(this.images.ball, ballDiamater, ballDiamater, this.config.ball.orientation, this.config.ball.speed);
        ball.setPosition(this.config.ball.position.x, this.config.ball.position.y);
        ball.isCircular = true;
        this.state.balls.push(ball);

        // Bordure de la mort
        const deathEdge = new GameObject(this.images.edge, this.config.canvasSize.width, 20);
        deathEdge.setPosition(0, this.config.canvasSize.height + 30);
        this.state.deathEdge = deathEdge;

        // Bordure à rebond
        //-- Haut
        const edgeTop = new GameObject(this.images.edge, this.config.canvasSize.width, 20);
        edgeTop.setPosition(0, 0);
        //-- Right
        const edgeRight = new GameObject(this.images.edge, 20, this.config.canvasSize.height + 10);
        edgeRight.setPosition(this.config.canvasSize.width - 20, 20);
        edgeRight.tag = 'RightEdge';
        //-- Left
        const edgeLeft = new GameObject(this.images.edge, 20, this.config.canvasSize.height + 10);
        edgeLeft.setPosition(0, 20);
        edgeLeft.tag = 'LeftEdge';

        //Ajout dans la listes des bords 
        this.state.bouncingEdges.push(edgeTop, edgeRight, edgeLeft);

        // Paddle
        const paddle = new Paddle(this.images.paddle, this.config.paddleSize.width, this.config.paddleSize.height, 0, 0);
        paddle.setPosition((this.config.canvasSize.width / 2) - (this.config.paddleSize.width / 2), this.config.canvasSize.height - this.config.paddleSize.height - 20);
        this.state.paddle = paddle;

        //Chargement des briques ssi c'est un nouveau niveau
        if (isNewLevel) {
            this.loadBricks(this.levels.data[levelIndex]);
        }
    }

    //Création des briques 
    loadBricks(levelArray) {
        //Boucle de generation Lignes & Colonnes 
        for (let line = 0; line < levelArray.length; line++) {
            for (let column = 0; column < levelArray[line].length; column++) {
                let brickType = levelArray[line][column];
                //SI valeur trouvé = 0 -> espace vide on bouge a la suivante 
                if (brickType == 0) continue;

                //Si on a bien une brique, on la crée et on la met dans le state 
                const brick = new Brick(this.images.brick, 50, 19, brickType);
                brick.setPosition(20 + (50 * column), (line * 19) + 20);

                this.state.bricks.push(brick);
            }
        }
    }

    //Affichage des Modales
    showMenuModal() {
        const modalMenu = document.getElementById('modal-menu');
        modalMenu.classList.remove('hidden');
    }
    // -- Victoire
    showVictoryModal() {
        this.scoreTextVictory.textContent = `Score: ${this.state.score}`;
        const modalWin = document.getElementById('modal-win');
        modalWin.classList.remove('hidden');
    }

    //-- Defaite
    showLooseModal() {
        this.scoreTextDefeat.textContent = `Score: ${this.state.score}`;
        const modalLoose = document.getElementById('modal-loose');
        modalLoose.classList.remove('hidden');
    }

    // Cycle de vie: 1- Entrées Utilisateur
    checkUserInput() {

        //On stocker les inputs dans des variables
        let inputRight = this.state.userInput.paddleRight;
        let inputLeft = this.state.userInput.paddleLeft;
        const inputUp = this.state.userInput.paddleUp;

        //Si le flag du bonus est activé, on inverse les commandes 
        if (this.bonusEffect.confusepad.isConfuse) {
            inputRight = this.state.userInput.paddleLeft;
            inputLeft = this.state.userInput.paddleRight;
        }

        // -- Paddle
        // On analyse quel commande de mouvement est demandée pour le paddle
        // Droite
        if (inputRight) {
            this.state.paddle.orientation = 0;
            this.state.paddle.speed = 7;
        }
        // Gauche
        if (inputLeft) {
            this.state.paddle.orientation = 180;
            this.state.paddle.speed = 7;
        }
        // Ni Droite Ni Gauche
        if (!inputRight && !inputLeft) {
            this.state.paddle.speed = 0;
        }

        //Haut
        //Actif que si le bonus 'Laser' est activé 
        if (inputUp && this.bonusEffect.laser.isLaser) {

            //Flag pour pas spam
            if (this.bonusEffect.laser.canShoot) {
                //On genere via la méthode de la classe du Bonus (Laser)
                this.bonusEffect.laser.generateProjectile();

                //On remet a false le flag pour ne tirer qu'un projectile
                this.bonusEffect.laser.canShoot = false;
            }
        } else {
            // Réinitialisation dès que la touche est relâchée
            this.bonusEffect.laser.canShoot = true;
        }

        //Si bonus StickyBall activé
        if (inputUp && this.bonusEffect.stickyball.isStuck) {

            // On lance TOUTES les balles collées 
            this.state.balls.forEach(theBall => {
                this.bonusEffect.stickyball.stickyLaunch(theBall);
            });
        }

        // Mise à jour de la position
        this.state.paddle.update();
    }

    // Cycle de vie: 2- Collisions et calculs qui en découlent
    checkCollisions() {

        // Collisions du paddle avec les bords
        this.state.bouncingEdges.forEach(theEdge => {
            const collisionType = this.state.paddle.getCollisionType(theEdge);

            // Si aucune collision ou autre que horizontal, on passe au edge suivant
            if (collisionType !== CollisionType.HORIZONTAL) return;

            // Si la collision est horizontale, on arrête la vitesse du paddle
            this.state.paddle.speed = 0;

            // On récupère les limites de theEdge
            const edgeBounds = theEdge.getBounds();

            // Si on a touché la bordure de droite
            if (theEdge.tag === "RightEdge") {
                this.state.paddle.position.x = edgeBounds.left - 1 - this.state.paddle.size.width;
            }
            // Si on a touché la bordure de gauche
            else if (theEdge.tag === "LeftEdge") {
                this.state.paddle.position.x = edgeBounds.right + 1;
            }

            // Mise à jour de la position
            this.state.paddle.update();
        });

        //Collisions des bonus avec le paddle 
        this.state.bonus.forEach(theBonus => {
            const bonusCollisionType = theBonus.getCollisionType(this.state.paddle);

            // Si la collision est Horizontale ou Verticale 
            if (bonusCollisionType !== CollisionType.NONE) {

                //On supprimer le bonus du state
                this.state.bonus = this.state.bonus.filter(bonus => bonus !== theBonus);

                //On applique l'effet du bonus
                this.bonusEffect[theBonus.type].trigger(this);
            }
        });

        //Collisions des projectiles avec les briques 
        this.state.projectiles.forEach(theProjectile => {

            this.state.bricks.forEach(theBrick => {
                const collisionType = theProjectile.getCollisionType(theBrick);

                // Si la collision est Horizontale ou Verticale 
                if (collisionType !== CollisionType.NONE) {

                    //Si c'est une brique cassable
                    if (theBrick.strength !== -1) {
                        //On décremente sa strength 
                        theBrick.strength--;
                    }

                    //On supprime le projectile du state 
                    this.state.projectiles = this.state.projectiles.filter(projectile => projectile !== theProjectile);
                }
            })
        })


        // Collisions des balles avec tous les objets
        // On crée un tableau pour stocker les balles non-perdues
        const savedBalls = [];

        this.state.balls.forEach(theBall => {

            // Collision de la balle avec le bord de la mort
            if (theBall.getCollisionType(this.state.deathEdge) !== CollisionType.NONE) {
                return;
            }

            // On sauvegarde la balle en cours (car si on est là, c'est qu'on a pas tapé le bord de la mort)
            savedBalls.push(theBall);

            // Collisions de la balle avec les bords rebondissants
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

            //TODO: A modifer pour les briques incassables
            // Collisions de la balle avec les briques
            this.state.bricks.forEach(theBrick => {
                const collisionType = theBall.getCollisionType(theBrick);

                // Si SuperBall, plus de collisions 
                if (this.bonusEffect.superball.isSuper) {
                    if (collisionType !== CollisionType.NONE && theBrick.strength !== -1) {
                        theBrick.strength = 0;
                        this.state.score = this.state.score + theBrick.strength * 1000;
                        this.scoreElement.textContent = this.state.score;
                    }
                    return;
                }

                // Sinon comportement normal
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

                //Ici on a forcement une collision car la premiere clause du switch fait un return
                //Decrement du compteur de strenght
                //Inutile dans notre cas, mais on déceremente uniquement les briques cassables 
                if (theBrick.strength !== -1) {
                    theBrick.strength--;

                    //On incrémente le score a chaque collision avec une brique cassable
                    this.state.score = this.state.score + 1000;
                    this.scoreElement.textContent = this.state.score;
                }

            });


            // Collision avec le paddle
            const paddleCollisionType = theBall.getCollisionType(this.state.paddle);

            //Si le bonus stickyball est activé 
            if (this.bonusEffect.stickyball.isSticky && !this.bonusEffect.stickyball.isStuck) {

                //Si ya collision Horizontale ou Verticale
                if (paddleCollisionType !== CollisionType.NONE) {

                    //flag
                    this.bonusEffect.stickyball.isStuck = true;

                    //On fixe sa position a au centre du paddle 
                    theBall.setPosition(this.state.paddle.position.x + (0.5 * this.state.paddle.size.width - 10), this.state.paddle.position.y - 25)

                    //On la rend inerte 
                    theBall.orientation = 0;
                    theBall.speed = 0;

                    return;
                }
            }



            switch (paddleCollisionType) {
                case CollisionType.HORIZONTAL:
                    theBall.reverseOrientationX();
                    break;

                case CollisionType.VERTICAL:
                    // Altération de l'angle en fonction du movement du paddle
                    let alteration = 0;
                    if (this.state.userInput.paddleRight)
                        alteration = -1 * this.config.ball.angleAlteration;
                    else if (this.state.userInput.paddleLeft)
                        alteration = this.config.ball.angleAlteration;

                    theBall.reverseOrientationY(alteration);

                    // Correction pour un résultat de 0 et 180 pour éviter une trajectoire horizontale
                    if (theBall.orientation === 0)
                        theBall.orientation = 10;
                    else if (theBall.orientation === 180)
                        theBall.orientation = 170;

                    break;

                default:
                    break;
            }
        });

        // Mise à jour du state.balls avec savedBalls
        this.state.balls = savedBalls;

    }

    //Intermediare fonction pour generer des bonus aléatoirement 
    getRandomBonus() {
        const bonusTypes = Object.keys(this.bonusEffect);
        return bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
    }

    // Cycle de vie: 3- Mise à jours des données des GameObjects
    updateObjects() {

        // Balles
        this.state.balls.forEach(theBall => {
            if (this.bonusEffect.stickyball.isStuck && theBall.speed === 0) {
                theBall.setPosition(
                    this.state.paddle.position.x + (0.5 * this.state.paddle.size.width - 10),
                    this.state.paddle.position.y - 25
                );
                return;
            }
            theBall.update();
        });

        // Mise à jour de l'image selon les bonus 
        this.updateBallImage();


        //Briques
        //Avant de les supprimer, on crée un bonus à la position de la brique si elles ont strength === 0
        this.state.bricks.forEach(theBrick => {
            if (theBrick.strength === 0 && Math.random() < this.config.bonus.spawnrate) {
                // On met a jour son type aleatoirement d'abord
                const bonusType = this.getRandomBonus();

                // Récupérer l'image du bonus selon son type
                const bonusImage = new Image();
                bonusImage.src = THEMES[this.selectedTheme].bonuses[bonusType];

                // Création du Bonus avec la bonne image
                const bonus = new Bonus(
                    bonusImage,
                    this.config.bonus.width,
                    this.config.bonus.height,
                    -90,
                    this.config.bonus.speed
                );

                //Position au centre de la brique 
                bonus.setPosition(
                    theBrick.position.x + (theBrick.size.width / 2) - (this.config.bonus.width / 2),
                    theBrick.position.y + (theBrick.size.height / 2) - (this.config.bonus.height / 2)
                );

                // Assigner le type
                bonus.type = bonusType;
                console.log(bonus.type);

                //On push dans le tab 
                this.state.bonus.push(bonus);

            }
        });

        //On conserve dans le state que les briques dont strength != 0 
        this.state.bricks = this.state.bricks.filter(theBrick => theBrick.strength !== 0);


        //Paddle 
        this.state.paddle.updateKeyframe();

        //Bonus
        this.state.bonus.forEach(theBonus => {
            theBonus.update();
        })

        //Projectile
        this.state.projectiles.forEach(theProjectile => {
            theProjectile.update();
        })


    }

    // Cycle de vie: 4- Rendu graphique des GameObjects
    renderObjects() {
        // On efface tous le canvas
        this.ctx.clearRect(
            0,
            0,
            this.config.canvasSize.width,
            this.config.canvasSize.height
        );

        // Dessin des bordures à rebond
        this.state.bouncingEdges.forEach(theEdge => {
            theEdge.draw();
        });

        // Dessin des briques
        this.state.bricks.forEach(theBrick => {
            theBrick.draw();
        });

        // Dessin du paddle
        this.state.paddle.draw();

        // Dessin des balles
        this.state.balls.forEach(theBall => {
            theBall.draw();
        });

        //Dessin des bonus
        this.state.bonus.forEach(theBonus => {
            theBonus.draw();
        })

        //Dessin des projectiles
        this.state.projectiles.forEach(theProjectile => {
            theProjectile.draw();
        })

    }

    // Boucle d'animation
    loop(stamp) {
        //Enregistrement du stamp actuel
        this.currentLoopStamp = stamp;

        // Cycle 1
        this.checkUserInput();

        // Cycle 2
        this.checkCollisions();

        // Cycle 3
        this.updateObjects();

        // Cycle 4
        this.renderObjects();

        // S'il n'y a aucune balle restante, on a perdu une vie
        if (this.state.balls.length <= 0) {
            this.state.life--;
            this.updateLife();

            if (this.state.life <= 0) {
                //On montre la modale de défaite
                this.showLooseModal();
                // On sort de loop()
                return;
            }

            // Relancer la manche avec le même niveau
            this.resetRound();
            // On relance la boucle
            requestAnimationFrame(this.loop.bind(this));
            return;
        }

        //S'il n'y a plus de brique, on passe au lvl suivant
        const destructibleBricks = this.state.bricks.filter(theBrick => theBrick.strength > 0);
        const destructedBricks = this.state.bricks.filter(theBrick => theBrick.strength === 0);

        if (destructibleBricks.length === 0) {
            //Affiche la modal de victoire 
            this.showVictoryModal();

            // On sort de loop()
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

    // Gestionnaires d'événement DOM
    handlerKeyboard(isActive, evt) {
        // Pour certains navigateurs anciens les noms sont différents, la doc :
        // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

        // Flèche droite
        if (evt.key === 'Right' || evt.key === 'ArrowRight') {
            // Si on souhaite activer "droite" mais que gauche est déjà activé, on désactive gauche
            if (isActive && this.state.userInput.paddleLeft)
                this.state.userInput.paddleLeft = false;

            this.state.userInput.paddleRight = isActive;
        }
        // Flèche gauche
        else if (evt.key === 'Left' || evt.key === 'ArrowLeft') {
            // Si on souhaite activer "gauche" mais que droite est déjà activé, on désactive droite
            if (isActive && this.state.userInput.paddleRight)
                this.state.userInput.paddleRight = false;

            this.state.userInput.paddleLeft = isActive;
        }

        //Fleche du Haut 
        else if (evt.key == 'Up' || evt.key === 'ArrowUp') {
            this.state.userInput.paddleUp = isActive;
        }
    }
}
const theGame = new Game(customConfig, levelsConfig);

export default theGame;
