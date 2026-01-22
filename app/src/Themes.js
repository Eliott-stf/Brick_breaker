//import des images
//-- Briques
import brickBit from './assets/img/brick8bitSprite.png';
import brickSpace from './assets/img/brickspaceSprite.png';
//-- Bg canva
import bgSpace from './assets/img/spacecanvas.png';
import bg8bit from './assets/img/8bitcanvas.png';
//-- Balles
import ballDefault from './assets/img/ball.png';
import ballSticky from './assets/img/stickyball.png';
import ballSuper from './assets/img/superball.png';
//-- Bonus
import multiballImg from './assets/img/MultiBall.png';
import extralifeImg from './assets/img/Extralife.png';
import extendpadImg from './assets/img/ExtendPad.png';
import confusepadImg from './assets/img/ConfusePad.png';
import superballImg from './assets/img/SuperBallB.png';
import stickyballImg from './assets/img/StickyBallB.png';
import laserImg from './assets/img/Laser.png';

export const THEMES = {
    //Si des assets doivent etre modifiés plus tard a l'ajout d'un nouveau theme (pas le time de faire 8-bit ^^)
    space: {
        brick: brickSpace,
        bg: `url(${bgSpace})`,
        ball: ballDefault,
        ballSticky: ballSticky,
        ballSuper: ballSuper,
        bonuses: {
            multiball: multiballImg,
            extralife: extralifeImg,
            extendpad: extendpadImg,
            confusepad: confusepadImg,
            superball: superballImg,
            stickyball: stickyballImg,
            laser: laserImg
        }
    },
    '8bit': {
        brick: brickBit,
        bg: `url(${bg8bit})`,
        ball: ballDefault,
        ballSticky: ballSticky,
        ballSuper: ballSuper,
        bonuses: {
            multiball: multiballImg,
            extralife: extralifeImg,
            extendpad: extendpadImg,
            confusepad: confusepadImg,
            superball: superballImg,
            stickyball: stickyballImg,
            laser: laserImg
        }
    }
};