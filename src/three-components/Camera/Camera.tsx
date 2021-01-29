import React from "react";
import {
  PerspectiveCameraProps,
  useThree,
} from "react-three-fiber";
import { PerspectiveCamera } from "three";

export interface IProps extends PerspectiveCameraProps {
  marker?: unknown;
}
const Camera: React.FC<IProps> = (props: IProps): JSX.Element => {
  const ref = React.useRef<PerspectiveCamera>();
  const { setDefaultCamera } = useThree();
  React.useEffect((): void => {
    if (ref.current !== undefined) {
      setDefaultCamera(ref.current);
    }
  }, [setDefaultCamera]);
  return <perspectiveCamera ref={ref} {...props} />;
};

export default Camera;
