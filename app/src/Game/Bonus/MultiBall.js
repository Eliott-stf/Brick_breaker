import BonusBase from './BonusBase';
import theGame from '../Game';
import Ball from '../MovingObjects/Ball';

export default class MultiBall extends BonusBase {
    trigger(game) {

        // Récupérer la position de la balle actuelle
        const currentBall = game.state.balls[0];
        
        // On crée 5 nouvelles instances de balle 
        for (let i = 0; i < 5; i++) {
            const ballDiameter = game.config.ball.radius * 2;
            const ball = new Ball(game.images.ball, ballDiameter, ballDiameter, game.config.ball.orientation, game.config.ball.speed);
            // Même position que la balle actuelle
            //TODO: Modif la position pour faire une explositoin de balles
            ball.setPosition(currentBall.position.x + (i * 20), currentBall.position.y + (i * 15));
            ball.isCircular = true;
            game.state.balls.push(ball);
        }
    }
}
