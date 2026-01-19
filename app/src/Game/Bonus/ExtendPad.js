import BonusBase from './BonusBase';
import theGame from '../Game';

export default class ExtendPad extends BonusBase {
    trigger() {
        //On modifie la taille du paddle 
        theGame.state.paddle.size.width += 50;
    }
}
