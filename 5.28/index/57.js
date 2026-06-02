function createFN57HighQuality() {
  const gun = new THREE.Group();

  const mats = {
    slide: new THREE.MeshStandardMaterial({ color: 0x242424, roughness: 0.48, metalness: 0.28 }),
    slideEdge: new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.45, metalness: 0.35 }),
    frame: new THREE.MeshStandardMaterial({ color: 0xa18457, roughness: 0.72, metalness: 0.06 }),
    frameDark: new THREE.MeshStandardMaterial({ color: 0x6d5736, roughness: 0.78, metalness: 0.05 }),
    black: new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.55, metalness: 0.25 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.88, metalness: 0.02 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.35, metalness: 0.6 }),
    red: new THREE.MeshStandardMaterial({ color: 0xd90000, roughness: 0.35, metalness: 0.05, emissive: 0x360000 }),
    sightGreen: new THREE.MeshStandardMaterial({ color: 0x58ff4f, roughness: 0.18, metalness: 0.02, emissive: 0x20ff18, emissiveIntensity: 1.35 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xcfdcff, roughness: 0.1, metalness: 0.05, transparent: true, opacity: 0.65 })
  };

  const meshes = [];

  function add(mesh, parent = gun) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    meshes.push(mesh);
    return mesh;
  }

  function box(name, size, pos, mat, rot = [0, 0, 0], parent = gun) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
    mesh.name = name;
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    return add(mesh, parent);
  }

  function cyl(name, radiusTop, radiusBottom, height, pos, mat, rot = [0, 0, 0], radial = 32, parent = gun) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radial),
      mat
    );
    mesh.name = name;
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    return add(mesh, parent);
  }

  function bevelBox(name, size, pos, mat, rot = [0, 0, 0], radius = 0.08, parent = gun) {
    const g = new THREE.Group();
    g.name = name;
    parent.add(g);

    box(`${name}_core`, size, [0, 0, 0], mat, [0, 0, 0], g);
    box(`${name}_top_soft`, [size[0] * 0.95, radius, size[2] * 0.92], [0, size[1] / 2 + radius * 0.18, 0], mat, [0, 0, 0], g);
    box(`${name}_bottom_soft`, [size[0] * 0.95, radius, size[2] * 0.92], [0, -size[1] / 2 - radius * 0.18, 0], mat, [0, 0, 0], g);

    g.position.set(...pos);
    g.rotation.set(...rot);
    return g;
  }

  bevelBox("long_black_slide", [5.65, 0.66, 0.72], [0.3, 1.02, 0], mats.slide, [0, 0, 0], 0.06);
  box("front_muzzle_block", [0.42, 0.78, 0.78], [3.36, 0.98, 0], mats.slideEdge);

  // FN 5-7 iron sights: rear notch is split left/right with a carved-looking center channel.
  const rearSight = new THREE.Group();
  rearSight.name = "rear_sight_notched_green_dots";
  gun.add(rearSight);
  rearSight.position.set(-2.47, 1.47, 0);
  rearSight.rotation.set(0, 0, -0.18);

  box("rear_sight_base", [0.72, 0.13, 0.62], [0, -0.045, 0], mats.black, [0, 0, 0], rearSight);
  box("rear_sight_left_ear", [0.28, 0.24, 0.18], [0, 0.055, -0.22], mats.black, [0, 0, 0], rearSight);
  box("rear_sight_right_ear", [0.28, 0.24, 0.18], [0, 0.055, 0.22], mats.black, [0, 0, 0], rearSight);

  cyl("rear_sight_left_green_dot", 0.055, 0.055, 0.025, [-0.15, 0.115, -0.21], mats.sightGreen, [Math.PI / 2, 0, Math.PI / 2], 24, rearSight);
  cyl("rear_sight_right_green_dot", 0.055, 0.055, 0.025, [-0.15, 0.115, 0.21], mats.sightGreen, [Math.PI / 2, 0, Math.PI / 2], 24, rearSight);

  const frontSight = new THREE.Group();
  frontSight.name = "front_sight_green_dot";
  gun.add(frontSight);
  frontSight.position.set(3.0, 1.48, 0);
  frontSight.rotation.set(0, 0, 0.1);

  box("front_sight_body", [0.18, 0.18, 0.42], [0, 0, 0], mats.black, [0, 0, 0], frontSight);
  box("front_sight_top_bead_holder", [0.13, 0.08, 0.30], [0.02, 0.09, 0], mats.black, [0, 0, 0], frontSight);
  cyl("front_sight_green_dot", 0.05, 0.05, 0.024, [-0.1, 0.07, 0.01], mats.sightGreen, [Math.PI / 2, 0, Math.PI/2], 24, frontSight);
  

  box("ejection_port_cut_dark", [1.15, 0.16, 0.77], [0.35, 1.37, 0], mats.black);
  box("ejection_port_inner_barrel", [0.75, 0.09, 0.46], [0.28, 1.39, 0], mats.metal);
  box("front_slide_lower_step", [2.0, 0.17, 0.78], [2.05, 0.59, 0], mats.slideEdge);
  box("rear_slide_panel", [1.0, 0.54, 0.8], [-2.55, 0.98, 0], mats.slideEdge);

  for (let i = 0; i < 8; i++) {
    box(`rear_serration_${i}`, [0.055, 0.52, 0.84], [-2.92 + i * 0.115, 1.02, 0.01], mats.black, [0, 0, -0.08]);
  }

  cyl("muzzle_outer", 0.26, 0.26, 0.13, [3.6, 0.98, 0], mats.black, [0, 0, Math.PI / 2], 40);
  cyl("muzzle_hole", 0.13, 0.13, 0.145, [3.67, 0.98, 0], mats.slide, [0, 0, Math.PI / 2], 36);
  cyl("barrel_inside", 0.06, 0.06, 0.16, [3.75, 0.98, 0], mats.black, [0, 0, Math.PI / 2], 24);

  bevelBox("tan_frame_main", [5.25, 0.56, 0.72], [0.12, 0.4, 0], mats.frame, [0, 0, 0], 0.07);
  box("frame_dust_cover", [2.05, 0.34, 0.76], [2.1, -0.02, 0], mats.frame);
  box("front_under_lug", [0.48, 0.5, 0.72], [2.95, 0.13, 0], mats.frame, [0, 0, -0.25]);
  box("rear_beavertail", [0.9, 0.42, 0.74], [-2.75, 0.48, 0], mats.frame, [0, 0, 0.18]);

  for (let i = 0; i < 5; i++) {
    box(`rail_tooth_${i}`, [0.28, 0.15, 0.86], [1.35 + i * 0.34, -0.28, 0], mats.frameDark, [0, 0, 0.22]);
  }

  box("rail_base", [1.9, 0.12, 0.7], [1.98, -0.18, 0], mats.frameDark);

  const grip = new THREE.Group();
  grip.name = "angled_grip_group";
  gun.add(grip);

  bevelBox("grip_body", [1.05, 2.55, 0.78], [0, 0, 0], mats.frame, [0, 0, -0.18], 0.06, grip);
  grip.position.set(-1.55, -1.03, 0);

  box("grip_front_curve_hint", [0.25, 2.2, 0.82], [-1.15, -0.8, 0], mats.frameDark, [0, 0, -0.28]);
  box("mag_base_plate", [1.2, 0.23, 0.9], [-1.62, -2.42, 0], mats.black, [0, 0, -0.05]);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 4; col++) {
      box(
        `grip_check_${row}_${col}`,
        [0.075, 0.075, 0.035],
        [-1.88 + col * 0.17 + row * 0.015, -0.55 - row * 0.18, 0.42],
        mats.frameDark,
        [0, 0, 0.78]
      );
    }
  }

  for (let i = 0; i < 9; i++) {
    box(`grip_side_line_${i}`, [0.58, 0.025, 0.035], [-1.25, -0.62 - i * 0.17, 0.43], mats.frameDark);
  }

  box("trigger_guard_bottom", [1.35, 0.14, 0.18], [-0.15, -0.55, 0.43], mats.frame, [0, 0, -0.05]);
  box("trigger_guard_front", [0.18, 0.9, 0.18], [0.48, -0.16, 0.43], mats.frame, [0, 0, -0.18]);
  box("trigger_guard_rear", [0.16, 0.65, 0.18], [-0.82, -0.22, 0.43], mats.frame, [0, 0, 0.22]);
  box("trigger_black", [0.22, 0.78, 0.18], [-0.27, -0.18, 0.46], mats.black, [0, 0, -0.17]);

  cyl("safety_selector_disc", 0.18, 0.18, 0.08, [-0.27, 0.45, 0.42], mats.metal, [Math.PI / 2, 0, 0], 32);
  box("safety_selector_lever", [0.42, 0.12, 0.09], [-0.18, 0.43, 0.48], mats.black, [0, 0, -0.08]);
  cyl("red_safety_dot", 0.055, 0.055, 0.03, [0.13, 0.65, 0.44], mats.red, [Math.PI / 2, 0, 0], 24);
  box("slide_stop", [0.45, 0.13, 0.12], [-0.9, 0.15, 0.46], mats.black, [0, 0, 0.05]);
  box("mag_release", [0.28, 0.2, 0.11], [-1.15, -0.45, 0.46], mats.black, [0, 0, 0.08]);

  const screwPositions = [
    [-2.9, 0.46, 0.43],
    [-2.35, 0.4, 0.43],
    [-0.02, 0.08, 0.43],
    [0.72, 0.27, 0.43],
    [1.72, 0.28, 0.43],
    [2.7, 0.12, 0.43]
  ];

  screwPositions.forEach((p, i) => {
    cyl(`silver_pin_${i}`, 0.085, 0.085, 0.045, p, mats.metal, [Math.PI / 2, 0, 0], 24);
    cyl(`pin_dark_center_${i}`, 0.04, 0.04, 0.05, [p[0], p[1], p[2] + 0.012], mats.black, [Math.PI / 2, 0, 0], 20);
  });

  box("marking_line_1", [0.78, 0.035, 0.025], [-1.65, 0.62, 0.45], mats.frameDark);
  box("marking_line_2", [0.58, 0.025, 0.025], [-1.75, 0.51, 0.45], mats.frameDark);
  box("caliber_mark_hint", [0.42, 0.025, 0.025], [0.8, 0.83, 0.45], mats.black);

  cyl("grip_logo_ring", 0.16, 0.16, 0.035, [-2.05, -1.25, 0.43], mats.frameDark, [Math.PI / 2, 0, 0], 32);
  cyl("grip_logo_inner", 0.105, 0.105, 0.04, [-2.05, -1.25, 0.45], mats.frame, [Math.PI / 2, 0, 0], 32);

  const suppressor = new THREE.Group();
  suppressor.name = "suppressor_group";
  gun.add(suppressor);

  cyl("suppressor_body", 0.33, 0.33, 2.25, [4.85, 0.98, 0], mats.black, [0, 0, Math.PI / 2], 40, suppressor);
  cyl("suppressor_front_cap", 0.34, 0.34, 0.08, [5.98, 0.98, 0], mats.slideEdge, [0, 0, Math.PI / 2], 40, suppressor);
  cyl("suppressor_hole", 0.13, 0.13, 0.09, [6.04, 0.98, 0], mats.black, [0, 0, Math.PI / 2], 32, suppressor);
  box("suppressor_highlight", [1.8, 0.025, 0.03], [4.88, 1.28, 0.17], mats.slideEdge, [0, 0, 0], suppressor);

  const flashlight = new THREE.Group();
  flashlight.name = "flashlight_group";
  gun.add(flashlight);

  box("light_mount", [1.1, 0.45, 0.72], [2.04, -0.65, 0], mats.frame, [0, 0, 0], flashlight);
  box("light_switch", [0.42, 0.12, 0.78], [1.83, -0.33, 0], mats.black, [0, 0, 0], flashlight);
  cyl("light_body", 0.37, 0.37, 1.18, [2.95, -0.7, 0], mats.frame, [0, 0, Math.PI / 2], 40, flashlight);
  cyl("light_head", 0.46, 0.46, 0.5, [3.75, -0.7, 0], mats.frame, [0, 0, Math.PI / 2], 40, flashlight);
  cyl("light_lens", 0.34, 0.34, 0.05, [4.02, -0.7, 0], mats.glass, [0, 0, Math.PI / 2], 40, flashlight);
  box("light_label_plate", [0.72, 0.24, 0.04], [2.72, -0.7, 0.39], mats.frameDark, [0, 0, 0], flashlight);

  gun.rotation.y = -0.25;
  gun.position.y = 0.45;

  gun.userData.meshes = meshes;
  gun.userData.materials = mats;
  gun.userData.suppressor = suppressor;
  gun.userData.flashlight = flashlight;

  return gun;
}
