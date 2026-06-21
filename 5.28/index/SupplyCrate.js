function createTechnicalSupplyCrateModel() {
  const crate = new THREE.Group();
  crate.name = "Technical_Supply_Crate_Lowpoly";

  // 1 unit = 1cm
  const W = 110; // width  X
  const D = 55;  // depth  Z
  const H = 55;  // height Y

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xb8a36f,
    roughness: 0.85,
    metalness: 0.05
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x7a6744,
    roughness: 0.9,
    metalness: 0.03
  });

  const edgeWoodMat = new THREE.MeshStandardMaterial({
    color: 0x9f8a5c,
    roughness: 0.9,
    metalness: 0.04
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x4c4638,
    roughness: 0.55,
    metalness: 0.65
  });

  const stencilMat = new THREE.MeshStandardMaterial({
    color: 0xe8dfbd,
    roughness: 0.8,
    metalness: 0.0
  });

  const inkMat = new THREE.MeshStandardMaterial({
    color: 0x5a5547,
    roughness: 0.9,
    metalness: 0.0
  });

  function addBox(name, size, pos, mat, rot = [0, 0, 0]) {
    const geo = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = name;
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.rotation.set(rot[0], rot[1], rot[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    crate.add(mesh);
    return mesh;
  }

  function addRivet(name, x, y, z, face = "front") {
    const geo = new THREE.CylinderGeometry(0.9, 0.9, 0.45, 8);
    const rivet = new THREE.Mesh(geo, metalMat);
    rivet.name = name;
    rivet.position.set(x, y, z);

    if (face === "front" || face === "back") {
      rivet.rotation.x = Math.PI / 2;
    } else if (face === "left" || face === "right") {
      rivet.rotation.z = Math.PI / 2;
    } else {
      rivet.rotation.x = 0;
    }

    rivet.castShadow = true;
    crate.add(rivet);
    return rivet;
  }

  // --------------------------------------------------
  // Main crate body
  // --------------------------------------------------
  addBox(
    "main_wooden_box_body",
    [W, H, D],
    [0, H / 2, 0],
    woodMat
  );

  // Slight darker bottom shadow/base
  addBox(
    "bottom_dark_base",
    [W + 1.5, 3, D + 1.5],
    [0, 1.5, 0],
    darkWoodMat
  );

  // --------------------------------------------------
  // Horizontal plank grooves on front/back/side
  // thin dark strips fake separated wooden boards
  // --------------------------------------------------
  const grooveCount = 7;
  for (let i = 1; i < grooveCount; i++) {
    const y = (H / grooveCount) * i;

    addBox(
      "front_horizontal_plank_gap_" + i,
      [W - 8, 0.55, 0.7],
      [0, y, -D / 2 - 0.45],
      darkWoodMat
    );

    addBox(
      "back_horizontal_plank_gap_" + i,
      [W - 8, 0.55, 0.7],
      [0, y, D / 2 + 0.45],
      darkWoodMat
    );

    addBox(
      "left_horizontal_plank_gap_" + i,
      [0.7, 0.55, D - 8],
      [-W / 2 - 0.45, y, 0],
      darkWoodMat
    );

    addBox(
      "right_horizontal_plank_gap_" + i,
      [0.7, 0.55, D - 8],
      [W / 2 + 0.45, y, 0],
      darkWoodMat
    );
  }

  // --------------------------------------------------
  // Vertical reinforced posts
  // --------------------------------------------------
  const postW = 5.5;
  const postDepth = 5.5;

  const frontZ = -D / 2 - 2.5;
  const backZ = D / 2 + 2.5;
  const leftX = -W / 2 - 2.5;
  const rightX = W / 2 + 2.5;

  // Front vertical posts: left, mid-left, mid-right, right
  const frontPostXs = [-W / 2 + 3, -W / 6, W / 6, W / 2 - 3];
  frontPostXs.forEach((x, i) => {
    addBox(
      "front_vertical_reinforced_post_" + i,
      [postW, H + 3, postDepth],
      [x, H / 2, frontZ],
      edgeWoodMat
    );
  });

  // Back vertical posts
  const backPostXs = [-W / 2 + 3, -W / 6, W / 6, W / 2 - 3];
  backPostXs.forEach((x, i) => {
    addBox(
      "back_vertical_reinforced_post_" + i,
      [postW, H + 3, postDepth],
      [x, H / 2, backZ],
      edgeWoodMat
    );
  });

  // Side corner posts
  [-D / 2 + 3, D / 2 - 3].forEach((z, i) => {
    addBox(
      "left_side_vertical_post_" + i,
      [postDepth, H + 3, postW],
      [leftX, H / 2, z],
      edgeWoodMat
    );

    addBox(
      "right_side_vertical_post_" + i,
      [postDepth, H + 3, postW],
      [rightX, H / 2, z],
      edgeWoodMat
    );
  });

  // --------------------------------------------------
  // Top length battens / raised rails
  // --------------------------------------------------
  const railZs = [-D / 2 + 5, 0, D / 2 - 5];

  railZs.forEach((z, i) => {
    addBox(
      "top_long_raised_batten_" + i,
      [W + 4, 5, 5],
      [0, H + 3, z],
      edgeWoodMat
    );
  });

  // Left/right top side rim
  addBox(
    "top_front_rim",
    [W + 5, 4, 4],
    [0, H + 2.5, -D / 2 - 2],
    edgeWoodMat
  );

  addBox(
    "top_back_rim",
    [W + 5, 4, 4],
    [0, H + 2.5, D / 2 + 2],
    edgeWoodMat
  );

  // --------------------------------------------------
  // Front diagonal braces
  // Four diagonal boards, like the reference image
  // --------------------------------------------------
  function addFrontDiagonalBrace(name, centerX, centerY, angleZ) {
    const length = 45;
    const thickness = 5.5;
    addBox(
      name,
      [length, thickness, 4.2],
      [centerX, centerY, -D / 2 - 5.2],
      edgeWoodMat,
      [0, 0, angleZ]
    );
  }

  addFrontDiagonalBrace(
    "front_left_diagonal_brace_a",
    -35,
    25,
    THREE.MathUtils.degToRad(38)
  );

  addFrontDiagonalBrace(
    "front_left_diagonal_brace_b",
    -15,
    25,
    THREE.MathUtils.degToRad(-38)
  );

  addFrontDiagonalBrace(
    "front_right_diagonal_brace_a",
    15,
    25,
    THREE.MathUtils.degToRad(38)
  );

  addFrontDiagonalBrace(
    "front_right_diagonal_brace_b",
    35,
    25,
    THREE.MathUtils.degToRad(-38)
  );

  // --------------------------------------------------
  // Back simple vertical reinforcement boards
  // --------------------------------------------------
  [-38, 0, 38].forEach((x, i) => {
    addBox(
      "back_extra_vertical_board_" + i,
      [4.5, H - 4, 4],
      [x, H / 2, D / 2 + 5],
      edgeWoodMat
    );
  });

  // --------------------------------------------------
  // Metal latch hardware on front upper area
  // --------------------------------------------------
  const latchXs = [-W / 6, W / 6];

  latchXs.forEach((x, i) => {
    addBox(
      "front_latch_plate_top_" + i,
      [7, 4, 1.2],
      [x, H - 5, -D / 2 - 7.6],
      metalMat
    );

    addBox(
      "front_latch_plate_lower_" + i,
      [5.5, 7, 1.2],
      [x, H - 12, -D / 2 - 7.7],
      metalMat
    );

    addBox(
      "front_latch_loop_" + i,
      [4.5, 1.3, 1.4],
      [x, H - 16.5, -D / 2 - 8.0],
      metalMat
    );

    // small hanging ring using low-poly torus substitute:
    // box cross shape to avoid TorusGeometry
    addBox(
      "front_latch_ring_h_" + i,
      [5, 0.9, 1.0],
      [x, H - 18.2, -D / 2 - 8.1],
      metalMat
    );

    addBox(
      "front_latch_ring_v_" + i,
      [0.9, 5, 1.0],
      [x, H - 18.2, -D / 2 - 8.2],
      metalMat
    );
  });

  // --------------------------------------------------
  // Small warning/stencil label on front-right
  // --------------------------------------------------
  addBox(
    "front_warning_label_plate",
    [16, 8, 0.45],
    [42, H - 17, -D / 2 - 8.4],
    stencilMat
  );

  // fake printed symbols on label
  addBox(
    "label_symbol_fragile_box",
    [3.5, 3.5, 0.3],
    [36.5, H - 17, -D / 2 - 8.75],
    inkMat
  );

  addBox(
    "label_symbol_arrow_1",
    [0.7, 5, 0.3],
    [42, H - 17, -D / 2 - 8.75],
    inkMat
  );

  addBox(
    "label_symbol_arrow_2",
    [0.7, 5, 0.3],
    [45, H - 17, -D / 2 - 8.75],
    inkMat
  );

  addBox(
    "label_symbol_umbrella_stem",
    [0.7, 4, 0.3],
    [49, H - 18, -D / 2 - 8.75],
    inkMat
  );

  addBox(
    "label_symbol_umbrella_top",
    [5, 0.7, 0.3],
    [49, H - 15.5, -D / 2 - 8.75],
    inkMat
  );

  // --------------------------------------------------
  // Rivets / screw heads
  // --------------------------------------------------
  const rivetYs = [10, 24, 39, 51];

  frontPostXs.forEach((x, pi) => {
    rivetYs.forEach((y, ri) => {
      addRivet(
        `front_post_${pi}_rivet_${ri}`,
        x,
        y,
        -D / 2 - 8.1,
        "front"
      );
    });
  });

  backPostXs.forEach((x, pi) => {
    rivetYs.forEach((y, ri) => {
      addRivet(
        `back_post_${pi}_rivet_${ri}`,
        x,
        y,
        D / 2 + 8.1,
        "back"
      );
    });
  });

  [-D / 2 + 3, D / 2 - 3].forEach((z, zi) => {
    rivetYs.forEach((y, ri) => {
      addRivet(
        `left_side_rivet_${zi}_${ri}`,
        -W / 2 - 8.1,
        y,
        z,
        "left"
      );

      addRivet(
        `right_side_rivet_${zi}_${ri}`,
        W / 2 + 8.1,
        y,
        z,
        "right"
      );
    });
  });

  // Rivets on top battens
  railZs.forEach((z, zi) => {
    [-45, -15, 15, 45].forEach((x, xi) => {
      addRivet(
        `top_batten_rivet_${zi}_${xi}`,
        x,
        H + 5.8,
        z,
        "top"
      );
    });
  });

  // --------------------------------------------------
  // Bottom support beams
  // --------------------------------------------------
  [-38, 0, 38].forEach((x, i) => {
    addBox(
      "bottom_cross_support_" + i,
      [5, 3, D + 2],
      [x, -1.5, 0],
      darkWoodMat
    );
  });

  addBox(
    "bottom_long_support_front",
    [W - 8, 3, 4],
    [0, -1.5, -D / 2 + 5],
    darkWoodMat
  );

  addBox(
    "bottom_long_support_back",
    [W - 8, 3, 4],
    [0, -1.5, D / 2 - 5],
    darkWoodMat
  );

  // --------------------------------------------------
  // Slight side plank lines on top surface
  // --------------------------------------------------
  for (let i = 1; i < 5; i++) {
    const z = -D / 2 + (D / 5) * i;
    addBox(
      "top_plank_gap_" + i,
      [W - 8, 0.45, 0.6],
      [0, H + 0.35, z],
      darkWoodMat
    );
  }

  // Center the crate bottom around y = 0.
  // Body itself goes from y=0 to y=55, top details rise above.
  crate.userData.dimensions = {
    width: W,
    depth: D,
    height: H,
    unit: "cm"
  };

  return crate;
}
