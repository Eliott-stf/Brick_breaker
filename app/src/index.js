// Import de la feuille de style
import './assets/css/style.css';

console.log( 'Allez, au boulot ! 🚀' );

const elH1 = document.createElement('h1');
elH1.textContent = 'Salut';

document.body.append( elH1 );

const elCanvas = document.createElement('canvas');
elCanvas.width = 800;
elCanvas.height = 600;

document.body.append( elCanvas );