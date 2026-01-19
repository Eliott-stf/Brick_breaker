import BonusBase from './BonusBase';
import theGame from '../Game';
import Ball from '../MovingObjects/Ball';

export default class MultiBall extends BonusBase {
    trigger() {
        
        // On crée 5 nouvelles instances de balle 
        for (let i = 0; i < 5; i++) {
            const ballDiameter = theGame.config.ball.radius * 2;
            const ball = new Ball(theGame.images.ball, ballDiameter, ballDiameter, theGame.config.ball.orientation, theGame.config.ball.speed);
            ball.setPosition(theGame.state.balls.position.x + (i * 20), theGame.state.balls.position.y - (i * 30));
            ball.isCircular = true;
            theGame.state.balls.push(ball);
        }
    }
}
