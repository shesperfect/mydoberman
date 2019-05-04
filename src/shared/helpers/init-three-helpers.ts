import { AxesHelper, Scene } from "three";

export const initThreeHelpers = (scene: Scene, axesSize?: number) => {
  const axes = new AxesHelper(axesSize);
  scene.add(axes);
};

