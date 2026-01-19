import BonusBase from './BonusBase';
import theGame from '../Game';

export default class ConfusePad extends BonusBase {
 trigger() {
    //On passe le flag a true
    theGame.confusedPaddle = true;

    //Au bout de 5 secondes on remet a false
    setTimeout(() => {
        theGame.confusedPaddle = false;
    }, 5000);
}
}
