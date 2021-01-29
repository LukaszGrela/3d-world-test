import { nanoid } from "nanoid";
import React, { ReactNode } from "react";
import { TextureLoader } from "three";
import { BoxProps, useBox } from "use-cannon";
import create from "zustand";
import dirt from "../../assets/dirt.jpg";

export type TCubesState = {
  
  cubes: ReactNode[];
  addCube: (x: number, y: number, z: number) => void;
  hasCubeAt: (x: number, y: number, z: number) => boolean;
};

export const useCubeStore = create<TCubesState>(
  (set): TCubesState => ({
    cubes: [],
    hasCubeAt: (x, y, z): boolean => false,
    addCube: (x, y, z): void => {
      set((state) => {
        if (state.hasCubeAt(x, y, z)) return state; // ignore
        return {
          cubes: [
            ...state.cubes,
            <Cube key={nanoid()} physicsProps={{ position: [x, y, z] }} />,
          ],
        };
      });
    },
  })
);

export interface IProps {
  physicsProps?: BoxProps;
}
const Cube: React.FC<IProps> = ({ physicsProps }: IProps): JSX.Element => {
  const addCube = useCubeStore((s) => s.addCube);
  const texture = new TextureLoader().load(dirt);

  const [hover, setHover] = React.useState<number>();
  const [ref] = useBox(
    (): BoxProps => ({ type: "Static", ...(physicsProps || {}) })
  );
  return (
    <mesh
      castShadow
      receiveShadow
      ref={ref}
      onPointerMove={(e) => {
        e.stopPropagation();
        if (e.faceIndex) {
          setHover(Math.floor(e.faceIndex / 2));
          console.log("Hovered", Math.floor(e.faceIndex / 2));
        }
      }}
      onPointerOut={() => {
        setHover(undefined);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const faceIndex = e.faceIndex && Math.floor(e.faceIndex / 2);
        if (ref.current) {
          const { x, y, z } = ref.current.position;
          switch (faceIndex) {
            case 4:
              addCube(x, y, z + 1);
              break;
            case 2:
              addCube(x - 1, y, z);
              break;
            case 1:
              addCube(x - 1, y, z);
              break;
            case 5:
              addCube(x, y, z - 1);
              break;
            case 3:
              addCube(x, y - 1, z);
              break;
            case 6:
              addCube(x + 1, y, z);
              break;
          }
        }
      }}
    >
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial
          key={index}
          attachArray="material"
          map={texture}
          color={hover === index ? "grey" : "white"}
        />
      ))}
      <boxBufferGeometry attach="geometry" />
    </mesh>
  );
};

export default Cube;
