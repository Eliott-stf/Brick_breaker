import Vector from "./DataType/Vector";
import CustomMath from "./CustomMath";
import GameObject from "./GameObject";
import CollisionType from "./DataType/CollisionType";

export default class MovingObject extends GameObject {
    speed = 1;
    orientation = 45;
    velocity;

    constructor(image, width, height, orientation, speed) {
        super(image, width, height);
        this.speed = speed;
        this.orientation = orientation;
        this.velocity = new Vector();
    }

    reverseOrientationX() {
        this.orientation = 180 - this.orientation;
    }

    reverseOrientationY() {
        this.orientation *= -1;
    }

    update() {
        let radOrientation = CustomMath.degToRad(this.orientation);
        this.velocity.x = this.speed * Math.cos(radOrientation);
        this.velocity.y = this.speed * Math.sin(radOrientation) * -1;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    getCollisionType(foreignGameObject) {
            const bounds = this.getBounds();
            const foreignBounds = foreignGameObject.getBounds();
    
            //Collision Horizontale
            if (
                (
                    bounds.right >= foreignBounds.left
                    && bounds.right <= foreignBounds.right
                    ||
                    bounds.left <= foreignBounds.right
                    && bounds.right >= foreignBounds.left
                )
                && bounds.top >= foreignBounds.top
                && bounds.bottom <= foreignBounds.bottom
            ) {
                return CollisionType.HORIZONTAL;
            }
    
            //Collision Verticale
            else if (
                (
                    bounds.top <= foreignBounds.bottom
                    && bounds.top >= foreignBounds.top
                    ||
                    bounds.bottom >= foreignBounds.top
                    && bounds.bottom <= foreignBounds.bottom
                )
                && bounds.left >= foreignBounds.left
                && bounds.right <= foreignBounds.right
            ) {
                return CollisionType.VERTICAL;
            }
    
            //Aucune collision 
            return  CollisionType.NONE;
    
        }
}