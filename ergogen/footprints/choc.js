// Kailh Choc PG1350
// Nets
//    from: corresponds to pin 1
//    to: corresponds to pin 2
// Params
//    hotswap: default is false
//      if true, will include holes and pads for Kailh choc hotswap sockets
//    reverse: default is false
//      if true, will flip the footprint such that the pcb can be reversible
//    keycaps: default is false
//      if true, will add choc sized keycap box around the footprint
//
// note: hotswap and reverse can be used simultaneously
//
// Changes compared to original ergogen footprint:
//  - Added hotswap socket outlines to silk screen
//  - Moved switch corner marks from user layer to silk screen
//  - Added option to show 1.5u keycap outline
//  - Changed keycap outline to show the exact choc keycap dimensions instead of padded dimensions (17.5mm length vs 18mm)

module.exports = {
    params: {
      designator: 'S',
      hotswap: false,
      hotswap_tht: false,
      reverse: false,
      keycaps: false,
      keycaps_x: 18,
      keycaps_y: 17,
      show_1_5u_outline: false,
      from: undefined,
      to: undefined
    },
    body: p => {

      const keycap_xo = 0.5 * p.keycaps_x;
      const keycap_yo = 0.5 * p.keycaps_y;

      const standard = `
        (module PG1350 (layer F.Cu) (tedit 5DD50112)
        ${p.at /* parametric position */}
        (attr virtual)

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        ${''/* corner marks - front */}
        (fp_line (start -7 -6) (end -7 -7) (layer F.SilkS) (width 0.15))
        (fp_line (start -7 7) (end -6 7) (layer F.SilkS) (width 0.15))
        (fp_line (start -6 -7) (end -7 -7) (layer F.SilkS) (width 0.15))
        (fp_line (start -7 7) (end -7 6) (layer F.SilkS) (width 0.15))
        (fp_line (start 7 6) (end 7 7) (layer F.SilkS) (width 0.15))
        (fp_line (start 7 -7) (end 6 -7) (layer F.SilkS) (width 0.15))
        (fp_line (start 6 7) (end 7 7) (layer F.SilkS) (width 0.15))
        (fp_line (start 7 -7) (end 7 -6) (layer F.SilkS) (width 0.15))

        ${''/* corner marks - back */}
        (fp_line (start -7 -6) (end -7 -7) (layer B.SilkS) (width 0.15))
        (fp_line (start -7 7) (end -6 7) (layer B.SilkS) (width 0.15))
        (fp_line (start -6 -7) (end -7 -7) (layer B.SilkS) (width 0.15))
        (fp_line (start -7 7) (end -7 6) (layer B.SilkS) (width 0.15))
        (fp_line (start 7 6) (end 7 7) (layer B.SilkS) (width 0.15))
        (fp_line (start 7 -7) (end 6 -7) (layer B.SilkS) (width 0.15))
        (fp_line (start 6 7) (end 7 7) (layer B.SilkS) (width 0.15))
        (fp_line (start 7 -7) (end 7 -6) (layer B.SilkS) (width 0.15))


        ${''/* middle shaft */}
        (pad "" np_thru_hole circle (at 0 0) (size 3.429 3.429) (drill 3.429) (layers *.Cu *.Mask))

        ${''/* stabilizers */}
        (pad "" np_thru_hole circle (at 5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
        (pad "" np_thru_hole circle (at -5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
        `

      const hotswap = `
        ${''/* Middle hole for hot swap sockets */}
        (pad "" np_thru_hole circle (at 0 -5.95) (size 3 3) (drill 3) (layers *.Cu *.Mask))
      `

      const hotswap_tht = `
      (pad 2 thru_hole circle (at 0 5.9) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.to.str})
      `
      const tht = `
      (pad 2 thru_hole circle (at 0 -5.9) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.to.str})
      `

      const keycap = `
        ${'' /* keycap marks - 1u */}
        (fp_line (start ${ -keycap_xo } ${ -keycap_yo }) (end ${ keycap_xo } ${ -keycap_yo }) (layer Dwgs.User) (width 0.15))
        (fp_line (start ${ keycap_xo } ${ -keycap_yo }) (end ${ keycap_xo } ${ keycap_yo }) (layer Dwgs.User) (width 0.15))
        (fp_line (start ${ keycap_xo } ${ keycap_yo }) (end ${ -keycap_xo } ${ keycap_yo }) (layer Dwgs.User) (width 0.15))
        (fp_line (start ${ -keycap_xo } ${ keycap_yo }) (end ${ -keycap_xo } ${ -keycap_yo }) (layer Dwgs.User) (width 0.15))
      `

      function pins(def_neg, def_pos, def_side) {
        let pad_1 = `
          (pad 1 connect custom (at ${def_neg}3.275 -5.95 ${p.rot}) (size 0.5 0.5) (layers ${def_side}.Cu ${def_side}.Mask)
          (zone_connect 0)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -1.3 -1.3) (xy -1.3 1.3) (xy 0.05 1.3) (xy 1.3 0.25) (xy 1.3 -1.3)
            ) (width 0))
          ) ${p.from.str})
        `;
        if(def_side == 'B') {
          pad_1 = `
          (pad 1 connect custom (at ${def_neg}3.275 -5.95 ${p.rot}) (size 0.5 0.5) (layers ${def_side}.Cu ${def_side}.Mask)
          (zone_connect 0)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -1.3 -1.3) (xy -1.3 0.25) (xy -0.05 1.3) (xy 1.3 1.3) (xy 1.3 -1.3)
            ) (width 0))
          ) ${p.from.str})
          `
        }

        const hotswap = `
          ${'' /* holes */}
          (pad "" np_thru_hole circle (at ${def_pos}5 -3.75) (size 3 3) (drill 3) (layers *.Cu *.Mask))

          ${'' /* net pads */}
          ${pad_1}
          (pad 2 smd rect (at ${def_pos}8.275 -3.75 ${p.rot}) (size 2.6 2.6) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask)  ${p.to.str})

          ${''/* hotswap outline - front */}
          (fp_line (start -2 -6.7) (end -2 -7.7) (layer "F.SilkS") (width 0.15) (tstamp 1da291cc-3aa5-4632-8f99-7dae246a7f56))
          (fp_line (start -7 -1.5) (end -7 -2) (layer "F.SilkS") (width 0.15) (tstamp 238b4f36-a253-431c-a93e-34af7da002ac))
          (fp_line (start -7 -6.2) (end -2.5 -6.2) (layer "F.SilkS") (width 0.15) (tstamp 4bee3b93-9a25-4a62-bc3b-7a216b6aba9d))
          (fp_line (start -2.5 -2.2) (end -2.5 -1.5) (layer "F.SilkS") (width 0.15) (tstamp 5193b92c-0f95-414f-9c12-4288fbf1289f))
          (fp_line (start -7 -5.6) (end -7 -6.2) (layer "F.SilkS") (width 0.15) (tstamp 7b669a9c-8885-4737-8192-e35d45fe2c93))
          (fp_line (start -1.5 -8.2) (end -2 -7.7) (layer "F.SilkS") (width 0.15) (tstamp 7e881b05-98b1-4290-99fa-d895271485f2))
          (fp_line (start -2.5 -1.5) (end -7 -1.5) (layer "F.SilkS") (width 0.15) (tstamp 8ef8ab63-d78b-49e0-89aa-d7de17fdbe74))
          (fp_line (start 2 -7.7) (end 1.5 -8.2) (layer "F.SilkS") (width 0.15) (tstamp 9b4b514c-b288-40ab-af4d-fb8827371f01))
          (fp_line (start 1.5 -3.7) (end -1 -3.7) (layer "F.SilkS") (width 0.15) (tstamp 9d6f01bf-507b-4b70-82a7-182a04da9e3f))
          (fp_line (start 1.5 -8.2) (end -1.5 -8.2) (layer "F.SilkS") (width 0.15) (tstamp c1815e63-5999-4d25-8dc0-c63ae372e426))
          (fp_line (start 2 -4.2) (end 1.5 -3.7) (layer "F.SilkS") (width 0.15) (tstamp d868ec48-42f4-4608-baef-8e135bf87a69))
          (fp_arc (start -0.91 -2.11) (end -0.8 -3.7) (angle -90) (layer F.SilkS) (width 0.15))
          (fp_arc (start -2.55 -6.75) (end -2.52 -6.2) (angle -90) (layer F.SilkS) (width 0.15))

          ${''/* hotswap outline - back */}
          (fp_line (start -1.5 -3.7) (end 1 -3.7) (layer "B.SilkS") (width 0.15) (tstamp 0ebc7e3d-c040-4c6e-aaf8-1870c68a4ff3))
          (fp_line (start 2 -6.7) (end 2 -7.7) (layer "B.SilkS") (width 0.15) (tstamp 119cd2ee-6025-406f-acfc-adcac3592135))
          (fp_line (start -2 -4.2) (end -1.5 -3.7) (layer "B.SilkS") (width 0.15) (tstamp 21f7e9f1-0a4c-49be-a4ca-8c8253ab27e6))
          (fp_line (start 1.5 -8.2) (end 2 -7.7) (layer "B.SilkS") (width 0.15) (tstamp 5d8b52e3-6cf3-4957-a7be-c8e9a1edb540))
          (fp_line (start -2 -7.7) (end -1.5 -8.2) (layer "B.SilkS") (width 0.15) (tstamp 6752af1f-7117-4db8-a4d6-67772bc5edb1))
          (fp_line (start -1.5 -8.2) (end 1.5 -8.2) (layer "B.SilkS") (width 0.15) (tstamp 6a9026f4-97ad-4ca6-b8a7-4b78e7eaa11b))
          (fp_line (start 2.5 -2.2) (end 2.5 -1.5) (layer "B.SilkS") (width 0.15) (tstamp 7982b0aa-ef8e-47f9-a2a9-295924d921de))
          (fp_line (start 2.5 -1.5) (end 7 -1.5) (layer "B.SilkS") (width 0.15) (tstamp 9ceea79f-ef80-4e41-a251-1e78376f0a53))
          (fp_line (start 7 -5.6) (end 7 -6.2) (layer "B.SilkS") (width 0.15) (tstamp a587fbd2-119d-431c-964c-d65c1fee09ba))
          (fp_line (start 7 -1.5) (end 7 -2) (layer "B.SilkS") (width 0.15) (tstamp aede887e-5713-4410-b301-8003185f738f))
          (fp_line (start 7 -6.2) (end 2.5 -6.2) (layer "B.SilkS") (width 0.15) (tstamp c0ed410a-0280-4a8c-8ff3-f58b7b1340fc))
          (fp_arc (start 0.97 -2.17) (end 2.5 -2.17) (angle -90) (layer B.SilkS) (width 0.15))
          (fp_arc (start 2.499999 -6.7) (end 2 -6.690001) (angle -88.9) (layer B.SilkS) (width 0.15))
        `;

        const tht = `
          ${''/* pins */}
          (pad 1 thru_hole circle (at ${def_pos}5 -3.8) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.from.str})
        `

        const hotswap_tht = `
          ${''/* pins - with inverse y direction */}
          (pad 1 thru_hole circle (at ${def_pos}5 3.8) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.from.str})
        `

        let final = '';
        if(p.hotswap) {
          final += hotswap;
          if(p.hotswap_tht) {
            final += hotswap_tht;
          }
        } else {
          final += tht;
        }

        return final;
      }
      if(p.reverse) {
        return `
          ${standard}
          ${p.keycaps ? keycap : ''}
          ${p.hotswap ? hotswap : tht}
          ${p.hotswap && p.hotswap_tht ? hotswap_tht : ''}
          ${pins('-', '', 'B')}
          ${pins('', '-', 'F')})
          `
      } else {
        return `
          ${standard}
          ${p.keycaps ? keycap : ''}
          ${pins('-', '', 'B')})
          `
      }
    }
  }
