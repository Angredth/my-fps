/**
 * Three.js 로우폴리 군용 목제 탄약 상자
 *
 * 크기:
 * X축 가로 = 60
 * Y축 높이 = 15
 * Z축 세로 = 20
 *
 * 반환값: THREE.Group
 */
function createAmmoCrateModel() {
  const root = new THREE.Group();

  root.name = 'AmmoCrate_60x20x15';
  root.userData.dimensions = {
    width: 60,
    depth: 20,
    height: 15
  };

  const woodPalette = [
    0x4e5d39,
    0x53613c,
    0x485635,
    0x5a6841,
    0x445132
  ];

  const woodMaterials = woodPalette.map((color) => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.92,
      metalness: 0,
      flatShading: true
    });
  });

  const woodLight = new THREE.MeshStandardMaterial({
    color: 0x64724b,
    roughness: 0.93,
    metalness: 0,
    flatShading: true
  });

  const woodDark = new THREE.MeshStandardMaterial({
    color: 0x303a27,
    roughness: 0.98,
    metalness: 0,
    flatShading: true
  });

  const exposedWood = new THREE.MeshStandardMaterial({
    color: 0x796344,
    roughness: 1,
    metalness: 0,
    flatShading: true
  });

  const metal = new THREE.MeshStandardMaterial({
    color: 0x555b4e,
    roughness: 0.68,
    metalness: 0.55,
    flatShading: true
  });

  const metalDark = new THREE.MeshStandardMaterial({
    color: 0x31362f,
    roughness: 0.63,
    metalness: 0.7,
    flatShading: true
  });

  const rust = new THREE.MeshStandardMaterial({
    color: 0x70452f,
    roughness: 0.95,
    metalness: 0.1,
    flatShading: true
  });

  root.userData.modelMaterials = [
    ...woodMaterials,
    woodLight,
    woodDark,
    exposedWood,
    metal,
    metalDark,
    rust
  ];

  function addBox(
    name,
    sizeX,
    sizeY,
    sizeZ,
    x,
    y,
    z,
    material,
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0
  ) {
    const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.rotation.set(rotationX, rotationY, rotationZ);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    root.add(mesh);

    return mesh;
  }

  function addRivet(
    name,
    x,
    y,
    z,
    rotationX = Math.PI / 2
  ) {
    const geometry = new THREE.CylinderGeometry(
      0.16,
      0.16,
      0.16,
      8
    );

    const mesh = new THREE.Mesh(geometry, metalDark);

    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.rotation.x = rotationX;
    mesh.castShadow = true;

    root.add(mesh);

    return mesh;
  }

  // =========================================================
  // 전면 및 후면 목재 판자
  // =========================================================

  const rowHeight = 2.58;

  for (let i = 0; i < 5; i++) {
    const y = 1.55 + i * 2.62;

    addBox(
      `FrontPlank_${i}`,
      58.2,
      rowHeight,
      0.72,
      0,
      y,
      9.64,
      woodMaterials[i % woodMaterials.length]
    );

    addBox(
      `BackPlank_${i}`,
      58.2,
      rowHeight,
      0.72,
      0,
      y,
      -9.64,
      woodMaterials[(i + 2) % woodMaterials.length]
    );
  }

  // =========================================================
  // 좌우 측면
  // =========================================================

  addBox(
    'LeftSide',
    0.78,
    13.55,
    18.55,
    -29.62,
    6.85,
    0,
    woodMaterials[1]
  );

  addBox(
    'RightSide',
    0.78,
    13.55,
    18.55,
    29.62,
    6.85,
    0,
    woodMaterials[2]
  );

  // =========================================================
  // 바닥 및 하단 프레임
  // =========================================================

  addBox(
    'Bottom',
    58.7,
    0.62,
    19.1,
    0,
    0.35,
    0,
    woodDark
  );

  addBox(
    'BottomFrontRail',
    59.2,
    0.72,
    1,
    0,
    0.52,
    9.6,
    exposedWood
  );

  addBox(
    'BottomBackRail',
    59.2,
    0.72,
    1,
    0,
    0.52,
    -9.6,
    exposedWood
  );

  // =========================================================
  // 상자 뚜껑
  // =========================================================

  const lidPlankDepth = 3.72;

  for (let i = 0; i < 5; i++) {
    const z = -7.45 + i * 3.73;

    addBox(
      `LidPlank_${i}`,
      59.1,
      0.76,
      lidPlankDepth,
      0,
      13.92,
      z,
      woodMaterials[(i + 1) % woodMaterials.length]
    );
  }

  addBox(
    'LidFrontLip',
    59.5,
    1.25,
    0.82,
    0,
    13.48,
    9.72,
    woodDark
  );

  addBox(
    'LidBackLip',
    59.5,
    1.25,
    0.82,
    0,
    13.48,
    -9.72,
    woodDark
  );

  // =========================================================
  // 뚜껑 위 보강대
  // =========================================================

  [-15.2, 15.2].forEach((x, index) => {
    addBox(
      `TopStrapWood_${index}`,
      3.15,
      0.72,
      20.5,
      x,
      14.7,
      0,
      woodLight
    );

    addBox(
      `TopStrapFrontPlate_${index}`,
      2.6,
      0.22,
      2.35,
      x,
      15.14,
      7.7,
      metal
    );

    addBox(
      `TopStrapRearPlate_${index}`,
      2.6,
      0.22,
      2.35,
      x,
      15.14,
      -7.7,
      metal
    );

    for (const offsetX of [-0.82, 0.82]) {
      for (const offsetZ of [-0.72, 0.72]) {
        const rivetGeometry = new THREE.CylinderGeometry(
          0.13,
          0.13,
          0.12,
          8
        );

        const rivet = new THREE.Mesh(rivetGeometry, rust);

        rivet.name = `TopStrapRivet_${index}_${offsetX}_${offsetZ}`;
        rivet.position.set(
          x + offsetX,
          15.29,
          7.7 + offsetZ
        );

        rivet.castShadow = true;
        root.add(rivet);
      }
    }
  });

  // =========================================================
  // 전면 및 후면 모서리 금속판
  // =========================================================

  [-28.65, 28.65].forEach((x, index) => {
    addBox(
      `FrontCornerPlate_${index}`,
      1.55,
      12.3,
      0.28,
      x,
      6.85,
      10.08,
      metal
    );

    addBox(
      `BackCornerPlate_${index}`,
      1.55,
      12.3,
      0.28,
      x,
      6.85,
      -10.08,
      metal
    );

    [2, 6.85, 11.7].forEach((y, rivetIndex) => {
      addRivet(
        `FrontCornerRivet_${index}_${rivetIndex}`,
        x,
        y,
        10.28
      );

      addRivet(
        `BackCornerRivet_${index}_${rivetIndex}`,
        x,
        y,
        -10.28
      );
    });
  });

  // 측면으로 감싸지는 모서리 철판
  [-29.98, 29.98].forEach((x, index) => {
    addBox(
      `SideCornerFront_${index}`,
      0.28,
      12.3,
      1.55,
      x,
      6.85,
      9.2,
      metal
    );

    addBox(
      `SideCornerBack_${index}`,
      0.28,
      12.3,
      1.55,
      x,
      6.85,
      -9.2,
      metal
    );
  });

  // =========================================================
  // 전면 잠금장치
  // =========================================================

  function addLatch(x, index) {
    addBox(
      `LatchBase_${index}`,
      2.25,
      5.2,
      0.34,
      x,
      11.05,
      10.17,
      metal
    );

    addBox(
      `LatchUpper_${index}`,
      2.75,
      1.05,
      0.44,
      x,
      13.13,
      10.28,
      metalDark
    );

    addBox(
      `LatchTongue_${index}`,
      1.38,
      3.2,
      0.38,
      x,
      9.65,
      10.38,
      metal
    );

    // U자 형태 버클
    addBox(
      `LatchLoopTop_${index}`,
      1.62,
      0.28,
      0.34,
      x,
      12.06,
      10.57,
      metalDark
    );

    addBox(
      `LatchLoopLeft_${index}`,
      0.28,
      1.3,
      0.34,
      x - 0.67,
      11.55,
      10.57,
      metalDark
    );

    addBox(
      `LatchLoopRight_${index}`,
      0.28,
      1.3,
      0.34,
      x + 0.67,
      11.55,
      10.57,
      metalDark
    );

    addRivet(
      `LatchRivetA_${index}`,
      x - 0.65,
      12.88,
      10.53
    );

    addRivet(
      `LatchRivetB_${index}`,
      x + 0.65,
      12.88,
      10.53
    );

    addRivet(
      `LatchRivetC_${index}`,
      x,
      8.55,
      10.58
    );
  }

  addLatch(-15.2, 0);
  addLatch(15.2, 1);

  // =========================================================
  // 후면 경첩
  // =========================================================

  [-15.2, 15.2].forEach((x, index) => {
    addBox(
      `RearHinge_${index}`,
      3.4,
      1.35,
      0.42,
      x,
      13.1,
      -10.19,
      metalDark
    );

    addRivet(
      `RearHingeRivetLeft_${index}`,
      x - 1,
      13.1,
      -10.45
    );

    addRivet(
      `RearHingeRivetRight_${index}`,
      x + 1,
      13.1,
      -10.45
    );
  });

  // =========================================================
  // 판자 사이의 틈
  // =========================================================

  for (let i = 1; i < 5; i++) {
    const y = 0.25 + i * 2.62;

    addBox(
      `FrontSeam_${i}`,
      57.6,
      0.1,
      0.08,
      0,
      y,
      10.03,
      woodDark
    );

    addBox(
      `BackSeam_${i}`,
      57.6,
      0.1,
      0.08,
      0,
      y,
      -10.03,
      woodDark
    );
  }

  for (let i = 1; i < 5; i++) {
    const z = -9.3 + i * 3.73;

    addBox(
      `LidSeam_${i}`,
      58,
      0.07,
      0.1,
      0,
      14.34,
      z,
      woodDark
    );
  }

  // =========================================================
  // 도색 벗겨짐 및 긁힘
  // =========================================================

  const scuffs = [
    [-21, 3.3, 9.99, 7.5],
    [-7, 5.7, 9.99, 11],
    [5, 2.2, 9.99, 8],
    [19, 8.2, 9.99, 6.5],
    [25, 4.5, 9.99, 4.5],
    [-17, 10.7, 9.99, 6],
    [-6, 14.35, -5.5, 8],
    [18, 14.35, 3.2, 7],
    [3, 14.35, 7.1, 5]
  ];

  scuffs.forEach(([x, y, z, length], index) => {
    const rotationZ = index % 2 === 0 ? -0.025 : 0.03;

    if (y > 14) {
      addBox(
        `TopScuff_${index}`,
        length,
        0.055,
        0.14,
        x,
        y,
        z,
        exposedWood,
        0,
        0,
        rotationZ
      );
    } else {
      addBox(
        `FrontScuff_${index}`,
        length,
        0.1,
        0.055,
        x,
        y,
        z,
        exposedWood,
        0,
        0,
        rotationZ
      );
    }
  });

  // =========================================================
  // 외부 이미지 없이 CanvasTexture로 스텐실 생성
  // =========================================================

  const stencilMeshes = [];

  function createStencilTexture(
    lines,
    width = 1024,
    height = 256
  ) {
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    context.clearRect(0, 0, width, height);

    context.fillStyle = 'rgba(15, 17, 13, 0.88)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '700 72px monospace';

    lines.forEach((line, index) => {
      context.fillText(
        line,
        width / 2,
        height * (0.32 + index * 0.38)
      );
    });

    const texture = new THREE.CanvasTexture(canvas);

    if ('colorSpace' in texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    texture.anisotropy = 4;
    texture.needsUpdate = true;

    return texture;
  }

  // 전면 스텐실
  const frontStencilMaterial = new THREE.MeshBasicMaterial({
    map: createStencilTexture([
      '5.45  /  2160 ШТ.',
      '380-86-88'
    ]),
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false
  });

  const frontStencil = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 6.2),
    frontStencilMaterial
  );

  frontStencil.name = 'FrontStencil';
  frontStencil.position.set(10.5, 6, 10.32);

  root.add(frontStencil);
  stencilMeshes.push(frontStencil);

  // 뚜껑 스텐실
  const topStencilMaterial = new THREE.MeshBasicMaterial({
    map: createStencilTexture([
      '5.45  2160 ШТ.',
      '120-80'
    ]),
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false
  });

  const topStencil = new THREE.Mesh(
    new THREE.PlaneGeometry(25, 6.8),
    topStencilMaterial
  );

  topStencil.name = 'TopStencil';
  topStencil.rotation.x = -Math.PI / 2;
  topStencil.position.set(1.5, 15.19, -0.1);

  root.add(topStencil);
  stencilMeshes.push(topStencil);

  root.userData.stencilMeshes = stencilMeshes;

  return root;
}
