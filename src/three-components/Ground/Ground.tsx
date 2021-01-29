import React from "react";
import { RepeatWrapping, TextureLoader } from "three";
import { PlaneProps, usePlane } from "use-cannon";
import grass from "../../assets/grass.jpg";

type TPlaneArgs = [
  width?: number,
  height?: number,
  widthSegments?: number,
  heightSegments?: number
];
export interface IProps {
  planeSize?: TPlaneArgs;
  receiveShadow?: boolean;
  physicsProps?: PlaneProps;
}

const Ground: React.FC<IProps> = ({
  planeSize = [1000, 1000],
  ...props
}: IProps): JSX.Element => {
  const [ref] = usePlane(
    (): PlaneProps => ({
      rotation: [-Math.PI / 2, 0, 0],
      ...(props.physicsProps || {}),
    })
  );

  const texture = new TextureLoader().load(grass);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(240, 240);
  return (
    <mesh ref={ref} receiveShadow={props.receiveShadow}>
      <planeBufferGeometry attach="geometry" args={planeSize} />
      <meshStandardMaterial attach="material" map={texture} />
    </mesh>
  );
};

export default Ground;
