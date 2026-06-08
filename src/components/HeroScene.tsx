import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CoreOrb() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#38e1ff"
          emissive="#38e1ff"
          emissiveIntensity={1.1}
          metalness={0.3}
          roughness={0.2}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div style={{ width: "100%", height: "360px" }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <color attach="background" args={["#040816"]} />
        <fog attach="fog" args={["#040816", 5, 12]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[2, 2, 2]} intensity={1.4} color="#38e1ff" />
        <pointLight position={[-2, -1, 2]} intensity={0.8} color="#9f73ff" />

        <Stars radius={30} depth={40} count={1500} factor={2.5} fade speed={0.7} />
        <CoreOrb />

        <Icosahedron args={[1.6, 1]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#9f73ff" wireframe transparent opacity={0.16} />
        </Icosahedron>

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.7}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}