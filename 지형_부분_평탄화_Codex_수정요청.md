# 지형 평탄화 로직 수정 요청

현재 파일의 부분 평탄화 로직만 수정해 주세요. 다른 게임 시스템이나 건물 배치 결과는 변경하지 마세요.

## 현재 코드 구조

현재 코드는 다음 방식으로 건물 주변을 평탄화하고 있습니다.

- `flattenedGroundAreas`에 평탄화 영역 저장
- `flattenedGroundHeightAt(x, z)`에서 가상의 평탄 높이 계산
- `getTerrainHeight()`가 가상의 평탄 높이를 반환
- `addFlattenedGroundArea()`가 얇은 `THREE.BoxGeometry` 패드를 지형 위에 추가
- 실제 `floorGeo`와 `CANNON.Trimesh`는 원래 굴곡진 상태로 유지됨
- 건물은 `for (let i = 0; i < 15; i++)` 반복문에서 생성됨

이 때문에 시각적 바닥, 높이 계산, 물리 충돌 지형이 서로 다를 수 있습니다.

## 수정 목표

기존 얇은 평탄화 패드를 완전히 제거하고, 건물 15개의 위치가 모두 결정된 뒤 `floorGeo` 정점 높이를 **단 한 번만 수정**해 실제 지형 자체를 평탄화하세요.

평탄화 적용 함수는 여러 번 실행되지 않도록 반드시 실행 방지 플래그를 사용하세요.

```js
let terrainFlattenApplied = false;
```

## 1. 제거할 코드

다음 코드는 제거하세요.

```js
const buildingGroundPadMaterial = new THREE.MeshStandardMaterial(...);
```

`addFlattenedGroundArea()` 안에서 다음 패드를 생성하는 코드도 제거하세요.

```js
const pad = new THREE.Mesh(
  new THREE.BoxGeometry(...),
  buildingGroundPadMaterial
);

pad.position.set(...);
scene.add(pad);
```

수정 후 `addFlattenedGroundArea()`는 영역 데이터만 등록해야 합니다.

```js
function addFlattenedGroundArea(
  x,
  z,
  w,
  d,
  y,
  padding = BUILDING_FLATTEN_PADDING,
  blend = BUILDING_FLATTEN_BLEND
) {
  const area = { x, z, w, d, y, padding, blend };
  flattenedGroundAreas.push(area);
  return area;
}
```

## 2. 접합 범위 확대

현재 값은 너무 좁아서 정점 간격상 접합부가 급격하게 보일 수 있습니다.

```js
const BUILDING_FLATTEN_PADDING = 3.2;
const BUILDING_FLATTEN_BLEND = 1.4;
```

다음처럼 변경하세요.

```js
const BUILDING_FLATTEN_PADDING = 3.2;
const BUILDING_FLATTEN_BLEND = 10;
```

또한 현재:

```js
const mapTileSegments = 12;
```

를 다음으로 변경하세요.

```js
const mapTileSegments = 20;
```

`flatShading` 설정은 기존 값을 유지하세요.

## 3. 최종 평탄 지형 높이 함수

기존 지형 높이와 건물 평탄 높이를 자연스럽게 보간하는 함수를 구현하세요.

건물 크기와 `padding` 범위까지는 완전히 평평해야 하며, 그 바깥 `blend` 거리에서 원래 지형으로 부드럽게 복귀해야 합니다.

```js
function calculateFlattenedTerrainHeight(x, z) {
  const originalHeight = terrainFormula(x, z);

  let selectedArea = null;
  let strongestWeight = 0;

  for (const area of flattenedGroundAreas) {
    const halfWidth = area.w / 2 + area.padding;
    const halfDepth = area.d / 2 + area.padding;

    const outsideX = Math.max(
      Math.abs(x - area.x) - halfWidth,
      0
    );

    const outsideZ = Math.max(
      Math.abs(z - area.z) - halfDepth,
      0
    );

    const distance = Math.hypot(outsideX, outsideZ);

    if (distance > area.blend) continue;

    const weight =
      1 - smoothstep(0, area.blend, distance);

    if (weight > strongestWeight) {
      strongestWeight = weight;
      selectedArea = area;
    }
  }

  if (!selectedArea) {
    return originalHeight;
  }

  return THREE.MathUtils.lerp(
    originalHeight,
    selectedArea.y,
    strongestWeight
  );
}
```

평탄 영역 내부에서는 `distance`가 0이므로 가중치가 정확히 1이 되어야 합니다.

## 4. 실제 `floorGeo`를 한 번만 수정

다음 함수를 추가하세요.

```js
function applyFlattenedGroundAreasToTerrainOnce() {
  if (terrainFlattenApplied) return;
  terrainFlattenApplied = true;

  const position = floorGeo.attributes.position;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);

    position.setY(
      i,
      calculateFlattenedTerrainHeight(x, z)
    );
  }

  position.needsUpdate = true;

  floorGeo.computeVertexNormals();
  floorGeo.computeBoundingBox();
  floorGeo.computeBoundingSphere();

  floor.updateMatrixWorld(true);

  rebuildTerrainPhysicsBody();
}
```

