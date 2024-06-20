// Author: @infused-kim
//
// Description:
// PCB footprint for for molex pico ezmate connector with 5 pins. Used to
// connect a trackpoint to the PCB on my keyboards.
//
// This connector was chosen over the more common JST connector, because it
// has a mated profile height of only 1.65 mm. This is lower than the Kailh
// Choc hotswap sockets.
//
// It should also be compatible with the JST ACH connector (which is almost the
// same).

module.exports = {
    params: {
      designator: 'CONN',
      side: 'F',
      reverse: false,
      pad_1: {type: 'net', value: 'CONN_1'},
      pad_2: {type: 'net', value: 'CONN_2'},
      pad_3: {type: 'net', value: 'CONN_3'},
      pad_4: {type: 'net', value: 'CONN_4'},
      pad_5: {type: 'net', value: 'CONN_5'},

      cable_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Molex_Ezmate_Pico_Cable_5pin.step',
      cable_3dmodel_side: '',
      cable_3dmodel_xyz_scale: '',
      cable_3dmodel_xyz_rotation: '',
      cable_3dmodel_xyz_offset: '',

      socket_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Molex_Ezmate_Pico_Socket_5pin.step',
      socket_3dmodel_side: '',
      socket_3dmodel_xyz_scale: '',
      socket_3dmodel_xyz_rotation: '',
      socket_3dmodel_xyz_offset: '',
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
      (module conn_molex_pico_ezmate_1x05 (layer F.Cu) (tedit 644602FB)
        ${p.at /* parametric position */}
        (attr smd)

      `;

      const front = `
        (fp_text reference "${p.ref}" (at 0 0.25 ${p.rot}) (layer F.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (fp_line (start -2.96 -2.09) (end -2.96 -2.3) (layer F.SilkS) (width 0.12))
        (fp_line (start 4.01 1.24) (end 4.01 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start 4.01 -2.09) (end 2.96 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.94 2.63) (end -2.44 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.44 2.63) (end -2.14 2.13) (layer F.SilkS) (width 0.12))
        (fp_line (start -2.14 2.13) (end 2.14 2.13) (layer F.SilkS) (width 0.12))
        (fp_line (start 2.14 2.13) (end 2.44 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start 2.44 2.63) (end 2.94 2.63) (layer F.SilkS) (width 0.12))
        (fp_line (start -3.9 2.52) (end -2.55 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start -2.55 2.52) (end -2.25 2.02) (layer F.Fab) (width 0.1))
        (fp_line (start -2.25 2.02) (end 2.25 2.02) (layer F.Fab) (width 0.1))
        (fp_line (start 2.25 2.02) (end 2.55 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start 2.55 2.52) (end 3.9 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start -3.9 -1.98) (end -3.9 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start 3.9 -1.98) (end 3.9 2.52) (layer F.Fab) (width 0.1))
        (fp_line (start -4.4 -2.8) (end -4.4 3.02) (layer F.CrtYd) (width 0.05))
        (fp_line (start -4.4 3.02) (end 4.4 3.02) (layer F.CrtYd) (width 0.05))
        (fp_line (start 4.4 3.02) (end 4.4 -2.8) (layer F.CrtYd) (width 0.05))
        (fp_line (start 4.4 -2.8) (end -4.4 -2.8) (layer F.CrtYd) (width 0.05))
        (fp_line (start -2.9 -1.98) (end -2.4 -1.272893) (layer F.Fab) (width 0.1))
        (fp_line (start -2.4 -1.272893) (end -1.9 -1.98) (layer F.Fab) (width 0.1))
        (fp_line (start -3.9 -1.98) (end 3.9 -1.98) (layer F.Fab) (width 0.1))
        (fp_line (start -4.01 1.24) (end -4.01 -2.09) (layer F.SilkS) (width 0.12))
        (fp_line (start -4.01 -2.09) (end -2.96 -2.09) (layer F.SilkS) (width 0.12))
        (fp_text user %R (at 0 0.27 ${p.rot}) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (pad 1 smd roundrect (at -2.4 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_1.str})
        (pad MP smd roundrect (at 3.55 1.9 ${p.rot}) (size 0.7 0.8) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25))
        (pad MP smd roundrect (at -3.55 1.9 ${p.rot}) (size 0.7 0.8) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25))
        (pad 2 smd roundrect (at -1.2 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_2.str})
        (pad 4 smd roundrect (at 1.2 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_4.str})
        (pad 5 smd roundrect (at 2.4 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_5.str})
        (pad 3 smd roundrect (at 0 -1.875 ${p.rot}) (size 0.6 0.85) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.pad_3.str})
      `
      const back = `
        (fp_text user %R (at 0 0.27 ${180 + p.rot}) (layer B.Fab)
          (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
        )
        (fp_line (start 2.94 2.63) (end 2.44 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.14 2.13) (end -2.44 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.44 2.63) (end -2.94 2.63) (layer B.SilkS) (width 0.12))
        (fp_line (start 3.9 2.52) (end 2.55 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 2.55 2.52) (end 2.25 2.02) (layer B.Fab) (width 0.1))
        (fp_line (start 2.25 2.02) (end -2.25 2.02) (layer B.Fab) (width 0.1))
        (fp_line (start -2.25 2.02) (end -2.55 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 2.44 2.63) (end 2.14 2.13) (layer B.SilkS) (width 0.12))
        (fp_line (start 2.14 2.13) (end -2.14 2.13) (layer B.SilkS) (width 0.12))
        (fp_line (start 2.96 -2.09) (end 2.96 -2.3) (layer B.SilkS) (width 0.12))
        (fp_line (start -4.01 -2.09) (end -2.96 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start -2.55 2.52) (end -3.9 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 3.9 -1.98) (end 3.9 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start -3.9 -1.98) (end -3.9 2.52) (layer B.Fab) (width 0.1))
        (fp_line (start 4.4 -2.8) (end 4.4 3.02) (layer B.CrtYd) (width 0.05))
        (fp_line (start 4.4 3.02) (end -4.4 3.02) (layer B.CrtYd) (width 0.05))
        (fp_line (start -4.4 3.02) (end -4.4 -2.8) (layer B.CrtYd) (width 0.05))
        (fp_line (start -4.4 -2.8) (end 4.4 -2.8) (layer B.CrtYd) (width 0.05))
        (fp_line (start 2.9 -1.98) (end 2.4 -1.272893) (layer B.Fab) (width 0.1))
        (fp_line (start 2.4 -1.272893) (end 1.9 -1.98) (layer B.Fab) (width 0.1))
        (fp_line (start 3.9 -1.98) (end -3.9 -1.98) (layer B.Fab) (width 0.1))
        (fp_line (start 4.01 1.24) (end 4.01 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start 4.01 -2.09) (end 2.96 -2.09) (layer B.SilkS) (width 0.12))
        (fp_line (start -4.01 1.24) (end -4.01 -2.09) (layer B.SilkS) (width 0.12))
        (pad 3 smd roundrect (at 0 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_3.str})
        (pad MP smd roundrect (at 3.55 1.9 ${180 + p.rot}) (size 0.7 0.8) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25))
        (pad 4 smd roundrect (at -1.2 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_4.str})
        (pad 5 smd roundrect (at -2.4 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_5.str})
        (pad 2 smd roundrect (at 1.2 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_2.str})
        (pad 1 smd roundrect (at 2.4 -1.875 ${180 + p.rot}) (size 0.6 0.85) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.pad_1.str})
        (pad MP smd roundrect (at -3.55 1.9 ${180 + p.rot}) (size 0.7 0.8) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25))
      `


        const all_3d_models = `
          ${ gen_3d_model(
                p.cable_3dmodel_filename,
                p.cable_3dmodel_xyz_scale,
                p.cable_3dmodel_xyz_rotation,
                p.cable_3dmodel_xyz_offset,
                p.cable_3dmodel_side,
                {
                  rotation_f: [0, 0, 0],
                  offset_f: [0, 0, 0.8],

                  rotation_b: [0, 180, 0],
                  offset_b: [0, 0, -(1.6 + 0.8)],
                },
            )
          }
          ${ gen_3d_model(
                p.socket_3dmodel_filename,
                p.socket_3dmodel_xyz_scale,
                p.socket_3dmodel_xyz_rotation,
                p.socket_3dmodel_xyz_offset,
                p.socket_3dmodel_side,
                {
                  rotation_f: [-90, 0, 0],
                  offset_f: [0, 0, 1.4],

                  rotation_b: [-90, 180, 0],
                  offset_b: [0, 0, -3],
                },
            )
          }
      `

      const bottom = `
      )
      `

      let final = top;

      if(p.side == "F" || p.reverse) {
        final += front;
      }
      if(p.side == "B" || p.reverse) {
        final += back;
      }

      final += all_3d_models;
      final += bottom;

      return final;
    }
}
