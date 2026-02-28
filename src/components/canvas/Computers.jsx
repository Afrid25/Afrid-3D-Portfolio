import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

/**
 * 3D Computer model component
 * Uses useGLTF from @react-three/drei - MUST be rendered inside Canvas
 */
const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
      {/* Bright lighting for better visibility */}
      <ambientLight intensity={1.5} />
      <hemisphereLight intensity={1.5} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={2}
        castShadow={false}
        shadow-mapSize={1024}
      />
      <pointLight intensity={2} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

/**
 * 3D Canvas component for the computer model
 * All R3F hooks (useGLTF, OrbitControls, etc.) are properly inside Canvas
 * 
 * Optimizations:
 * - frameloop="demand": Only renders when needed
 * - dpr=[1, 1.5]: Limits device pixel ratio for performance  
 * - preserveDrawingBuffer={false}: Reduces memory usage
 * - shadows={false}: Disabled for better mobile performance
 * - touchAction='none': Prevents touch lag on mobile
 */
const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobile detection using media query
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows={false}
      dpr={[1, 1.5]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ 
        preserveDrawingBuffer: false,
        antialias: !isMobile,
        powerPreference: "high-performance"
      }}
      style={{
        touchAction: 'none',
        position: 'absolute',
        inset: 0
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.05}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