이 함수는 반드시 평탄화 영역이 전부 등록된 뒤 한 번만 실행해야 합니다.

## 5. Cannon 지형 재생성

현재 `terrainBody`가 `const`로 선언되어 있다면 다음처럼 변경하세요.

```js
let terrainBody = null;
```

기존 Cannon 지형 생성 코드를 함수로 분리하세요.

```js
function rebuildTerrainPhysicsBody() {
  if (terrainBody) {
    physicsWorld.removeBody(terrainBody);
  }

  const position = floorGeo.attributes.position;

  const terrainIndices = floorGeo.index
    ? Array.from(floorGeo.index.array)
    : Array.from(
        { length: position.count },
        (_, index) => index
      );

  const terrainVertices = [];

  for (let i = 0; i < position.count; i++) {
    terrainVertices.push(
      position.getX(i),
      position.getY(i),
      position.getZ(i)
    );
  }

  const terrainShape = new CANNON.Trimesh(
    terrainVertices,
    terrainIndices
  );

  terrainBody = new CANNON.Body({
    mass: 0,
    shape: terrainShape
  });

  physicsWorld.addBody(terrainBody);
}
```

최초 지형 생성 시에도 기존 직접 생성 코드 대신 다음을 호출하세요.

```js
rebuildTerrainPhysicsBody();
```

평탄화 적용 후에도 같은 함수를 호출하여 기존 물리 지형을 교체하세요.

## 6. 정확한 실행 위치

현재 건물 생성 반복문은 다음 구조입니다.

```js
for (let i = 0; i < 15; i++) {
  // 건물 위치 계산
  // addFlattenedGroundArea(...)
  // 건물 생성
  // 월드 루팅 오브젝트 생성
}
```

이 반복문이 완전히 끝난 직후에 다음 코드를 정확히 한 번 호출하세요.

```js
applyFlattenedGroundAreasToTerrainOnce();
```

즉, 구조는 다음과 같아야 합니다.

```js
for (let i = 0; i < 15; i++) {
  // 기존 건물 생성 로직 유지
}

applyFlattenedGroundAreasToTerrainOnce();

// 이후 나무, 적, 기타 월드 오브젝트 생성
```

건물 반복문 내부에서 호출하면 안 됩니다.

## 7. `getTerrainHeight()` 수정

평탄화가 적용된 뒤에는 실제 `floor` 레이캐스트 결과를 우선 사용해야 합니다.

```js
function getTerrainHeight(x, z) {
  if (!isInsideMap(x, z)) return 0;

  /*
   * 건물 생성 중에는 아직 floorGeo가 변형되지 않았으므로
   * 등록된 평탄화 높이를 임시로 사용한다.
   */
  if (!terrainFlattenApplied) {
    const temporaryHeight =
      flattenedGroundHeightAt(x, z);

    if (temporaryHeight !== null) {
      return temporaryHeight;
    }
  }

  terrainRayOrigin.set(x, 120, z);
  terrainRaycaster.set(
    terrainRayOrigin,
    terrainRayDirection
  );

  terrainRaycaster.far = 260;

  const floorHit =
    terrainRaycaster.intersectObject(
      floor,
      false
    )[0];

  if (floorHit) {
    return floorHit.point.y;
  }

  return calculateFlattenedTerrainHeight(x, z);
}
```

이렇게 하면:

- 건물 생성 중에는 예정된 평탄 높이 사용
- 지형 변형 완료 후에는 실제 렌더링 지형 높이 사용
- Cannon 물리 충돌도 같은 정점 사용

## 금지 사항

- 새로운 평면이나 `BoxGeometry`를 지형 위에 추가하지 마세요.
- 건물 위치를 다시 랜덤 생성하지 마세요.
- 건물 개수나 크기를 변경하지 마세요.
- 평탄화 함수를 건물마다 반복 실행하지 마세요.
- 매 프레임 지형 정점을 수정하지 마세요.
- 기존 `floor`와 별개의 충돌 바닥을 만들지 마세요.
- 다른 인벤토리, 전투, 적 AI, 루팅 시스템은 수정하지 마세요.

## 완료 조건

- `flattenedGround` 타입의 별도 패드 메시가 존재하지 않음
- 건물 15개의 배치 결과는 기존과 동일함
- 건물 주변 실제 `floorGeo`가 평탄해짐
- 접합부가 `smoothstep`으로 자연스럽게 이어짐
- 평탄화 적용 함수는 한 번만 실행됨
- 기존 Cannon 지형은 제거된 뒤 수정된 `floorGeo` 기준으로 한 번 재생성됨
- 플레이어가 접합부를 걸을 때 단차나 충돌 불일치가 없음
- 나무, 적, 루팅 오브젝트가 수정된 실제 지면 높이를 사용함

수정 완료 후 변경한 부분만 간단히 설명하고, 수정된 전체 HTML 파일을 제공하세요.
