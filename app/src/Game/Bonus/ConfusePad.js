import BonusBase from './BonusBase';
import theGame from '../Game';

export default class ConfusePad extends BonusBase {
 trigger() {
    //On passe le flag a true
    this.isConfuse = true;

    //Au bout de 5 secondes on remet a false
    setTimeout(() => {
        this.isConfuse = false;
    }, 5000);
}
}
