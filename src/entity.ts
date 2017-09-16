import { Point3D } from "./geometry";

const entities = Object.create(null);

export type Entity<Type extends String, Extension> = {
   id: Type;
} & Extension;

export const createEntity = <Type extends string, Extension>(
   id: Type,
   extension?: Extension
) => {
   if (entities[id] != null) {
      throw new Error("Entity already exists");
   }

   entities[id] =
      extension != null ? Object.assign({}, extension, { id }) : { id };

   return entities[id] as Entity<Type, Extension>;
};

export const extendEntity = <Type extends string, Extension1, Extension2>(
   entity: Entity<Type, Extension1>,
   extension: Extension2
) => {
   return Object.assign(entity, extension) as Entity<
      Type,
      Extension1 & Extension2
   >;
};

export type TangibleEntity<
   Type extends string,
   Extension extends { location: Point3D }
> = Entity<Type, Extension>;

export function isTangibleEntity<Type extends string, Extension>(
   point: Entity<Type, Extension>
): point is TangibleEntity<Type, Extension & { location: Point3D }> {
   return "location" in point;
}
