import { Entity, createEntity } from "./entity";

export interface Scene {
   nodes: Node<string, {}>[];
   root: Node<string, {}>;
}

export const createScene = () => {
   const scene = {
      nodes: [],
      root: {
         scene: null as Scene | null,
         parent: null,
         children: [],
         entity: createEntity("scene")
      }
   };

   scene.root.scene = scene as Scene;

   return scene as Scene;
};

export const addChild = <Type extends string, Extension>(
   node: Node<string, {}>,
   entity: Entity<Type, Extension>
) => {
   const child: Node<Type, Extension> = {
      scene: node.scene,
      parent: node,
      children: [],
      entity: Object.assign(Object.create(null), entity)
   };

   node.children.push(child);
   node.scene.nodes.push(child);

   return child;
};

export const removeChild = <Type extends string, Extension>(
   node: Node<Type, Extension>
) => {
   if (node.parent != null) {
      const parentIndex = node.parent.children.indexOf(node);
      node.parent.children.splice(parentIndex, 1);

      const sceneIndex = node.scene.nodes.indexOf(node);
      node.scene.nodes.splice(sceneIndex, 1);
   }
};

export interface Node<Type extends string, Extension> {
   scene: Scene;
   parent: Node<string, {}> | null;
   children: Node<string, {}>[];
   entity: Entity<Type, Extension>;
}
