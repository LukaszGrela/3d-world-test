import React from "react";
import { extend, Object3DNode, useThree } from "react-three-fiber";
import { PointerLockControls as PointerLockControlsImpl } from "three/examples/jsm/controls/PointerLockControls";

extend({
  PointerLockControlsImpl,
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointerLockControlsImpl: Object3DNode<
        PointerLockControlsImpl,
        typeof PointerLockControlsImpl
      >;
    }
  }
}
export interface IProps
  extends Partial<
    Omit<InstanceType<typeof PointerLockControlsImpl>, "ref" | "args">
  > {}

const PointerLockControls: React.FC<IProps> = ({ ...props }: IProps) => {
  const { camera, gl } = useThree();
  const ref = React.useRef<PointerLockControlsImpl>();

  React.useEffect((): (() => void) => {
    const handler = () => {
      if (ref.current) {
        ref.current.lock();
      }
    };
    document.addEventListener("click", handler);
    return (): void => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <pointerLockControlsImpl
      ref={ref}
      args={[camera, gl.domElement]}
      {...props}
    />
  );
};

export default PointerLockControls;
