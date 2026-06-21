import * as THREE from 'three';

/**
 * 사용 예:
 *
 * import { createTacticalBayonetModel } from './TacticalBayonetModel.js';
 *
 * const knife = createTacticalBayonetModel();
 * scene.add(knife);
 */

function extrudedShape(shape, depth, material, bevel = 0.04) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 8
  });

  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function roundedRectShape(width, height, radius) {
  const x = -width / 2;
  const y = -height / 2;

  const shape = new THREE.Shape();

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);

  shape.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  shape.lineTo(
    x + width,
    y + height - radius
  );

  shape.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );

  shape.lineTo(
    x + radius,
    y + height
  );

  shape.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );

  shape.lineTo(x, y + radius);

  shape.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  return shape;
}

function regularPolygonPoints(radius, sides, rotation = 0) {
  const points = [];

  for (let i = 0; i < sides; i++) {
    const angle =
      rotation +
      (i / sides) * Math.PI * 2;

    points.push(
      new THREE.Vector2(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius
      )
    );
  }

  return points;
}

function createAngularRingMesh(
  outerRadius,
  innerRadius,
  depth,
  material
) {
  const outerPoints = regularPolygonPoints(
    outerRadius,
    8,
    Math.PI / 8
  );

  const innerPoints = regularPolygonPoints(
    innerRadius,
    8,
    Math.PI / 8
  );

  const shape = new THREE.Shape(outerPoints);
  const hole = new THREE.Path(innerPoints);

  shape.holes.push(hole);

  return extrudedShape(
    shape,
    depth,
    material,
    0.01
  );
}

function makeBladeShape() {
  const shape = new THREE.Shape();

  // 탄토형 칼끝
  shape.moveTo(-6.2, 0.0);
  shape.lineTo(-5.34, 0.88);
  shape.lineTo(0.98, 0.88);
  shape.lineTo(0.98, -0.62);
  shape.lineTo(0.66, -0.62);

  // 하단 톱니
  const serrationStart = 0.66;
  const serrationEnd = -1.08;
  const teeth = 11;
  const step =
    (serrationStart - serrationEnd) /
    teeth;

  for (let i = 0; i < teeth; i++) {
    const x1 =
      serrationStart -
      i * step;

    const x2 =
      x1 -
      step * 0.5;

    const x3 =
      x1 -
      step;

    shape.lineTo(x2, -0.78);
    shape.lineTo(x3, -0.62);
  }

  shape.lineTo(-5.34, -0.62);
  shape.closePath();

  // 칼날 타공
  const hole = new THREE.Path();

  const left = -3.86;
  const right = -3.35;
  const top = 0.52;
  const bottom = 0.12;
  const radius = 0.10;

  hole.moveTo(
    left + radius,
    bottom
  );

  hole.lineTo(
    right - radius,
    bottom
  );

  hole.quadraticCurveTo(
    right,
    bottom,
    right,
    bottom + radius
  );

  hole.lineTo(
    right,
    top - radius
  );

  hole.quadraticCurveTo(
    right,
    top,
    right - radius,
    top
  );

  hole.lineTo(
    left + radius,
    top
  );

  hole.quadraticCurveTo(
    left,
    top,
    left,
    top - radius
  );

  hole.lineTo(
    left,
    bottom + radius
  );

  hole.quadraticCurveTo(
    left,
    bottom,
    left + radius,
    bottom
  );

  shape.holes.push(hole);

  return shape;
}

