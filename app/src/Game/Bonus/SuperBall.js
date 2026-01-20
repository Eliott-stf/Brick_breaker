import BonusBase from './BonusBase';
import theGame from '../Game';

export default class SuperBall extends BonusBase {
    trigger() {
        //On passe le flag a true
        theGame.isSuper = true;

        //Au bout de 5 secondes on remet a false
        setTimeout(() => {
            theGame.isSuper = false;
        }, 5000);
    }
}
