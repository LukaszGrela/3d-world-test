import { Sky } from "@react-three/drei";
import { Canvas } from "react-three-fiber";
import { Vector3 } from "three";
import { Physics } from "use-cannon";
import Camera from "./three-components/Camera/Camera";
import Cube, { useCubeStore } from "./three-components/Cube/Cube";
import Ground from "./three-components/Ground/Ground";
import Player from "./three-components/Player/Player";

function App() {
  const { cubes } = useCubeStore();
  return (
    <Canvas
      shadowMap
      gl={{
        alpha: false,
      }}
    >
      <Camera fov={50} />
      <Sky sunPosition={new Vector3(100, 10, 100)} />
      <ambientLight intensity={0.3} />
      <pointLight
        castShadow
        intensity={0.8}
        position={new Vector3(100, 100, 100)}
      />
      <Physics>
        <Ground />
        <Player />
        <Cube
          physicsProps={{
            position: [0, 0.5, -10],
          }}
        />
        {cubes.map((cube) => cube)}
      </Physics>
    </Canvas>
  );
}

export default App;
