import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const createGhostTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, 512, 1024);
        
        // Body (tattered dress, pale blue-grey)
        ctx.fillStyle = 'rgba(150, 175, 195, 0.85)';
        ctx.beginPath();
        ctx.moveTo(170, 300);
        ctx.quadraticCurveTo(256, 260, 342, 300); // Shoulders
        ctx.lineTo(390, 650); // Right sleeve
        ctx.lineTo(320, 680);
        ctx.lineTo(300, 500); // Right side
        ctx.lineTo(360, 950); // Right dress bottom
        
        // Tattered bottom edge
        ctx.lineTo(320, 900);
        ctx.lineTo(280, 960);
        ctx.lineTo(240, 890);
        ctx.lineTo(200, 950);
        ctx.lineTo(170, 900);
        
        ctx.lineTo(152, 950); // Left dress bottom
        ctx.lineTo(212, 500); // Left side
        ctx.lineTo(192, 680);
        ctx.lineTo(122, 650); // Left sleeve
        ctx.closePath();
        ctx.fill();
        
        // Add some transparency/wrinkles to dress
        ctx.fillStyle = 'rgba(110, 130, 150, 0.3)';
        for(let i=0; i<15; i++) {
           ctx.beginPath();
           ctx.ellipse(200 + Math.random()*112, 400 + Math.random()*500, 10 + Math.random()*10, 50 + Math.random()*120, 0, 0, Math.PI*2);
           ctx.fill();
        }

        // Arms/hands (pale blueish grey)
        ctx.fillStyle = 'rgba(130, 150, 170, 0.9)';
        ctx.beginPath();
        ctx.arc(150, 710, 15, 0, Math.PI*2); // left hand
        ctx.arc(362, 710, 15, 0, Math.PI*2); // right hand
        ctx.fill();

        // Feet (bare, pale)
        ctx.beginPath();
        ctx.arc(220, 960, 14, 0, Math.PI*2);
        ctx.arc(290, 960, 14, 0, Math.PI*2);
        ctx.fill();

        // Head/Hair (long black hair covering face)
        ctx.fillStyle = '#111214';
        ctx.beginPath();
        ctx.arc(256, 180, 55, 0, Math.PI*2); // head top
        ctx.fill();
        
        // Hair falling down
        ctx.beginPath();
        ctx.moveTo(201, 180);
        ctx.quadraticCurveTo(170, 400, 200, 520);
        ctx.lineTo(220, 480);
        ctx.lineTo(240, 560);
        ctx.lineTo(270, 490);
        ctx.lineTo(290, 570);
        ctx.lineTo(312, 480);
        ctx.quadraticCurveTo(342, 400, 311, 180);
        ctx.closePath();
        ctx.fill();

    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};

const createTalismanTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#ffecb3';
        ctx.fillRect(0, 0, 256, 512);

        for (let i = 0; i < 350; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(218, 165, 32, 0.2)' : 'rgba(255, 235, 150, 0.25)';
            ctx.fillRect(Math.random() * 256, Math.random() * 512, 2, 2);
        }

        ctx.strokeStyle = '#c62828';
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, 236, 492);
        ctx.lineWidth = 3;
        ctx.strokeRect(18, 18, 220, 476);

        ctx.fillStyle = '#b71c1c';
        ctx.strokeStyle = '#b71c1c';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.font = 'bold 42px serif';
        ctx.textAlign = 'center';
        ctx.fillText('敕令', 128, 75);

        ctx.beginPath();
        ctx.moveTo(128, 100);
        ctx.lineTo(128, 400);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(70, 140);
        ctx.quadraticCurveTo(180, 180, 80, 230);
        ctx.quadraticCurveTo(200, 270, 100, 320);
        ctx.quadraticCurveTo(170, 360, 128, 410);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(60, 180); ctx.lineTo(196, 180);
        ctx.moveTo(60, 280); ctx.lineTo(196, 280);
        ctx.moveTo(60, 350); ctx.lineTo(196, 350);
        ctx.stroke();

        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(96, 420, 64, 64);
        ctx.fillStyle = '#ffcdd2';
        ctx.font = 'bold 24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('符', 128, 452);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
};

const createBloodSplatterTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = 'rgba(90, 5, 5, 0.9)'; 
        // A few big spots
        for(let j=0; j<8; j++) {
            ctx.beginPath();
            ctx.arc(256 + (Math.random()-0.5)*180, 256 + (Math.random()-0.5)*180, 15 + Math.random() * 40, 0, Math.PI * 2);
            ctx.fill();
        }
        // Little splatters
        for(let i=0; i<80; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 240;
            const radius = Math.random() * 10;
            ctx.beginPath();
            ctx.arc(256 + Math.cos(angle)*dist, 256 + Math.sin(angle)*dist, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
};

const createSnowflakeTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.translate(256, 256);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
        ctx.shadowBlur = 15;

        for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate((Math.PI * 2 / 6) * i);
            
            ctx.strokeStyle = '#aaddff';
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -220);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -210);
            ctx.stroke();
            
            const drawV = (y: number, size: number, width: number) => {
                ctx.strokeStyle = '#aaddff';
                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(-size, y - size);
                ctx.moveTo(0, y);
                ctx.lineTo(size, y - size);
                ctx.stroke();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = width * 0.4;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(-size + 2, y - size + 2);
                ctx.moveTo(0, y);
                ctx.lineTo(size - 2, y - size + 2);
                ctx.stroke();
            };

            drawV(-40, 40, 12);
            drawV(-90, 50, 12);
            drawV(-150, 40, 10);
            
            ctx.beginPath();
            ctx.moveTo(0, -30);
            ctx.lineTo(26, -15);
            ctx.strokeStyle = '#aaddff';
            ctx.lineWidth = 8;
            ctx.stroke();
            
            ctx.restore();
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#aaddff';
        ctx.lineWidth = 8;
        ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
};

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const interactTextRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  const lockCooldownRef = useRef<boolean>(false);
  const [started, setStarted] = useState(false);
  const [activeSkill, setActiveSkill] = useState<number>(1);
  const activeSkillRef = useRef<number>(1);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x111111, 0.03); // Creepy fog

    // Camera setup
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 100);
    camera.position.y = 1.6; // average eye height

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    renderer.autoClear = false;
    renderer.setPixelRatio(1); // Force 1x pixel ratio for better FPS
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // Cheaper than soft shadows
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new PointerLockControls(camera, document.body);
    // Giới hạn góc gập/cúi đầu tự nhiên như con người (~60° ngửa mặt lên, ~48° cúi mặt xuống ~30-48°)
    controls.minPolarAngle = Math.PI / 2 - 1.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.85;
    controlsRef.current = controls;
    scene.add(camera);

    // FPS Arms & Weapon
    const fpsGroup = new THREE.Group();
    camera.add(fpsGroup);

    // --- Procedural Textures for Wizard Hands & Arcane Robes ---
    const createSkinTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Base warm realistic mage skin tone gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#ebd0b9');
        grad.addColorStop(0.5, '#dbae91');
        grad.addColorStop(1, '#c28e70');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Micro skin noise texture
        for (let i = 0; i < 4000; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const alpha = Math.random() * 0.05;
          ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(100,40,20,${alpha})`;
          ctx.fillRect(x, y, 1.5, 1.5);
        }

        // Arcane Runic Tattoos on back of hand
        ctx.strokeStyle = 'rgba(70, 150, 255, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(256, 256, 80, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(180, 100, 255, 0.35)';
        ctx.lineWidth = 1.5;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(256, 256);
          ctx.lineTo(256 + Math.cos(a) * 110, 256 + Math.sin(a) * 110);
          ctx.stroke();
        }

        // Knuckle creases
        ctx.strokeStyle = 'rgba(110, 45, 25, 0.2)';
        ctx.lineWidth = 2;
        for (let y = 140; y < 440; y += 75) {
          ctx.beginPath();
          ctx.moveTo(50, y);
          ctx.bezierCurveTo(160, y - 10, 350, y + 10, 460, y);
          ctx.stroke();
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const createRobeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Deep Sorcerer Velvet Robe (Midnight Violet/Indigo)
        const grad = ctx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0, '#1c1033');
        grad.addColorStop(0.5, '#140a26');
        grad.addColorStop(1, '#0c051a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Gold Runic Embroidered Trim at Sleeve Edge
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(0, 420, 512, 40);

        ctx.strokeStyle = '#ffee99';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < 512; x += 32) {
          ctx.moveTo(x, 420);
          ctx.lineTo(x + 16, 460);
          ctx.lineTo(x + 32, 420);
        }
        ctx.stroke();
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const skinTextureMap = createSkinTexture();
    const robeTextureMap = createRobeTexture();

    // --- Helper for Realistic 5-Fingered Anatomical FPS Wizard Hands & Robes ---
    interface FingerJoints {
      mcp: THREE.Group;
      pip: THREE.Group;
      dip: THREE.Group;
    }

    interface HandFingers {
      thumb: FingerJoints;
      index: FingerJoints;
      middle: FingerJoints;
      ring: FingerJoints;
      pinky: FingerJoints;
    }

    interface FPSArmAndHand {
      armGroup: THREE.Group;
      handGroup: THREE.Group;
      fingers: HandFingers;
    }

    const createFPSArmAndHand = (isLeft: boolean): FPSArmAndHand => {
      const armGroup = new THREE.Group();
      const sideSign = isLeft ? -1 : 1;

      // Wizard Materials
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xebd0b9,
        map: skinTextureMap,
        roughness: 0.5,
        metalness: 0.05,
      });

      const robeMat = new THREE.MeshStandardMaterial({
        color: 0x22133e,
        map: robeTextureMap,
        roughness: 0.85,
        metalness: 0.1,
      });

      const goldTrimMat = new THREE.MeshStandardMaterial({
        color: 0xe5b839,
        roughness: 0.3,
        metalness: 0.85,
      });

      const runeBraceletMat = new THREE.MeshStandardMaterial({
        color: 0x223355,
        emissive: 0x3388ff,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.9,
      });

      // 1. Wide Flared Wizard Robe Sleeve
      const sleeveGeo = new THREE.CylinderGeometry(0.062, 0.048, 0.22, 16);
      const sleeve = new THREE.Mesh(sleeveGeo, robeMat);
      sleeve.position.set(0, -0.08, 0);
      armGroup.add(sleeve);

      // Golden Embroidered Sleeve Cuff Ring
      const cuffGeo = new THREE.TorusGeometry(0.062, 0.007, 10, 20);
      const cuffMesh = new THREE.Mesh(cuffGeo, goldTrimMat);
      cuffMesh.rotation.x = Math.PI / 2;
      cuffMesh.position.set(0, 0.03, 0);
      armGroup.add(cuffMesh);

      // 2. Arcane Runic Bracelet / Wrist Band
      const braceletGeo = new THREE.CylinderGeometry(0.044, 0.045, 0.025, 16);
      const braceletMesh = new THREE.Mesh(braceletGeo, runeBraceletMat);
      braceletMesh.position.set(0, 0.048, 0);
      armGroup.add(braceletMesh);

      // Exposed Wrist Skin Joint
      const wristGeo = new THREE.CylinderGeometry(0.038, 0.042, 0.03, 14);
      const wristMesh = new THREE.Mesh(wristGeo, skinMat);
      wristMesh.position.set(0, 0.068, 0);
      armGroup.add(wristMesh);

      // 3. Hand Group (Pivots smoothly at wrist)
      const handGroup = new THREE.Group();
      handGroup.position.set(0, 0.08, 0);
      armGroup.add(handGroup);

      // Palm Base (Flattened anatomical mage hand)
      const palmShape = new THREE.Shape();
      palmShape.moveTo(-0.028, 0);
      palmShape.lineTo(-0.034, 0.065); // Knuckles left
      palmShape.lineTo(0.034, 0.065);  // Knuckles right
      palmShape.lineTo(0.028, 0);      // Wrist right
      palmShape.closePath();

      const extrudeSettings = { depth: 0.024, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.005, bevelThickness: 0.005 };
      const palmGeo = new THREE.ExtrudeGeometry(palmShape, extrudeSettings);
      palmGeo.center();
      const palmMesh = new THREE.Mesh(palmGeo, skinMat);
      palmMesh.position.set(0, 0.032, 0);
      handGroup.add(palmMesh);

      // Arcane Runic Seal on Back of Hand (+Z)
      const sealGeo = new THREE.RingGeometry(0.008, 0.016, 16);
      const sealMat = new THREE.MeshBasicMaterial({ color: 0x66ccff, side: THREE.DoubleSide });
      const sealMesh = new THREE.Mesh(sealGeo, sealMat);
      sealMesh.position.set(0, 0.045, 0.014);
      handGroup.add(sealMesh);

      // Fleshy Palm Pads - Palm side (-Z)
      const thenarGeo = new THREE.SphereGeometry(0.018, 10, 10);
      thenarGeo.scale(1.3, 0.9, 1.4);
      const thenarMesh = new THREE.Mesh(thenarGeo, skinMat);
      thenarMesh.position.set(sideSign * -0.024, 0.028, -0.012);
      handGroup.add(thenarMesh);

      const hypoGeo = new THREE.SphereGeometry(0.015, 8, 8);
      hypoGeo.scale(0.9, 1.4, 1.1);
      const hypoMesh = new THREE.Mesh(hypoGeo, skinMat);
      hypoMesh.position.set(sideSign * 0.024, 0.028, -0.012);
      handGroup.add(hypoMesh);

      // Helper for Realistic 3-Joint Articulated Mage Finger
      const createFinger = (
        posX: number,
        posY: number,
        posZ: number,
        baseRotY: number,
        lens: [number, number, number],
        radii: [number, number, number],
        isThumb: boolean = false,
        baseRotX: number = 0,
        baseRotZ: number = 0
      ): FingerJoints => {
        // MCP (Knuckle Joint)
        const mcp = new THREE.Group();
        mcp.position.set(posX, posY, posZ);
        mcp.rotation.set(baseRotX, baseRotY, baseRotZ);
        handGroup.add(mcp);

        const knuckleMesh = new THREE.Mesh(new THREE.SphereGeometry(radii[0] * 1.08, 10, 10), skinMat);
        mcp.add(knuckleMesh);

        // Proximal Phalanx
        const pSeg = new THREE.Mesh(new THREE.CylinderGeometry(radii[0] * 0.92, radii[1] * 1.05, lens[0], 10), skinMat);
        pSeg.position.set(0, lens[0] / 2, 0);
        mcp.add(pSeg);

        // PIP Joint
        const pip = new THREE.Group();
        pip.position.set(0, lens[0], 0);
        mcp.add(pip);

        const pipMesh = new THREE.Mesh(new THREE.SphereGeometry(radii[1] * 1.08, 10, 10), skinMat);
        pip.add(pipMesh);

        // Sorcerer Ring on Index / Ring Finger
        if (!isThumb && (Math.abs(posX) > 0.008)) {
          const ringGeo = new THREE.TorusGeometry(radii[1] * 1.08, 0.002, 8, 16);
          const ringMesh = new THREE.Mesh(ringGeo, goldTrimMat);
          ringMesh.rotation.x = Math.PI / 2;
          pip.add(ringMesh);

          const gemGeo = new THREE.SphereGeometry(0.0035, 8, 8);
          const gemMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 0.8 });
          const gemMesh = new THREE.Mesh(gemGeo, gemMat);
          gemMesh.position.set(0, 0, radii[1] * 1.12);
          pip.add(gemMesh);
        }

        // Middle Phalanx
        const mSeg = new THREE.Mesh(new THREE.CylinderGeometry(radii[1] * 0.92, radii[2] * 1.05, lens[1], 10), skinMat);
        mSeg.position.set(0, lens[1] / 2, 0);
        pip.add(mSeg);

        // DIP Joint
        const dip = new THREE.Group();
        dip.position.set(0, lens[1], 0);
        pip.add(dip);

        const dipMesh = new THREE.Mesh(new THREE.SphereGeometry(radii[2] * 1.04, 10, 10), skinMat);
        dip.add(dipMesh);

        // Distal Phalanx
        const dSeg = new THREE.Mesh(new THREE.CylinderGeometry(radii[2] * 0.92, radii[2] * 0.65, lens[2], 10), skinMat);
        dSeg.position.set(0, lens[2] / 2, 0);
        dip.add(dSeg);

        // Fingertip Pad
        const tipMesh = new THREE.Mesh(new THREE.SphereGeometry(radii[2] * 0.72, 10, 10), skinMat);
        tipMesh.position.set(0, lens[2], 0);
        dip.add(tipMesh);

        // Fingernail plate
        const nailGeo = new THREE.PlaneGeometry(radii[2] * 0.9, lens[2] * 0.5);
        const nailMat = new THREE.MeshStandardMaterial({ color: 0xf2cbbe, roughness: 0.3, metalness: 0.1 });
        const nailMesh = new THREE.Mesh(nailGeo, nailMat);
        nailMesh.position.set(0, lens[2] * 0.65, radii[2] * 0.68);
        nailMesh.rotation.x = Math.PI / 12;
        dip.add(nailMesh);

        return { mcp, pip, dip };
      };

      // Construct 5 Anatomically Correct Wizard Fingers:
      // Thumb attaches lower at side of palm (thenar area Y=0.028) angled forward toward palm (-Z)
      const thumb = createFinger(
        sideSign * -0.028, 0.028, -0.008,
        sideSign * -0.5,
        [0.025, 0.020, 0.015],
        [0.0095, 0.0085, 0.0075],
        true,
        0.35,
        sideSign * -0.25
      );
      const index = createFinger(sideSign * -0.018, 0.062, 0, sideSign * -0.08, [0.034, 0.024, 0.018], [0.0085, 0.0075, 0.0065]);
      const middle = createFinger(sideSign * -0.005, 0.065, 0, 0, [0.038, 0.026, 0.020], [0.009, 0.008, 0.007]);
      const ring = createFinger(sideSign * 0.008, 0.063, 0, sideSign * 0.07, [0.035, 0.024, 0.018], [0.0085, 0.0075, 0.0065]);
      const pinky = createFinger(sideSign * 0.021, 0.057, 0, sideSign * 0.18, [0.028, 0.020, 0.016], [0.0075, 0.0065, 0.0055]);

      return {
        armGroup,
        handGroup,
        fingers: { thumb, index, middle, ring, pinky }
      };
    };

    // Instantiate Left Arm & Hand (Palm-Up Open Hand Spellcasting)
    const leftArmData = createFPSArmAndHand(true);
    const leftArm = leftArmData.armGroup;
    leftArm.position.set(-0.20, -0.22, -0.38);
    leftArm.rotation.set(-1.00, 0.30, -0.12);
    // Supinate wrist/hand (Math.PI Y-rotation) so open palm (-Z) faces UP towards camera with thumb on inner right side
    leftArmData.handGroup.rotation.set(-0.30, Math.PI - 0.10, 0.10);
    fpsGroup.add(leftArm);

    // Set Left Hand Cupped Open Palm Pose (Thumb on inner right, fingers cupped gently upwards)
    const lF = leftArmData.fingers;
    lF.thumb.mcp.rotation.set(-0.2, 0.35, -0.2);
    lF.thumb.pip.rotation.x = -0.2;
    lF.thumb.dip.rotation.x = -0.1;

    lF.index.mcp.rotation.x = -0.35;
    lF.index.pip.rotation.x = -0.35;
    lF.index.dip.rotation.x = -0.2;

    lF.middle.mcp.rotation.x = -0.38;
    lF.middle.pip.rotation.x = -0.38;
    lF.middle.dip.rotation.x = -0.2;

    lF.ring.mcp.rotation.x = -0.40;
    lF.ring.pip.rotation.x = -0.40;
    lF.ring.dip.rotation.x = -0.2;

    lF.pinky.mcp.rotation.x = -0.42;
    lF.pinky.pip.rotation.x = -0.42;
    lF.pinky.dip.rotation.x = -0.25;

    // Floating Arcane Spell Casting Orb floating directly ABOVE the open palm (-Z in local hand space)
    const spellOrbGroup = new THREE.Group();
    spellOrbGroup.position.set(0, 0.05, -0.08);
    leftArmData.handGroup.add(spellOrbGroup);

    const spellOrbGeo = new THREE.SphereGeometry(0.032, 16, 16);
    const spellOrbMat = new THREE.MeshStandardMaterial({
      color: 0xaa44ff,
      emissive: 0x9922ff,
      emissiveIntensity: 1.8,
      transparent: true,
      opacity: 0.88,
      roughness: 0.1
    });
    const spellOrb = new THREE.Mesh(spellOrbGeo, spellOrbMat);
    spellOrbGroup.add(spellOrb);

    const spellRingGeo = new THREE.TorusGeometry(0.048, 0.003, 8, 24);
    const spellRingMat = new THREE.MeshBasicMaterial({ color: 0xdd88ff });
    const spellRing1 = new THREE.Mesh(spellRingGeo, spellRingMat);
    const spellRing2 = new THREE.Mesh(spellRingGeo, spellRingMat);
    spellRing2.rotation.x = Math.PI / 2;
    spellOrbGroup.add(spellRing1);
    spellOrbGroup.add(spellRing2);

    const spellLight = new THREE.PointLight(0xbb33ff, 2.2, 3.5);
    spellOrbGroup.add(spellLight);

    // Instantiate Right Arm & Hand (Holding Magic Staff)
    const rightArmData = createFPSArmAndHand(false);
    const rightArm = rightArmData.armGroup;
    rightArm.position.set(0.18, -0.22, -0.38);
    rightArm.rotation.set(-0.85, -0.35, 0.15);
    // Rotate right wrist so palm faces inward/left, thumb on top, knuckles facing right
    rightArmData.handGroup.rotation.set(0.25, -0.40, 0.20);
    fpsGroup.add(rightArm);

    // Set Right Hand Staff Grip Pose (Fingers wrap firmly around staff shaft)
    const rF = rightArmData.fingers;
    rF.thumb.mcp.rotation.set(-0.2, -0.5, 0.4);
    rF.thumb.pip.rotation.x = -0.5;
    rF.thumb.dip.rotation.x = -0.4;

    rF.index.mcp.rotation.set(-0.7, -0.2, -0.2);
    rF.index.pip.rotation.x = -1.1;
    rF.index.dip.rotation.x = -0.8;

    rF.middle.mcp.rotation.set(-0.75, -0.1, -0.15);
    rF.middle.pip.rotation.x = -1.15;
    rF.middle.dip.rotation.x = -0.8;

    rF.ring.mcp.rotation.set(-0.75, 0.1, -0.1);
    rF.ring.pip.rotation.x = -1.15;
    rF.ring.dip.rotation.x = -0.8;

    rF.pinky.mcp.rotation.set(-0.7, 0.2, -0.05);
    rF.pinky.pip.rotation.x = -1.05;
    rF.pinky.dip.rotation.x = -0.7;

    // Wizard Magic Staff (Quyền Trượng Phù Thủy - Lowered so head/orb is fully visible)
    const staffGroup = new THREE.Group();
    
    // Ancient carved wooden shaft (Length 1.0, compact so top is clearly seen in FPS camera)
    const shaftGeo = new THREE.CylinderGeometry(0.015, 0.012, 1.0, 12);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x3a2216, roughness: 0.6, metalness: 0.2 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    staffGroup.add(shaft);

    // Golden spiral vine around shaft
    const vineGeo = new THREE.TorusGeometry(0.021, 0.003, 8, 32);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xe5b839, roughness: 0.2, metalness: 0.9 });
    for (let v = -0.4; v <= 0.4; v += 0.13) {
      const vine = new THREE.Mesh(vineGeo, goldMat);
      vine.position.y = v;
      vine.rotation.x = Math.PI / 3;
      vine.rotation.y = v * 5;
      staffGroup.add(vine);
    }

    // Bottom golden tip
    const finialGeo = new THREE.ConeGeometry(0.02, 0.1, 6);
    const finial = new THREE.Mesh(finialGeo, goldMat);
    finial.position.y = -0.52;
    finial.rotation.x = Math.PI;
    staffGroup.add(finial);

    // Ornate Golden Crown / Crescent at Top (Đầu Quyền Trượng)
    const moonGeo = new THREE.TorusGeometry(0.09, 0.02, 10, 32, Math.PI * 1.35);
    const moon = new THREE.Mesh(moonGeo, goldMat);
    moon.position.y = 0.50;
    moon.rotation.z = -Math.PI * 0.18;
    moon.rotation.y = Math.PI / 2;
    staffGroup.add(moon);

    // Floating Glowing Magic Crystal Orb at Staff Top
    const orbGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00aaff,
        emissiveIntensity: 1.6,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.92
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.y = 0.52;
    staffGroup.add(orb);

    // Outer Arcane Aura Ring orbiting the staff crystal
    const auraGeo = new THREE.TorusGeometry(0.075, 0.004, 8, 24);
    const auraMat = new THREE.MeshBasicMaterial({ color: 0x66ffff });
    const auraRing = new THREE.Mesh(auraGeo, auraMat);
    auraRing.position.y = 0.52;
    staffGroup.add(auraRing);

    const staffLight = new THREE.PointLight(0x00d2ff, 2.8, 4.5);
    staffLight.position.set(0, 0.55, 0);
    staffGroup.add(staffLight);

    // Position staff held directly in right hand's palm (centered in fist at Z=-0.012)
    staffGroup.position.set(0, 0.035, -0.012);
    staffGroup.rotation.set(0.05, 0, 0);
    rightArmData.handGroup.add(staffGroup);

    // --- Procedural Texture for Red & White Striped Stockings (Vớ Sọc Đỏ Trắng theo Ảnh Tham Chiếu) ---
    const createStripedStockingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Red and white horizontal stripes matching reference image
        const stripeHeight = 16;
        for (let y = 0; y < 256; y += stripeHeight * 2) {
          ctx.fillStyle = '#d32f2f'; // Red stripe
          ctx.fillRect(0, y, 128, stripeHeight);
          ctx.fillStyle = '#ffffff'; // White stripe
          ctx.fillRect(0, y + stripeHeight, 128, stripeHeight);
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 4);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const stockingTextureMap = createStripedStockingTexture();

    // --- Player Lower Body Group (Tham chiếu ảnh mẫu: Váy đen lót xanh, Vớ trắng nơ đen, Giày Mary Jane) ---
    const lowerBodyGroup = new THREE.Group();
    scene.add(lowerBodyGroup);

    // 1. Black Witch Dress with Blue Inner Lining
    const dressOuterMat = new THREE.MeshLambertMaterial({
      color: 0x1d1c22, // Black / Dark charcoal outer dress
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0
    });

    const dressInnerMat = new THREE.MeshLambertMaterial({
      color: 0x345785, // Blue inner lining from reference image
      side: THREE.BackSide,
      transparent: true,
      opacity: 0
    });

    const waistCapGeo = new THREE.CircleGeometry(0.16, 24);
    const waistCapMat = new THREE.MeshLambertMaterial({
      color: 0x121116,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });

    // Outer Skirt Mesh (Smaller ring bottom radius 0.18 & pulled back to z = 0.10 so shoe toes extend in front)
    const dressOuterGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.55, 24, 1, true);
    const dressOuter = new THREE.Mesh(dressOuterGeo, dressOuterMat);
    dressOuter.position.set(0, 0.72, 0.10);
    lowerBodyGroup.add(dressOuter);

    // Inner Skirt Lining Mesh
    const dressInnerGeo = new THREE.CylinderGeometry(0.138, 0.176, 0.548, 24, 1, true);
    const dressInner = new THREE.Mesh(dressInnerGeo, dressInnerMat);
    dressInner.position.set(0, 0.72, 0.10);
    lowerBodyGroup.add(dressInner);

    // Waist Cap Mesh
    const waistCap = new THREE.Mesh(waistCapGeo, waistCapMat);
    waistCap.rotation.x = -Math.PI / 2;
    waistCap.position.set(0, 0.98, 0.10);
    lowerBodyGroup.add(waistCap);

    // Dark Trim around dress hem bottom
    const dressTrimMat = new THREE.MeshStandardMaterial({
      color: 0x2d486d,
      roughness: 0.5,
      transparent: true,
      opacity: 0
    });
    const dressTrimGeo = new THREE.TorusGeometry(0.18, 0.010, 8, 24);
    const dressTrim = new THREE.Mesh(dressTrimGeo, dressTrimMat);
    dressTrim.rotation.x = Math.PI / 2;
    dressTrim.position.set(0, 0.445, 0.10);
    lowerBodyGroup.add(dressTrim);

    // 2. White Stockings with Black Ribbons, Skin Tone, and Black Mary Jane Shoes
    const skinLegMat = new THREE.MeshStandardMaterial({
      color: 0xfce2d5, // Fair skin tone
      roughness: 0.5,
      transparent: true,
      opacity: 0
    });

    const stockingMat = new THREE.MeshStandardMaterial({
      color: 0xf2f4f8, // White socks
      roughness: 0.6,
      metalness: 0.05,
      transparent: true,
      opacity: 0
    });

    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x18171c, // Black ribbon bow on socks
      roughness: 0.5,
      transparent: true,
      opacity: 0
    });

    const maryJaneShoeMat = new THREE.MeshStandardMaterial({
      color: 0x1b1a20, // Black Mary Jane cute shoe
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0
    });

    const maryJaneSoleMat = new THREE.MeshStandardMaterial({
      color: 0x0f0e12, // Black sole
      roughness: 0.8,
      transparent: true,
      opacity: 0
    });

    const buckleMat = new THREE.MeshStandardMaterial({
      color: 0xe5b839, // Gold strap buckle
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0
    });

    const createWitchLegAndShoe = (isLeft: boolean) => {
      const legGroup = new THREE.Group();
      const sideSign = isLeft ? -1 : 1;
      // Position legs inside skirt, pushed slightly forward so shoes stick out from front hem
      legGroup.position.set(sideSign * 0.08, 0.44, -0.02);
      // Natural V-shaped feet stance (feet turned slightly outward)
      legGroup.rotation.y = sideSign * -0.12;

      // Thigh (Skin tone inside skirt)
      const thighGeo = new THREE.CylinderGeometry(0.040, 0.038, 0.14, 14);
      const thighMesh = new THREE.Mesh(thighGeo, skinLegMat);
      thighMesh.position.set(0, -0.07, 0);
      legGroup.add(thighMesh);

      // White Sock/Stocking (Calf & Ankle)
      const sockGeo = new THREE.CylinderGeometry(0.038, 0.032, 0.32, 14);
      const sockMesh = new THREE.Mesh(sockGeo, stockingMat);
      sockMesh.position.set(0, -0.28, 0);
      legGroup.add(sockMesh);

      // Black Ribbon Bow on Top Cuff of Sock
      const ribbonBandGeo = new THREE.TorusGeometry(0.0385, 0.004, 8, 16);
      const ribbonBand = new THREE.Mesh(ribbonBandGeo, ribbonMat);
      ribbonBand.rotation.x = Math.PI / 2;
      ribbonBand.position.set(0, -0.13, 0);
      legGroup.add(ribbonBand);

      const ribbonKnotGeo = new THREE.SphereGeometry(0.007, 8, 8);
      const ribbonKnot = new THREE.Mesh(ribbonKnotGeo, ribbonMat);
      ribbonKnot.position.set(0, -0.13, -0.039);
      legGroup.add(ribbonKnot);

      const ribbonLoopGeo = new THREE.TorusGeometry(0.010, 0.0025, 6, 12);
      const loopL = new THREE.Mesh(ribbonLoopGeo, ribbonMat);
      loopL.position.set(-0.010, -0.13, -0.040);
      loopL.rotation.y = 0.3;
      legGroup.add(loopL);

      const loopR = new THREE.Mesh(ribbonLoopGeo, ribbonMat);
      loopR.position.set(0.010, -0.13, -0.040);
      loopR.rotation.y = -0.3;
      legGroup.add(loopR);

      // Foot & Mary Jane Witch Shoe Group (Extended forward past front skirt hem)
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.44, -0.08);
      legGroup.add(shoeGroup);

      // Shoe Main Body (Shorter depth)
      const shoeBodyGeo = new THREE.BoxGeometry(0.080, 0.050, 0.13);
      const shoeBody = new THREE.Mesh(shoeBodyGeo, maryJaneShoeMat);
      shoeBody.position.set(0, 0.022, -0.01);
      shoeGroup.add(shoeBody);

      // Rounded Cute Toe Cap (Shorter toe extension)
      const toeCapGeo = new THREE.SphereGeometry(0.042, 12, 12);
      const toeCap = new THREE.Mesh(toeCapGeo, maryJaneShoeMat);
      toeCap.position.set(0, 0.022, -0.065);
      toeCap.scale.set(0.95, 0.60, 0.75);
      shoeGroup.add(toeCap);

      // Sole Base (Shorter length)
      const soleGeo = new THREE.BoxGeometry(0.084, 0.018, 0.14);
      const sole = new THREE.Mesh(soleGeo, maryJaneSoleMat);
      sole.position.set(0, 0.006, -0.01);
      shoeGroup.add(sole);

      // Cute Witch Block Heel
      const heelGeo = new THREE.BoxGeometry(0.048, 0.030, 0.040);
      const heel = new THREE.Mesh(heelGeo, maryJaneSoleMat);
      heel.position.set(0, -0.01, 0.035);
      shoeGroup.add(heel);

      // Strap across Instep
      const strapGeo = new THREE.TorusGeometry(0.038, 0.004, 6, 14, Math.PI);
      const strap = new THREE.Mesh(strapGeo, maryJaneShoeMat);
      strap.rotation.x = Math.PI / 2;
      strap.position.set(0, 0.044, -0.01);
      shoeGroup.add(strap);

      // Strap Gold Buckle
      const buckleGeo = new THREE.BoxGeometry(0.010, 0.010, 0.005);
      const buckle = new THREE.Mesh(buckleGeo, buckleMat);
      buckle.position.set(sideSign * 0.038, 0.044, -0.01);
      shoeGroup.add(buckle);

      return { legGroup, shoeGroup };
    };

    const leftLegData = createWitchLegAndShoe(true);
    const rightLegData = createWitchLegAndShoe(false);

    lowerBodyGroup.add(leftLegData.legGroup);
    lowerBodyGroup.add(rightLegData.legGroup);

    // Disable raycasting on lower body so spells and interactions don't collide with self
    lowerBodyGroup.traverse((child) => {
      child.raycast = () => {};
    });

    // --- Magic Skills System (Phép Thuật) ---
    interface MagicProjectile {
      mesh: THREE.Object3D;
      velocity: THREE.Vector3;
      type: number;
      lifetime: number;
      maxLifetime: number;
      light?: THREE.PointLight;
    }

    interface PooledParticle {
      mesh: THREE.Object3D;
      velocity: THREE.Vector3;
      lifetime: number;
      maxLifetime: number;
      startScale: number;
      endScale: number;
      inUse: boolean;
    }

    interface ImpactLightItem {
      light: THREE.PointLight;
      life: number;
      maxLife: number;
      initialIntensity: number;
    }

    const activeProjectiles: MagicProjectile[] = [];
    const activeImpactLights: ImpactLightItem[] = [];

    const spellTargetMeshes: THREE.Object3D[] = [];
    const roomLightsList: { light: THREE.PointLight, worldZ: number }[] = [];

    const MAX_DYNAMIC_LIGHTS = 20;
    const lightPool: { light: THREE.PointLight, inUse: boolean }[] = [];
    for (let i = 0; i < MAX_DYNAMIC_LIGHTS; i++) {
        const poolLight = new THREE.PointLight(0xffffff, 0, 10);
        poolLight.visible = false;
        scene.add(poolLight);
        lightPool.push({ light: poolLight, inUse: false });
    }

    const getFreeLight = (color: number, intensity: number, distance: number) => {
        const item = lightPool.find(l => !l.inUse);
        if (item) {
            item.inUse = true;
            item.light.color.setHex(color);
            item.light.intensity = intensity;
            item.light.distance = distance;
            item.light.visible = true;
            return item.light;
        }
        return null;
    };

    const releaseLight = (light?: THREE.PointLight) => {
        if (!light) return;
        const item = lightPool.find(l => l.light === light);
        if (item) {
            item.inUse = false;
            item.light.intensity = 0;
            item.light.visible = false;
        }
    };

    let lastCastTime = 0;
    const cooldownDuration = 0.35; // 0.35s cast cooldown
    let spellRecoil = 0; // Staff & hand recoil impulse

    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0);

    // Shared Geometries & Materials for Skills (0 stutter, 0 allocation overhead)
    const sharedSparkGeo = new THREE.SphereGeometry(0.03, 6, 6);
    const sharedRingGeo = new THREE.RingGeometry(0.05, 0.2, 16);

    const fireballCoreGeo = new THREE.SphereGeometry(0.09, 14, 14);
    const fireballCoreMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xffdd00,
      emissiveIntensity: 4.0,
      roughness: 0.1
    });
    const fireballMantleGeo = new THREE.SphereGeometry(0.13, 12, 12);
    const fireballMantleMat = new THREE.MeshStandardMaterial({
      color: 0xff2200,
      emissive: 0xff3300,
      emissiveIntensity: 3.0,
      transparent: true,
      opacity: 0.65
    });
    const fireballRingGeo = new THREE.TorusGeometry(0.17, 0.02, 8, 16);
    const fireballRingMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });

    const frostIceGeo = new THREE.OctahedronGeometry(0.09, 2);
    const frostIceMat = new THREE.MeshStandardMaterial({
      color: 0x88ffff,
      emissive: 0x00ccff,
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1
    });
    const frostRingGeo = new THREE.TorusGeometry(0.13, 0.015, 6, 16);
    const frostRingMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    
    const snowflakeTex = createSnowflakeTexture();
    const silverIceAoEGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const silverIceAoEMat = new THREE.MeshBasicMaterial({ 
        map: snowflakeTex,
        color: 0x88ffff,
        transparent: true, 
        opacity: 0.8,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    const silverIceDropMat = new THREE.SpriteMaterial({
        map: snowflakeTex,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const sparkBaseMat1 = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff5500,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 1.0
    });
    const sparkBaseMat2 = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 1.0
    });
    const sparkBaseMat3 = new THREE.MeshStandardMaterial({
      color: 0xbb33ff,
      emissive: 0xbb33ff,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 1.0
    });

    const ringBaseMat1 = new THREE.MeshBasicMaterial({ color: 0xff5500, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const ringBaseMat2 = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const ringBaseMat3 = new THREE.MeshBasicMaterial({ color: 0xbb33ff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });

    const sharedBoltMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sharedOuterBoltMat = new THREE.MeshBasicMaterial({ color: 0x6644ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });

    // --- Pre-allocated Zero-GC Particle Pool ---
    const particlePoolGroup = new THREE.Group();
    scene.add(particlePoolGroup);

    const particlePool: PooledParticle[] = [];

    // Pre-create 50 spark meshes
    for (let i = 0; i < 50; i++) {
      const pMesh = new THREE.Mesh(sharedSparkGeo, sparkBaseMat1);
      pMesh.visible = false;
      particlePoolGroup.add(pMesh);
      particlePool.push({
        mesh: pMesh,
        velocity: new THREE.Vector3(),
        lifetime: 0,
        maxLifetime: 1,
        startScale: 1,
        endScale: 0.1,
        inUse: false
      });
    }

    // Pre-create 20 shockwave ring meshes
    for (let i = 0; i < 20; i++) {
      const rMesh = new THREE.Mesh(sharedRingGeo, ringBaseMat1);
      rMesh.visible = false;
      particlePoolGroup.add(rMesh);
      particlePool.push({
        mesh: rMesh,
        velocity: new THREE.Vector3(),
        lifetime: 0,
        maxLifetime: 1,
        startScale: 0.5,
        endScale: 3.5,
        inUse: false
      });
    }

    // Pre-create 40 drop sprite meshes
    for (let i = 0; i < 40; i++) {
      const dMesh = new THREE.Sprite(silverIceDropMat);
      dMesh.visible = false;
      particlePoolGroup.add(dMesh);
      particlePool.push({
        mesh: dMesh,
        velocity: new THREE.Vector3(),
        lifetime: 0,
        maxLifetime: 0.5,
        startScale: 0.35,
        endScale: 0.35,
        inUse: false
      });
    }

    const getFreeParticle = (isRing: boolean, isDrop: boolean) => {
      let p = particlePool.find(item => !item.inUse && (
        isRing ? item.mesh.geometry === sharedRingGeo :
        isDrop ? item.mesh instanceof THREE.Sprite :
        item.mesh.geometry === sharedSparkGeo
      ));
      if (!p) {
        // Recycle oldest in-use particle if pool full
        p = particlePool.find(item => (
          isRing ? item.mesh.geometry === sharedRingGeo :
          isDrop ? item.mesh instanceof THREE.Sprite :
          item.mesh.geometry === sharedSparkGeo
        ));
      }
      if (p) {
        p.inUse = true;
        p.mesh.visible = true;
        p.lifetime = 0;
      }
      return p;
    };

    // Pre-built Reusable Silver Ice AoE Ring
    const silverIceAoEMesh = new THREE.Mesh(silverIceAoEGeo, silverIceAoEMat);
    silverIceAoEMesh.rotation.x = Math.PI / 2;
    silverIceAoEMesh.visible = false;
    scene.add(silverIceAoEMesh);

    let activeIceAoE: { active: boolean; circlePos: THREE.Vector3; light?: THREE.PointLight; timer: number; duration: number; spawnTimer: number } | null = null;

    // Pre-built Lightning Bolt Model (0 runtime TubeGeometry creation, 0 lag spike)
    const createPrebuiltLightningBolt = (segments: number, offsetAmount: number, innerRadius: number, outerRadius: number) => {
      const points: THREE.Vector3[] = [];
      const start = new THREE.Vector3(0, 3.2, 0);
      const end = new THREE.Vector3(0, 0, 0);
      points.push(start);
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const currP = start.clone().lerp(end, t);
        currP.x += (Math.random() - 0.5) * offsetAmount;
        currP.z += (Math.random() - 0.5) * offsetAmount;
        points.push(currP);
      }
      points.push(end);
      const curve = new THREE.CatmullRomCurve3(points);
      const boltGeo = new THREE.TubeGeometry(curve, Math.floor(segments * 1.5), innerRadius, 6, false);
      const boltMesh = new THREE.Mesh(boltGeo, sharedBoltMat);
      const outerGeo = new THREE.TubeGeometry(curve, Math.floor(segments * 1.5), outerRadius, 6, false);
      const outerMesh = new THREE.Mesh(outerGeo, sharedOuterBoltMat);
      boltMesh.add(outerMesh);
      return boltMesh;
    };

    const prebuiltLightningGroup = new THREE.Group();
    const mainBoltMesh = createPrebuiltLightningBolt(12, 0.8, 0.05, 0.15);
    prebuiltLightningGroup.add(mainBoltMesh);

    const branchBoltMeshes: THREE.Object3D[] = [];
    for (let b = 0; b < 4; b++) {
      const branch = createPrebuiltLightningBolt(8, 1.2, 0.015, 0.05);
      prebuiltLightningGroup.add(branch);
      branchBoltMeshes.push(branch);
    }
    prebuiltLightningGroup.visible = false;
    scene.add(prebuiltLightningGroup);

    let activeLightningTimer = 0;
    let activeLightningLight: THREE.PointLight | null = null;

    // Audio synthesizer for magic skills
    const playSpellSound = (type: number) => {
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;

      if (type === 1) {
        // Fireball Sound: Chinh Đồ Pháp sư roaring fire launch & sub-bass punch
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.35);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(140, now);
        subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
        subGain.gain.setValueAtTime(0.35, now);
        subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        subOsc.connect(subGain);
        gain.connect(audioCtx.destination);
        subGain.connect(audioCtx.destination);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 0.35);
        subOsc.stop(now + 0.35);
      } else if (type === 2) {
        // Frost Nova Sound: Crystalline ice chime
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.35);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 3) {
        // Lightning Bolt Sound: Electric plasma crackle
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.setValueAtTime(180, now + 0.05);
        osc.frequency.setValueAtTime(1000, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    };

    // Spawn Impact Particles on spell hit (Zero-GC pooled particles & lights)
    const spawnImpactParticles = (pos: THREE.Vector3, type: number) => {
      const count = type === 3 ? 20 : 15;
      let color = 0xff5500;
      let sparkMat = sparkBaseMat1;

      if (type === 2) {
        color = 0x00ffff;
        sparkMat = sparkBaseMat2;
      } else if (type === 3) {
        color = 0xbb33ff;
        sparkMat = sparkBaseMat3;
      }

      // Flash Point Light
      const impactLight = getFreeLight(color, 8, 5);
      if (impactLight) {
        impactLight.position.copy(pos);
        activeImpactLights.push({
          light: impactLight,
          life: 0.25,
          maxLife: 0.25,
          initialIntensity: 8
        });
      }

      // Expanding Shockwave Ring (Pooled)
      const ringParticle = getFreeParticle(true, false);
      if (ringParticle) {
        ringParticle.mesh.position.copy(pos);
        ringParticle.mesh.lookAt(camera.position);
        (ringParticle.mesh as THREE.Mesh).material = (type === 2 ? ringBaseMat2 : type === 3 ? ringBaseMat3 : ringBaseMat1);
        ringParticle.velocity.set(0, 0, 0);
        ringParticle.startScale = 0.5;
        ringParticle.endScale = 3.5;
        ringParticle.maxLifetime = 0.3;
      }

      // Ember / Ice / Lightning Spark Particles (Pooled)
      for (let i = 0; i < count; i++) {
        const spark = getFreeParticle(false, false);
        if (spark) {
          spark.mesh.position.copy(pos);
          (spark.mesh as THREE.Mesh).material = sparkMat;
          spark.velocity.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.2) * 4,
            (Math.random() - 0.5) * 5
          );
          spark.startScale = 1.0;
          spark.endScale = 0.1;
          spark.maxLifetime = 0.35 + Math.random() * 0.25;
        }
      }
    };

    // Cast Active Magic Skill Function
    const castSpell = () => {
      if (!controls.isLocked) return;
      const now = timer.getElapsed();
      if (now - lastCastTime < cooldownDuration) return;
      lastCastTime = now;

      const currentSkill = activeSkillRef.current;
      spellRecoil = 1.0; // Trigger recoil kick
      playSpellSound(currentSkill);

      // Get origin position from staff top orb
      const spawnPos = new THREE.Vector3();
      orb.getWorldPosition(spawnPos);

      // Raycast vector direction from camera center
      const rayDirection = new THREE.Vector3();
      camera.getWorldDirection(rayDirection);

      if (currentSkill === 1) {
        // --- SKILL 1: HỎA CẦU PHÁP SƯ CHINH ĐỒ (Zhengtu Fireball) ---
        const fbGroup = new THREE.Group();
        fbGroup.position.copy(spawnPos);

        // Glowing Yellow-Gold Inner Core
        const coreMesh = new THREE.Mesh(fireballCoreGeo, fireballCoreMat);
        fbGroup.add(coreMesh);

        // Raging Outer Fire Mantle
        const mantleMesh = new THREE.Mesh(fireballMantleGeo, fireballMantleMat);
        fbGroup.add(mantleMesh);

        // Dual Rotating Fire Rings (Horizontal & Vertical)
        const flameRing1 = new THREE.Mesh(fireballRingGeo, fireballRingMat);
        const flameRing2 = new THREE.Mesh(fireballRingGeo, fireballRingMat);
        flameRing2.rotation.x = Math.PI / 2;
        fbGroup.add(flameRing1, flameRing2);

        const pLight = getFreeLight(0xff5500, 5, 8);
        if (pLight) {
          pLight.position.copy(spawnPos);
        }

        scene.add(fbGroup);

        const speed = 22;
        const velocity = rayDirection.clone().multiplyScalar(speed);

        activeProjectiles.push({
          mesh: fbGroup,
          velocity,
          type: 1,
          lifetime: 0,
          maxLifetime: 3.0,
          light: pLight || undefined
        });

      } else if (currentSkill === 2) {
        // --- SKILL 2: BĂNG BẠC (Silver Ice AoE) ---
        if (activeIceAoE && activeIceAoE.active && activeIceAoE.light) {
          releaseLight(activeIceAoE.light);
        }

        raycaster.setFromCamera(center, camera);
        const intersects = raycaster.intersectObjects(spellTargetMeshes, false);
        
        let targetPoint = spawnPos.clone().add(rayDirection.clone().multiplyScalar(15));
        if (intersects.length > 0) {
          for (let hit of intersects) {
            if (hit.distance > 0.5) {
              targetPoint = hit.point.clone();
              break;
            }
          }
        }
        targetPoint.y = 0; // cap at ground

        const circleY = 3.0; // below ceiling
        const circlePos = targetPoint.clone();
        circlePos.y = circleY;

        silverIceAoEMesh.position.copy(circlePos);
        silverIceAoEMesh.visible = true;

        const pLight = getFreeLight(0x00ffff, 8, 8);
        if (pLight) {
          pLight.position.copy(circlePos);
        }

        activeIceAoE = {
          active: true,
          circlePos,
          light: pLight || undefined,
          timer: 0,
          duration: 2.5,
          spawnTimer: 0
        };

      } else if (currentSkill === 3) {
        // --- SKILL 3: LÔI ĐIỆN (Lightning Strike) ---
        raycaster.setFromCamera(center, camera);
        const intersects = raycaster.intersectObjects(spellTargetMeshes, false);

        let targetPoint = spawnPos.clone().add(rayDirection.clone().multiplyScalar(25));
        if (intersects.length > 0) {
          for (let hit of intersects) {
            if (hit.distance > 0.5) {
              targetPoint = hit.point.clone();
              break;
            }
          }
        }

        targetPoint.y = 0; // target ground
        prebuiltLightningGroup.position.copy(targetPoint);
        prebuiltLightningGroup.rotation.y = Math.random() * Math.PI * 2;

        // Randomize branch rotation slightly for variety
        branchBoltMeshes.forEach(branch => {
          branch.rotation.y = (Math.random() - 0.5) * 1.2;
        });

        prebuiltLightningGroup.visible = true;
        activeLightningTimer = 0.25;

        // Instant impact at target
        spawnImpactParticles(targetPoint, 3);

        if (activeLightningLight) {
          releaseLight(activeLightningLight);
        }
        const boltLight = getFreeLight(0xcc44ff, 15, 12);
        if (boltLight) {
          boltLight.position.copy(targetPoint);
          boltLight.position.y += 1.0;
          activeLightningLight = boltLight;
        }
      }
    };

    controls.addEventListener('unlock', () => {
      lockCooldownRef.current = true;
      setStarted(false);
      setTimeout(() => { lockCooldownRef.current = false; }, 1250);
    });

    controls.addEventListener('lock', () => {
      setStarted(true);
    });

    // Click to lock or Left Click to Cast Skill
    const handleMouseClick = (e: MouseEvent) => {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (controls.isLocked && e.button === 0) {
        castSpell();
      }
    };
    document.addEventListener('mousedown', handleMouseClick);
    
    // Hallway creation
    const hallwayLength = 80;
    const hallwayWidth = 3.5;
    const hallwayHeight = 3.2;

    // Materials - Using Lambert for better performance
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x666666, side: THREE.DoubleSide });
    const ceilingMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
    
    const bloodTexture = createBloodSplatterTexture();
    const bloodMaterial = new THREE.MeshLambertMaterial({ 
        map: bloodTexture, 
        transparent: true, 
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
    });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(hallwayWidth, hallwayLength);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -hallwayLength / 2 + 5; 
    floor.receiveShadow = true;
    scene.add(floor);
    spellTargetMeshes.push(floor);

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(hallwayWidth, hallwayLength);
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = hallwayHeight;
    ceiling.position.z = -hallwayLength / 2 + 5;
    ceiling.receiveShadow = true;
    scene.add(ceiling);
    spellTargetMeshes.push(ceiling);

    const doorWidth = 1.2;
    const doorHeight = 2.4;
    const doors: { mesh: THREE.Mesh, pivot: THREE.Group, isOpen: boolean, isLeft: boolean, roomZ: number }[] = [];

    // Shared Geometries & Materials for Room Objects (Massive memory & performance optimization)
    const roomW = 6;
    const roomD = 5;
    const roomWallMat = new THREE.MeshLambertMaterial({ color: 0xeeebd9, side: THREE.DoubleSide });
    const roomFloorMat = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    const roomCeilingMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const bedFrameMat = new THREE.MeshLambertMaterial({ color: 0x6e3a1e });
    const mattressMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const runnerMat = new THREE.MeshLambertMaterial({ color: 0x8a1525 });
    const pillowMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const wardrobeMat = new THREE.MeshLambertMaterial({ color: 0x4a0a0a });
    const handleMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const noteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const acMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const lampBaseMat = new THREE.MeshLambertMaterial({ color: 0x442211 });
    const lampShadeMat = new THREE.MeshLambertMaterial({ color: 0xffeedd, emissive: 0xffaa44, emissiveIntensity: 0.6 });
    const paintingFrameMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const canvasMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const flowerMat = new THREE.MeshLambertMaterial({ color: 0xdd3333 });

    const roomFloorGeo = new THREE.PlaneGeometry(roomW, roomD);
    const roomCeilingGeo = new THREE.PlaneGeometry(roomW, roomD);
    const roomBackWallGeo = new THREE.PlaneGeometry(roomW, hallwayHeight);
    const roomSideGeo = new THREE.PlaneGeometry(roomD, hallwayHeight);
    const bedFrameGeo = new THREE.BoxGeometry(2.1, 0.4, 2.6);
    const mattressGeo = new THREE.BoxGeometry(2, 0.2, 2.5);
    const runnerGeo = new THREE.BoxGeometry(2.05, 0.21, 0.5);
    const pillowGeo = new THREE.BoxGeometry(0.8, 0.15, 0.4);
    const squarePillowGeo = new THREE.BoxGeometry(0.4, 0.15, 0.4);
    const headboardGeo = new THREE.BoxGeometry(2.1, 0.8, 0.1);
    const wardrobeGeo = new THREE.BoxGeometry(1.2, 2.2, 1.5);
    const handleGeo = new THREE.BoxGeometry(0.02, 0.2, 0.02);
    const noteGeo = new THREE.PlaneGeometry(0.4, 0.3);
    const acGeo = new THREE.BoxGeometry(1.2, 0.4, 0.3);
    const lampBaseGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
    const lampShadeGeo = new THREE.BoxGeometry(0.25, 0.15, 0.25);
    const paintingGeo = new THREE.BoxGeometry(0.05, 0.6, 0.6);
    const canvasGeo = new THREE.PlaneGeometry(0.5, 0.5);
    const flowerGeo = new THREE.PlaneGeometry(0.15, 0.4);

    // Shared Geometries & Materials for Room Debris (Books, Papers, Broken Glass)
    const paperMat = new THREE.MeshLambertMaterial({ color: 0xede6d6, side: THREE.DoubleSide });
    const bookMat1 = new THREE.MeshLambertMaterial({ color: 0x2b3a4a }); // Dark blue book
    const bookMat2 = new THREE.MeshLambertMaterial({ color: 0x5a2a2a }); // Dark red book
    const bookMat3 = new THREE.MeshLambertMaterial({ color: 0x2a4a30 }); // Dark green book
    const bookMat4 = new THREE.MeshLambertMaterial({ color: 0x3d3122 }); // Dark brown book
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0xcceeff,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        metalness: 0.7,
        side: THREE.DoubleSide
    });

    const paperGeo = new THREE.PlaneGeometry(0.22, 0.30);
    const bookGeo = new THREE.BoxGeometry(0.25, 0.05, 0.35);
    const smallBookGeo = new THREE.BoxGeometry(0.20, 0.04, 0.28);
    const glassShardGeo1 = new THREE.OctahedronGeometry(0.08, 0);
    glassShardGeo1.scale(1, 0.15, 1.2);
    const glassShardGeo2 = new THREE.PlaneGeometry(0.12, 0.08);
    const glassShardGeo3 = new THREE.PlaneGeometry(0.07, 0.14);

    const placeRoomDebris = (parentGroup: THREE.Group) => {
        // Randomly place small debris objects like books, papers, or broken glass on the floor
        const debrisCount = 4 + Math.floor(Math.random() * 6);
        const bookMats = [bookMat1, bookMat2, bookMat3, bookMat4];
        const glassGeos = [glassShardGeo1, glassShardGeo2, glassShardGeo3];

        for (let i = 0; i < debrisCount; i++) {
            const type = Math.floor(Math.random() * 3); // 0: paper, 1: book, 2: broken glass
            let x = (Math.random() - 0.5) * (roomW - 1.8);
            let z = -0.8 - Math.random() * (roomD - 1.6);

            // Avoid placing inside bed
            if (x > 0.5 && z < -2.2) {
                x = (Math.random() - 0.7) * 2.0;
            }
            // Avoid placing inside wardrobe
            if (x < -1.5 && z < -3.2) {
                z = -1.0 - Math.random() * 2.0;
            }

            const rotY = Math.random() * Math.PI * 2;

            if (type === 0) {
                // Loose papers
                const sheetCount = 1 + Math.floor(Math.random() * 3);
                for (let s = 0; s < sheetCount; s++) {
                    const paper = new THREE.Mesh(paperGeo, paperMat);
                    paper.rotation.x = -Math.PI / 2;
                    paper.rotation.z = rotY + (Math.random() - 0.5) * 0.8;
                    const offsetX = s === 0 ? 0 : (Math.random() - 0.5) * 0.25;
                    const offsetZ = s === 0 ? 0 : (Math.random() - 0.5) * 0.25;
                    paper.position.set(x + offsetX, 0.012 + s * 0.002, z + offsetZ);
                    parentGroup.add(paper);
                }
            } else if (type === 1) {
                // Scattered book(s)
                const mat = bookMats[Math.floor(Math.random() * bookMats.length)];
                const geo = Math.random() > 0.5 ? bookGeo : smallBookGeo;
                const book = new THREE.Mesh(geo, mat);
                book.rotation.y = rotY;
                if (Math.random() > 0.7) {
                    book.rotation.z = (Math.random() - 0.5) * 0.3;
                }
                book.position.set(x, 0.03, z);
                book.receiveShadow = true;
                parentGroup.add(book);

                if (Math.random() > 0.5) {
                    const mat2 = bookMats[Math.floor(Math.random() * bookMats.length)];
                    const book2 = new THREE.Mesh(smallBookGeo, mat2);
                    book2.rotation.y = rotY + (Math.random() - 0.5) * 0.8;
                    book2.position.set(x + (Math.random() - 0.5) * 0.12, 0.07, z + (Math.random() - 0.5) * 0.12);
                    parentGroup.add(book2);
                }
            } else {
                // Broken glass shards
                const shardCount = 3 + Math.floor(Math.random() * 5);
                for (let g = 0; g < shardCount; g++) {
                    const geo = glassGeos[Math.floor(Math.random() * glassGeos.length)];
                    const shard = new THREE.Mesh(geo, glassMat);
                    const radius = Math.random() * 0.35;
                    const angle = Math.random() * Math.PI * 2;
                    const sx = x + Math.cos(angle) * radius;
                    const sz = z + Math.sin(angle) * radius;

                    if (geo === glassShardGeo1) {
                        shard.rotation.set(Math.random() * 0.4, Math.random() * Math.PI * 2, Math.random() * 0.4);
                        shard.position.set(sx, 0.02, sz);
                    } else {
                        shard.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.2;
                        shard.rotation.z = Math.random() * Math.PI * 2;
                        shard.position.set(sx, 0.015, sz);
                    }
                    parentGroup.add(shard);
                }
            }
        }
    };

    const buildRoom = (parentGroup: THREE.Group, isLeft: boolean) => {
        const floor = new THREE.Mesh(roomFloorGeo, roomFloorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0.01, -roomD/2);
        floor.receiveShadow = true;
        parentGroup.add(floor);
        spellTargetMeshes.push(floor);
        
        const ceiling = new THREE.Mesh(roomCeilingGeo, roomCeilingMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(0, hallwayHeight, -roomD/2);
        parentGroup.add(ceiling);

        const backWall = new THREE.Mesh(roomBackWallGeo, roomWallMat);
        backWall.position.set(0, hallwayHeight/2, -roomD);
        backWall.receiveShadow = true;
        parentGroup.add(backWall);
        spellTargetMeshes.push(backWall);

        const sideWall1 = new THREE.Mesh(roomSideGeo, roomWallMat);
        sideWall1.rotation.y = Math.PI / 2;
        sideWall1.position.set(-roomW/2, hallwayHeight/2, -roomD/2);
        sideWall1.receiveShadow = true;
        parentGroup.add(sideWall1);
        spellTargetMeshes.push(sideWall1);

        const sideWall2 = new THREE.Mesh(roomSideGeo, roomWallMat);
        sideWall2.rotation.y = -Math.PI / 2;
        sideWall2.position.set(roomW/2, hallwayHeight/2, -roomD/2);
        sideWall2.receiveShadow = true;
        parentGroup.add(sideWall2);
        spellTargetMeshes.push(sideWall2);

        // Bed (Wooden frame)
        const bedFrame = new THREE.Mesh(bedFrameGeo, bedFrameMat);
        bedFrame.position.set(roomW/2 - 1.2, 0.2, -roomD + 1.4);
        bedFrame.castShadow = true;
        bedFrame.receiveShadow = true;
        parentGroup.add(bedFrame);

        // Mattress (White)
        const mattress = new THREE.Mesh(mattressGeo, mattressMat);
        mattress.position.set(roomW/2 - 1.2, 0.5, -roomD + 1.4);
        mattress.castShadow = true;
        mattress.receiveShadow = true;
        parentGroup.add(mattress);
        
        // Red runner
        const runner = new THREE.Mesh(runnerGeo, runnerMat);
        runner.position.set(roomW/2 - 1.2, 0.5, -roomD + 1.9);
        parentGroup.add(runner);

        // Pillows
        const pillow1 = new THREE.Mesh(pillowGeo, pillowMat);
        pillow1.position.set(roomW/2 - 0.7, 0.65, -roomD + 0.4);
        pillow1.rotation.x = Math.PI / 12;
        parentGroup.add(pillow1);
        
        const pillow2 = new THREE.Mesh(pillowGeo, pillowMat);
        pillow2.position.set(roomW/2 - 1.7, 0.65, -roomD + 0.4);
        pillow2.rotation.x = Math.PI / 12;
        parentGroup.add(pillow2);
        
        // Red square pillow
        const squarePillow = new THREE.Mesh(squarePillowGeo, runnerMat);
        squarePillow.position.set(roomW/2 - 1.2, 0.7, -roomD + 0.5);
        squarePillow.rotation.x = Math.PI / 6;
        squarePillow.rotation.z = Math.PI / 4;
        parentGroup.add(squarePillow);
        
        // Headboard
        const headboard = new THREE.Mesh(headboardGeo, bedFrameMat);
        headboard.position.set(roomW/2 - 1.2, 0.6, -roomD + 0.1);
        parentGroup.add(headboard);

        // Wardrobe
        const wardrobe = new THREE.Mesh(wardrobeGeo, wardrobeMat);
        wardrobe.position.set(-roomW/2 + 0.7, 1.1, -roomD + 0.85);
        wardrobe.castShadow = true;
        wardrobe.receiveShadow = true;
        parentGroup.add(wardrobe);
        
        // Wardrobe handles
        const handle1 = new THREE.Mesh(handleGeo, handleMat);
        handle1.position.set(-roomW/2 + 1.31, 1.1, -roomD + 0.6);
        parentGroup.add(handle1);
        
        const handle2 = new THREE.Mesh(handleGeo, handleMat);
        handle2.position.set(-roomW/2 + 1.31, 1.1, -roomD + 0.8);
        parentGroup.add(handle2);
        
        // Wardrobe paper note
        const note = new THREE.Mesh(noteGeo, noteMat);
        note.position.set(-roomW/2 + 1.31, 1.5, -roomD + 0.7);
        note.rotation.y = Math.PI / 2;
        parentGroup.add(note);

        // Air Conditioner
        const ac = new THREE.Mesh(acGeo, acMat);
        ac.position.set(0, 2.5, -roomD + 0.15);
        parentGroup.add(ac);

        // Wall lamp
        const lampBase = new THREE.Mesh(lampBaseGeo, lampBaseMat);
        lampBase.position.set(roomW/2 - 0.05, 2.2, -roomD + 1.5);
        parentGroup.add(lampBase);
        
        const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
        lampShade.position.set(roomW/2 - 0.1, 2.2, -roomD + 1.5);
        parentGroup.add(lampShade);

        // Small painting
        const paintingFrame = new THREE.Mesh(paintingGeo, paintingFrameMat);
        paintingFrame.position.set(roomW/2 - 0.03, 2.2, -roomD + 2.5);
        parentGroup.add(paintingFrame);
        
        const canvas = new THREE.Mesh(canvasGeo, canvasMat);
        canvas.position.set(roomW/2 - 0.06, 2.2, -roomD + 2.5);
        canvas.rotation.y = -Math.PI / 2;
        parentGroup.add(canvas);
        
        const flower = new THREE.Mesh(flowerGeo, flowerMat);
        flower.position.set(roomW/2 - 0.07, 2.2, -roomD + 2.5);
        flower.rotation.y = -Math.PI / 2;
        parentGroup.add(flower);

        const roomLight = new THREE.PointLight(0xffaa44, 8, 4.5); // Warm light from lamp
        roomLight.position.set(roomW/2 - 0.5, 2.2, -roomD + 1.5);
        parentGroup.add(roomLight);

        // Blood splatters in the room
        if (Math.random() > 0.3) {
            const numBlood = 1 + Math.floor(Math.random() * 3);
            for(let i=0; i<numBlood; i++) {
                const bSize = 1.5 + Math.random() * 2;
                const blood = new THREE.Mesh(new THREE.PlaneGeometry(bSize, bSize), bloodMaterial);
                blood.rotation.x = -Math.PI / 2;
                blood.rotation.z = Math.random() * Math.PI * 2;
                blood.position.set((Math.random() - 0.5) * (roomW - 1), 0.02, -roomD/2 + (Math.random() - 0.5) * (roomD - 1));
                parentGroup.add(blood);
            }
        }

        // Randomly place debris objects (books, papers, broken glass) on the floor
        placeRoomDebris(parentGroup);

        return roomLight;
    };

    const createRoomNumberTexture = (numStr: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Dark plaque background
            ctx.fillStyle = '#141414';
            ctx.fillRect(0, 0, 256, 128);

            // Metallic border
            ctx.strokeStyle = '#aaaaaa';
            ctx.lineWidth = 8;
            ctx.strokeRect(6, 6, 244, 116);

            ctx.strokeStyle = '#444444';
            ctx.lineWidth = 4;
            ctx.strokeRect(14, 14, 228, 100);

            // White digits (chữ số màu trắng)
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 64px "Courier New", monospace, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(numStr, 128, 64);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    };

    const buildWallWithDoor = (x: number, z: number, rotationY: number, isLeft: boolean, roomNumber: string) => {
        const sideWallWidth = (6 - doorWidth) / 2;
        const sideGeo = new THREE.PlaneGeometry(sideWallWidth, hallwayHeight);
        const topGeo = new THREE.PlaneGeometry(doorWidth, hallwayHeight - doorHeight);
        
        const group = new THREE.Group();
        
        const side1 = new THREE.Mesh(sideGeo, wallMaterial);
        side1.position.set(sideWallWidth/2 + doorWidth/2, hallwayHeight/2, 0);
        side1.receiveShadow = true;
        group.add(side1);
        spellTargetMeshes.push(side1);

        const side2 = new THREE.Mesh(sideGeo, wallMaterial);
        side2.position.set(-sideWallWidth/2 - doorWidth/2, hallwayHeight/2, 0);
        side2.receiveShadow = true;
        group.add(side2);
        spellTargetMeshes.push(side2);
        
        const top = new THREE.Mesh(topGeo, wallMaterial);
        top.position.set(0, doorHeight + (hallwayHeight - doorHeight)/2, 0);
        top.receiveShadow = true;
        group.add(top);
        spellTargetMeshes.push(top);

        // Solid 3D Door Frame Casing (Khuôn khung cửa 3D bịt kín mọi góc lag / hở va chạm)
        const frameThickness = 0.16;
        const frameWidth = 0.08;
        const frameMat = doorMaterial;

        const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(frameWidth, doorHeight, frameThickness), frameMat);
        leftJamb.position.set(-doorWidth / 2 + frameWidth / 2, doorHeight / 2, frameThickness / 2 - 0.02);
        leftJamb.receiveShadow = true;
        group.add(leftJamb);

        const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(frameWidth, doorHeight, frameThickness), frameMat);
        rightJamb.position.set(doorWidth / 2 - frameWidth / 2, doorHeight / 2, frameThickness / 2 - 0.02);
        rightJamb.receiveShadow = true;
        group.add(rightJamb);

        const topJamb = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, frameWidth, frameThickness), frameMat);
        topJamb.position.set(0, doorHeight - frameWidth / 2, frameThickness / 2 - 0.02);
        topJamb.receiveShadow = true;
        group.add(topJamb);

        const pivot = new THREE.Group();
        // Recess the pivot slightly in Z (0.06) and shift slightly inward (0.01) to prevent hinge Z-fighting with the wall
        pivot.position.set(isLeft ? doorWidth/2 - 0.01 : -doorWidth/2 + 0.01, 0, 0.06);
        
        // Make door slightly smaller than the frame gap to avoid scraping
        const door = new THREE.Mesh(new THREE.BoxGeometry(doorWidth - 0.02, doorHeight - 0.02, 0.1), doorMaterial);
        door.position.set(isLeft ? -doorWidth/2 + 0.01 : doorWidth/2 - 0.01, doorHeight/2, 0);
        door.castShadow = true;
        door.receiveShadow = true;
        pivot.add(door);

        // Room number plaque on the door (chữ số màu trắng)
        const plateTex = createRoomNumberTexture(roomNumber);
        const plateMat = new THREE.MeshStandardMaterial({
            map: plateTex,
            roughness: 0.3,
            metalness: 0.5,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1
        });
        const plateWidth = 0.32;
        const plateHeight = 0.16;
        const doorPosX = isLeft ? -doorWidth/2 + 0.01 : doorWidth/2 - 0.01;
        const doorPosY = doorHeight * 0.72;

        // Front face plaque (facing hallway)
        const frontPlate = new THREE.Mesh(new THREE.PlaneGeometry(plateWidth, plateHeight), plateMat);
        frontPlate.position.set(doorPosX, doorPosY, 0.052);
        pivot.add(frontPlate);

        // Back face plaque (facing inside room)
        const backPlate = new THREE.Mesh(new THREE.PlaneGeometry(plateWidth, plateHeight), plateMat);
        backPlate.position.set(doorPosX, doorPosY, -0.052);
        backPlate.rotation.y = Math.PI;
        pivot.add(backPlate);

        group.add(pivot);

        const roomLight = buildRoom(group, isLeft);

        group.position.set(x, 0, z);
        group.rotation.y = rotationY;
        scene.add(group);
        group.updateMatrixWorld(true);

        const lightWorldPos = new THREE.Vector3();
        roomLight.getWorldPosition(lightWorldPos);
        roomLightsList.push({ light: roomLight, worldZ: lightWorldPos.z });
        
        doors.push({ mesh: door, pivot: pivot, isOpen: false, openOutwards: false, isLeft: isLeft, roomZ: z });
    };

    const buildPlainWall = (x: number, z: number, rotationY: number, length: number) => {
        const wall = new THREE.Mesh(new THREE.PlaneGeometry(length, hallwayHeight), wallMaterial);
        wall.position.set(x, hallwayHeight/2, z);
        wall.rotation.y = rotationY;
        wall.receiveShadow = true;
        scene.add(wall);
        spellTargetMeshes.push(wall);
    };

    for (let z = 0; z > -hallwayLength + 10; z -= 6) {
        const roomIdx = Math.round(-z / 6);
        const leftRoomNum = (101 + roomIdx * 2).toString();
        const rightRoomNum = (102 + roomIdx * 2).toString();
        buildWallWithDoor(-hallwayWidth / 2, z, Math.PI / 2, true, leftRoomNum);
        buildWallWithDoor(hallwayWidth / 2, z, -Math.PI / 2, false, rightRoomNum);
    }
    const doorMeshes = doors.map(d => d.mesh);
    
    // Hallway blood splatters
    for (let z = 2; z > -hallwayLength + 5; z -= 4) {
        if (Math.random() > 0.3) {
            const bSize = 2 + Math.random() * 3;
            const blood = new THREE.Mesh(new THREE.PlaneGeometry(bSize, bSize), bloodMaterial);
            blood.rotation.x = -Math.PI / 2;
            blood.rotation.z = Math.random() * Math.PI * 2;
            blood.position.set((Math.random() - 0.5) * (hallwayWidth - 1), 0.015, z + (Math.random() - 0.5) * 3);
            scene.add(blood);
            
            // Sometimes on the walls too
            if (Math.random() > 0.6) {
                const wallBlood = new THREE.Mesh(new THREE.PlaneGeometry(bSize, bSize), bloodMaterial);
                const isLeftWall = Math.random() > 0.5;
                wallBlood.rotation.y = isLeftWall ? Math.PI / 2 : -Math.PI / 2;
                wallBlood.rotation.z = Math.random() * Math.PI * 2;
                wallBlood.position.set(isLeftWall ? -hallwayWidth/2 + 0.015 : hallwayWidth/2 - 0.015, 0.5 + Math.random() * 1.5, z + (Math.random() - 0.5) * 3);
                scene.add(wallBlood);
            }
        }
    }

    // Hallway Cobwebs (Màn nhện cổ quái ma mị ngoài hành lang - Tối ưu hóa hiệu năng)
    const createCobwebTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, 256, 256);

            const cx = 15;
            const cy = 15;
            const numSpokes = 10;
            const maxRadius = 230;

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(220, 225, 235, 0.8)';

            // Radial spokes
            const angles: number[] = [];
            for (let i = 0; i <= numSpokes; i++) {
                const angle = (i / numSpokes) * (Math.PI / 2) + (Math.random() * 0.04 - 0.02);
                angles.push(angle);
                const ex = cx + Math.cos(angle) * maxRadius;
                const ey = cy + Math.sin(angle) * maxRadius;

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(ex, ey);
                ctx.stroke();
            }

            // Sagging concentric arches
            const numRings = 8;
            for (let r = 1; r <= numRings; r++) {
                const dist = (r / numRings) * maxRadius;
                ctx.beginPath();
                for (let i = 0; i < angles.length - 1; i++) {
                    const a1 = angles[i];
                    const a2 = angles[i + 1];

                    const x1 = cx + Math.cos(a1) * dist;
                    const y1 = cy + Math.sin(a1) * dist;
                    const x2 = cx + Math.cos(a2) * dist;
                    const y2 = cy + Math.sin(a2) * dist;

                    const midAngle = (a1 + a2) / 2;
                    const sagFactor = dist * 0.86;
                    const mx = cx + Math.cos(midAngle) * sagFactor;
                    const my = cy + Math.sin(midAngle) * sagFactor;

                    if (i === 0) ctx.moveTo(x1, y1);
                    ctx.quadraticCurveTo(mx, my, x2, y2);
                }
                ctx.lineWidth = 1.0;
                ctx.strokeStyle = `rgba(210, 215, 230, ${0.4 + (r % 2) * 0.3})`;
                ctx.stroke();
            }

            // Hanging threads / torn strands for creepy effect
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = 'rgba(240, 240, 250, 0.6)';
            for (let k = 0; k < 12; k++) {
                const a = Math.random() * (Math.PI / 2);
                const d = 40 + Math.random() * 170;
                const sx = cx + Math.cos(a) * d;
                const sy = cy + Math.sin(a) * d;

                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + (Math.random() - 0.5) * 15, sy + 20 + Math.random() * 25);
                ctx.stroke();
            }
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    };

    const cobwebTex = createCobwebTexture();
    const cobwebMat = new THREE.MeshBasicMaterial({
        map: cobwebTex,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        side: THREE.DoubleSide,
        color: 0xcccccc
    });

    const cobwebGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const largeCobwebGeo = new THREE.PlaneGeometry(2.0, 1.3);

    // Spider Generator & Animation Systems (Thêm nhện to/nhỏ bò & nhện treo lơ lửng)
    const createSpiderMesh = (scale: number = 1.0, isCute: boolean = false) => {
        const spiderGroup = new THREE.Group();
        const darkMat = new THREE.MeshBasicMaterial({ color: isCute ? 0x1e1b1b : 0x121010 });
        const eyeMat = new THREE.MeshBasicMaterial({ color: isCute ? 0x00e5ff : 0xff2200 }); // Cute glowing cyan or red eyes

        // Cephalothorax
        const cephGeo = new THREE.SphereGeometry(0.045 * scale, 6, 6);
        const ceph = new THREE.Mesh(cephGeo, darkMat);
        ceph.position.set(0, 0.025 * scale, 0.035 * scale);
        spiderGroup.add(ceph);

        // Abdomen
        const abdGeo = new THREE.SphereGeometry(0.075 * scale, 6, 6);
        const abd = new THREE.Mesh(abdGeo, darkMat);
        abd.scale.set(1, 0.85, 1.25);
        abd.position.set(0, 0.035 * scale, -0.05 * scale);
        spiderGroup.add(abd);

        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.012 * scale, 4, 4);
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.018 * scale, 0.045 * scale, 0.07 * scale);
        spiderGroup.add(eyeL);

        const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        eyeR.position.set(0.018 * scale, 0.045 * scale, 0.07 * scale);
        spiderGroup.add(eyeR);

        // 8 Legs
        const legGeo = new THREE.CylinderGeometry(0.004 * scale, 0.0015 * scale, 0.14 * scale, 4);
        const legs: THREE.Mesh[] = [];

        for (let side = -1; side <= 1; side += 2) {
            for (let i = 0; i < 4; i++) {
                const leg = new THREE.Mesh(legGeo, darkMat);
                leg.geometry.translate(0, 0.07 * scale, 0); // Pivot at joint
                const spreadAngle = (i - 1.5) * 0.35;
                leg.position.set(side * 0.025 * scale, 0.02 * scale, (i - 1.5) * 0.025 * scale);
                leg.rotation.z = side * (-Math.PI / 3);
                leg.rotation.y = side * Math.PI / 2 + spreadAngle;
                spiderGroup.add(leg);
                legs.push(leg);
            }
        }

        return { group: spiderGroup, legs };
    };

    interface WebSpiderData {
        spiderObj: { group: THREE.Group; legs: THREE.Mesh[] };
        startX: number;
        startY: number;
        endX: number;
        endY: number;
        speed: number;
        progress: number;
        dir: number;
    }

    const webSpidersList: WebSpiderData[] = [];

    // A small spider that peeks down from the ceiling near the entrance.
    const hangingSpider = createSpiderMesh(0.65, true);
    const hangingSpiderAnchorY = hallwayHeight - 0.02;
    const hangingSpiderBaseY = hallwayHeight - 0.18;
    hangingSpider.group.position.set(0.55, hangingSpiderBaseY, -4.5);
    hangingSpider.group.rotation.x = Math.PI;
    scene.add(hangingSpider.group);

    const hangingThread = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.003, 1, 4),
        new THREE.MeshBasicMaterial({ color: 0xdde4e8, transparent: true, opacity: 0.75 })
    );
    hangingThread.position.set(0.55, hangingSpiderAnchorY, -4.5);
    scene.add(hangingThread);

    for (let z = 2; z > -hallwayLength + 8; z -= 6.0) {
        // Upper left corner cobweb
        if (Math.random() > 0.3) {
            const webLeft = new THREE.Mesh(cobwebGeo, cobwebMat);
            webLeft.position.set(-hallwayWidth / 2 + 0.4, hallwayHeight - 0.4, z);
            webLeft.rotation.set(Math.PI / 4, Math.PI / 4, Math.random() * Math.PI * 2);
            webLeft.matrixAutoUpdate = false;
            webLeft.updateMatrix();
            scene.add(webLeft);

            // Small cute spider crawling on webLeft
            const spiderObj = createSpiderMesh(0.26 + Math.random() * 0.08, true);
            const startX = (Math.random() - 0.5) * 0.6;
            const startY = (Math.random() - 0.5) * 0.6;
            const endX = (Math.random() - 0.5) * 0.6;
            const endY = (Math.random() - 0.5) * 0.6;
            spiderObj.group.position.set(startX, startY, 0.015);
            webLeft.add(spiderObj.group);
            webSpidersList.push({
                spiderObj, startX, startY, endX, endY,
                speed: 0.18 + Math.random() * 0.25,
                progress: Math.random(),
                dir: Math.random() > 0.5 ? 1 : -1
            });
        }

        // Upper right corner cobweb
        if (Math.random() > 0.3) {
            const webRight = new THREE.Mesh(cobwebGeo, cobwebMat);
            webRight.position.set(hallwayWidth / 2 - 0.4, hallwayHeight - 0.4, z + 1.5);
            webRight.rotation.set(Math.PI / 4, -Math.PI / 4, Math.random() * Math.PI * 2);
            webRight.matrixAutoUpdate = false;
            webRight.updateMatrix();
            scene.add(webRight);

            // Small cute spider crawling on webRight
            const spiderObj = createSpiderMesh(0.26 + Math.random() * 0.08, true);
            const startX = (Math.random() - 0.5) * 0.6;
            const startY = (Math.random() - 0.5) * 0.6;
            const endX = (Math.random() - 0.5) * 0.6;
            const endY = (Math.random() - 0.5) * 0.6;
            spiderObj.group.position.set(startX, startY, 0.015);
            webRight.add(spiderObj.group);
            webSpidersList.push({
                spiderObj, startX, startY, endX, endY,
                speed: 0.18 + Math.random() * 0.25,
                progress: Math.random(),
                dir: Math.random() > 0.5 ? 1 : -1
            });
        }

        // Hanging cross-ceiling cobweb
        if (Math.random() > 0.6) {
            const webCeiling = new THREE.Mesh(largeCobwebGeo, cobwebMat);
            webCeiling.position.set(0, hallwayHeight - 0.2, z + 3.0);
            webCeiling.rotation.set(Math.PI / 2 + 0.1, 0, Math.random() * Math.PI);
            webCeiling.matrixAutoUpdate = false;
            webCeiling.updateMatrix();
            scene.add(webCeiling);

            // 1-2 small cute spiders crawling on cross-ceiling cobweb
            const count = Math.random() > 0.5 ? 2 : 1;
            for (let c = 0; c < count; c++) {
                const spiderObj = createSpiderMesh(0.24 + Math.random() * 0.08, true);
                const startX = (Math.random() - 0.5) * 1.2;
                const startY = (Math.random() - 0.5) * 0.7;
                const endX = (Math.random() - 0.5) * 1.2;
                const endY = (Math.random() - 0.5) * 0.7;
                spiderObj.group.position.set(startX, startY, 0.015);
                webCeiling.add(spiderObj.group);
                webSpidersList.push({
                    spiderObj, startX, startY, endX, endY,
                    speed: 0.2 + Math.random() * 0.25,
                    progress: Math.random(),
                    dir: Math.random() > 0.5 ? 1 : -1
                });
            }
        }
    }
    
    buildPlainWall(-hallwayWidth/2, 4, Math.PI/2, 2);
    buildPlainWall(hallwayWidth/2, 4, -Math.PI/2, 2);
    
    buildPlainWall(-hallwayWidth/2, -72, Math.PI/2, 6);
    buildPlainWall(hallwayWidth/2, -72, -Math.PI/2, 6);

    // End Wall (surrounding the bright doorway)
    const endWallGeometry = new THREE.PlaneGeometry(hallwayWidth, hallwayHeight);
    const endWall = new THREE.Mesh(endWallGeometry, wallMaterial);
    endWall.position.z = -hallwayLength + 5;
    endWall.position.y = hallwayHeight / 2;
    endWall.receiveShadow = true;
    scene.add(endWall);
    spellTargetMeshes.push(endWall);

    // Glowing doorway at the end
    const endGlowWidth = 1.8;
    const endGlowHeight = 2.6;
    const endGlowGeo = new THREE.PlaneGeometry(endGlowWidth, endGlowHeight);
    const endGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff0c2 });
    const endGlow = new THREE.Mesh(endGlowGeo, endGlowMat);
    endGlow.position.set(0, endGlowHeight / 2, -hallwayLength + 5.01);
    scene.add(endGlow);

    // Start Wall (behind player)
    const startWall = new THREE.Mesh(endWallGeometry, wallMaterial);
    startWall.rotation.y = Math.PI;
    startWall.position.z = 5;
    startWall.position.y = hallwayHeight / 2;
    startWall.receiveShadow = true;
    scene.add(startWall);
    spellTargetMeshes.push(startWall);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.8); // Soft visible ambient
    scene.add(ambientLight);

    // Intense light coming from the glowing doorway
    const endLight = new THREE.PointLight(0xfff0c2, 400, 100);
    endLight.position.set(0, hallwayHeight / 2, -hallwayLength + 6);
    endLight.castShadow = false; // Disabled to save performance (6 passes!)
    scene.add(endLight);
    
    // Directional light ray from the end
    const spotLight = new THREE.SpotLight(0xfff0c2, 200);
    spotLight.position.set(0, hallwayHeight / 2, -hallwayLength + 6);
    spotLight.target.position.set(0, 0, 0);
    spotLight.angle = Math.PI / 8;
    spotLight.penumbra = 1;
    spotLight.castShadow = true; 
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.bias = -0.005;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Floating Talismans Setup (Bùa chú tối ưu hiệu năng, nhẹ mượt 60fps)
    const talismanTex = createTalismanTexture();
    const talismanMat = new THREE.MeshStandardMaterial({
        map: talismanTex,
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide,
        transparent: true,
        emissive: 0xffb300,
        emissiveIntensity: 0.35
    });
    const talismanGeo = new THREE.PlaneGeometry(0.2, 0.45);
    const talismansList: {
        mesh: THREE.Mesh;
        basePos: THREE.Vector3;
        floatSpeed: number;
        floatAmplitude: number;
        driftSpeed: number;
        rotSpeed: THREE.Vector3;
        phase: number;
    }[] = [];

    for (let i = 0; i < 16; i++) {
        const talismanMesh = new THREE.Mesh(talismanGeo, talismanMat);
        const posX = (Math.random() - 0.5) * 4.2;
        const posY = 0.6 + Math.random() * 1.8;
        const posZ = 3.0 - Math.random() * 68.0;
        talismanMesh.position.set(posX, posY, posZ);
        scene.add(talismanMesh);

        talismansList.push({
            mesh: talismanMesh,
            basePos: new THREE.Vector3(posX, posY, posZ),
            floatSpeed: 1.5 + Math.random() * 2.0,
            floatAmplitude: 0.3 + Math.random() * 0.5,
            driftSpeed: 1.5 + Math.random() * 3.0,
            rotSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 2.0,
                (Math.random() - 0.5) * 3.0,
                (Math.random() - 0.5) * 2.0
            ),
            phase: Math.random() * Math.PI * 2
        });
    }

    // Creepy Ghost Setup
    const ghostTex = createGhostTexture();
    const ghostMat = new THREE.SpriteMaterial({ map: ghostTex, transparent: true, opacity: 0 });
    const ghostSprite = new THREE.Sprite(ghostMat);
    ghostSprite.scale.set(1.5, 3, 1);
    
    scene.add(ghostSprite);

    let ghostTriggered = false;
    let ghostProgress = 0; // 0 to 1
    let ghostTimer = 2 + Math.random() * 8; // 2 to 10 seconds random timer
    let currentGhostSpawnZ = -30;
    let ghostDirection = 1; // 1 for left to right, -1 for right to left

    // Movement state
    const moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false
    };

    let velocityY = 0;
    const gravity = -15; // m/s^2
    const jumpForce = 5;
    let isGrounded = true;
    let playerY = 1.6;

    let currentDoorData: { mesh: THREE.Mesh, pivot: THREE.Group, isOpen: boolean, openOutwards: boolean, isLeft: boolean, roomZ: number } | null = null;

    const interact = () => {
        if (!controls.isLocked || !currentDoorData) return;
        if (!currentDoorData.isOpen) {
            const halfHall = hallwayWidth / 2;
            const playerX = camera.position.x;
            if (currentDoorData.isLeft) {
                currentDoorData.openOutwards = (playerX < -halfHall - 0.05);
            } else {
                currentDoorData.openOutwards = (playerX > halfHall + 0.05);
            }
        }
        currentDoorData.isOpen = !currentDoorData.isOpen;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1' || event.code === 'Digit1' || event.code === 'Numpad1') {
        activeSkillRef.current = 1;
        setActiveSkill(1);
      } else if (event.key === '2' || event.code === 'Digit2' || event.code === 'Numpad2') {
        activeSkillRef.current = 2;
        setActiveSkill(2);
      } else if (event.key === '3' || event.code === 'Digit3' || event.code === 'Numpad3') {
        activeSkillRef.current = 3;
        setActiveSkill(3);
      }

      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp': moveState.forward = true; break;
        case 'KeyA':
        case 'ArrowLeft': moveState.left = true; break;
        case 'KeyS':
        case 'ArrowDown': moveState.backward = true; break;
        case 'KeyD':
        case 'ArrowRight': moveState.right = true; break;
        case 'KeyE': if (!event.repeat) interact(); break;
        case 'Space': 
            if (isGrounded && controls.isLocked && !event.repeat) {
                velocityY = jumpForce;
                isGrounded = false;
            }
            break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp': moveState.forward = false; break;
        case 'KeyA':
        case 'ArrowLeft': moveState.left = false; break;
        case 'KeyS':
        case 'ArrowDown': moveState.backward = false; break;
        case 'KeyD':
        case 'ArrowRight': moveState.right = false; break;
        case 'Space': moveState.jump = false; break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Audio context for footsteps
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
    let lastStepTime = 0;

    const playFootstep = () => {
      if (audioCtx.currentTime - lastStepTime < 0.5) return;
      lastStepTime = audioCtx.currentTime;
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    };

    // --- Pre-warm WebGL Shaders for all 3 Magic Skills & Impact Particles ---
    const dummySkillGroup = new THREE.Group();
    dummySkillGroup.position.set(0, -1000, 0); // Placed out of view
    dummySkillGroup.visible = true; // Must be true so WebGLRenderer traverses and compiles all skill materials!

    dummySkillGroup.add(
      new THREE.Mesh(fireballCoreGeo, fireballCoreMat),
      new THREE.Mesh(fireballMantleGeo, fireballMantleMat),
      new THREE.Mesh(fireballRingGeo, fireballRingMat),
      new THREE.Mesh(frostIceGeo, frostIceMat),
      new THREE.Mesh(frostRingGeo, frostRingMat),
      new THREE.Mesh(silverIceAoEGeo, silverIceAoEMat),
      new THREE.Sprite(silverIceDropMat),
      new THREE.Mesh(sharedRingGeo, ringBaseMat1),
      new THREE.Mesh(sharedRingGeo, ringBaseMat2),
      new THREE.Mesh(sharedRingGeo, ringBaseMat3),
      new THREE.Mesh(sharedSparkGeo, sparkBaseMat1),
      new THREE.Mesh(sharedSparkGeo, sparkBaseMat2),
      new THREE.Mesh(sharedSparkGeo, sparkBaseMat3),
      mainBoltMesh,
      branchBoltMeshes[0]
    );
    scene.add(dummySkillGroup);

    // Briefly activate light pool lights during compile pass so shader program includes PointLight uniforms
    lightPool.forEach(item => {
      item.light.intensity = 1;
      item.light.visible = true;
    });

    // Pre-compile full scene shaders & materials in one unified pass
    renderer.compile(scene, camera);
    renderer.render(scene, camera);

    // Clean up dummy pre-warm objects & reset lights
    scene.remove(dummySkillGroup);
    lightPool.forEach(item => {
      item.light.intensity = 0;
      item.light.visible = false;
    });

    // Animation Loop
    const timer = new THREE.Timer();
    const speed = 2.5; // walking speed
    let time = 0;
    let frameId: number;

    const animate = (timestamp?: number) => {
      frameId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const delta = Math.min(timer.getDelta(), 0.1); // Cap delta time
      time += delta;

      // Distance-cull room lights to optimize WebGL shader overhead
      const playerZ = camera.position.z;
      for (let i = 0; i < roomLightsList.length; i++) {
        const item = roomLightsList[i];
        item.light.visible = Math.abs(playerZ - item.worldZ) < 22;
      }

      // Subtly animate the light intensity
      endLight.intensity = 300 + Math.sin(time * 5) * 20;

      // Ghost animation
      if (!ghostTriggered) {
          ghostTimer -= delta;
          if (ghostTimer <= 0) {
              const camDir = new THREE.Vector3();
              camera.getWorldDirection(camDir);
              const lookDirZ = camDir.z < 0 ? -1 : 1;
              
              // 1 room = 6 units. 3 rooms = 18 units.
              // Try spawning ahead (3.25 to 6.25 rooms away = 19.5 to 37.5 units)
              let spawnZ = camera.position.z + lookDirZ * (19.5 + Math.random() * 18);

              // If candidate is out of hallway bounds, try behind player
              if (spawnZ < -70 || spawnZ > 4) {
                  spawnZ = camera.position.z - lookDirZ * (19.5 + Math.random() * 18);
              }

              // Clamp to valid hallway length
              if (spawnZ < -70) spawnZ = -70;
              if (spawnZ > 4) spawnZ = 4;

              const distZ = Math.abs(spawnZ - camera.position.z);

              // Must be strictly greater than 3 rooms (> 18 units) away from player to spawn
              if (distZ > 18.0) {
                  ghostTriggered = true;
                  ghostProgress = 0;
                  currentGhostSpawnZ = spawnZ;
                  ghostDirection = Math.random() > 0.5 ? 1 : -1;
              } else {
                  // Too close to player or <= 3 rooms away: DO NOT spawn, retry later
                  ghostTimer = 1.5 + Math.random() * 2.5;
              }
          }
      }

      if (ghostTriggered) {
          ghostProgress += delta * 0.22; // Takes ~4.5 seconds to cross
          if (ghostProgress >= 1) {
              ghostProgress = 1;
              ghostTriggered = false;
              ghostTimer = 2 + Math.random() * 8; // Reset timer for next spawn
              ghostMat.opacity = 0;
          } else {
              // Fade in and out
              if (ghostProgress < 0.2) {
                  ghostMat.opacity = (ghostProgress / 0.2);
              } else if (ghostProgress > 0.8) {
                  ghostMat.opacity = (1 - ghostProgress) / 0.2;
              } else {
                  ghostMat.opacity = 1;
              }

              // Move from x = -6 to x = 6 or vice versa
              const startX = ghostDirection === 1 ? -6 : 6;
              const endX = ghostDirection === 1 ? 6 : -6;
              const currentX = startX + ghostProgress * (endX - startX);
              const walkBob = Math.sin(ghostProgress * Math.PI * 18) * 0.05;
              ghostSprite.position.set(currentX, 1.5 + walkBob, currentGhostSpawnZ);
          }
      }

      // Update wind-blown flying talismans (Bùa chú bay mượt mà 60fps)
      for (let i = 0; i < talismansList.length; i++) {
          const t = talismansList[i];
          const pt = t.basePos;
          
          let currentZ = pt.z + (time * t.driftSpeed) % 70;
          if (currentZ > 5) currentZ -= 75;
          if (currentZ < -70) currentZ += 75;

          const p = t.phase + time * t.floatSpeed;
          
          t.mesh.position.x = pt.x + Math.sin(p * 0.8) * 0.6 + Math.cos(time * 1.5 + i) * 0.2;
          t.mesh.position.y = pt.y + Math.cos(p * 1.1) * 0.5 + Math.sin(time * 2.0 + i) * 0.15;
          t.mesh.position.z = currentZ;

          t.mesh.rotation.x = Math.sin(time * 5.0 + i) * 0.5 + Math.sin(p) * 0.3;
          t.mesh.rotation.y = Math.cos(time * 4.0 + i * 0.5) * 1.0 + p * 0.2;
          t.mesh.rotation.z = Math.sin(time * 6.0 + i) * 0.6 + Math.cos(p * 1.5) * 0.5;

          // Subtle natural scale pulse for paper flutter effect
          const flutter = 1.0 + Math.sin(time * 12.0 + i * 2.0) * 0.08;
          t.mesh.scale.set(flutter, 1.0 / flutter, 1.0);
      }

      // Door animations
      doors.forEach(door => {
          let targetRotation = 0;
          if (door.isOpen) {
              if (door.isLeft) {
                  targetRotation = door.openOutwards ? Math.PI / 2 : -Math.PI / 2;
              } else {
                  targetRotation = door.openOutwards ? -Math.PI / 2 : Math.PI / 2;
              }
          }
          const diff = targetRotation - door.pivot.rotation.y;
          if (Math.abs(diff) > 0.001) {
              door.pivot.rotation.y += diff * 0.1;
          } else {
              door.pivot.rotation.y = targetRotation;
          }
      });

      // Animate Web Spiders (Nhện nhỏ xinh bò trên tơ nhện đã có sẵn)
      webSpidersList.forEach(ws => {
          ws.progress += ws.speed * ws.dir * delta;
          if (ws.progress > 1) {
              ws.progress = 1;
              ws.dir = -1;
          } else if (ws.progress < 0) {
              ws.progress = 0;
              ws.dir = 1;
          }

          const curX = THREE.MathUtils.lerp(ws.startX, ws.endX, ws.progress);
          const curY = THREE.MathUtils.lerp(ws.startY, ws.endY, ws.progress);
          ws.spiderObj.group.position.set(curX, curY, 0.015);

          const dx = (ws.endX - ws.startX) * ws.dir;
          const dy = (ws.endY - ws.startY) * ws.dir;
          if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
              const angle = Math.atan2(dy, dx);
              ws.spiderObj.group.rotation.z = angle - Math.PI / 2;
          }

          const legWiggle = Math.sin(time * 22 + ws.progress * 8) * 0.28;
          ws.spiderObj.legs.forEach((leg, idx) => {
              leg.rotation.x = (idx % 2 === 0 ? 1 : -1) * legWiggle;
          });
      });

      // Slowly lower the entrance spider, pause briefly, then pull it back up.
      const hangingCycle = (Math.sin(time * 0.75 - Math.PI / 2) + 1) / 2;
      const hangingDrop = THREE.MathUtils.smoothstep(hangingCycle, 0.12, 0.88) * 0.82;
      const hangingSpiderY = hangingSpiderBaseY - hangingDrop;
      hangingSpider.group.position.y = hangingSpiderY;
      hangingSpider.group.rotation.y = Math.sin(time * 1.4) * 0.12;
      hangingThread.position.y = (hangingSpiderAnchorY + hangingSpiderY) / 2;
      hangingThread.scale.y = hangingSpiderAnchorY - hangingSpiderY;
      const hangingRetract = Math.max(0, -Math.cos(time * 0.75 - Math.PI / 2));
      hangingSpider.legs.forEach((leg, idx) => {
          const side = idx < 4 ? -1 : 1;
          const pairIndex = idx % 4;
          const idleTwitch = Math.sin(time * 2.2 + pairIndex * 1.3) * 0.015;
          leg.rotation.x = 0;
          leg.rotation.z = side * (-Math.PI / 3 + hangingRetract * 0.22 + idleTwitch);
      });

      if (controls.isLocked) {
        // Raycast for interactions
        raycaster.setFromCamera(center, camera);
        const intersects = raycaster.intersectObjects(doorMeshes, false);
        
        if (intersects.length > 0 && intersects[0].distance < 3) {
            const doorMesh = intersects[0].object;
            currentDoorData = doors.find(d => d.mesh === doorMesh) || null;
        } else {
            currentDoorData = null;
        }

        if (interactTextRef.current) {
            if (currentDoorData) {
                interactTextRef.current.style.opacity = '1';
                interactTextRef.current.innerText = currentDoorData.isOpen ? "Nhấn [E] để Đóng" : "Nhấn [E] để Mở";
            } else {
                interactTextRef.current.style.opacity = '0';
            }
        }

        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const moveZ = Number(moveState.forward) - Number(moveState.backward);
        const moveX = Number(moveState.right) - Number(moveState.left);

        if (moveZ !== 0 || moveX !== 0) {
          // Normalize movement vector to prevent faster diagonal movement
          const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
          const normX = moveX / length;
          const normZ = moveZ / length;

          const oldX = camera.position.x;
          const oldZ = camera.position.z;

          controls.moveRight(normX * speed * delta);
          controls.moveForward(normZ * speed * delta);
          
          const newX = camera.position.x;
          const newZ = camera.position.z;
          
          const collisionMargin = 0.25;
          const halfHall = hallwayWidth / 2;
          
          const isValidPosition = (x: number, z: number) => {
              // 1. Check main hallway
              if (x > -halfHall + collisionMargin && 
                  x < halfHall - collisionMargin && 
                  z < 4 && 
                  z > -hallwayLength + 6) {
                  return true;
              }
              
              // 2. Check rooms and doorways
              for (let i = 0; i < doors.length; i++) {
                  const door = doors[i];
                  const roomZ = door.roomZ;
                  const doorMinZ = roomZ - doorWidth / 2 + collisionMargin;
                  const doorMaxZ = roomZ + doorWidth / 2 - collisionMargin;
                  
                  const rMinZ = roomZ - 3 + collisionMargin;
                  const rMaxZ = roomZ + 3 - collisionMargin;

                  if (z >= rMinZ && z <= rMaxZ) {
                      if (door.isLeft) {
                          const roomMinX = -halfHall - 5 + collisionMargin;
                          const roomMaxX = -halfHall + collisionMargin;
                          
                          if (x < roomMaxX && x > roomMinX) {
                              const inDoorwayZ = (z >= doorMinZ && z <= doorMaxZ);
                              
                              if (x >= -halfHall - collisionMargin) {
                                  if (!inDoorwayZ || !door.isOpen) {
                                      continue;
                                  }
                              }

                              const lx = roomZ - z;
                              const lz = x + halfHall;
                              const feetY = playerY - 1.6;

                              if (lx > 0.75 - collisionMargin && lx < 2.85 + collisionMargin && lz > -5.0 - collisionMargin && lz < -2.4 + collisionMargin) {
                                  if (feetY < 0.6 - 0.1) return false;
                              }
                              if (lx > -2.9 - collisionMargin && lx < -1.7 + collisionMargin && lz > -4.9 - collisionMargin && lz < -3.4 + collisionMargin) {
                                  return false;
                              }
                              if (door.isOpen) {
                                  const lxMin = 0.6 - 0.1 - collisionMargin;
                                  const lxMax = 0.6 + 0.1 + collisionMargin;
                                  const lzMin = door.openOutwards ? (-0.1 - collisionMargin) : (-1.2 - collisionMargin);
                                  const lzMax = door.openOutwards ? (1.2 + collisionMargin) : (0.1 + collisionMargin);

                                  const isInsidePanel = (lx > lxMin && lx < lxMax && lz > lzMin && lz < lzMax);
                                  if (isInsidePanel) {
                                      const oldLx = roomZ - oldZ;
                                      const oldLz = oldX + halfHall;
                                      const isOldInsidePanel = (oldLx > lxMin && oldLx < lxMax && oldLz > lzMin && oldLz < lzMax);
                                      if (!isOldInsidePanel) {
                                          return false;
                                      }
                                  }
                              }
                              return true;
                          }
                      } else {
                          const roomMinX = halfHall - collisionMargin;
                          const roomMaxX = halfHall + 5 - collisionMargin;
                          
                          if (x > roomMinX && x < roomMaxX) {
                              const inDoorwayZ = (z >= doorMinZ && z <= doorMaxZ);
                              
                              if (x <= halfHall + collisionMargin) {
                                  if (!inDoorwayZ || !door.isOpen) {
                                      continue;
                                  }
                              }

                              const lx = z - roomZ;
                              const lz = halfHall - x;
                              const feetY = playerY - 1.6;

                              if (lx > 0.75 - collisionMargin && lx < 2.85 + collisionMargin && lz > -5.0 - collisionMargin && lz < -2.4 + collisionMargin) {
                                  if (feetY < 0.6 - 0.1) return false;
                              }
                              if (lx > -2.9 - collisionMargin && lx < -1.7 + collisionMargin && lz > -4.9 - collisionMargin && lz < -3.4 + collisionMargin) {
                                  return false;
                              }
                              if (door.isOpen) {
                                  const lxMin = -0.6 - 0.1 - collisionMargin;
                                  const lxMax = -0.6 + 0.1 + collisionMargin;
                                  const lzMin = door.openOutwards ? (-0.1 - collisionMargin) : (-1.2 - collisionMargin);
                                  const lzMax = door.openOutwards ? (1.2 + collisionMargin) : (0.1 + collisionMargin);

                                  const isInsidePanel = (lx > lxMin && lx < lxMax && lz > lzMin && lz < lzMax);
                                  if (isInsidePanel) {
                                      const oldLx = oldZ - roomZ;
                                      const oldLz = halfHall - oldX;
                                      const isOldInsidePanel = (oldLx > lxMin && oldLx < lxMax && oldLz > lzMin && oldLz < lzMax);
                                      if (!isOldInsidePanel) {
                                          return false;
                                      }
                                  }
                              }
                              return true;
                          }
                      }
                  }
              }
              return false;
          };

          if (!isValidPosition(newX, oldZ)) {
              camera.position.x = oldX;
          }
          if (!isValidPosition(camera.position.x, newZ)) {
              camera.position.z = oldZ;
          }

          if (isGrounded) {
              playFootstep();
          }
        }
        
        // Vertical movement (Gravity & Jump)
        const getFloorHeight = (x: number, z: number) => {
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i];
                const roomZ = door.pivot.parent!.position.z;
                const inLeft = door.isLeft && x < -hallwayWidth / 2 && x > -hallwayWidth / 2 - 5 && z > roomZ - 3 && z < roomZ + 3;
                const inRight = !door.isLeft && x > hallwayWidth / 2 && x < hallwayWidth / 2 + 5 && z > roomZ - 3 && z < roomZ + 3;
                if (inLeft || inRight) {
                    const lx = door.isLeft ? roomZ - z : z - roomZ;
                    const lz = door.isLeft ? x + hallwayWidth/2 : hallwayWidth/2 - x;
                    if (lx > 0.75 && lx < 2.85 && lz > -5.0 && lz < -2.4) return 0.6; // Bed
                    if (lx > -2.9 && lx < -1.7 && lz > -4.9 && lz < -3.4) return 2.2; // Wardrobe
                }
            }
            return 0;
        };

        const targetPlayerY = 1.6 + getFloorHeight(camera.position.x, camera.position.z);

        if (!isGrounded) {
            velocityY += gravity * delta;
            playerY += velocityY * delta;
            
            if (playerY <= targetPlayerY) {
                playerY = targetPlayerY;
                velocityY = 0;
                isGrounded = true;
            }
            camera.position.y = playerY;
        } else {
            if (playerY > targetPlayerY + 0.1) {
                isGrounded = false;
            } else {
                playerY = targetPlayerY;
            }

            // Animate Staff Crystal Orb & Magic Aura
            orb.rotation.y = time * 1.8;
            orb.position.y = 0.52 + Math.sin(time * 2.5) * 0.01;
            auraRing.rotation.x = time * 2.5;
            auraRing.rotation.z = time * 1.8;
            staffLight.intensity = 2.4 + Math.sin(time * 4) * 0.6;

            // Animate Left Hand Spellcasting Magic Orb Levitation & Energy Rings (Niệm Chú Thuật)
            spellOrbGroup.position.z = -0.08 + Math.sin(time * 3.0) * 0.015;
            spellOrb.rotation.y = time * 2.5;
            spellRing1.rotation.x = time * 3.2;
            spellRing2.rotation.z = time * 2.8;
            spellOrbMat.emissiveIntensity = 1.8 + Math.sin(time * 5) * 0.5;
            spellLight.intensity = 2.2 + Math.sin(time * 5) * 0.5;

            // Left Hand Cupped Finger Spellweaving Animation ("Niệm Chú Thuật")
            lF.index.mcp.rotation.x = -0.35 + Math.sin(time * 3.2) * 0.05;
            lF.middle.mcp.rotation.x = -0.38 + Math.sin(time * 3.2 + 0.4) * 0.05;
            lF.ring.mcp.rotation.x = -0.40 + Math.sin(time * 3.2 + 0.8) * 0.05;
            lF.pinky.mcp.rotation.x = -0.42 + Math.sin(time * 3.2 + 1.2) * 0.05;
            lF.thumb.mcp.rotation.x = -0.20 + Math.cos(time * 2.2) * 0.04;

            if (isGrounded && (moveZ !== 0 || moveX !== 0)) {
                const bob = Math.sin(time * 8) * 0.045;
                camera.position.y = playerY + bob;
                fpsGroup.position.y = Math.sin(time * 8) * 0.012;
                fpsGroup.position.x = Math.cos(time * 4) * 0.008;

                // Smooth staff sway while walking (holding staff upright in right hand)
                staffGroup.rotation.z = Math.sin(time * 8) * 0.015;
                staffGroup.rotation.x = 0.05 + Math.cos(time * 8) * 0.015;

                // Dual-hand walk sync (Left hand spellcasting, Right hand staff)
                leftArm.position.y = -0.24 + Math.sin(time * 8) * 0.012;
                leftArm.position.z = -0.38 + Math.cos(time * 4) * 0.012;

                rightArm.position.y = -0.24 + Math.sin(time * 8) * 0.012;
                rightArm.position.z = -0.38 + Math.cos(time * 4) * 0.012;
            } else {
                camera.position.y += (playerY - camera.position.y) * 0.1;
                fpsGroup.position.y += (0 - fpsGroup.position.y) * 0.1;
                fpsGroup.position.x += (0 - fpsGroup.position.x) * 0.1;

                // Smooth idle breathing for staff & hands
                const idleSway = Math.sin(time * 2.2);
                staffGroup.rotation.z = idleSway * 0.008;
                staffGroup.rotation.x = 0.05 + Math.cos(time * 2.2) * 0.008;

                leftArm.position.y += ((-0.24 + idleSway * 0.008) - leftArm.position.y) * 0.1;
                leftArm.position.z += (-0.38 - leftArm.position.z) * 0.1;

                rightArm.position.y += ((-0.24 + idleSway * 0.008) - rightArm.position.y) * 0.1;
                rightArm.position.z += (-0.38 - rightArm.position.z) * 0.1;
            }

            // Wizard Spell Channeling / Interaction Gesture (When near door or interacting)
            if (currentDoorData !== null) {
                // Left hand raises up and projects spell energy forward
                leftArm.position.z += (-0.32 - leftArm.position.z) * 0.15;
                leftArm.position.y += (-0.14 - leftArm.position.y) * 0.15;
                leftArm.position.x += (-0.15 - leftArm.position.x) * 0.15;

                // Spell orb glows intensely during interaction
                spellOrbMat.emissiveIntensity = 3.2 + Math.sin(time * 12) * 1.0;
                spellLight.intensity = 4.0;
            } else if (!isGrounded) {
                // Mid-air floating spell stance
                leftArm.position.y += (-0.18 - leftArm.position.y) * 0.1;
                lF.index.mcp.rotation.z = -0.16;
                lF.middle.mcp.rotation.z = -0.06;
                lF.ring.mcp.rotation.z = 0.06;
                lF.pinky.mcp.rotation.z = 0.18;
            } else {
                // Return left hand to spellcasting position
                leftArm.position.x += (-0.20 - leftArm.position.x) * 0.1;
                leftArm.position.y += (-0.24 - leftArm.position.y) * 0.1;
                leftArm.position.z += (-0.38 - leftArm.position.z) * 0.1;

                lF.index.mcp.rotation.z = -0.06;
                lF.middle.mcp.rotation.z = 0;
                lF.ring.mcp.rotation.z = 0.06;
                lF.pinky.mcp.rotation.z = 0.15;
            }
        }
      }

      // --- Update Player Lower Body (Váy đen lót xanh, Vớ trắng nơ đen & Giày Mary Jane khi Cúi Đầu) ---
      const camWorldDir = new THREE.Vector3();
      camera.getWorldDirection(camWorldDir);
      const playerYaw = Math.atan2(-camWorldDir.x, -camWorldDir.z);

      // Hiển thị phần thân dưới và chân khi player nghiêng camera cúi xuống
      const lookDownFactor = THREE.MathUtils.clamp((-camWorldDir.y) / 0.22, 0, 1);

      if (lookDownFactor > 0.001) {
        lowerBodyGroup.visible = true;

        dressOuterMat.opacity = lookDownFactor;
        dressInnerMat.opacity = lookDownFactor;
        waistCapMat.opacity = lookDownFactor;
        dressTrimMat.opacity = lookDownFactor;
        skinLegMat.opacity = lookDownFactor;
        stockingMat.opacity = lookDownFactor;
        ribbonMat.opacity = lookDownFactor;
        maryJaneShoeMat.opacity = lookDownFactor;
        maryJaneSoleMat.opacity = lookDownFactor;
        buckleMat.opacity = lookDownFactor;

        // Đặt vị trí thân dưới ngay dưới camera eye để góc nhìn từ trên xuống thấy được đôi giày Mary Jane nhô ra rất rõ ràng
        const backOffset = 0.04;
        const posX = camera.position.x + Math.sin(playerYaw) * backOffset;
        const posZ = camera.position.z + Math.cos(playerYaw) * backOffset;
        const floorLevel = playerY - 1.6;

        lowerBodyGroup.position.set(posX, floorLevel, posZ);
        lowerBodyGroup.rotation.y = playerYaw;
      } else {
        lowerBodyGroup.visible = false;
      }

      // Leg stride walking animation when moving and grounded
      const isMoving = controls.isLocked && (moveState.forward || moveState.backward || moveState.left || moveState.right);
      if (isGrounded && isMoving) {
        const stride = Math.sin(time * 8);
        leftLegData.legGroup.rotation.x = stride * 0.35;
        rightLegData.legGroup.rotation.x = -stride * 0.35;
        leftLegData.legGroup.position.y = 0.44 + Math.max(0, stride) * 0.04;
        rightLegData.legGroup.position.y = 0.44 + Math.max(0, -stride) * 0.04;
      } else {
        leftLegData.legGroup.rotation.x += (0 - leftLegData.legGroup.rotation.x) * 0.1;
        rightLegData.legGroup.rotation.x += (0 - rightLegData.legGroup.rotation.x) * 0.1;
        leftLegData.legGroup.position.y += (0.44 - leftLegData.legGroup.position.y) * 0.1;
        rightLegData.legGroup.position.y += (0.44 - rightLegData.legGroup.position.y) * 0.1;
      }

      // --- Update Active Magic Projectiles ---
      for (let i = activeProjectiles.length - 1; i >= 0; i--) {
        const proj = activeProjectiles[i];
        proj.lifetime += delta;

        proj.mesh.position.addScaledVector(proj.velocity, delta);
        proj.mesh.rotation.x += delta * 6;
        proj.mesh.rotation.y += delta * 8;

        if (proj.light) {
          proj.light.position.copy(proj.mesh.position);
        }

        // Spawn trailing flame tail for Fireball (Skill 1 - Pooled)
        if (proj.type === 1) {
          for (let k = 0; k < 2; k++) {
            const trailParticle = getFreeParticle(false, false);
            if (trailParticle) {
              const offset = new THREE.Vector3(
                (Math.random() - 0.5) * 0.08,
                (Math.random() - 0.5) * 0.08,
                (Math.random() - 0.5) * 0.08
              );
              trailParticle.mesh.position.copy(proj.mesh.position).add(offset);
              (trailParticle.mesh as THREE.Mesh).material = sparkBaseMat1;

              trailParticle.velocity.copy(proj.velocity).multiplyScalar(-0.12).add(
                new THREE.Vector3(
                  (Math.random() - 0.5) * 0.6,
                  (Math.random() - 0.2) * 0.6,
                  (Math.random() - 0.5) * 0.6
                )
              );
              trailParticle.startScale = 1.6;
              trailParticle.endScale = 0.1;
              trailParticle.maxLifetime = 0.18 + Math.random() * 0.08;
            }
          }
        }

        let hit = false;
        const pos = proj.mesh.position;

        if (proj.lifetime > 0.02) {
          if (
            pos.y <= 0.05 ||
            pos.y >= hallwayHeight - 0.1 ||
            pos.z >= 4.9 ||
            pos.z <= -hallwayLength + 5.1
          ) {
            hit = true;
          } else {
            const halfHall = hallwayWidth / 2 - 0.1; // 1.65
            if (Math.abs(pos.x) > halfHall) {
              const isLeft = pos.x < 0;
              let inValidRoomSpace = false;

              for (let d = 0; d < doors.length; d++) {
                const door = doors[d];
                if (door.isLeft !== isLeft) continue;

                const rZ = door.roomZ;
                if (pos.z >= rZ - 2.85 && pos.z <= rZ + 2.85) {
                  const inDoorwayX = isLeft
                    ? (pos.x <= -1.65 && pos.x >= -2.15)
                    : (pos.x >= 1.65 && pos.x <= 2.15);

                  if (inDoorwayX) {
                    const inFrame = (pos.z >= rZ - 0.55 && pos.z <= rZ + 0.55 && pos.y <= 2.35);
                    if (door.isOpen && inFrame) {
                      inValidRoomSpace = true;
                      break;
                    }
                  } else {
                    const inRoomX = isLeft
                      ? (pos.x < -2.15 && pos.x >= -6.65)
                      : (pos.x > 2.15 && pos.x <= 6.65);

                    if (inRoomX) {
                      inValidRoomSpace = true;
                      break;
                    }
                  }
                }
              }

              if (!inValidRoomSpace) {
                hit = true;
              }
            }
          }
        }

        if (hit || proj.lifetime >= proj.maxLifetime) {
          spawnImpactParticles(pos.clone(), proj.type);
          if (proj.light) {
            releaseLight(proj.light);
          }
          scene.remove(proj.mesh);
          activeProjectiles.splice(i, 1);
        }
      }

      // --- Update Active Pooled Particles & Shockwaves ---
      for (let i = 0; i < particlePool.length; i++) {
        const p = particlePool[i];
        if (!p.inUse) continue;

        p.lifetime += delta;
        const progress = p.lifetime / p.maxLifetime;

        p.mesh.position.addScaledVector(p.velocity, delta);

        // Immediate recycling for ice drops hitting floor (y <= 0)
        if (p.mesh instanceof THREE.Sprite) {
          if (p.mesh.position.y <= 0 || progress >= 1.0) {
            p.inUse = false;
            p.mesh.visible = false;

            if (p.mesh.position.y <= 0) {
              const spark = getFreeParticle(false, false);
              if (spark) {
                spark.mesh.position.set(p.mesh.position.x, 0.05, p.mesh.position.z);
                (spark.mesh as THREE.Mesh).material = sparkBaseMat2;
                spark.velocity.set(
                  (Math.random() - 0.5) * 2,
                  Math.random() * 2 + 0.5,
                  (Math.random() - 0.5) * 2
                );
                spark.startScale = 0.4;
                spark.endScale = 0.05;
                spark.maxLifetime = 0.18;
              }
            }
            continue;
          }
        }

        if (progress >= 1.0) {
          p.inUse = false;
          p.mesh.visible = false;
        } else {
          const currentScale = THREE.MathUtils.lerp(p.startScale, p.endScale, progress);
          p.mesh.scale.set(currentScale, currentScale, currentScale);
        }
      }

      // --- Update Active Impact Lights Fade ---
      for (let i = activeImpactLights.length - 1; i >= 0; i--) {
        const item = activeImpactLights[i];
        item.life -= delta;
        if (item.life <= 0) {
          releaseLight(item.light);
          activeImpactLights.splice(i, 1);
        } else {
          item.light.intensity = (item.life / item.maxLife) * item.initialIntensity;
        }
      }

      // --- Update Active Ice AoE Rain Spawner ---
      if (activeIceAoE && activeIceAoE.active) {
        activeIceAoE.timer += delta;
        activeIceAoE.spawnTimer += delta;

        // Smoothly rotate the ice magic circle
        silverIceAoEMesh.rotation.z += delta * 1.5;

        if (activeIceAoE.spawnTimer >= 0.12) {
          activeIceAoE.spawnTimer = 0;
          for (let i = 0; i < 3; i++) {
            const drop = getFreeParticle(false, true);
            if (drop) {
              const r = Math.random() * 1.4;
              const theta = Math.random() * Math.PI * 2;
              const spawnX = activeIceAoE.circlePos.x + r * Math.cos(theta);
              const spawnZ = activeIceAoE.circlePos.z + r * Math.sin(theta);
              drop.mesh.position.set(spawnX, activeIceAoE.circlePos.y, spawnZ);
              drop.velocity.set(0, -12 - Math.random() * 5, 0);
              drop.startScale = 0.35;
              drop.endScale = 0.35;
              drop.maxLifetime = 0.5;
            }
          }
        }

        if (activeIceAoE.timer >= activeIceAoE.duration) {
          activeIceAoE.active = false;
          silverIceAoEMesh.visible = false;
          if (activeIceAoE.light) releaseLight(activeIceAoE.light);
        }
      }

      // --- Update Active Prebuilt Lightning Bolt Visibility ---
      if (prebuiltLightningGroup.visible) {
        activeLightningTimer -= delta;
        if (activeLightningTimer <= 0) {
          prebuiltLightningGroup.visible = false;
          if (activeLightningLight) {
            releaseLight(activeLightningLight);
            activeLightningLight = null;
          }
        }
      }

      // --- Update Spell Recoil for Staff & Hands ---
      if (spellRecoil > 0) {
        spellRecoil -= delta * 4.5;
        if (spellRecoil < 0) spellRecoil = 0;

        staffGroup.rotation.x = 0.05 - spellRecoil * 0.35;
        staffGroup.position.z = -0.012 - spellRecoil * 0.04;
        leftArm.position.z = -0.38 - spellRecoil * 0.05;
        leftArm.position.y = -0.24 + spellRecoil * 0.03;
      }

      renderer.clear();
      fpsGroup.visible = false;
      renderer.render(scene, camera);
      fpsGroup.visible = true;
      renderer.clearDepth();
      renderer.render(fpsGroup, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousedown', handleMouseClick);
      controlsRef.current = null;
      controls.dispose();
      if (audioCtx.state !== 'closed') audioCtx.close();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="absolute inset-0 overflow-hidden bg-black" />
      
      <div 
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-red-700 font-sans cursor-pointer select-none transition-all duration-200 hover:text-red-500 ${
          started ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`} 
        onClick={() => {
          if (lockCooldownRef.current) return;
          if (controlsRef.current && !controlsRef.current.isLocked) {
            controlsRef.current.lock();
          }
        }}
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-widest mb-8">HÀNH LANG</h1>
        <p className="text-xl md:text-2xl animate-pulse tracking-widest">NHẤN ĐỂ VÀO</p>
        <p className="mt-12 text-sm text-red-900 font-sans tracking-normal">CẢNH BÁO: Có ánh sáng nhấp nháy và âm thanh bất ngờ</p>
      </div>

      {/* Top Controls Bar */}
      <div className="absolute top-6 left-6 pointer-events-none z-10">
        <div className="text-white/70 font-sans text-xs md:text-sm bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
          [1, 2, 3] Chọn Phép &nbsp;•&nbsp; [CHUỘT TRÁI] Bắn Phép &nbsp;•&nbsp; [W,A,S,D] Di chuyển &nbsp;•&nbsp; [E] Tương tác &nbsp;•&nbsp; [SPACE] Nhảy
        </div>
      </div>

      {/* Magic Skill Bar HUD Overlay (Small Vertical Squares Centered Right) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto z-20 flex flex-col items-center gap-3 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        {/* Skill 1: Hỏa Cầu */}
        <button
          onClick={() => {
            activeSkillRef.current = 1;
            setActiveSkill(1);
          }}
          title="Hỏa Cầu (Pháp Sư Chinh Đồ)"
          className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 cursor-pointer ${
            activeSkill === 1
              ? 'bg-amber-500/25 border-2 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="absolute top-1.5 left-1.5 flex items-center justify-center w-4 h-4 rounded bg-amber-500/40 text-amber-300 font-mono font-bold text-[10px] border border-amber-400/50">
            1
          </span>
          <span className="text-2xl mt-1">🔥</span>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5 text-amber-200/90 leading-none">Hỏa Cầu</span>
        </button>

        {/* Skill 2: Băng Bạc */}
        <button
          onClick={() => {
            activeSkillRef.current = 2;
            setActiveSkill(2);
          }}
          title="Băng Bạc (Silver Ice)"
          className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 cursor-pointer ${
            activeSkill === 2
              ? 'bg-cyan-500/25 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-110'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="absolute top-1.5 left-1.5 flex items-center justify-center w-4 h-4 rounded bg-cyan-500/40 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-400/50">
            2
          </span>
          <span className="text-2xl mt-1">❄️</span>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5 text-cyan-200/90 leading-none">Băng Bạc</span>
        </button>

        {/* Skill 3: Lôi Điện */}
        <button
          onClick={() => {
            activeSkillRef.current = 3;
            setActiveSkill(3);
          }}
          title="Lôi Điện (Lightning Strike)"
          className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 cursor-pointer ${
            activeSkill === 3
              ? 'bg-purple-500/25 border-2 border-purple-400 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="absolute top-1.5 left-1.5 flex items-center justify-center w-4 h-4 rounded bg-purple-500/40 text-purple-300 font-mono font-bold text-[10px] border border-purple-400/50">
            3
          </span>
          <span className="text-2xl mt-1">⚡</span>
          <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5 text-purple-200/90 leading-none">Lôi Điện</span>
        </button>
      </div>

      {/* Interaction Prompt */}
      <div 
        ref={interactTextRef}
        className="absolute top-[55%] left-1/2 -translate-x-1/2 text-white/80 font-sans text-lg font-bold pointer-events-none opacity-0 transition-opacity duration-150 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
      >
        Nhấn [E] để Mở
      </div>
      
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference" />
    </>
  );
}
