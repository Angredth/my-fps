export function createDesktopTowerModel(THREE) {
  const tower = new THREE.Group();
  tower.name = 'LowPolyDesktopTower';

  // 1 unit = 1 meter
  // 기존 cm 수치를 그대로 쓰고, 내부에서 0.01 배로 환산
  const SCALE = 0.01;
  const s = (v) => v * SCALE;
  const sv = (arr) => arr.map(v => v * SCALE);

  tower.userData.dimensions = {
    width: 0.15,
    depth: 0.45,
    height: 0.40,
    unit: 'm'
  };

  const mats = {
    shell: new THREE.MeshStandardMaterial({ color: 0x17191b, roughness: 0.53, metalness: 0.18 }),
    shellDark: new THREE.MeshStandardMaterial({ color: 0x0b0c0d, roughness: 0.48, metalness: 0.22 }),
    panel: new THREE.MeshStandardMaterial({ color: 0x26292c, roughness: 0.46, metalness: 0.20 }),
    trim: new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: 0.34, metalness: 0.25 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x81868a, roughness: 0.58, metalness: 0.65 }),
    metalDark: new THREE.MeshStandardMaterial({ color: 0x3d4246, roughness: 0.57, metalness: 0.55 }),
    portBlue: new THREE.MeshStandardMaterial({ color: 0x1c6f9c, roughness: 0.42, metalness: 0.25 }),
    label: new THREE.MeshStandardMaterial({ color: 0xa4a9ac, roughness: 0.45, metalness: 0.22 })
  };

  tower.userData.materials = Object.values(mats);

  function box(name, size, position, material, parent = tower) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(...sv(size)),
      material
    );
    mesh.name = name;
    mesh.position.set(...sv(position));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function cylinder(name, radiusTop, radiusBottom, length, segments, position, rotation, material, parent = tower) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(s(radiusTop), s(radiusBottom), s(length), segments),
      material
    );
    mesh.name = name;
    mesh.position.set(...sv(position));
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // 본체
  box('Main_Chassis', [15, 39.2, 44.6], [0, 19.8, 0], mats.shell);
  box('Top_Panel', [14.7, 0.45, 44.0], [0, 39.72, 0.1], mats.panel);
  box('Bottom_Rail', [14.8, 0.65, 44.2], [0, 0.45, 0], mats.shellDark);

  // 전면
  box('Front_Base_Panel', [14.15, 38.4, 0.68], [0, 20.0, -22.52], mats.panel);
  box('Front_Top_Lip', [13.55, 1.15, 0.95], [0, 38.3, -22.93], mats.trim);
  box('Upper_Bay', [12.9, 4.15, 0.74], [0, 34.65, -22.92], mats.shellDark);
  box('Optical_Bay', [12.9, 5.45, 0.78], [0, 29.9, -22.94], mats.shellDark);
  box('Front_Control_Bar', [12.9, 4.15, 0.96], [0, 24.55, -23.03], mats.trim);

  cylinder(
    'Power_Button_Rim',
    1.08, 1.08, 0.55, 16,
    [-4.95, 24.65, -23.43],
    [Math.PI / 2, 0, 0],
    mats.metalDark
  );

  cylinder(
    'Power_Button',
    0.68, 0.68, 0.68, 16,
    [-4.95, 24.65, -23.76],
    [Math.PI / 2, 0, 0],
    mats.shellDark
  );

  // 좌측면
  box('Left_Side_Inset', [0.32, 35.5, 39.5], [-7.54, 20.5, 0.6], mats.panel);
  box('Handle_Recess', [0.48, 10.0, 3.7], [-7.78, 23.0, -1.4], mats.shellDark);
  box('Handle_Inner', [0.34, 7.6, 1.7], [-8.04, 23.0, -1.4], mats.metalDark);

  for (let i = 0; i < 9; i++) {
    box(`Side_Vent_${i}`, [0.40, 0.34, 10.6], [-7.77, 4.4 + i * 0.48, 4.2], mats.shellDark);
  }

  // 우측면
  box('Right_Side_Inset', [0.32, 35.5, 39.5], [7.54, 20.5, 0.6], mats.panel);

  // 후면
  box('Rear_Metal_Panel', [13.35, 37.0, 0.62], [0, 20.15, 22.55], mats.metal);
  box('PSU_Panel', [12.2, 8.3, 0.45], [0, 35.15, 22.95], mats.metalDark);
  box('PSU_Socket', [2.1, 1.55, 0.52], [-4.75, 36.55, 23.32], mats.shellDark);

  cylinder(
    'PSU_Fan_Back',
    3.15, 3.15, 0.30, 20,
    [2.75, 35.1, 23.18],
    [Math.PI / 2, 0, 0],
    mats.shellDark
  );

  cylinder(
    'PSU_Fan_Hub',
    0.72, 0.72, 0.52, 16,
    [2.75, 35.1, 23.42],
    [Math.PI / 2, 0, 0],
    mats.metalDark
  );

  for (let i = 0; i < 8; i++) {
    const spoke = box(`PSU_Fan_Spoke_${i}`, [0.20, 5.7, 0.24], [2.75, 35.1, 23.4], mats.metalDark);
    spoke.rotation.z = i * Math.PI / 4;
  }

  box('Rear_IO_Plate', [4.25, 12.9, 0.48], [-4.1, 24.1, 23.0], mats.metalDark);
  box('LAN_Port', [1.45, 1.35, 0.48], [-4.8, 26.8, 23.37], mats.shellDark);

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      box(
        `Rear_USB_${row}_${col}`,
        [0.55, 0.92, 0.48],
        [-5.35 + col * 1.1, 22.5 - row * 1.45, 23.37],
        row < 2 ? mats.portBlue : mats.shellDark
      );
    }
  }

  box('Rear_Exhaust_Frame', [6.8, 12.3, 0.46], [2.8, 24.0, 23.0], mats.metalDark);

  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 5; x++) {
      const px = 0.85 + x * 1.0 + (y % 2 ? 0.5 : 0);
      if (px > 5.35) continue;

      cylinder(
        `Rear_Vent_${x}_${y}`,
        0.18, 0.18, 0.52, 8,
        [px, 20.7 + y * 1.05, 23.36],
        [Math.PI / 2, 0, 0],
        mats.shellDark
      );
    }
  }

  for (let i = 0; i < 5; i++) {
    box(`Expansion_Slot_${i}`, [8.2, 0.64, 0.47], [0.35, 13.75 - i * 1.2, 23.03], mats.metalDark);
    box(`Expansion_Slot_Gap_${i}`, [6.8, 0.12, 0.50], [0.0, 13.75 - i * 1.2, 23.34], mats.shellDark);
  }

  // 바닥 받침
  [[-5.5, -18.1], [5.5, -18.1], [-5.5, 18.1], [5.5, 18.1]].forEach((p, i) => {
    cylinder(`Foot_${i}`, 0.75, 0.88, 0.7, 12, [p[0], 0.0, p[1]], [0, 0, 0], mats.shellDark);
  });

  return tower;
}
