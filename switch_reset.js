// Author: @infused-kim
//
// Description:
// Reversible footprint for nice nano

// Should be compatible with:
// EVQ-P7A01P
//
// WARNING: This is not the same reset switch commonly used in the keyboard
// community. This switch faces sideways and is lower profile.

module.exports = {
    params: {
      designator: 'SW',
      side: 'F',
      reverse: false,
      from: {type: 'net', value: 'GND'},
      to: {type: 'net', value: 'RST'},

      switch_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Switch_Reset.step',
      switch_3dmodel_side: '',
      switch_3dmodel_xyz_scale: '',
      switch_3dmodel_xyz_rotation: '',
      switch_3dmodel_xyz_offset: '',
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
        (module sw_reset_side (layer F.Cu) (tedit 64473C6F)
          ${p.at /* parametric position */}
          (attr smd)

          (fp_text reference "${p.ref}" (at 0 3.5 ${p.rot}) (layer ${p.side}.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )
      `
      const front = `
          (fp_line (start 1.7 2.75) (end -1.7 2.75) (layer F.CrtYd) (width 0.05))
          (fp_line (start -1.7 2.75) (end -1.7 -2.75) (layer F.CrtYd) (width 0.05))
          (fp_line (start 2.1 0.85) (end 2.1 -0.85) (layer F.Fab) (width 0.1))
          (fp_line (start 1.7 -1.1) (end 2.35 -1.1) (layer F.CrtYd) (width 0.05))
          (fp_line (start -1.7 -2.75) (end 1.7 -2.75) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.45 -1.75) (end 1.45 1.75) (layer F.Fab) (width 0.1))
          (fp_line (start 1.7 1.1) (end 1.7 2.75) (layer F.CrtYd) (width 0.05))
          (fp_line (start 2.35 1.1) (end 1.7 1.1) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.7 -2.75) (end 1.7 -1.1) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.55 -1.75) (end 1.55 1.75) (layer F.SilkS) (width 0.12))
          (fp_line (start 2.1 -0.85) (end 1.45 -0.85) (layer F.Fab) (width 0.1))
          (fp_line (start 2.35 -1.1) (end 2.35 1.1) (layer F.CrtYd) (width 0.05))
          (fp_line (start 2.1 0.85) (end 1.45 0.85) (layer F.Fab) (width 0.1))
          (fp_line (start -1.55 1.75) (end -1.55 -1.75) (layer F.SilkS) (width 0.12))
          (fp_line (start 1.45 1.75) (end -1.4 1.75) (layer F.Fab) (width 0.1))
          (fp_line (start -1.45 1.75) (end -1.45 -1.75) (layer F.Fab) (width 0.1))
          (fp_line (start -1.45 -1.75) (end 1.45 -1.75) (layer F.Fab) (width 0.1))

          (pad 1 smd rect (at -0.72 -1.8 ${90 + p.rot}) (size 1.4 1.05) (layers F.Cu F.Paste F.Mask) ${p.from.str})

          (pad 1 smd rect (at -0.72 1.8 ${90 + p.rot}) (size 1.4 1.05) (layers F.Cu F.Paste F.Mask) ${p.from.str})
          (pad 2 smd rect (at 0.72 -1.8 ${90 + p.rot}) (size 1.4 1.05) (layers F.Cu F.Paste F.Mask) ${p.to.str})
          (pad 2 smd rect (at 0.72 1.8 ${90 + p.rot}) (size 1.4 1.05) (layers F.Cu F.Paste F.Mask) ${p.to.str})
      `
      const back = `
      (fp_line (start -1.45 1.75) (end 1.45 1.75) (layer B.Fab) (width 0.1))
      (fp_line (start 1.45 1.75) (end 1.45 -1.75) (layer B.Fab) (width 0.1))
      (fp_line (start 1.7 -1.1) (end 1.7 -2.75) (layer B.CrtYd) (width 0.05))
      (fp_line (start 2.35 -1.1) (end 1.7 -1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start 1.7 2.75) (end 1.7 1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start 1.55 1.75) (end 1.55 -1.75) (layer B.SilkS) (width 0.12))
      (fp_line (start 2.1 0.85) (end 1.45 0.85) (layer B.Fab) (width 0.1))
      (fp_line (start 2.35 1.1) (end 2.35 -1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start 2.1 -0.85) (end 1.45 -0.85) (layer B.Fab) (width 0.1))
      (fp_line (start -1.55 -1.75) (end -1.55 1.75) (layer B.SilkS) (width 0.12))
      (fp_line (start 1.45 -1.75) (end -1.4 -1.75) (layer B.Fab) (width 0.1))
      (fp_line (start -1.45 -1.75) (end -1.45 1.75) (layer B.Fab) (width 0.1))
      (fp_line (start 1.7 -2.75) (end -1.7 -2.75) (layer B.CrtYd) (width 0.05))
      (fp_line (start -1.7 -2.75) (end -1.7 2.75) (layer B.CrtYd) (width 0.05))
      (fp_line (start 2.1 -0.85) (end 2.1 0.85) (layer B.Fab) (width 0.1))
      (fp_line (start 1.7 1.1) (end 2.35 1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start -1.7 2.75) (end 1.7 2.75) (layer B.CrtYd) (width 0.05))
      (pad 1 smd rect (at -0.72 -1.8 ${270 + p.rot}) (size 1.4 1.05) (layers B.Cu B.Paste B.Mask) ${p.from.str})
      (pad 2 smd rect (at 0.72 1.8 ${270 + p.rot}) (size 1.4 1.05) (layers B.Cu B.Paste B.Mask) ${p.to.str})
      (pad 2 smd rect (at 0.72 -1.8 ${270 + p.rot}) (size 1.4 1.05) (layers B.Cu B.Paste B.Mask) ${p.to.str})
      (pad 1 smd rect (at -0.72 1.8 ${270 + p.rot}) (size 1.4 1.05) (layers B.Cu B.Paste B.Mask) ${p.from.str})
      (fp_text user ${p.ref} (at 0 3.5 ${p.rot}) (layer B.SilkS) ${p.ref_hide}
        (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      )
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

      final += gen_3d_model(
        p.switch_3dmodel_filename,
        p.switch_3dmodel_xyz_scale,
        p.switch_3dmodel_xyz_rotation,
        p.switch_3dmodel_xyz_offset,
        p.switch_3dmodel_side,
        {
          default_side: 'B',

          rotation_f: [-90, 0, -90],
          offset_f: [0, 0, 0],

          rotation_b: [90, 0, 90],
          offset_b: [0, 0, -1.6],
        },
      );

      final += bottom;

      return final;
    }
 }
