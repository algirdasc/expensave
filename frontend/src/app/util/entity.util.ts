import {EntityInterface} from '../api/entities/entity.interface';

// TODO: deprecated
export class EntityUtil {
    public static replaceInArray(entityArray: EntityInterface[], entity: EntityInterface): void {
        const index = entityArray.findIndex((e: EntityInterface) => e.id === entity.id);
        if (index !== -1) {
            entityArray[index] = entity;
        }
    }
}
