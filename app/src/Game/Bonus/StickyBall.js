import BonusBase from './BonusBase';
import theGame from '../Game';

export default class StickyBall extends BonusBase {
    trigger() {
        //On passe le flag a true
        this.isSticky = true;
        //ball.setPosition(theGame.state.paddle.position.x, theGame.state.paddle.position.y);
        //theGame.state.balls[0].speed = 0;

    }
}
