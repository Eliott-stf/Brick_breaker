import BonusBase from './BonusBase';
import theGame from '../Game';
import Projectile from '../MovingObjects/Projectile';
import CollisionType from '../DataType/CollisionType';


export default class Laser extends BonusBase {
    trigger() {
        //On créer nos flag 
        this.isLaser = true;

        //flag d'input pour pas spam le projectile
        this.canShoot = true;

        //Au bout de 5 secondes on remet a false
        setTimeout(() => {
            this.isLaser = false;
        }, 5000);
    }

    //Fonction qui genere les projectiles au milieu du paddle 
    generateProjectile() {
        
        //instancie + on met sa position 
        const missile = new Projectile(theGame.images.projectile, theGame.config.projectiles.width, theGame.config.projectiles.height, 90, theGame.config.projectiles.speed)
        missile.setPosition(theGame.state.paddle.position.x + (0.5 * theGame.state.paddle.size.width) - 2.5, theGame.state.paddle.position.y)

        //on push dans le tab
        theGame.state.projectiles.push(missile);
    }

}
