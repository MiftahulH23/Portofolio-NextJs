"use client";
import React, { useEffect, useState } from "react";
import { Color } from "three";
import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";

// 1. Definisikan tipe yang lebih spesifik untuk data GeoJSON
type GeoJsonFeature = {
  type: string;
  properties: Record<string, unknown>;
  geometry: Record<string, unknown>;
};

// ... (Tipe GlobeConfig tetap sama) ...

type WorldProps = {
  data: GeoJsonFeature[];
};

const World: React.FC<WorldProps> = ({ data }) => {
  const { scene } = useThree();

  useEffect(() => {
    const globe = new ThreeGlobe({
      waitForGlobeReady: true,
      animateIn: true,
    })
      .hexPolygonsData(data)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor("#3a228a")
      .atmosphereAltitude(0.25)
      // 2. Hapus parameter '_' yang tidak terpakai
      .hexPolygonColor(() => "#1b63c4");

    globe.rotateY(-Math.PI * (5 / 9));
    globe.rotateZ(-Math.PI / 6);

    const globeMaterial = globe.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(0x3a228a);
    globeMaterial.emissive = new Color(0x220038);
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.7;

    scene.add(globe);

    return () => {
      scene.remove(globe);
    };
  }, [data, scene]);

  return null;
};

export function GlobeDemo() {
  const [countries, setCountries] = useState({ features: [] });
  useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 3], fov: 75 }}
      >
        <ambientLight color={0xbbbbbb} intensity={0.3} />
        <directionalLight
          color={0xffffff}
          position={[-100, -100, -100]}
          intensity={0.8}
        />
        <World data={countries.features} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
