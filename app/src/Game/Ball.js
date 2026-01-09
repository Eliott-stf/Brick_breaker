import MovingObject from "./MovingObject";
import CollisionType from "./DataType/CollisionType";

export default class ball extends MovingObject {
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