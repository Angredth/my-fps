/**
 * Creates a medium-detail AKS-74U using only Three.js primitive geometry.
 *
 * Orientation:
 *   muzzle: -X
 *   stock:  +X
 *   up:     +Y
 *
 * Usage:
 *   const aks74u = createAKS74U();
 *   scene.add(aks74u);
 */
function createAKS74U() {
  const group = new THREE.Group();
  group.name = "AKS74U";

  const materials = {
    receiver: new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.78,
      roughness: 0.38
    }),
    receiverEdge: new THREE.MeshStandardMaterial({
      color: 0x303030,
      metalness: 0.82,
      roughness: 0.32
    }),
    blackMetal: new THREE.MeshStandardMaterial({
      color: 0x0d0d0d,
      metalness: 0.86,
      roughness: 0.3
    }),
    wornSteel: new THREE.MeshStandardMaterial({
      color: 0x4b4b48,
      metalness: 0.9,
      roughness: 0.34
    }),
    wood: new THREE.MeshStandardMaterial({
      color: 0x7a3f1d,
      metalness: 0.02,
      roughness: 0.72
    }),
    woodDark: new THREE.MeshStandardMaterial({
      color: 0x4c2412,
      metalness: 0.02,
      roughness: 0.8
    }),
    bakelite: new THREE.MeshStandardMaterial({
      color: 0xa34f1f,
      metalness: 0.04,
      roughness: 0.62
    }),
    bakeliteDark: new THREE.MeshStandardMaterial({
      color: 0x5a2510,
      metalness: 0.03,
      roughness: 0.76
    })
  };

  const meshes = [];
  const xAxisRotation = [0, 0, Math.PI / 2];
  const zAxisRotation = [Math.PI / 2, 0, 0];

  function section(name) {
    const partGroup = new THREE.Group();
    partGroup.name = name;
    group.add(partGroup);
    return partGroup;
  }

  function addMesh(mesh, parent = group) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    meshes.push(mesh);
    return mesh;
  }

  function box(name, size, position, material, rotation = [0, 0, 0], parent = group) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    return addMesh(mesh, parent);
  }

  function cylinder(
    name,
    radiusTop,
    radiusBottom,
    height,
    position,
    material,
    rotation = [0, 0, 0],
    radialSegments = 16,
    parent = group
  ) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments),
      material
    );
    mesh.name = name;
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    return addMesh(mesh, parent);
  }

  function extrude(name, shape, depth, position, material, parent = group, options = {}) {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: options.bevelEnabled !== false,
      bevelSegments: options.bevelSegments ?? 1,
      bevelSize: options.bevelSize ?? 0.025,
      bevelThickness: options.bevelThickness ?? 0.025,
      curveSegments: options.curveSegments ?? 12,
      steps: 1
    });
    geometry.translate(0, 0, -depth / 2);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    return addMesh(mesh, parent);
  }

  function link(name, start, end, radius, material, parent = group, radialSegments = 12) {
    const from = new THREE.Vector3(...start);
    const to = new THREE.Vector3(...end);
    const direction = to.clone().sub(from);
    const midpoint = from.clone().add(to).multiplyScalar(0.5);

    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, direction.length(), radialSegments),
      material
    );
    mesh.name = name;
    mesh.position.copy(midpoint);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return addMesh(mesh, parent);
  }

  function sidePin(name, x, y, radius, material, parent, bothSides = true) {
    cylinder(name + "_right", radius, radius, 0.045, [x, y, 0.292], material, zAxisRotation, 16, parent);
    if (bothSides) {
      cylinder(name + "_left", radius, radius, 0.045, [x, y, -0.292], material, zAxisRotation, 16, parent);
    }
  }

  // Receiver: stamped AK side profile, side rails, rivets, and rear trunnion.
  const receiver = section("receiver");
  const receiverShape = new THREE.Shape();
  receiverShape.moveTo(-0.9, 0.2);
  receiverShape.lineTo(1.68, 0.2);
  receiverShape.lineTo(1.72, 0.92);
  receiverShape.lineTo(1.48, 1.08);
  receiverShape.lineTo(-0.78, 1.08);
  receiverShape.lineTo(-0.9, 0.84);
  receiverShape.closePath();
  extrude("receiver_body", receiverShape, 0.54, [0, 0, 0], materials.receiver, receiver);

  box("receiver_lower_step", [2.32, 0.13, 0.58], [0.34, 0.24, 0], materials.blackMetal, [0, 0, 0], receiver);
  box("rear_trunnion", [0.34, 0.72, 0.62], [1.57, 0.63, 0], materials.receiverEdge, [0, 0, 0], receiver);
  box("left_side_stamping", [1.72, 0.22, 0.035], [0.2, 0.72, -0.292], materials.receiverEdge, [0, 0, -0.025], receiver);
  box("right_side_stamping", [1.72, 0.22, 0.035], [0.2, 0.72, 0.292], materials.receiverEdge, [0, 0, -0.025], receiver);
  box("left_scope_rail", [1.08, 0.14, 0.075], [0.45, 0.55, -0.335], materials.blackMetal, [0, 0, 0], receiver);
  box("left_scope_rail_front", [0.18, 0.34, 0.075], [-0.02, 0.55, -0.335], materials.blackMetal, [0, 0, 0], receiver);
  box("left_scope_rail_rear", [0.18, 0.34, 0.075], [0.92, 0.55, -0.335], materials.blackMetal, [0, 0, 0], receiver);

  [
    [-0.65, 0.43, 0.07],
    [-0.42, 0.43, 0.065],
    [0.82, 0.42, 0.065],
    [1.35, 0.43, 0.075],
    [1.52, 0.82, 0.07]
  ].forEach(([x, y, r], index) => {
    sidePin("receiver_rivet_" + index, x, y, r, materials.wornSteel, receiver);
  });

  // Right-side AK controls: ejection port, charging handle, and safety selector.
  box("ejection_port", [0.78, 0.28, 0.025], [0.45, 0.92, 0.306], materials.blackMetal, [0, 0, -0.04], receiver);
  box("bolt_visible", [0.44, 0.1, 0.035], [0.24, 0.93, 0.325], materials.wornSteel, [0, 0, -0.04], receiver);
  link("charging_handle_stem", [0.68, 0.93, 0.32], [0.68, 0.93, 0.55], 0.045, materials.blackMetal, receiver, 12);
  cylinder("charging_handle_knob", 0.075, 0.075, 0.22, [0.68, 0.93, 0.63], materials.blackMetal, zAxisRotation, 16, receiver);
  sidePin("safety_pivot", 1.15, 0.78, 0.08, materials.wornSteel, receiver, false);
  box("safety_selector", [1.18, 0.075, 0.04], [0.62, 0.64, 0.33], materials.wornSteel, [0, 0, -0.15], receiver);
  box("selector_tip", [0.18, 0.12, 0.055], [0.05, 0.55, 0.335], materials.wornSteel, [0, 0, -0.15], receiver);

  // Hinged top cover with the compact AKS-74U rear sight mounted on it.
  const topCover = section("top_cover");
  const coverShape = new THREE.Shape();
  coverShape.moveTo(-0.82, 1.04);
  coverShape.lineTo(1.54, 1.04);
  coverShape.lineTo(1.44, 1.28);
  coverShape.lineTo(1.18, 1.38);
  coverShape.lineTo(-0.55, 1.36);
  coverShape.lineTo(-0.82, 1.2);
  coverShape.closePath();
  extrude("top_cover_body", coverShape, 0.57, [0, 0, 0], materials.receiverEdge, topCover);
  box("top_cover_spine", [1.74, 0.045, 0.18], [0.35, 1.38, 0], materials.blackMetal, [0, 0, 0], topCover);
  cylinder("cover_hinge", 0.085, 0.085, 0.67, [-0.78, 1.17, 0], materials.blackMetal, zAxisRotation, 16, topCover);
  cylinder("cover_release_button", 0.075, 0.075, 0.18, [1.58, 1.18, 0], materials.wornSteel, xAxisRotation, 16, topCover);

  const rearSight = section("rear_sight");
  box("rear_sight_base", [0.54, 0.12, 0.5], [1.1, 1.45, 0], materials.blackMetal, [0, 0, 0], rearSight);
  box("rear_sight_left_ear", [0.22, 0.24, 0.1], [1.1, 1.58, -0.2], materials.blackMetal, [0, 0, 0], rearSight);
  box("rear_sight_right_ear", [0.22, 0.24, 0.1], [1.1, 1.58, 0.2], materials.blackMetal, [0, 0, 0], rearSight);
  box("rear_sight_leaf", [0.3, 0.08, 0.28], [1.0, 1.53, 0], materials.wornSteel, [0, 0, -0.08], rearSight);

  // Short upper and lower wooden handguards.
  const handguard = section("handguard");
  const lowerHandguardShape = new THREE.Shape();
  lowerHandguardShape.moveTo(-2.28, 0.3);
  lowerHandguardShape.lineTo(-0.82, 0.3);
  lowerHandguardShape.lineTo(-0.72, 0.48);
  lowerHandguardShape.lineTo(-0.83, 0.83);
  lowerHandguardShape.lineTo(-2.18, 0.83);
  lowerHandguardShape.lineTo(-2.34, 0.64);
  lowerHandguardShape.closePath();
  extrude("lower_wood_handguard", lowerHandguardShape, 0.68, [0, 0, 0], materials.wood, handguard, {
    bevelSize: 0.045,
    bevelThickness: 0.045
  });

  const upperHandguardShape = new THREE.Shape();
  upperHandguardShape.moveTo(-2.2, 0.94);
  upperHandguardShape.lineTo(-0.92, 0.94);
  upperHandguardShape.lineTo(-0.82, 1.08);
  upperHandguardShape.lineTo(-0.96, 1.3);
  upperHandguardShape.lineTo(-2.08, 1.3);
  upperHandguardShape.lineTo(-2.24, 1.14);
  upperHandguardShape.closePath();
  extrude("upper_wood_handguard", upperHandguardShape, 0.54, [0, 0, 0], materials.wood, handguard, {
    bevelSize: 0.035,
    bevelThickness: 0.035
  });

  box("rear_handguard_retainer", [0.15, 0.7, 0.72], [-0.78, 0.62, 0], materials.blackMetal, [0, 0, 0], handguard);
  box("front_handguard_retainer", [0.14, 0.72, 0.72], [-2.27, 0.63, 0], materials.blackMetal, [0, 0, 0], handguard);
  box("upper_rear_band", [0.12, 0.38, 0.6], [-0.9, 1.12, 0], materials.blackMetal, [0, 0, 0], handguard);
  box("upper_front_band", [0.12, 0.38, 0.6], [-2.18, 1.12, 0], materials.blackMetal, [0, 0, 0], handguard);

  for (let index = 0; index < 4; index++) {
    const x = -2.02 + index * 0.3;
    box("lower_handguard_groove_right_" + index, [0.07, 0.38, 0.025], [x, 0.56, 0.365], materials.woodDark, [0, 0, 0.06], handguard);
    box("lower_handguard_groove_left_" + index, [0.07, 0.38, 0.025], [x, 0.56, -0.365], materials.woodDark, [0, 0, 0.06], handguard);
  }

  for (let index = 0; index < 3; index++) {
    const x = -1.94 + index * 0.38;
    box("upper_handguard_groove_right_" + index, [0.08, 0.23, 0.025], [x, 1.12, 0.302], materials.woodDark, [0, 0, 0], handguard);
    box("upper_handguard_groove_left_" + index, [0.08, 0.23, 0.025], [x, 1.12, -0.302], materials.woodDark, [0, 0, 0], handguard);
  }

  // Barrel, gas tube, combined gas block/front sight, and compact muzzle booster.
  const barrel = section("barrel_and_gas_system");
  cylinder("barrel", 0.075, 0.075, 2.75, [-2.25, 0.78, 0], materials.blackMetal, xAxisRotation, 16, barrel);
  cylinder("barrel_chamber", 0.11, 0.11, 0.62, [-0.92, 0.78, 0], materials.blackMetal, xAxisRotation, 16, barrel);
  cylinder("gas_tube", 0.09, 0.09, 1.7, [-1.48, 1.12, 0], materials.blackMetal, xAxisRotation, 16, barrel);
  link("gas_port_tube", [-2.63, 0.82, 0], [-2.48, 1.08, 0], 0.065, materials.blackMetal, barrel, 12);

  cylinder("gas_block_barrel_collar", 0.16, 0.16, 0.34, [-2.67, 0.79, 0], materials.blackMetal, xAxisRotation, 16, barrel);
  box("gas_block_body", [0.4, 0.42, 0.44], [-2.67, 1.02, 0], materials.receiverEdge, [0, 0, 0], barrel);
  cylinder("gas_block_top", 0.12, 0.12, 0.42, [-2.67, 1.2, 0], materials.blackMetal, zAxisRotation, 16, barrel);

  box("front_sight_left_ear", [0.15, 0.52, 0.1], [-2.68, 1.48, -0.18], materials.blackMetal, [0, 0, 0], barrel);
  box("front_sight_right_ear", [0.15, 0.52, 0.1], [-2.68, 1.48, 0.18], materials.blackMetal, [0, 0, 0], barrel);
  cylinder("front_sight_post", 0.025, 0.025, 0.38, [-2.68, 1.5, 0], materials.wornSteel, [0, 0, 0], 10, barrel);
  box("front_sight_bridge", [0.16, 0.1, 0.42], [-2.68, 1.72, 0], materials.blackMetal, [0, 0, 0], barrel);

  cylinder("muzzle_thread_base", 0.11, 0.11, 0.3, [-3.62, 0.78, 0], materials.wornSteel, xAxisRotation, 16, barrel);
  cylinder("muzzle_booster_rear", 0.18, 0.15, 0.22, [-3.84, 0.78, 0], materials.blackMetal, xAxisRotation, 18, barrel);
  cylinder("muzzle_booster_body", 0.23, 0.18, 0.58, [-4.22, 0.78, 0], materials.blackMetal, xAxisRotation, 18, barrel);
  cylinder("muzzle_booster_front_ring", 0.25, 0.25, 0.12, [-4.57, 0.78, 0], materials.receiverEdge, xAxisRotation, 18, barrel);
  cylinder("muzzle_opening", 0.145, 0.145, 0.02, [-4.64, 0.78, 0], materials.blackMetal, xAxisRotation, 18, barrel);

  // Curved orange-bakelite magazine, with raised ribs and dark floor plate.
  const magazine = section("magazine");
  const magazineShape = new THREE.Shape();
  magazineShape.moveTo(-0.48, 0.27);
  magazineShape.lineTo(0.24, 0.27);
  magazineShape.bezierCurveTo(0.3, -0.32, 0.18, -0.98, -0.08, -1.56);
  magazineShape.lineTo(-0.66, -1.56);
  magazineShape.bezierCurveTo(-0.47, -0.92, -0.4, -0.3, -0.48, 0.27);
  magazineShape.closePath();
  extrude("curved_bakelite_magazine", magazineShape, 0.44, [0, 0, 0], materials.bakelite, magazine, {
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 18
  });

  box("magazine_feed_lip", [0.78, 0.16, 0.5], [-0.12, 0.24, 0], materials.blackMetal, [0, 0, 0], magazine);
  box("magazine_floor_plate", [0.64, 0.13, 0.5], [-0.38, -1.58, 0], materials.blackMetal, [0, 0, -0.035], magazine);

  const magazineRibs = [
    [-0.23, -0.08, -0.02],
    [-0.27, -0.42, -0.05],
    [-0.34, -0.78, -0.09],
    [-0.44, -1.14, -0.14]
  ];
  magazineRibs.forEach(([x, y, angle], index) => {
    box("magazine_rib_right_" + index, [0.52, 0.055, 0.025], [x, y, 0.245], materials.bakeliteDark, [0, 0, angle], magazine);
    box("magazine_rib_left_" + index, [0.52, 0.055, 0.025], [x, y, -0.245], materials.bakeliteDark, [0, 0, angle], magazine);
  });

  // Angled AK pistol grip.
  const grip = section("pistol_grip");
  const gripShape = new THREE.Shape();
  gripShape.moveTo(0.78, 0.22);
  gripShape.lineTo(1.28, 0.22);
  gripShape.lineTo(1.52, -1.12);
  gripShape.lineTo(0.92, -1.2);
  gripShape.lineTo(0.7, -0.98);
  gripShape.closePath();
  extrude("pistol_grip_body", gripShape, 0.43, [0, 0, 0], materials.bakeliteDark, grip, {
    bevelSize: 0.04,
    bevelThickness: 0.04
  });
  box("pistol_grip_cap", [0.68, 0.12, 0.48], [1.22, -1.17, 0], materials.blackMetal, [0, 0, -0.05], grip);
  for (let index = 0; index < 5; index++) {
    const y = -0.08 - index * 0.2;
    box("grip_rib_right_" + index, [0.42, 0.035, 0.025], [1.13 + index * 0.025, y, 0.24], materials.blackMetal, [0, 0, -0.12], grip);
    box("grip_rib_left_" + index, [0.42, 0.035, 0.025], [1.13 + index * 0.025, y, -0.24], materials.blackMetal, [0, 0, -0.12], grip);
  }

  // Trigger, trigger guard, and AK paddle magazine release.
  const controls = section("trigger_and_controls");
  link("trigger_guard_front", [0.36, 0.2, 0.2], [0.4, -0.42, 0.2], 0.035, materials.blackMetal, controls, 10);
  link("trigger_guard_bottom", [0.4, -0.42, 0.2], [0.98, -0.42, 0.2], 0.035, materials.blackMetal, controls, 10);
  link("trigger_guard_rear", [0.98, -0.42, 0.2], [1.03, 0.16, 0.2], 0.035, materials.blackMetal, controls, 10);
  link("trigger_guard_front_left", [0.36, 0.2, -0.2], [0.4, -0.42, -0.2], 0.035, materials.blackMetal, controls, 10);
  link("trigger_guard_bottom_left", [0.4, -0.42, -0.2], [0.98, -0.42, -0.2], 0.035, materials.blackMetal, controls, 10);
  link("trigger_guard_rear_left", [0.98, -0.42, -0.2], [1.03, 0.16, -0.2], 0.035, materials.blackMetal, controls, 10);
  link("trigger", [0.72, 0.1, 0], [0.75, -0.28, 0], 0.045, materials.blackMetal, controls, 10);
  box("magazine_release_paddle", [0.24, 0.32, 0.12], [0.42, 0.08, 0], materials.blackMetal, [0, 0, -0.25], controls);
  cylinder("magazine_release_pin", 0.055, 0.055, 0.56, [0.47, 0.22, 0], materials.wornSteel, zAxisRotation, 12, controls);

  // Thin, triangular AKS folding stock shown in its extended position.
  const stock = section("folding_stock");
  cylinder("stock_hinge", 0.17, 0.17, 0.66, [1.78, 0.68, 0], materials.blackMetal, zAxisRotation, 18, stock);
  cylinder("stock_hinge_pin", 0.065, 0.065, 0.74, [1.78, 0.68, 0], materials.wornSteel, zAxisRotation, 14, stock);
  box("stock_lock_block", [0.28, 0.34, 0.62], [1.82, 0.5, 0], materials.blackMetal, [0, 0, 0], stock);

  const stockDepths = [-0.22, 0.22];
  stockDepths.forEach((z, index) => {
    link("stock_upper_strut_" + index, [1.88, 0.84, z], [4.28, 0.72, z], 0.055, materials.blackMetal, stock, 12);
    link("stock_lower_strut_" + index, [1.9, 0.42, z], [4.28, -0.05, z], 0.055, materials.blackMetal, stock, 12);
    link("stock_butt_rail_" + index, [4.28, -0.05, z], [4.28, 0.72, z], 0.06, materials.blackMetal, stock, 12);
    link("stock_rear_diagonal_" + index, [3.75, 0.05, z], [4.28, 0.72, z], 0.045, materials.blackMetal, stock, 10);
  });
  link("stock_butt_top_crossbar", [4.28, 0.72, -0.22], [4.28, 0.72, 0.22], 0.06, materials.blackMetal, stock, 12);
  link("stock_butt_bottom_crossbar", [4.28, -0.05, -0.22], [4.28, -0.05, 0.22], 0.06, materials.blackMetal, stock, 12);
  box("stock_butt_plate", [0.13, 0.86, 0.5], [4.34, 0.32, 0], materials.receiverEdge, [0, 0, -0.02], stock);
  box("stock_butt_pad", [0.08, 0.74, 0.42], [4.42, 0.32, 0], materials.blackMetal, [0, 0, -0.02], stock);

  // Sling loops at the handguard retainer and stock hinge.
  const frontSling = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 8, 16), materials.blackMetal);
  frontSling.name = "front_sling_loop";
  frontSling.position.set(-2.31, 0.45, -0.43);
  frontSling.rotation.set(Math.PI / 2, 0, 0);
  addMesh(frontSling, group);

  const rearSling = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.028, 8, 16), materials.blackMetal);
  rearSling.name = "rear_sling_loop";
  rearSling.position.set(1.82, 0.27, -0.4);
  rearSling.rotation.set(Math.PI / 2, 0, 0);
  addMesh(rearSling, group);

  group.userData.meshes = meshes;
  group.userData.materials = materials;
  group.userData.orientation = {
    muzzle: "-X",
    stock: "+X",
    up: "+Y"
  };

  return group;
}

if (typeof window !== "undefined") {
  window.createAKS74U = createAKS74U;
}
