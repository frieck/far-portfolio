import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function WireCore() {
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.x = t * 0.12;
      core.current.rotation.y = t * 0.18;
    }
    if (shell.current) {
      shell.current.rotation.x = -t * 0.075;
      shell.current.rotation.y = t * 0.12;
    }
  });

  return (
    <group position={[3.15, 1.05, -2.25]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#39ff88"
          emissive="#39ff88"
          emissiveIntensity={0.7}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial
          color="#12c47f"
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>
    </group>
  );
}

export default function SciFiBackground() {
  return (
    <div className="r3f-bg" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: false, alpha: true }}
        resize={{ scroll: false }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[2, 2, 3]} intensity={1.0} color="#39ff88" />
        <pointLight position={[-3, -1, 2]} intensity={0.6} color="#12c47f" />

        <Stars radius={40} depth={50} count={1200} factor={2.2} fade speed={0.5} />
        <WireCore />
      </Canvas>
    </div>
  );
}
