// Import de la feuille de style
import '../assets/css/style.css'
import ballImgSrc from '../assets/img/ball.png';
class Game {

    //context du dessin du canvas
    ctx;

    start() {
        console.log('jeu');
        this.initHtmlUI();

        //Temporairement: Dessin de la balle a partir d'un sprite
        //1- On créer une baluise HTML <img> qui sera jamais ajoutée au DOM
        const ballImg = new Image();
        //2- on récuère le nom de l'image génére par webpack 
        ballImg.src = ballImgSrc;
        //3- on dmd au context de dessiner cette image ds le canvas 
        ballImg.addEventListener('load', () => { this.ctx.drawImage(ballImg, 400, 300) })



    }

    //méthode 'privée'
    initHtmlUI() {
        const elH1 = document.createElement('h1');
        elH1.textContent = 'Salut';

        document.body.append(elH1);

        const elCanvas = document.createElement('canvas');
        elCanvas.width = 800;
        elCanvas.height = 600;

        document.body.append(elH1, elCanvas);

        //recupération du context de dessin
        this.ctx = elCanvas.getContext('2d');

    }
    //fonction test inutile ds le jeu
    drawTest() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fc0';
        this.ctx.arc(400, 300, 100, 0, Math.PI * 2 - Math.PI / 3);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

const theGame = new Game;
export default theGame;