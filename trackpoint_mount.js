// Author: @infused-kim
//
// Description:
// Adds mounting holes for a trackpoint to the PCB.
//
// Should be compatible with:
//  - Thinkpad T430
//  - Thinkpad T440 / X240
//
// Check this page for other models:
// https://deskthority.net/wiki/TrackPoint_Hardware

module.exports = {
  params: {
    designator: 'TP',
    side: 'B',
    reverse: false,

    // T430: 3.5
    // T460S (red one): 3.5
    // X240: 5.5
    drill: 5.5,
    outline: 0.25,

    show_outline_t430: false,
    show_outline_x240: false,
    show_outline_t460s: false,
    show_board: false,

      // This side parameter applies to all 3d models
      tp_3dmodel_side: '',

      tp_cap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Cap_Red_T460S.step',
      tp_cap_3dmodel_xyz_scale: '',
      tp_cap_3dmodel_xyz_rotation: '',
      tp_cap_3dmodel_xyz_offset: '',

      tp_extension_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Extension_Red_T460S_h10.5_md0.0_pcb1.6.step',
      tp_extension_3dmodel_xyz_scale: '',
      tp_extension_3dmodel_xyz_rotation: '',
      tp_extension_3dmodel_xyz_offset: '',

      tp_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Red_T460S_platform_z_offset_+0.0_pcb_offset_-2.0.step',
      tp_3dmodel_xyz_scale: '',
      tp_3dmodel_xyz_rotation: '',
      tp_3dmodel_xyz_offset: '',
  },
  body: p => {

    const gen_3d_model = (filename, scale, rotation, offset, side, {
      default_side =  'F',
      scale_f =       [1, 1, 1],
      rotation_f =    [0, 0, 0],
      offset_f =      [0, 0, 0],
      scale_b =       [1, 1, 1],
      rotation_b =    [0, 0, 0],
      offset_b =      [0, 0, 0]
    } = {}) => {

      if(filename == '') {
        return '';
      }

      const get_3d_model_side = (side, default_side) => {

          if(side == '') {
              if(p.reverse == true) {
                  side = default_side;
              } else {
                  side = p.side;
              }
          }

          if(side == 'F' || side == 'B') {
              return side;
          } else {
              return default_side;
          }
      }

      const final_side = get_3d_model_side(side, default_side, p);
      const is_front = final_side === 'F';

      // Determine the actual values to use
      const final_scale = scale || (is_front ? scale_f : scale_b);
      const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
      let final_offset = offset || (is_front ? offset_f : offset_b);

      // Fix bug that seems to happen during the upgrade from KiCad 5 to
      // 8. All offset values seem to be multiplied by 25.4. So here we
      // divide them so that the upgrade KiCad file ends up with the
      // correct value.
      const offset_divisor = 25.4;
      final_offset = final_offset.map(value => value / offset_divisor);

      return  `
        (model ${filename}
          (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
          (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
          (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
        )
      `;
    };

    const top = `
      (module trackpoint_mount_t430 (layer F.Cu) (tedit 6449FFC5)
        ${p.at /* parametric position */}
        (attr virtual)

        (fp_text reference "${p.ref}" (at 0 0) (layer ${p.side}.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
    `;

    const front = `
        (fp_circle (center 0 -9.75) (end -2.15 -9.75) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 -9.75) (end -1.9 -9.75) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 9.75) (end -2.15 9.75) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 9.75) (end -1.9 9.75) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 0) (end -3.95 0) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 0) (end -3.7 0) (layer Cmts.User) (width 0.15))

        (fp_text user %R (at 0 0 180) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )
    `
    const back = `
        (fp_circle (center 0 0) (end -3.95 0) (layer B.CrtYd) (width 0.05))
        (fp_circle (center 0 0) (end -3.7 0) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 9.75) (end -2.15 9.75) (layer B.CrtYd) (width 0.05))
        (fp_circle (center 0 -9.75) (end -2.15 -9.75) (layer B.CrtYd) (width 0.05))
    `

    const outline_t430_front = `
        (fp_line (start -4.5 -12.75) (end -9.5 -7.25) (layer F.Fab) (width 0.2))
        (fp_line (start -9.5 7.25) (end -4.5 12.75) (layer F.Fab) (width 0.2))
        (fp_line (start 6.5 8) (end 6.5 -8) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 -8) (end 9.5 -12.75) (layer F.Fab) (width 0.2))
        (fp_line (start -9.5 7.25) (end -9.5 -7.25) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 -12.75) (end -4.5 -12.75) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 12.75) (end -4.5 12.75) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 -8) (end 6.5 -8) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 8) (end 9.5 12.75) (layer F.Fab) (width 0.2))
        (fp_line (start 9.5 8) (end 6.5 8) (layer F.Fab) (width 0.2))
        (fp_line (start 8.5 5.5) (end 8.5 -5.5) (layer F.Fab) (width 0.2))
        (fp_line (start 8.5 -5.5) (end 6.5 -5.5) (layer F.Fab) (width 0.2))
        (fp_line (start 8.5 5.5) (end 6.5 5.5) (layer F.Fab) (width 0.2))
    `

    const outline_t430_back = `
        (fp_line (start -4.5 12.75) (end -9.5 7.25) (layer B.Fab) (width 0.2))
        (fp_line (start 9.5 -8) (end 9.5 -12.75) (layer B.Fab) (width 0.12))
        (fp_line (start 9.5 8) (end 9.5 12.75) (layer B.Fab) (width 0.2))
        (fp_line (start 6.5 -8) (end 6.5 8) (layer B.Fab) (width 0.2))
        (fp_line (start 9.5 -12.75) (end -4.5 -12.75) (layer B.Fab) (width 0.2))
        (fp_line (start -9.5 -7.25) (end -4.5 -12.75) (layer B.Fab) (width 0.2))
        (fp_line (start 9.5 -8) (end 6.5 -8) (layer B.Fab) (width 0.12))
        (fp_line (start 9.5 8) (end 6.5 8) (layer B.Fab) (width 0.2))
        (fp_line (start -9.5 -7.25) (end -9.5 7.25) (layer B.Fab) (width 0.2))
        (fp_line (start 9.5 12.75) (end -4.5 12.75) (layer B.Fab) (width 0.2))
        (fp_line (start 8.5 -5.5) (end 8.5 5.5) (layer B.Fab) (width 0.2))
        (fp_line (start 8.5 -5.5) (end 6.5 -5.5) (layer B.Fab) (width 0.2))
        (fp_line (start 8.5 5.5) (end 6.5 5.5) (layer B.Fab) (width 0.2))
    `

    const outline_x240_front = `
        (fp_line (start 12.25 -6.5) (end 6.75 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 12.25 6.5) (end 6.75 6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 12.25 6.5) (end 12.25 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6.75 11.5) (end -6.75 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6.75 -11.5) (end -6.75 -11.5) (layer F.Fab) (width 0.2))
        (fp_line (start -6.75 11.5) (end -6.75 -11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6.75 11.5) (end 6.75 -11.5) (layer F.Fab) (width 0.2))
    `

    const outline_x240_back = `
        (fp_line (start 12.25 -6.5) (end 6.75 -6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 12.25 -6.5) (end 12.25 6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6.75 -11.5) (end -6.75 -11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6.75 11.5) (end -6.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start -6.75 -11.5) (end -6.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6.75 -11.5) (end 6.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 12.25 6.5) (end 6.75 6.5) (layer B.Fab) (width 0.2))
    `

    const outline_x240_board = `
        (fp_line (start 39.25 12) (end 23.25 12) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 5.5) (end 23.25 12) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 -5.5) (end 23.25 5.5) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 5.5) (end 12.25 5.5) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 -5.5) (end 12.25 -5.5) (layer Dwgs.User) (width 0.2))
        (fp_line (start 39.25 -22) (end 39.25 12) (layer Dwgs.User) (width 0.2))
        (fp_line (start 39.25 -22) (end 23.25 -22) (layer Dwgs.User) (width 0.2))
        (fp_line (start 23.25 -22) (end 23.25 -5.5) (layer Dwgs.User) (width 0.2))
        (fp_line (start 12.25 -5.5) (end 12.25 5.5) (layer Dwgs.User) (width 0.2))
    `

    const outline_t460s_front = `
        (fp_line (start 2.75 6.5) (end 6.25 3) (layer F.Fab) (width 0.2))
        (fp_line (start 2.75 11.5) (end -2.75 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start -6.25 3) (end -6.25 -3) (layer F.Fab) (width 0.2))
        (fp_line (start 6.25 3) (end 6.25 -3) (layer F.Fab) (width 0.2))
        (fp_line (start 2.75 -11.5) (end -2.75 -11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 2.75 6.5) (end 2.75 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start -2.75 6.5) (end -2.75 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start -2.75 -11.5) (end -2.75 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 2.75 -11.5) (end 2.75 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start -2.75 6.5) (end -6.25 3) (layer F.Fab) (width 0.2))
        (fp_line (start 6.25 -3) (end 2.75 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start -6.25 -3) (end -2.75 -6.5) (layer F.Fab) (width 0.2))
    `

    const outline_t460s_back = `
        (fp_line (start -6.25 -3) (end -2.75 -6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6.25 -3) (end 2.75 -6.5) (layer B.Fab) (width 0.2))

        (fp_line (start 2.75 6.5) (end 6.25 3) (layer B.Fab) (width 0.2))
        (fp_line (start -2.75 6.5) (end -6.25 3) (layer B.Fab) (width 0.2))

        (fp_line (start 6.25 3) (end 6.25 -3) (layer B.Fab) (width 0.2))
        (fp_line (start 2.75 11.5) (end -2.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start -6.25 3) (end -6.25 -3) (layer B.Fab) (width 0.2))
        (fp_line (start 2.75 -11.5) (end -2.75 -11.5) (layer B.Fab) (width 0.2))
        (fp_line (start -2.75 6.5) (end -2.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 2.75 6.5) (end 2.75 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start -2.75 -11.5) (end -2.75 -6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 2.75 -11.5) (end 2.75 -6.5) (layer B.Fab) (width 0.2))
    `

    const outline_t460s_board = `
        (fp_line (start 38.25 12.25) (end 22.25 12.25) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 2.75) (end 22.25 12.25) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 -2.75) (end 22.25 2.75) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 2.75) (end 6.25 2.75) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 -2.75) (end 6.25 -2.75) (layer Dwgs.User) (width 0.2))
        (fp_line (start 38.25 -22.25) (end 38.25 12.25) (layer Dwgs.User) (width 0.2))
        (fp_line (start 38.25 -22.25) (end 22.25 -22.25) (layer Dwgs.User) (width 0.2))
        (fp_line (start 22.25 -22.25) (end 22.25 -2.75) (layer Dwgs.User) (width 0.2))
        (fp_line (start 6.25 -2.75) (end 6.25 2.75) (layer Dwgs.User) (width 0.2))
    `

    const size = p.drill + (p.outline * 2)
    const bottom = `
        (pad "" thru_hole circle (at 0 -9.75 180) (size 3.8 3.8) (drill 2.2) (layers *.Cu *.Mask))
        (pad 1 np_thru_hole circle (at 0 0 180) (size ${size} ${size}) (drill ${p.drill}) (layers *.Cu *.Mask))
        (pad "" thru_hole circle (at 0 9.75 180) (size 3.8 3.8) (drill 2.2) (layers *.Cu *.Mask))
      )
    `

    let final = top;

    if(p.side == "F" || p.reverse) {
      final += front;

      if(p.show_outline_t430) {
        final += outline_t430_front;
      }
      if(p.show_outline_x240) {
        final += outline_x240_front;
      }
      if(p.show_outline_t460s) {
        final += outline_t460s_front;
      }
    }

    if(p.side == "B" || p.reverse) {
      final += back;
      if(p.show_outline_t430) {
        final += outline_t430_back;
      }
      if(p.show_outline_x240) {
        final += outline_x240_back;
      }
      if(p.show_outline_t460s) {
        final += outline_t460s_back;
      }
    }

    if(p.show_board) {
      if(p.show_outline_x240) {
        final += outline_x240_board
      }
      if(p.show_outline_t460s) {
        final += outline_t460s_board
      }
    }

    final += `
      ${ gen_3d_model(
              p.tp_cap_3dmodel_filename,
              p.tp_cap_3dmodel_xyz_scale,
              p.tp_cap_3dmodel_xyz_rotation,
              p.tp_cap_3dmodel_xyz_offset,
              p.tp_3dmodel_side,
              {
                rotation_f: [0, 0, 0],
                offset_f: [0, 0, 10.5],

                rotation_b: [0, 180, 0],
                offset_b: [0, 0, -(10.5+1.6)],
              },
          )
        }

      ${ gen_3d_model(
              p.tp_extension_3dmodel_filename,
              p.tp_extension_3dmodel_xyz_scale,
              p.tp_extension_3dmodel_xyz_rotation,
              p.tp_extension_3dmodel_xyz_offset,
              p.tp_3dmodel_side,
              {
                rotation_f: [0, 0, 0],
                offset_f: [0, 0, 0],

                rotation_b: [0, 180, 0],
                offset_b: [0, 0, -1.6],
              },
          )
        }

      ${ gen_3d_model(
              p.tp_3dmodel_filename,
              p.tp_3dmodel_xyz_scale,
              p.tp_3dmodel_xyz_rotation,
              p.tp_3dmodel_xyz_offset,
              p.tp_3dmodel_side,
              {
                rotation_f: [0, 0, 180],
                offset_f: [0, 0, 0],

                rotation_b: [0, 0, 0],
                offset_b: [0, 0, 0],
              },
          )
        }
    `;

    final += bottom;

    return final;
  }
}