export function createTacticalBayonetModel() {
  const group = new THREE.Group();

  group.name = 'TacticalBayonet';

  const bladeMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x202226,
      roughness: 0.31,
      metalness: 0.88
    });

  const bladeDarkMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x111316,
      roughness: 0.42,
      metalness: 0.72
    });

  const edgeMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x9ba0a6,
      roughness: 0.2,
      metalness: 1.0
    });

  const guardMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x111215,
      roughness: 0.36,
      metalness: 0.82
    });

  const gripMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x15171a,
      roughness: 0.82,
      metalness: 0.08
    });

  const gripPanelMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x202327,
      roughness: 0.68,
      metalness: 0.12
    });

  const pommelMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x24272b,
      roughness: 0.28,
      metalness: 0.82
    });

  // ==============================
  // 칼날 본체
  // ==============================

  const blade = extrudedShape(
    makeBladeShape(),
    0.22,
    bladeMaterial,
    0.028
  );

  blade.name = 'Blade';

  group.add(blade);

  // ==============================
  // 칼끝 상부 베벨
  // ==============================

  const bevelShape =
    new THREE.Shape();

  bevelShape.moveTo(
    -6.08,
    0.03
  );

  bevelShape.lineTo(
    -5.30,
    0.82
  );

  bevelShape.lineTo(
    -3.88,
    0.82
  );

  bevelShape.lineTo(
    -5.31,
    0.10
  );

  bevelShape.closePath();

  const bevelFront =
    extrudedShape(
      bevelShape,
      0.035,
      edgeMaterial,
      0
    );

  bevelFront.position.z = 0.132;

  group.add(bevelFront);

  const bevelBack =
    bevelFront.clone();

  bevelBack.position.z = -0.132;
  bevelBack.rotation.y = Math.PI;

  group.add(bevelBack);

  // ==============================
  // 하부 날선
  // ==============================

  const cuttingEdgeShape =
    new THREE.Shape();

  cuttingEdgeShape.moveTo(
    -6.02,
    -0.02
  );

  cuttingEdgeShape.lineTo(
    -5.31,
    -0.54
  );

  cuttingEdgeShape.lineTo(
    -1.16,
    -0.54
  );

  cuttingEdgeShape.lineTo(
    -1.16,
    -0.62
  );

  cuttingEdgeShape.lineTo(
    -5.34,
    -0.62
  );

  cuttingEdgeShape.closePath();

  const cuttingEdgeFront =
    extrudedShape(
      cuttingEdgeShape,
      0.028,
      edgeMaterial,
      0
    );

  cuttingEdgeFront.position.z =
    0.135;

  group.add(cuttingEdgeFront);

  const cuttingEdgeBack =
    cuttingEdgeFront.clone();

  cuttingEdgeBack.position.z =
    -0.135;

  cuttingEdgeBack.rotation.y =
    Math.PI;

  group.add(cuttingEdgeBack);

  // ==============================
  // 칼날 홈
  // ==============================

  const fullerShape =
    roundedRectShape(
      2.85,
      0.34,
      0.12
    );

  const fullerFront =
    extrudedShape(
      fullerShape,
      0.055,
      bladeDarkMaterial,
      0.025
    );

  fullerFront.position.set(
    -1.52,
    0.43,
    0.135
  );

  group.add(fullerFront);

  const fullerBack =
    fullerFront.clone();

  fullerBack.position.z =
    -0.135;

  fullerBack.rotation.y =
    Math.PI;

  group.add(fullerBack);

  // ==============================
  // 코등이
  // ==============================

  const guard = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.17,
      2.18,
      0.42
    ),
    guardMaterial
  );

  guard.position.set(
    1.08,
    -0.01,
    0
  );

  guard.castShadow = true;
  guard.receiveShadow = true;

  group.add(guard);

  const upperGuard =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.17,
        0.62,
        0.42
      ),
      guardMaterial
    );

  upperGuard.position.set(
    1.08,
    1.18,
    0
  );

  upperGuard.castShadow = true;

  group.add(upperGuard);

  // ==============================
  // 각진 링 가드
  // Y축 90도 회전
  // ==============================

  const ring =
    createAngularRingMesh(
      0.40,
      0.24,
      0.11,
      guardMaterial
    );

  ring.position.set(
    1.08,
    -1.18,
    0
  );

  ring.rotation.y =
    Math.PI / 2;

  group.add(ring);

  const ringConnector =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.17,
        0.34,
        0.20
      ),
      guardMaterial
    );

  ringConnector.position.set(
    1.08,
    -0.86,
    0
  );

  ringConnector.castShadow = true;

  group.add(ringConnector);

  const ringSupport =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.08,
        0.18,
        0.26
      ),
      guardMaterial
    );

  ringSupport.position.set(
    1.08,
    -0.98,
    0
  );

  ringSupport.castShadow = true;

  group.add(ringSupport);

  // ==============================
  // 손잡이 본체
  // ==============================

  const handleShape =
    new THREE.Shape();

  handleShape.moveTo(
    1.18,
    0.62
  );

  handleShape.lineTo(
    4.68,
    0.58
  );

  handleShape.quadraticCurveTo(
    4.96,
    0.53,
    5.06,
    0.38
  );

  handleShape.lineTo(
    5.06,
    -0.38
  );

  handleShape.quadraticCurveTo(
    4.96,
    -0.53,
    4.68,
    -0.58
  );

  handleShape.lineTo(
    1.48,
    -0.62
  );

  handleShape.lineTo(
    1.18,
    -0.49
  );

  handleShape.closePath();

  const handle =
    extrudedShape(
      handleShape,
      0.60,
      gripMaterial,
      0.075
    );

  handle.name = 'Grip';

  group.add(handle);

  // ==============================
  // 손잡이 전면 패널
  // ==============================

  const frontPanelShape =
    roundedRectShape(
      1.22,
      0.62,
      0.12
    );

  const frontPanel =
    extrudedShape(
      frontPanelShape,
      0.065,
      gripPanelMaterial,
      0.03
    );

  frontPanel.position.set(
    2.16,
    0.04,
    0.342
  );

  group.add(frontPanel);

  const frontPanelBack =
    frontPanel.clone();

  frontPanelBack.position.z =
    -0.342;

  frontPanelBack.rotation.y =
    Math.PI;

  group.add(frontPanelBack);

  // ==============================
  // 손잡이 후면 패널
  // ==============================

  const rearPanelShape =
    roundedRectShape(
      1.66,
      0.68,
      0.16
    );

  const rearPanel =
    extrudedShape(
      rearPanelShape,
      0.055,
      gripPanelMaterial,
      0.025
    );

  rearPanel.position.set(
    3.92,
    -0.02,
    0.344
  );

  group.add(rearPanel);

  const rearPanelBack =
    rearPanel.clone();

  rearPanelBack.position.z =
    -0.344;

  rearPanelBack.rotation.y =
    Math.PI;

  group.add(rearPanelBack);

  // ==============================
  // 손잡이 홈 밴드
  // ==============================

  for (const x of [2.88, 4.66]) {
    const band =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.09,
          1.12,
          0.64
        ),
        bladeDarkMaterial
      );

    band.position.set(
      x,
      -0.03,
      0
    );

    band.castShadow = true;

    group.add(band);
  }

  // ==============================
  // 손잡이 끝부분 마감
  // ==============================

  const rearCollar =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.46,
        0.46,
        0.10,
        24
      ),
      bladeDarkMaterial
    );

  rearCollar.rotation.z =
    Math.PI / 2;

  rearCollar.position.set(
    4.93,
    0,
    0
  );

  rearCollar.castShadow = true;

  group.add(rearCollar);

  const pommelBody =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.48,
        0.48,
        0.22,
        24
      ),
      pommelMaterial
    );

  pommelBody.rotation.z =
    Math.PI / 2;

  pommelBody.position.set(
    5.11,
    0,
    0
  );

  pommelBody.castShadow = true;

  group.add(pommelBody);

  const lockRing =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.505,
        0.505,
        0.05,
        24
      ),
      bladeDarkMaterial
    );

  lockRing.rotation.z =
    Math.PI / 2;

  lockRing.position.set(
    5.255,
    0,
    0
  );

  lockRing.castShadow = true;

  group.add(lockRing);

  const endCap =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.49,
        0.49,
        0.12,
        24
      ),
      pommelMaterial
    );

  endCap.rotation.z =
    Math.PI / 2;

  endCap.position.set(
    5.36,
    0,
    0
  );

  endCap.castShadow = true;

  group.add(endCap);

  const endFaceRim =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.52,
        0.52,
        0.035,
        24
      ),
      bladeDarkMaterial
    );

  endFaceRim.rotation.z =
    Math.PI / 2;

  endFaceRim.position.set(
    5.435,
    0,
    0
  );

  endFaceRim.castShadow = true;

  group.add(endFaceRim);

  // 후면 잠금 슬롯
  const slotBody =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.03,
        0.12,
        0.34
      ),
      bladeDarkMaterial
    );

  slotBody.position.set(
    5.455,
    -0.20,
    0
  );

  slotBody.castShadow = true;

  group.add(slotBody);

  const slotLip =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.018,
        0.045,
        0.22
      ),
      pommelMaterial
    );

  slotLip.position.set(
    5.47,
    -0.20,
    0
  );

  slotLip.castShadow = true;

  group.add(slotLip);

  // 모델 전체 기본 정렬
  group.rotation.x = -0.06;
  group.rotation.y = 0.12;
  group.position.y = 0.15;

  return group;
}

export default createTacticalBayonetModel;