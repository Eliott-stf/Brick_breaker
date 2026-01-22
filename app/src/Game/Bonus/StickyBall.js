import BonusBase from './BonusBase';
import theGame from '../Game';

export default class StickyBall extends BonusBase {
    isSticky = false;
    isStuck = false;

    trigger() {
        //On passe le flag a true
        this.isSticky = true;
    }

    stickyLaunch(ball = null) {
        if (!this.isStuck) return;

        const theBall = ball ?? theGame.state.balls[0];
        if (!theBall) return;

        theBall.orientation = 90;
        theBall.speed = 7;

        this.isStuck = false;
        this.isSticky = false;
    }
}
