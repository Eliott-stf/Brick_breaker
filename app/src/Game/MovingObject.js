import Vector from "./DataType/Vector";
import CustomMath from "./CustomMath";
import GameObject from "./GameObject";
import CollisionType from "./DataType/CollisionType";
import Bounds from "./DataType/Bounds";

export default class MovingObject extends GameObject {
    speed = 1;
    orientation = 45;
    velocity;
    isCircular = false;

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
        const radius = this.isCircular ? this.size.width / 2 : 0;
        const boundsBias = new Bounds (radius, -1 * radius, -1 * radius, radius);

        //Collision Horizontale
        if (
            (
                bounds.right >= foreignBounds.left - 1
                && bounds.right <= foreignBounds.right
                ||
                bounds.left <= foreignBounds.right + 1
                && bounds.right >= foreignBounds.left
            )
            && bounds.top + boundsBias.top >= foreignBounds.top
            && bounds.bottom + boundsBias.bottom <= foreignBounds.bottom
        ) {
            return CollisionType.HORIZONTAL;
        }

        //Collision Verticale
        else if (
            (
                bounds.top <= foreignBounds.bottom + 1
                && bounds.top >= foreignBounds.top
                ||
                bounds.bottom >= foreignBounds.top - 1
                && bounds.bottom <= foreignBounds.bottom
            )
            && bounds.left + boundsBias.left >= foreignBounds.left
            && bounds.right + boundsBias.right <= foreignBounds.right
        ) {
            return CollisionType.VERTICAL;
        }

        //Aucune collision 
        return CollisionType.NONE;

    }
}