import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Satellite,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Maximize2,
  Minimize2,
  Compass,
  Trees,
  TrendingUp,
  ShieldCheck,
  Info,
  Plus,
  Minus,
  Eye,
  Activity,
  ArrowRight,
  Radio,
  FileCheck2,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { Language } from '../types';
import { useToast } from '../context/ToastContext';

interface TreeReplanting3DSimulationProps {
  lang: Language;
  onExplorePipeline?: () => void;
}

interface TreeObject {
  group: THREE.Group;
  trunk: THREE.Mesh;
  foliageParts: THREE.Mesh[];
  originalScales: THREE.Vector3[];
  maxScale: number;
  seedX: number;
  seedZ: number;
  growthDelay: number;
}

type CameraPreset = 'orbit' | 'nadir' | 'surveyor' | 'isometric';

export const TreeReplanting3DSimulation: React.FC<TreeReplanting3DSimulationProps> = ({
  lang,
  onExplorePipeline,
}) => {
  const { toast } = useToast();
  const mountRef = useRef<HTMLDivElement>(null);
  const [growthProgress, setGrowthProgress] = useState<number>(0.35); // 0 to 1 (default Year 2)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x or 2x
  const [spectralMode, setSpectralMode] = useState<'true_color' | 'ndvi'>('true_color');
  const [activeCameraPreset, setActiveCameraPreset] = useState<CameraPreset>('orbit');
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const treesRef = useRef<TreeObject[]>([]);
  const satelliteMeshRef = useRef<THREE.Group | null>(null);
  const scanConeRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera coordinates
  const cameraRotationRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
    radius: 36,
  });

  const targetCameraRef = useRef<{ theta: number; phi: number; radius: number } | null>(null);

  // Calculate live compliance statistics from growthProgress (0 to 1)
  const currentNDVI = Number((0.15 + growthProgress * 0.63).toFixed(2));
  const survivalRate = Math.min(100, Math.round(48 + growthProgress * 46));
  const crownDensity = Math.min(100, Math.round(growthProgress * 84));
  const treeCount = Math.round(growthProgress * 48500);
  const carbonTons = Math.round(growthProgress * 680);

  // Stage labeling & milestones
  const stages = [
    {
      id: 0,
      label: 'Day 0',
      tag: 'Pre-Planting',
      progress: 0.04,
      title: 'Stage 0 • Barren Clear-Cut Soil (Pitting & Survey)',
      desc: 'Ground demarcated by cadastral survey coordinates. Soil pitting and sapling baseline registration in progress.',
    },
    {
      id: 1,
      label: 'Month 6',
      tag: 'Transplantation',
      progress: 0.18,
      title: 'Stage 1 • Sapling Transplantation & Fencing',
      desc: '48,500 native saplings planted in 30x30cm pits with vermicompost and cattle-proof perimeter trenching.',
    },
    {
      id: 2,
      label: 'Year 2',
      tag: 'Establishment',
      progress: 0.42,
      title: 'Stage 2 • Root Establishment & Sapling Branching',
      desc: 'Young trees achieve 1.8–2.4m height. Sentinel-2 Red-Edge captures active photosynthesis and 38% crown cover.',
    },
    {
      id: 3,
      label: 'Year 3.5',
      tag: 'Canopy Formation',
      progress: 0.72,
      title: 'Stage 3 • Canopy Closure & Crown Interlocking',
      desc: 'Foliage crowns intersect to create dense continuous canopy (>60%). Exceeds statutory MoEFCC 40% mandate.',
    },
    {
      id: 4,
      label: 'Year 5',
      tag: 'Final Climax',
      progress: 1.0,
      title: 'Stage 4 • Closed Climax Canopy & Handover',
      desc: 'Full ecological succession achieved. Verified 84% crown density, eligible for formal MoEFCC clearance sign-off.',
    },
  ];

  const currentStage = stages.reduce((acc, s) => (growthProgress >= s.progress - 0.08 ? s : acc), stages[0]);

  // Update Three.js tree foliage colors based on spectral mode
  const updateFoliageColors = useCallback((mode: 'true_color' | 'ndvi', progress: number) => {
    treesRef.current.forEach((t) => {
      t.foliageParts.forEach((mesh, index) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mode === 'ndvi') {
          // Heatmap: low progress = red/orange, medium = yellow/lime, high = vibrant electric emerald
          if (progress < 0.22) {
            mat.color.setHex(0xef4444); // red (bare rock/soil / early)
            mat.emissive.setHex(0x3a0d0d);
          } else if (progress < 0.52) {
            mat.color.setHex(0xf59e0b); // amber/yellow (sparse young growth)
            mat.emissive.setHex(0x382205);
          } else if (progress < 0.75) {
            mat.color.setHex(0x84cc16); // vibrant lime (vigorous vegetation)
            mat.emissive.setHex(0x192e05);
          } else {
            mat.color.setHex(0x10b981); // electric emerald (dense healthy forest canopy)
            mat.emissive.setHex(0x06281b);
          }
          mat.roughness = 0.35;
          mat.metalness = 0.15;
        } else {
          // Natural true color palette: varied organic green shades
          const greens = [0x2d6a4f, 0x40916c, 0x1b4332, 0x387856, 0x52b788];
          mat.color.setHex(greens[index % greens.length]);
          mat.emissive.setHex(0x05130b);
          mat.roughness = 0.68;
          mat.metalness = 0.05;
        }
      });
    });
  }, []);

  // Update tree scales based on growth progress
  const applyGrowthToScene = useCallback((progress: number) => {
    treesRef.current.forEach((t) => {
      // Stagger growth using delay
      const effectiveP = Math.max(0, Math.min(1, (progress - t.growthDelay * 0.18) / 0.82));

      if (effectiveP <= 0.02) {
        t.group.visible = false;
      } else {
        t.group.visible = true;
        // Scale trunk
        const trunkScale = Math.max(0.1, effectiveP);
        t.trunk.scale.set(trunkScale, trunkScale, trunkScale);
        // Scale foliage parts
        t.foliageParts.forEach((mesh, i) => {
          const orig = t.originalScales[i];
          const folScale = Math.max(0.12, Math.pow(effectiveP, 0.75));
          mesh.scale.set(orig.x * folScale, orig.y * folScale, orig.z * folScale);
        });
      }
    });
  }, []);

  // Sync growth changes
  useEffect(() => {
    applyGrowthToScene(growthProgress);
    updateFoliageColors(spectralMode, growthProgress);
  }, [growthProgress, spectralMode, applyGrowthToScene, updateFoliageColors]);

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x071912); // Deep observatory night-green
    scene.fog = new THREE.FogExp2(0x071912, 0.016);

    // Camera
    const width = container.clientWidth;
    const height = container.clientHeight || 560;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 220);
    cameraRef.current = camera;

    const updateCameraPosition = () => {
      const { theta, phi, radius } = cameraRotationRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 1.2, 0);
    };
    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xd1fae5, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    sunLight.position.set(24, 38, 22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 90;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Fill rim light (cool satellite sensor blue)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rimLight.position.set(-22, 16, -22);
    scene.add(rimLight);

    // Soft point light from above center
    const pointLight = new THREE.PointLight(0x6ee7b7, 0.4, 40);
    pointLight.position.set(0, 12, 0);
    scene.add(pointLight);

    // Ground: Undulating low-poly soil terrain with elevation mounds
    const terrainGeo = new THREE.PlaneGeometry(34, 34, 32, 32);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Create subtle natural terrain slope and mounds
      const z = Math.sin(x * 0.22) * Math.cos(y * 0.22) * 0.65 + Math.sin(x * 0.55) * 0.22;
      pos.setZ(i, z);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x142b20,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Technical Coordinate CAD Grid overlay on ground
    const gridHelper = new THREE.GridHelper(30, 20, 0x34d399, 0x1f4733);
    gridHelper.position.y = 0.03;
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.opacity = 0.22;
    gridMat.transparent = true;
    scene.add(gridHelper);

    // Cadastral Survey Boundary Line (Glowing Neon boundary perimeter)
    const boundaryPts = [
      new THREE.Vector3(-12.5, 0.12, -12.5),
      new THREE.Vector3(12.5, 0.12, -12.5),
      new THREE.Vector3(12.5, 0.12, 12.5),
      new THREE.Vector3(-12.5, 0.12, 12.5),
      new THREE.Vector3(-12.5, 0.12, -12.5),
    ];
    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPts);
    const boundaryMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2.5 });
    const boundaryLine = new THREE.Line(boundaryGeo, boundaryMat);
    scene.add(boundaryLine);

    // Cadastral Survey Corner Pegs (Glowing Pillars with beacon lights)
    const pegGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.4, 8);
    const pegMat = new THREE.MeshStandardMaterial({
      color: 0xa8c3a0,
      emissive: 0x10b981,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.4,
    });
    [
      [-12.5, -12.5],
      [12.5, -12.5],
      [12.5, 12.5],
      [-12.5, 12.5],
    ].forEach(([px, pz]) => {
      const peg = new THREE.Mesh(pegGeo, pegMat);
      peg.position.set(px, 0.7, pz);
      peg.castShadow = true;
      scene.add(peg);

      // Top glowing spherical marker
      const beaconGeo = new THREE.SphereGeometry(0.24, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(px, 1.5, pz);
      scene.add(beacon);
    });

    // Generate 48 Procedural 3D Trees with 3 distinct species architectures
    const treeObjects: TreeObject[] = [];
    const trunkGeo = new THREE.CylinderGeometry(0.14, 0.24, 2.2, 7);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2c1e, roughness: 0.9 });

    // Planting Pit earth rings on the ground
    const pitGeo = new THREE.RingGeometry(0.4, 0.65, 10);
    const pitMat = new THREE.MeshBasicMaterial({ color: 0x0f2118, side: THREE.DoubleSide });

    const numTrees = 48;
    for (let i = 0; i < numTrees; i++) {
      const treeGroup = new THREE.Group();

      // Organically distribute within the cadastral polygon [-11 to 11]
      const angle = (i / numTrees) * Math.PI * 2 * 3.4 + (i % 5) * 0.45;
      const radius = 2.2 + (i / numTrees) * 8.8 + Math.sin(i * 1.3) * 1.2;
      const x = Math.max(-11, Math.min(11, Math.cos(angle) * radius));
      const z = Math.max(-11, Math.min(11, Math.sin(angle) * radius));

      // Planting pit marker on ground
      const pit = new THREE.Mesh(pitGeo, pitMat);
      pit.rotation.x = -Math.PI / 2;
      pit.position.set(x, 0.04, z);
      scene.add(pit);

      // Trunk
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.1;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);

      // Multi-layer foliage with 3 distinct species silhouettes:
      // Species 0: Teak (Tectona grandis) - Tall upright pyramidal canopy
      // Species 1: Neem (Azadirachta indica) - Broad hemispherical spreading crown
      // Species 2: Bamboo clump (Dendrocalamus strictus) - Slender multi-tiered cluster
      const foliageParts: THREE.Mesh[] = [];
      const origScales: THREE.Vector3[] = [];
      const treeSpecies = i % 3;

      const layerConfigs =
        treeSpecies === 0
          ? [
              { y: 2.1, r: 1.15, detail: 1 },
              { y: 3.1, r: 0.9, detail: 1 },
              { y: 3.9, r: 0.65, detail: 1 },
            ]
          : treeSpecies === 1
          ? [
              { y: 2.0, r: 1.4, detail: 2 },
              { y: 2.95, r: 1.05, detail: 2 },
            ]
          : [
              { y: 2.2, r: 1.2, detail: 1 },
              { y: 3.15, r: 0.88, detail: 1 },
              { y: 4.1, r: 0.6, detail: 1 },
            ];

      layerConfigs.forEach((cfg) => {
        const folGeo = new THREE.IcosahedronGeometry(cfg.r, cfg.detail);
        const folMat = new THREE.MeshStandardMaterial({
          color: 0x2d6a4f,
          roughness: 0.62,
          metalness: 0.06,
          flatShading: true,
        });
        const folMesh = new THREE.Mesh(folGeo, folMat);
        folMesh.position.y = cfg.y;
        folMesh.castShadow = true;
        folMesh.receiveShadow = true;

        treeGroup.add(folMesh);
        foliageParts.push(folMesh);
        origScales.push(new THREE.Vector3(1, 1, 1));
      });

      treeGroup.position.set(x, 0, z);
      scene.add(treeGroup);

      treeObjects.push({
        group: treeGroup,
        trunk,
        foliageParts,
        originalScales: origScales,
        maxScale: 0.85 + Math.random() * 0.35,
        seedX: x,
        seedZ: z,
        growthDelay: Math.random() * 0.75,
      });
    }
    treesRef.current = treeObjects;

    // 3D Orbital Copernicus Sentinel-2 Satellite Model
    const satGroup = new THREE.Group();

    // Central chassis with gold MLI thermal insulation blanket
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.9, 0.9);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
    });
    const satBody = new THREE.Mesh(bodyGeo, bodyMat);
    satGroup.add(satBody);

    // Multi-spectral MSI instrument optical aperture
    const optGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.4, 16);
    const optMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.95, roughness: 0.1 });
    const optAperture = new THREE.Mesh(optGeo, optMat);
    optAperture.position.set(0, -0.5, 0);
    satGroup.add(optAperture);

    // Dual Solar Array Wings (Deep solar blue with grid lines)
    const wingGeo = new THREE.BoxGeometry(2.8, 0.04, 0.85);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x0f2b5c,
    });
    const wingLeft = new THREE.Mesh(wingGeo, wingMat);
    wingLeft.position.set(-2.2, 0, 0);
    satGroup.add(wingLeft);

    const wingRight = new THREE.Mesh(wingGeo, wingMat);
    wingRight.position.set(2.2, 0, 0);
    satGroup.add(wingRight);

    // SAR Radar / Telemetry Communication Dish
    const dishGeo = new THREE.ConeGeometry(0.45, 0.35, 14, 1, true);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0.5, -0.6, 0.3);
    dish.rotation.x = Math.PI * 0.9;
    satGroup.add(dish);

    satGroup.position.set(0, 17, 0);
    scene.add(satGroup);
    satelliteMeshRef.current = satGroup;

    // Scanning Cone Sensor Beam projecting down from satellite
    const coneGeo = new THREE.ConeGeometry(8.5, 17, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const scanCone = new THREE.Mesh(coneGeo, coneMat);
    scanCone.position.set(0, 8.5, 0);
    scanCone.rotation.x = Math.PI;
    scene.add(scanCone);
    scanConeRef.current = scanCone;

    // Mouse Drag Orbit Event Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      targetCameraRef.current = null; // cancel active preset interpolation
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cameraRotationRef.current.theta -= deltaX * 0.007;
      cameraRotationRef.current.phi = Math.max(
        0.18,
        Math.min(Math.PI / 2.05, cameraRotationRef.current.phi - deltaY * 0.007)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCameraRef.current = null;
      cameraRotationRef.current.radius = Math.max(
        16,
        Math.min(52, cameraRotationRef.current.radius + e.deltaY * 0.03)
      );
      updateCameraPosition();
    };

    // Touch support for tablets & touchscreens
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        targetCameraRef.current = null;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
      cameraRotationRef.current.theta -= deltaX * 0.007;
      cameraRotationRef.current.phi = Math.max(
        0.18,
        Math.min(Math.PI / 2.05, cameraRotationRef.current.phi - deltaY * 0.007)
      );
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      updateCameraPosition();
    };
    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW && newH && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Initial render state
    applyGrowthToScene(growthProgress);

    // Continuous Animation Loop
    const timer = new THREE.Timer();
    const animate = (timestamp: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      timer.update(timestamp);
      const elapsedTime = timer.getElapsed();

      // Smooth camera interpolation if transitioning to target preset
      if (targetCameraRef.current) {
        const current = cameraRotationRef.current;
        const target = targetCameraRef.current;
        const lerpFactor = 0.08;

        current.theta += (target.theta - current.theta) * lerpFactor;
        current.phi += (target.phi - current.phi) * lerpFactor;
        current.radius += (target.radius - current.radius) * lerpFactor;

        // Check if converged
        if (
          Math.abs(target.theta - current.theta) < 0.005 &&
          Math.abs(target.phi - current.phi) < 0.005 &&
          Math.abs(target.radius - current.radius) < 0.1
        ) {
          current.theta = target.theta;
          current.phi = target.phi;
          current.radius = target.radius;
          targetCameraRef.current = null;
        }
        updateCameraPosition();
      } else if (!isDraggingRef.current && isAutoOrbit) {
        // Slow gentle orbital drift when idle
        cameraRotationRef.current.theta += 0.0012;
        updateCameraPosition();
      }

      // Satellite Orbit & Beam Animation
      if (satelliteMeshRef.current && scanConeRef.current) {
        const orbitRadius = 11.5;
        const satX = Math.sin(elapsedTime * 0.35) * orbitRadius;
        const satZ = Math.cos(elapsedTime * 0.35) * orbitRadius;
        satelliteMeshRef.current.position.set(satX, 16 + Math.sin(elapsedTime * 0.7) * 0.4, satZ);
        satelliteMeshRef.current.rotation.y = -elapsedTime * 0.35;

        scanConeRef.current.position.set(satX, 8, satZ);
        const scanMat = scanConeRef.current.material as THREE.MeshBasicMaterial;
        scanMat.opacity = 0.06 + Math.sin(elapsedTime * 3) * 0.04;
      }

      // Subtle organic foliage breeze sway
      treesRef.current.forEach((t, i) => {
        if (t.group.visible) {
          t.foliageParts.forEach((part, pIdx) => {
            part.rotation.y = Math.sin(elapsedTime * 1.3 + i * 0.4 + pIdx) * 0.035;
          });
        }
      });

      renderer.render(scene, camera);
    };
    animate(performance.now());

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [applyGrowthToScene, isAutoOrbit]);

  // Automated Growth Play Loop with speed control
  useEffect(() => {
    if (!isPlaying) return;
    const step = 0.012 * playbackSpeed;
    const interval = setInterval(() => {
      setGrowthProgress((prev) => {
        if (prev >= 1) {
          return 0.04; // loop back to day 0
        }
        return Number(Math.min(1, prev + step).toFixed(3));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Camera preset switcher
  const handleSelectCameraPreset = (preset: CameraPreset) => {
    setActiveCameraPreset(preset);
    setIsAutoOrbit(false);

    switch (preset) {
      case 'nadir':
        targetCameraRef.current = {
          theta: 0.001,
          phi: 0.18, // directly overhead satellite nadir
          radius: 38,
        };
        toast.info('Satellite Nadir View (90°)', {
          message: 'Switched to vertical orthorectified satellite perspective matching Sentinel-2 imagery.',
          duration: 3000,
        });
        break;
      case 'surveyor':
        targetCameraRef.current = {
          theta: Math.PI / 3.2,
          phi: Math.PI / 2.3, // ground level
          radius: 20,
        };
        toast.info('Ground Patrol View (18°)', {
          message: 'Switched to low-angle surveyor perspective at the forest boundary perimeter.',
          duration: 3000,
        });
        break;
      case 'isometric':
        targetCameraRef.current = {
          theta: Math.PI / 6,
          phi: Math.PI / 3.8,
          radius: 34,
        };
        toast.info('Isometric Engineering View', {
          message: 'Cadastral parcel oriented in technical 30° orthographic elevation.',
          duration: 3000,
        });
        break;
      case 'orbit':
      default:
        targetCameraRef.current = {
          theta: Math.PI / 4,
          phi: Math.PI / 3.4,
          radius: 36,
        };
        break;
    }
  };

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    targetCameraRef.current = null;
    const delta = direction === 'in' ? -4 : 4;
    cameraRotationRef.current.radius = Math.max(
      16,
      Math.min(52, cameraRotationRef.current.radius + delta)
    );
  };

  const handleResetCamera = () => {
    targetCameraRef.current = {
      theta: Math.PI / 4,
      phi: Math.PI / 3.4,
      radius: 36,
    };
    setActiveCameraPreset('orbit');
    setIsAutoOrbit(true);
    toast.info('Camera Orientation Reset', {
      message: 'Restored 45° perspective orbit with gentle telemetry drift.',
      duration: 2500,
    });
  };

  const toggleSpectralMode = () => {
    const nextMode = spectralMode === 'true_color' ? 'ndvi' : 'true_color';
    setSpectralMode(nextMode);
    toast.success(
      nextMode === 'ndvi' ? 'Sentinel-2 NDVI Heatmap Active' : 'Natural Surface Color (RGB)',
      {
        message:
          nextMode === 'ndvi'
            ? 'Foliage shaded by NIR/Red reflectance ratio. Emerald = Healthy Climax, Yellow = Young Canopy, Red = Barren Soil.'
            : 'Simulating true-color high-resolution optical surface reflectance.',
        duration: 4000,
      }
    );
  };

  return (
    <div
      id="3d-simulation-observatory"
      className={`w-full rounded-3xl bg-gradient-to-b from-[#0b241b] via-[#071912] to-[#040e0b] border border-white/15 p-4 sm:p-7 xl:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-300`}
    >
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/10 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-[#A8C3A0] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">
              Copernicus Sentinel-2 • 10m Multi-spectral Telemetry
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif-display text-white tracking-tight">
            Interactive 3D Afforestation Observatory
          </h3>
          <p className="text-xs sm:text-sm text-white/75 max-w-2xl leading-relaxed">
            Autonomous multi-temporal satellite audit of 48.5 hectares compensatory parcel under Forest Conservation Act covenants. Orbit the terrain, toggle spectral NDVI telemetry, and scrub 5-year succession.
          </p>
        </div>

        {/* Action Controls Deck */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Spectral Mode Toggle */}
          <button
            onClick={toggleSpectralMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border shadow-sm ${
              spectralMode === 'ndvi'
                ? 'bg-[#10B981] text-[#062417] border-[#6EE7B7] font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
            }`}
            title="Toggle between natural surface color and satellite NDVI heatmap"
          >
            <Layers size={14} className={spectralMode === 'ndvi' ? 'text-[#062417]' : 'text-[#A8C3A0]'} />
            <span>{spectralMode === 'ndvi' ? 'NDVI Heatmap ON' : 'Show Satellite NDVI'}</span>
          </button>

          {/* Auto-Orbit Toggle */}
          <button
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isAutoOrbit
                ? 'bg-white/15 text-[#A8C3A0] border-[#A8C3A0]/40'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/15'
            }`}
            title={isAutoOrbit ? 'Pause orbital auto-rotation' : 'Resume orbital auto-rotation'}
          >
            <RotateCcw size={13} className={isAutoOrbit ? 'animate-spin text-[#A8C3A0]' : 'text-white/60'} />
            <span className="hidden sm:inline">Auto-Orbit</span>
          </button>

          {/* Expand / Theater Mode */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title={isExpanded ? 'Collapse viewport' : 'Expand to theater view'}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden md:inline">{isExpanded ? 'Standard View' : 'Theater Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Simulation Stage (Centrally Dominant) */}
      <div className="relative mt-6 rounded-3xl border border-white/20 overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.85)] bg-[#05140e] group">
        
        {/* Aerospace Coordinate Crosshairs */}
        <div className="absolute top-3.5 left-4 text-white/35 text-[10px] font-mono pointer-events-none select-none z-10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]/80" />
          <span>PARCEL 42 • 18°08&apos;42&quot;N 75°41&apos;18&quot;E</span>
        </div>
        <div className="absolute top-3.5 right-4 text-white/35 text-[10px] font-mono pointer-events-none select-none z-10 hidden sm:block">
          SENTINEL-2 MSI • 10M BOA • NADIR ORBIT
        </div>

        {/* Three.js Canvas Container */}
        <div
          ref={mountRef}
          className={`w-full transition-all duration-300 cursor-grab active:cursor-grabbing relative ${
            isExpanded ? 'h-[680px] sm:h-[780px] lg:h-[840px]' : 'h-[540px] sm:h-[620px] lg:h-[680px]'
          }`}
        />

        {/* TOP-LEFT HUD: Telemetry & Spectral Metrics (Modern Compact Glassmorphism) */}
        <div className="absolute top-10 sm:top-12 left-3 sm:left-4 p-3.5 sm:p-4 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 text-white space-y-2.5 max-w-[260px] sm:max-w-[270px] shadow-[0_12px_36px_rgba(0,0,0,0.6)] pointer-events-none select-none z-20">
          {/* Status Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8C3A0] font-bold flex items-center gap-1.5">
              <Satellite size={13} className="text-[#38BDF8]" />
              <span>Copernicus S2-MSI</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#6EE7B7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              <span>ORBIT TRACK</span>
            </div>
          </div>

          {/* 2x2 Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10">
              <span className="text-[9px] text-white/60 block font-mono uppercase">Mean NDVI</span>
              <span
                className={`text-lg sm:text-xl font-bold font-mono block leading-tight mt-0.5 ${
                  currentNDVI < 0.3
                    ? 'text-[#F87171]'
                    : currentNDVI < 0.55
                    ? 'text-[#FBBF24]'
                    : 'text-[#34D399]'
                }`}
              >
                {currentNDVI.toFixed(2)}
              </span>
              <span className="text-[9px] text-white/45 font-mono">Target: 0.65+</span>
            </div>

            <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10">
              <span className="text-[9px] text-white/60 block font-mono uppercase">Crown Cover</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-white block leading-tight mt-0.5">
                {crownDensity}%
              </span>
              <span className="text-[9px] text-[#A8C3A0] font-mono">FCA Min: &gt;40%</span>
            </div>
          </div>

          {/* Linear Progress & Survival stats */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/70">Sapling Survival:</span>
              <span
                className={`font-mono font-bold ${
                  survivalRate >= 80 ? 'text-[#34D399]' : 'text-[#FBBF24]'
                }`}
              >
                {survivalRate}% (Req. 80%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  survivalRate >= 80 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                }`}
                style={{ width: `${survivalRate}%` }}
              />
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/70">
            <span>Verified Stems:</span>
            <span className="text-white font-bold">{treeCount.toLocaleString()} / 48,500</span>
          </div>
        </div>

        {/* TOP-RIGHT HUD: Statutory Verdict & Cadastral Identifier */}
        <div className="absolute top-10 sm:top-12 right-3 sm:right-4 p-3.5 sm:p-4 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 text-white space-y-2 max-w-[250px] sm:max-w-[270px] shadow-[0_12px_36px_rgba(0,0,0,0.6)] pointer-events-none select-none z-20">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50 uppercase border-b border-white/10 pb-1.5">
            <span>Statutory Verification</span>
            <span className="text-[#38BDF8] font-semibold">IEA §65B</span>
          </div>

          {/* Dynamic Verdict Pill */}
          {growthProgress < 0.3 ? (
            <div className="p-2 rounded-xl bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-start gap-2 text-[#F87171]">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-[#F87171]" />
              <div>
                <span className="text-xs font-bold block leading-tight">Canopy Deficit Flagged</span>
                <span className="text-[10px] text-white/70 leading-snug block mt-0.5">
                  Early growth below 25% statutory target. Infilling required.
                </span>
              </div>
            </div>
          ) : growthProgress < 0.72 ? (
            <div className="p-2 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-start gap-2 text-[#FBBF24]">
              <TrendingUp size={15} className="shrink-0 mt-0.5 text-[#FBBF24]" />
              <div>
                <span className="text-xs font-bold block leading-tight">Maturing Under Supervision</span>
                <span className="text-[10px] text-white/70 leading-snug block mt-0.5">
                  NDVI trajectory positive. On track for canopy closure.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-start gap-2 text-[#6EE7B7]">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-[#6EE7B7]" />
              <div>
                <span className="text-xs font-bold block leading-tight">Compliant Climax Canopy</span>
                <span className="text-[10px] text-white/70 leading-snug block mt-0.5">
                  84% crown density confirmed. Meets MoEFCC signoff criteria.
                </span>
              </div>
            </div>
          )}

          <div className="pt-1 text-[10px] text-white/75 font-mono space-y-0.5">
            <div className="flex justify-between">
              <span className="text-white/50">Cadastral Plot:</span>
              <span className="text-white font-semibold">Gut No. 42 (Barshi)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Carbon Fixation:</span>
              <span className="text-[#A8C3A0] font-semibold">{carbonTons} tCO₂e/yr</span>
            </div>
          </div>
        </div>

        {/* RIGHT FLOATING GLASS TOOLBAR: Camera Angles & Quick Zoom */}
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 p-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 shadow-2xl z-20">
          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>

          <div className="h-px w-full bg-white/15 my-0.5" />

          {/* Camera Preset: 45° Perspective */}
          <button
            onClick={() => handleSelectCameraPreset('orbit')}
            className={`p-2 rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center font-mono ${
              activeCameraPreset === 'orbit'
                ? 'bg-[#3E7C59] text-white shadow-sm font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title="45° Orbit Angle"
          >
            45°
          </button>

          {/* Camera Preset: 90° Satellite Nadir */}
          <button
            onClick={() => handleSelectCameraPreset('nadir')}
            className={`p-2 rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center font-mono ${
              activeCameraPreset === 'nadir'
                ? 'bg-[#3E7C59] text-white shadow-sm font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title="90° Top-Down Satellite Nadir"
          >
            90°
          </button>

          {/* Camera Preset: 18° Ground Patrol */}
          <button
            onClick={() => handleSelectCameraPreset('surveyor')}
            className={`p-2 rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center font-mono ${
              activeCameraPreset === 'surveyor'
                ? 'bg-[#3E7C59] text-white shadow-sm font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title="18° Ground Surveyor Perspective"
          >
            18°
          </button>

          <div className="h-px w-full bg-white/15 my-0.5" />

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
            title="Reset Camera Angle"
            aria-label="Reset camera"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* BOTTOM INTEGRATED COMMAND DOCK: Polished Interactive Timeline */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-6 p-3 sm:p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white space-y-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] z-20">
          
          {/* Stage Heading & Playback Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-mono text-[#A8C3A0] uppercase tracking-wider font-bold">
                Afforestation Timeline:
              </span>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#3E7C59]/40 text-[#A8C3A0] border border-[#A8C3A0]/30">
                Year {(growthProgress * 5).toFixed(1)} of 5.0
              </span>
              <span className="text-xs font-semibold text-white truncate">
                • {currentStage.title}
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md border border-[#A8C3A0]/30"
              >
                {isPlaying ? <Pause size={12} className="text-white" /> : <Play size={12} className="text-white" />}
                <span>{isPlaying ? 'Pause' : 'Play Time-Lapse'}</span>
              </button>

              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
                className={`px-2 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  playbackSpeed === 2
                    ? 'bg-white/20 text-[#6EE7B7] border-[#6EE7B7]/40'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/15'
                }`}
                title="Toggle playback speed"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={() => {
                  setGrowthProgress(0.04);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/15 transition-all cursor-pointer"
                title="Rewind to Day 0"
                aria-label="Rewind to Day 0"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Interactive Milestone Nodes Bar */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {stages.map((stage) => {
              const isCurrent = currentStage.id === stage.id;
              const isPast = growthProgress >= stage.progress;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setGrowthProgress(stage.progress);
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl text-left transition-all cursor-pointer border relative overflow-hidden group ${
                    isCurrent
                      ? 'bg-[#3E7C59]/50 border-[#A8C3A0] shadow-[0_0_12px_rgba(168,195,160,0.3)]'
                      : isPast
                      ? 'bg-white/10 border-white/20 text-white/90 hover:bg-white/15'
                      : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold block truncate">
                      {stage.label}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCurrent
                          ? 'bg-[#6EE7B7] ring-2 ring-[#6EE7B7]/40'
                          : isPast
                          ? 'bg-[#10B981]'
                          : 'bg-white/20'
                      }`}
                    />
                  </div>
                  <span className="text-[9px] text-white/60 block truncate mt-0.5 font-normal">
                    {stage.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Continuous Range Scrubber Slider */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0.02"
                max="1.0"
                step="0.005"
                value={growthProgress}
                onChange={(e) => {
                  setIsPlaying(false);
                  setGrowthProgress(parseFloat(e.target.value));
                }}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#10B981] transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/55">
              <span className="flex items-center gap-1.5">
                <span>🖱️ Click & drag to rotate terrain</span>
                <span className="text-white/30">•</span>
                <span>Scroll to zoom</span>
              </span>
              <span className="hidden md:inline text-white/50">
                Plot Gut 42 • 48.5 Hectares • Solapur, MH
              </span>
              {onExplorePipeline && (
                <button
                  onClick={onExplorePipeline}
                  className="text-[#A8C3A0] hover:text-white flex items-center gap-1 cursor-pointer font-sans font-semibold transition-colors"
                >
                  <span>Verify in Pipeline</span>
                  <ArrowRight size={11} />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modern Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#10B981]/30 transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A8C3A0] font-mono">
              <div className="p-1.5 rounded-lg bg-[#10B981]/15 text-[#6EE7B7]">
                <Compass size={14} />
              </div>
              <span>Cadastral Geofencing</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">FCA §2</span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Revenue survey coordinates (Gut No. 42) isolate statutory compensatory land from adjacent non-cleared forests, preventing double-counting fraud.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#38BDF8]/30 transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#74BDE0] font-mono">
              <div className="p-1.5 rounded-lg bg-[#38BDF8]/15 text-[#74BDE0]">
                <Satellite size={14} />
              </div>
              <span>10m Multi-spectral NIR</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">Sentinel-2B</span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Sentinel-2 optical passes capture Near-Infrared reflectance twice every 10 days to distinguish living trees from dry gravel and seasonal weeds.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#F59E0B]/30 transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FBBF24] font-mono">
              <div className="p-1.5 rounded-lg bg-[#F59E0B]/15 text-[#FBBF24]">
                <ShieldCheck size={14} />
              </div>
              <span>Autonomous Audit Alerts</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">IEA §65B</span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            If canopy cover fails to hit the statutory 40% threshold by Year 3, Canopy automatically drafts formal MoEFCC inspection memos and legal notices.
          </p>
        </div>
      </div>

    </div>
  );
};
