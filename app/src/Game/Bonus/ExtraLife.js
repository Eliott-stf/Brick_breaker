import BonusBase from './BonusBase';
import theGame from '../Game';

export default class ExtraLife extends BonusBase {
    trigger() {
        //On ajoute une vie au joueur
        theGame.state.life++;
        //console.log(theGame.state.life);
    }
}
