import BonusBase from './BonusBase';
import theGame from '../Game';
import Ball from '../MovingObjects/Ball';

export default class MultiBall extends BonusBase {
    trigger() {

        // On crée 5 nouvelles instances de balle 
        for (let i = 0; i < 5; i++) {
            const ballDiameter = theGame.config.ball.radius * 2;

            //On fait varié l'orientation 
            const ball = new Ball(theGame.images.ball, ballDiameter, ballDiameter, theGame.config.ball.orientation + (i * 60), theGame.config.ball.speed);

            //on positionne au meme endroit que la balle "principale"
            ball.setPosition(theGame.state.balls[0].position.x, theGame.state.balls[0].position.y);
            ball.isCircular = true;
            theGame.state.balls.push(ball);
        }
    }
}
