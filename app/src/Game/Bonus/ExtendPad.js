import BonusBase from './BonusBase';
import theGame from '../Game';

export default class ExtendPad extends BonusBase {
    trigger() {
        theGame.state.paddle.size.width += 50;
    }
}
