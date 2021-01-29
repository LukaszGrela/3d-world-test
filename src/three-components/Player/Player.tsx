import React from "react";
import { CanvasContext, useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";
import { SphereProps, useSphere } from "use-cannon";
import { useMount } from "../../hooks/use-mount";
import { usePlayerControls } from "../../hooks/usePlayerControls";
import PointerLockControls from "../PointerLockControls/PointerLockControls";

export interface IProps {
  physicsProps?: SphereProps;

  speed?: number;
  jumpSpeed?: number;
}

const SPEED = 5;
const JUMP_SPEED = 5;

const Player: React.FC<IProps> = ({
  speed = SPEED,
  jumpSpeed = JUMP_SPEED,
  physicsProps,
}: IProps): JSX.Element => {
  const movement = usePlayerControls();
  const { camera } = useThree();
  const [ref, api] = useSphere(
    (index: number): SphereProps => ({
      mass: 1,
      type: "Dynamic",
      position: [0, 10, 0],
      ...(physicsProps || {}),
    })
  );
  const velocity = React.useRef<[x: number, y: number, z: number]>([0, 0, 0]);
  useMount((): void => {
    api.velocity.subscribe(
      (v) => (velocity.current = v as [x: number, y: number, z: number])
    );
  });
  useFrame((state: CanvasContext, delta: number): void => {
    if (ref.current?.position) {
      camera.position.copy(ref.current.position);
      const direction = new Vector3();

      const frontVector = new Vector3(
        0,
        0,
        Number(movement.backward) - Number(movement.forward)
      );
      const sideVector = new Vector3(
        Number(movement.left) - Number(movement.right),
        0,
        0
      );

      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(speed)
        .applyEuler(camera.rotation);

      // apply
      api.velocity.set(direction.x, velocity.current[1], direction.z);

      // jump
      if (
        movement.jump &&
        Number(Math.abs(velocity.current[1]).toFixed(2)) < 0.05
      ) {
        // if stationary jump (vertical velocity)
        api.velocity.set(velocity.current[0], jumpSpeed, velocity.current[2]);
      }
    }
  });
  return (
    <>
      <PointerLockControls />
      <mesh ref={ref}></mesh>
    </>
  );
};

export default Player;
