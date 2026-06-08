/**
 * Low-poly Tarkov-style toolbox model.
 *
 * 축척:
 * 1 Three.js unit = 1 meter
 *
 * 전체 크기:
 * 가로 0.30m
 * 세로 0.15m
 * 높이 0.14m
 *
 * 축:
 * X = 가로
 * Y = 높이
 * Z = 세로
 * 정면 = +Z
 *
 * 사용법:
 * const toolbox = createToolboxModel(THREE);
 * scene.add(toolbox);
 */
function createToolboxModel(THREE) {
  const group = new THREE.Group();
  group.name = "LowPolyToolbox";

  const MAT = {
    body: new THREE.MeshStandardMaterial({
      color: 0x202321,
      roughness: 0.82,
      metalness: 0.03,
      flatShading: true
    }),

    lid: new THREE.MeshStandardMaterial({
      color: 0x2b2e2b,
      roughness: 0.78,
      metalness: 0.03,
      flatShading: true
    }),

    dark: new THREE.MeshStandardMaterial({
      color: 0x111412,
      roughness: 0.9,
      metalness: 0.02,
      flatShading: true
    }),

    olive: new THREE.MeshStandardMaterial({
      color: 0x6d713d,
      roughness: 0.62,
      metalness: 0.16,
      flatShading: true
    }),

    oliveDark: new THREE.MeshStandardMaterial({
      color: 0x4d512d,
      roughness: 0.7,
      metalness: 0.12,
      flatShading: true
    }),

    labelBase: new THREE.MeshStandardMaterial({
      color: 0x54534b,
      roughness: 0.92,
      metalness: 0.02,
      flatShading: true
    }),

    labelYellow: new THREE.MeshStandardMaterial({
      color: 0x9b8433,
      roughness: 0.9,
      metalness: 0,
      flatShading: true
    }),

    labelRed: new THREE.MeshStandardMaterial({
      color: 0x6f3028,
      roughness: 0.9,
      metalness: 0,
      flatShading: true
    }),

    labelInk: new THREE.MeshStandardMaterial({
      color: 0x292b27,
      roughness: 0.95,
      metalness: 0,
      flatShading: true
    })
  };

  function addBox(
    name,
    size,
    position,
    material,
    parent = group
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

  function addCylinder(
    name,
    radius,
    length,
    position,
    rotation,
    material,
    radialSegments = 8,
    parent = group
  ) {
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      length,
      radialSegments,
      1,
      false
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
  // 메인 몸체
  // =========================================================

  addBox(
    "LowerBody",
    [0.286, 0.083, 0.138],
    [0, 0.0415, 0],
    MAT.body
  );

  addBox(
    "UpperBodyBand",
    [0.292, 0.018, 0.142],
    [0, 0.086, 0],
    MAT.dark
  );

  // =========================================================
  // 뚜껑
  // =========================================================

  addBox(
    "LidMain",
    [0.3, 0.025, 0.15],
    [0, 0.1075, 0],
    MAT.lid
  );

  addBox(
    "LidLowerLip",
    [0.296, 0.006, 0.146],
    [0, 0.092, 0],
    MAT.dark
  );

  // =========================================================
  // 모서리 보강부
  // =========================================================

  const cornerX = 0.137;
  const cornerZ = 0.066;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addBox(
        "CornerBlock",
        [0.022, 0.066, 0.02],
        [
          sx * cornerX,
          0.049,
          sz * cornerZ
        ],
        MAT.body
      );

      addBox(
        "LidCornerBlock",
        [0.024, 0.02, 0.022],
        [
          sx * cornerX,
          0.109,
          sz * cornerZ
        ],
        MAT.lid
      );
    }
  }

  // =========================================================
  // 전면 패널
  // 정면 방향은 +Z
  // =========================================================

  addBox(
    "FrontPanelInset",
    [0.158, 0.05, 0.006],
    [0, 0.039, 0.0715],
    MAT.dark
  );

  addBox(
    "FrontPanelFace",
    [0.148, 0.042, 0.004],
    [0, 0.039, 0.075],
    MAT.labelBase
  );

  addBox(
    "FrontCenterRib",
    [0.014, 0.058, 0.008],
    [0, 0.042, 0.0765],
    MAT.body
  );

  for (const x of [-0.092, 0.092]) {
    addBox(
      "FrontVerticalRib",
      [0.01, 0.074, 0.01],
      [x, 0.042, 0.0735],
      MAT.body
    );
  }

  // =========================================================
  // 전면 라벨
  // 텍스처 없이 단순 지오메트리로 표현
  // =========================================================

  addBox(
    "LabelBacking",
    [0.126, 0.019, 0.0018],
    [0, 0.048, 0.078],
    MAT.labelYellow
  );

  addBox(
    "LabelRedStripeTop",
    [0.126, 0.003, 0.0019],
    [0, 0.054, 0.079],
    MAT.labelRed
  );

  addBox(
    "LabelRedStripeBottom",
    [0.126, 0.0025, 0.0019],
    [0, 0.041, 0.079],
    MAT.labelRed
  );

  addBox(
    "LabelInkBar",
    [0.045, 0.005, 0.002],
    [-0.025, 0.047, 0.08],
    MAT.labelInk
  );

  addBox(
    "LabelIcon",
    [0.01, 0.01, 0.002],
    [0.047, 0.048, 0.08],
    MAT.labelInk
  );

  // =========================================================
  // 바닥 받침
  // =========================================================

  for (const x of [-0.112, 0.112]) {
    addBox(
      "Foot",
      [0.04, 0.005, 0.08],
      [x, 0.0025, 0],
      MAT.dark
    );
  }

  // =========================================================
  // 뚜껑 격자무늬
  // InstancedMesh를 사용해 드로우콜 감소
  // =========================================================

  const tileGeometry = new THREE.BoxGeometry(
    0.031,
    0.0018,
    0.025
  );

  const tilePositions = [];

  const columns = 8;
  const rows = 4;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = -0.1235 + column * 0.0353;
      const z = -0.0525 + row * 0.035;

      // 손잡이 중앙부는 비워둔다.
      const isHandleArea =
        Math.abs(x) < 0.045 &&
        Math.abs(z - 0.0175) < 0.024;

      if (isHandleArea) {
        continue;
      }

      tilePositions.push([
        x,
        0.121,
        z
      ]);
    }
  }

  const lidTiles = new THREE.InstancedMesh(
    tileGeometry,
    MAT.dark,
    tilePositions.length
  );

  lidTiles.name = "LidGridTiles";
  lidTiles.castShadow = true;
  lidTiles.receiveShadow = true;

  const dummy = new THREE.Object3D();

  tilePositions.forEach((position, index) => {
    dummy.position.set(
      position[0],
      position[1],
      position[2]
    );

    dummy.updateMatrix();

    lidTiles.setMatrixAt(
      index,
      dummy.matrix
    );
  });

  lidTiles.instanceMatrix.needsUpdate = true;

  group.add(lidTiles);

  // =========================================================
  // 뚜껑 후면 보강선과 손잡이 홈
  // =========================================================

  addBox(
    "RearLidRidge",
    [0.27, 0.004, 0.012],
    [0, 0.121, -0.061],
    MAT.dark
  );

  addBox(
    "HandleRecess",
    [0.105, 0.003, 0.036],
    [0, 0.121, -0.01],
    MAT.dark
  );

  // =========================================================
  // 좌우 잠금장치
  // =========================================================

  const frontZ = 0.0785;

  for (const x of [-0.116, 0.116]) {
    addBox(
      "SideLatchUpper",
      [0.032, 0.018, 0.01],
      [x, 0.097, frontZ],
      MAT.olive
    );

    const latchFlap = addBox(
      "SideLatchFlap",
      [0.032, 0.026, 0.008],
      [
        x,
        0.079,
        frontZ + 0.002
      ],
      MAT.olive
    );

    latchFlap.rotation.x = -0.16;

    addCylinder(
      "SideLatchHinge",
      0.0024,
      0.03,
      [
        x,
        0.106,
        frontZ + 0.002
      ],
      [
        0,
        0,
        Math.PI / 2
      ],
      MAT.oliveDark,
      8
    );
  }

  // =========================================================
  // 중앙 잠금장치
  // =========================================================

  addBox(
    "CenterLatchHousing",
    [0.048, 0.02, 0.012],
    [0, 0.099, frontZ],
    MAT.dark
  );

  const centerLatch = addBox(
    "CenterLatch",
    [0.046, 0.023, 0.009],
    [
      0,
      0.092,
      frontZ + 0.003
    ],
    MAT.olive
  );

  centerLatch.rotation.x = -0.12;

  // =========================================================
  // 손잡이
  // 손잡이를 포함한 최대 높이가 0.14m
  // =========================================================

  const handle = new THREE.Group();
  handle.name = "Handle";

  group.add(handle);

  addBox(
    "HandlePostLeft",
    [0.011, 0.027, 0.011],
    [-0.052, 0.1265, -0.012],
    MAT.olive,
    handle
  );

  addBox(
    "HandlePostRight",
    [0.011, 0.027, 0.011],
    [0.052, 0.1265, -0.012],
    MAT.olive,
    handle
  );

  // CylinderGeometry의 기본 길이 방향은 Y축이다.
  // Z축으로 90도 회전시켜 X축 방향 손잡이로 만든다.
  addCylinder(
    "HandleGrip",
    0.005,
    0.104,
    [0, 0.135, -0.012],
    [
      0,
      0,
      Math.PI / 2
    ],
    MAT.dark,
    8,
    handle
  );

  // 손잡이 고무 그립 링
  for (let i = 0; i < 11; i++) {
    const x = -0.044 + i * 0.0088;

    addCylinder(
      "GripRing",
      0.006,
      0.0024,
      [x, 0.135, -0.012],
      [
        0,
        0,
        Math.PI / 2
      ],
      MAT.body,
      8,
      handle
    );
  }

  // 손잡이 하단 힌지
  addCylinder(
    "HandleHingeLeft",
    0.003,
    0.015,
    [-0.052, 0.1165, -0.012],
    [
      Math.PI / 2,
      0,
      0
    ],
    MAT.oliveDark,
    8,
    handle
  );

  addCylinder(
    "HandleHingeRight",
    0.003,
    0.015,
    [0.052, 0.1165, -0.012],
    [
      Math.PI / 2,
      0,
      0
    ],
    MAT.oliveDark,
    8,
    handle
  );

  // =========================================================
  // 모델 정보
  // =========================================================

  group.userData.units = "meters";

  group.userData.dimensions = {
    width: 0.3,
    depth: 0.15,
    height: 0.14
  };

  group.userData.frontAxis = "+Z";
  group.userData.lowPoly = true;

  return group;
}
