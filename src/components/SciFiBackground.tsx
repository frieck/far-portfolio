import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function SciFiBackground() {
  return (
    <div className="r3f-bg" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: false, alpha: true }}
        resize={{ scroll: false }}
      >
        <Stars radius={40} depth={50} count={1200} factor={2.2} fade speed={0.5} />
      </Canvas>
    </div>
  );
}
