import GameObject from "./GameObject";
import theGame from "./Game";


export default class Brick extends GameObject {
    type;
    strength;

    constructor(image, width, height, strength = 1) {
        super(image, width, height);
        this.strength = strength;
        this.type = strength;
    }

    draw() {
        //On décalle de 1 pour le sprite car aux coordonnées (0;0) il y a la brique incassable 
        let sourceX = (this.size.width * this.type + this.size.width) - this.size.width;
        let sourceY = (this.size.height * this.strength) - this.size.height;

        //Si la brique est incassable, on met en DUR ses coordonées du sprite (0;0)
        if(this.strength === -1){
            sourceX = 0;
            sourceY = 0;
        }

        theGame.ctx.drawImage(
            this.image,
            sourceX,
            sourceY,
            this.size.width,
            this.size.height,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }
}