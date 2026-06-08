/**
 * Low-poly desktop tower made only from Three.js basic geometries.
 *
 * 크기:
 * X = 가로 15
 * Y = 높이 40
 * Z = 세로 45
 *
 * 원점:
 * 본체 밑면 중앙
 *
 * 방향:
 * 정면 = -Z
 * 후면 = +Z
 */
function createDesktopTowerModel(THREE) {
  const tower = new THREE.Group();

  tower.name = 'LowPolyDesktopTower';

  tower.userData.dimensions = {
    width: 15,
    depth: 45,
    height: 40,
    unit: 'cm'
  };

  const materials = {
    shell: new THREE.MeshStandardMaterial({
      color: 0x17191b,
      roughness: 0.53,
      metalness: 0.18
    }),

    shellDark: new THREE.MeshStandardMaterial({
      color: 0x0b0c0d,
      roughness: 0.48,
      metalness: 0.22
    }),

    panel: new THREE.MeshStandardMaterial({
      color: 0x26292c,
      roughness: 0.46,
      metalness: 0.2
    }),

    trim: new THREE.MeshStandardMaterial({
      color: 0x08090a,
      roughness: 0.34,
      metalness: 0.25
    }),

    metal: new THREE.MeshStandardMaterial({
      color: 0x81868a,
      roughness: 0.58,
      metalness: 0.65
    }),

    metalDark: new THREE.MeshStandardMaterial({
      color: 0x3d4246,
      roughness: 0.57,
      metalness: 0.55
    }),

    portBlue: new THREE.MeshStandardMaterial({
      color: 0x1c6f9c,
      roughness: 0.42,
      metalness: 0.25
    }),

    label: new THREE.MeshStandardMaterial({
      color: 0xa4a9ac,
      roughness: 0.45,
      metalness: 0.22
    })
  };

  tower.userData.materials = Object.values(materials);

  function createBox(
    name,
    size,
    position,
    material,
    parent = tower
  ) {
    const geometry = new THREE.BoxGeometry(
      size[0],
      size[1],
      size[2]
    );

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    mesh.position.set(
      position[0],
      position[1],
      position[2]
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
  }

  function createCylinder(
    name,
    radiusTop,
    radiusBottom,
    length,
    segments,
    position,
    rotation,
    material,
    parent = tower
  ) {
    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      length,
      segments
    );

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;

    mesh.position.set(
      position[0],
      position[1],
      position[2]
    );

    mesh.rotation.set(
      rotation[0],
      rotation[1],
      rotation[2]
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
  }

  // =========================================================
  // 메인 본체
  // =========================================================

  createBox(
    'Main_Chassis',
    [15, 39.2, 44.6],
    [0, 19.8, 0],
    materials.shell
  );

  createBox(
    'Top_Panel',
    [14.7, 0.45, 44],
    [0, 39.72, 0.1],
    materials.panel
  );

  createBox(
    'Bottom_Rail',
    [14.8, 0.65, 44.2],
    [0, 0.45, 0],
    materials.shellDark
  );

  // =========================================================
  // 전면 패널
  // =========================================================

  createBox(
    'Front_Base_Panel',
    [14.15, 38.4, 0.68],
    [0, 20, -22.52],
    materials.panel
  );

  createBox(
    'Front_Top_Lip',
    [13.55, 1.15, 0.95],
    [0, 38.3, -22.93],
    materials.trim
  );

  createBox(
    'Upper_Bay',
    [12.9, 4.15, 0.74],
    [0, 34.65, -22.92],
    materials.shellDark
  );

  createBox(
    'Optical_Bay',
    [12.9, 5.45, 0.78],
    [0, 29.9, -22.94],
    materials.shellDark
  );

  createBox(
    'Front_Control_Bar',
    [12.9, 4.15, 0.96],
    [0, 24.55, -23.03],
    materials.trim
  );

  createCylinder(
    'Power_Button_Rim',
    1.08,
    1.08,
    0.55,
    16,
    [-4.95, 24.65, -23.43],
    [Math.PI / 2, 0, 0],
    materials.metalDark
  );

  createCylinder(
    'Power_Button',
    0.68,
    0.68,
    0.68,
    16,
    [-4.95, 24.65, -23.76],
    [Math.PI / 2, 0, 0],
    materials.shellDark
  );

  // 전면 USB 포트
  createBox(
    'Front_USB_1',
    [0.75, 0.42, 0.38],
    [3.7, 25.05, -23.58],
    materials.shellDark
  );

  createBox(
    'Front_USB_2',
    [0.75, 0.42, 0.38],
    [4.75, 25.05, -23.58],
    materials.shellDark
  );

  // 전면 상태 표시등
  createBox(
    'Front_LED',
    [0.18, 0.18, 0.3],
    [-3.2, 24.65, -23.63],
    materials.portBlue
  );

  // 전면 하단 로고를 단순한 막대 형태로 표현
  createBox(
    'Front_Logo',
    [3.2, 0.38, 0.15],
    [0, 15.7, -22.96],
    materials.label
  );

  // =========================================================
  // 좌측 측면
  // =========================================================

  createBox(
    'Left_Side_Inset',
    [0.32, 35.5, 39.5],
    [-7.54, 20.5, 0.6],
    materials.panel
  );

  // 측면 손잡이 오목한 부분
  createBox(
    'Handle_Recess',
    [0.48, 10, 3.7],
    [-7.78, 23, -1.4],
    materials.shellDark
  );

  createBox(
    'Handle_Inner',
    [0.34, 7.6, 1.7],
    [-8.04, 23, -1.4],
    materials.metalDark
  );

  // 측면 하단 통풍구
  for (let i = 0; i < 9; i++) {
    createBox(
      `Side_Vent_${i}`,
      [0.4, 0.34, 10.6],
      [-7.77, 4.4 + i * 0.48, 4.2],
      materials.shellDark
    );
  }

  // =========================================================
  // 우측 측면
  // =========================================================

  createBox(
    'Right_Side_Inset',
    [0.32, 35.5, 39.5],
    [7.54, 20.5, 0.6],
    materials.panel
  );

  // =========================================================
  // 후면 패널
  // =========================================================

  createBox(
    'Rear_Metal_Panel',
    [13.35, 37, 0.62],
    [0, 20.15, 22.55],
    materials.metal
  );

  // 파워서플라이 영역
  createBox(
    'PSU_Panel',
    [12.2, 8.3, 0.45],
    [0, 35.15, 22.95],
    materials.metalDark
  );

  createBox(
    'PSU_Socket',
    [2.1, 1.55, 0.52],
    [-4.75, 36.55, 23.32],
    materials.shellDark
  );

  // 파워서플라이 팬
  createCylinder(
    'PSU_Fan_Back',
    3.15,
    3.15,
    0.3,
    20,
    [2.75, 35.1, 23.18],
    [Math.PI / 2, 0, 0],
    materials.shellDark
  );

  createCylinder(
    'PSU_Fan_Hub',
    0.72,
    0.72,
    0.52,
    16,
    [2.75, 35.1, 23.42],
    [Math.PI / 2, 0, 0],
    materials.metalDark
  );

  for (let i = 0; i < 8; i++) {
    const spoke = createBox(
      `PSU_Fan_Spoke_${i}`,
      [0.2, 5.7, 0.24],
      [2.75, 35.1, 23.4],
      materials.metalDark
    );

    spoke.rotation.z = i * Math.PI / 4;
  }

  // =========================================================
  // 후면 메인보드 I/O
  // =========================================================

  createBox(
    'Rear_IO_Plate',
    [4.25, 12.9, 0.48],
    [-4.1, 24.1, 23],
    materials.metalDark
  );

  createBox(
    'LAN_Port',
    [1.45, 1.35, 0.48],
    [-4.8, 26.8, 23.37],
    materials.shellDark
  );

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 2; column++) {
      createBox(
        `Rear_USB_${row}_${column}`,
        [0.55, 0.92, 0.48],
        [
          -5.35 + column * 1.1,
          22.5 - row * 1.45,
          23.37
        ],
        row < 2
          ? materials.portBlue
          : materials.shellDark
      );
    }
  }

  // 오디오 단자
  createCylinder(
    'Rear_Audio_Port_1',
    0.27,
    0.27,
    0.28,
    10,
    [-5.15, 17.7, 23.45],
    [Math.PI / 2, 0, 0],
    materials.shellDark
  );

  createCylinder(
    'Rear_Audio_Port_2',
    0.27,
    0.27,
    0.28,
    10,
    [-4.1, 17.7, 23.45],
    [Math.PI / 2, 0, 0],
    materials.shellDark
  );

  createCylinder(
    'Rear_Audio_Port_3',
    0.27,
    0.27,
    0.28,
    10,
    [-3.05, 17.7, 23.45],
    [Math.PI / 2, 0, 0],
    materials.shellDark
  );

  // =========================================================
  // 후면 배기 통풍구
  // =========================================================

  createBox(
    'Rear_Exhaust_Frame',
    [6.8, 12.3, 0.46],
    [2.8, 24, 23],
    materials.metalDark
  );

  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 5; x++) {
      const offsetX =
        0.85 +
        x * 1 +
        (y % 2 === 1 ? 0.5 : 0);

      if (offsetX > 5.35) {
        continue;
      }

      createCylinder(
        `Rear_Vent_${x}_${y}`,
        0.18,
        0.18,
        0.52,
        8,
        [
          offsetX,
          20.7 + y * 1.05,
          23.36
        ],
        [Math.PI / 2, 0, 0],
        materials.shellDark
      );
    }
  }

  // =========================================================
  // 후면 확장 슬롯
  // =========================================================

  for (let i = 0; i < 5; i++) {
    createBox(
      `Expansion_Slot_${i}`,
      [8.2, 0.64, 0.47],
      [0.35, 13.75 - i * 1.2, 23.03],
      materials.metalDark
    );

    createBox(
      `Expansion_Slot_Gap_${i}`,
      [6.8, 0.12, 0.5],
      [0, 13.75 - i * 1.2, 23.34],
      materials.shellDark
    );
  }

  // =========================================================
  // 바닥 고무 받침
  // =========================================================

  const footPositions = [
    [-5.5, -18.1],
    [5.5, -18.1],
    [-5.5, 18.1],
    [5.5, 18.1]
  ];

  footPositions.forEach((position, index) => {
    createCylinder(
      `Foot_${index}`,
      0.75,
      0.88,
      0.7,
      12,
      [position[0], 0, position[1]],
      [0, 0, 0],
      materials.shellDark
    );
  });

  return tower;
}
