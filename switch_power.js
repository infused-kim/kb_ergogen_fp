// Author: @infused-kim
//
// Description:
// Power switch for wireless boards.
//
// Should be compatible with:
//  - G-Switch MK-12C02-G015
//  - Alps SSSS811101
//  - PCM12SMTR

module.exports = {
    params: {
      designator: 'SW',
      side: 'F',
      reverse: false,
      from: {type: 'net', value: 'BAT_P'},
      to: {type: 'net', value: 'RAW'},

      switch_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Switch_Power.step',
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

      const shared_1 = `
        (module power_switch (layer F.Cu) (tedit 644556E6)
          ${p.at /* parametric position */}
          (attr smd)

      `;

      const front_switch = `
          (fp_text reference "${p.ref}" (at -3.6 0 ${-90 + p.rot}) (layer F.SilkS) ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
          )

          (fp_line (start 0.415 -3.45) (end -0.375 -3.45) (layer F.SilkS) (width 0.12))
          (fp_line (start -0.375 3.45) (end 0.415 3.45) (layer F.SilkS) (width 0.12))
          (fp_line (start -1.425 1.6) (end -1.425 -0.1) (layer F.SilkS) (width 0.12))
          (fp_line (start 1.425 2.85) (end 1.425 -2.85) (layer F.SilkS) (width 0.12))
          (fp_line (start 1.795 4.4) (end -2.755 4.4) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.795 1.65) (end 1.795 4.4) (layer F.CrtYd) (width 0.05))
          (fp_line (start 3.095 1.65) (end 1.795 1.65) (layer F.CrtYd) (width 0.05))
          (fp_line (start 3.095 -1.65) (end 3.095 1.65) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.795 -1.65) (end 3.095 -1.65) (layer F.CrtYd) (width 0.05))
          (fp_line (start 1.795 -4.4) (end 1.795 -1.65) (layer F.CrtYd) (width 0.05))
          (fp_line (start -2.755 -4.4) (end 1.795 -4.4) (layer F.CrtYd) (width 0.05))
          (fp_line (start -2.755 4.4) (end -2.755 -4.4) (layer F.CrtYd) (width 0.05))
          (fp_line (start -1.425 -1.4) (end -1.425 -1.6) (layer F.SilkS) (width 0.12))
          (fp_line (start -1.305 -3.35) (end -1.305 3.35) (layer F.Fab) (width 0.1))
          (fp_line (start 1.295 -3.35) (end -1.305 -3.35) (layer F.Fab) (width 0.1))
          (fp_line (start 1.295 3.35) (end 1.295 -3.35) (layer F.Fab) (width 0.1))
          (fp_line (start -1.305 3.35) (end 1.295 3.35) (layer F.Fab) (width 0.1))
          (fp_line (start 2.595 0.1) (end 1.295 0.1) (layer F.Fab) (width 0.1))
          (fp_line (start 2.645 0.15) (end 2.595 0.1) (layer F.Fab) (width 0.1))
          (fp_line (start 2.845 0.35) (end 2.645 0.15) (layer F.Fab) (width 0.1))
          (fp_line (start 2.845 1.2) (end 2.845 0.35) (layer F.Fab) (width 0.1))
          (fp_line (start 2.645 1.4) (end 2.845 1.2) (layer F.Fab) (width 0.1))
          (fp_line (start 1.345 1.4) (end 2.645 1.4) (layer F.Fab) (width 0.1))

          (pad "" smd rect (at 1.125 -3.65 ${90 + p.rot}) (size 1 0.8) (layers F.Cu F.Paste F.Mask))
          (pad "" smd rect (at -1.085 -3.65 ${90 + p.rot}) (size 1 0.8) (layers F.Cu F.Paste F.Mask))
          (pad "" smd rect (at -1.085 3.65 ${90 + p.rot}) (size 1 0.8) (layers F.Cu F.Paste F.Mask))
          (pad 1 smd rect (at -1.735 2.25 ${90 + p.rot}) (size 0.7 1.5) (layers F.Cu F.Paste F.Mask))
          (pad 2 smd rect (at -1.735 -0.75 ${90 + p.rot}) (size 0.7 1.5) (layers F.Cu F.Paste F.Mask) ${p.from.str})
          (pad 3 smd rect (at -1.735 -2.25 ${90 + p.rot}) (size 0.7 1.5) (layers F.Cu F.Paste F.Mask) ${p.to.str})
          (pad "" smd rect (at 1.125 3.65 ${90 + p.rot}) (size 1 0.8) (layers F.Cu F.Paste F.Mask))

      `
      const back_switch = `
        ${'' /* Add the optional parts here */}
        (fp_text user "${p.ref}" (at -3.5 0 ${90 + p.rot}) (layer B.SilkS) ${p.ref_hide}
        (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
        )
        (fp_line (start 2.595 -0.1) (end 1.295 -0.1) (layer B.Fab) (width 0.1))
        (fp_line (start -1.305 3.35) (end -1.305 -3.35) (layer B.Fab) (width 0.1))
        (fp_line (start 2.645 -0.15) (end 2.595 -0.1) (layer B.Fab) (width 0.1))
        (fp_line (start -1.425 1.4) (end -1.425 1.6) (layer B.SilkS) (width 0.12))
        (fp_line (start 0.415 3.45) (end -0.375 3.45) (layer B.SilkS) (width 0.12))
        (fp_line (start -0.375 -3.45) (end 0.415 -3.45) (layer B.SilkS) (width 0.12))
        (fp_line (start -1.425 -1.6) (end -1.425 0.1) (layer B.SilkS) (width 0.12))
        (fp_line (start 1.425 -2.85) (end 1.425 2.85) (layer B.SilkS) (width 0.12))
        (fp_line (start 1.795 4.4) (end 1.795 1.65) (layer B.CrtYd) (width 0.05))
        (fp_line (start -2.755 4.4) (end 1.795 4.4) (layer B.CrtYd) (width 0.05))
        (fp_line (start 2.845 -1.2) (end 2.845 -0.35) (layer B.Fab) (width 0.1))
        (fp_line (start 1.345 -1.4) (end 2.645 -1.4) (layer B.Fab) (width 0.1))
        (fp_line (start 1.795 -4.4) (end -2.755 -4.4) (layer B.CrtYd) (width 0.05))
        (fp_line (start 1.795 -1.65) (end 1.795 -4.4) (layer B.CrtYd) (width 0.05))
        (fp_line (start 3.095 -1.65) (end 1.795 -1.65) (layer B.CrtYd) (width 0.05))
        (fp_line (start 2.845 -0.35) (end 2.645 -0.15) (layer B.Fab) (width 0.1))
        (fp_line (start 2.645 -1.4) (end 2.845 -1.2) (layer B.Fab) (width 0.1))
        (fp_line (start 1.295 -3.35) (end 1.295 3.35) (layer B.Fab) (width 0.1))
        (fp_line (start 1.295 3.35) (end -1.305 3.35) (layer B.Fab) (width 0.1))
        (fp_line (start -1.305 -3.35) (end 1.295 -3.35) (layer B.Fab) (width 0.1))
        (fp_line (start -2.755 -4.4) (end -2.755 4.4) (layer B.CrtYd) (width 0.05))
        (fp_line (start 3.095 1.65) (end 3.095 -1.65) (layer B.CrtYd) (width 0.05))
        (fp_line (start 1.795 1.65) (end 3.095 1.65) (layer B.CrtYd) (width 0.05))
        (pad "" smd rect (at -1.085 -3.65 ${270 + p.rot}) (size 1 0.8) (layers B.Cu B.Paste B.Mask))
        (pad "" smd rect (at 1.125 -3.65 ${270 + p.rot}) (size 1 0.8) (layers B.Cu B.Paste B.Mask))
        (pad 4 smd rect (at -1.735 2.25 ${270 + p.rot}) (size 0.7 1.5) (layers B.Cu B.Paste B.Mask))
        (pad "" smd rect (at -1.085 3.65 ${270 + p.rot}) (size 1 0.8) (layers B.Cu B.Paste B.Mask))
        (pad 5 smd rect (at -1.735 0.75 ${270 + p.rot}) (size 0.7 1.5) (layers B.Cu B.Paste B.Mask) ${p.from.str})
        (pad 6 smd rect (at -1.735 -2.25 ${270 + p.rot}) (size 0.7 1.5) (layers B.Cu B.Paste B.Mask) ${p.to.str})
        (pad "" smd rect (at 1.125 3.65 ${270 + p.rot}) (size 1 0.8) (layers B.Cu B.Paste B.Mask))
        `

        const shared_2 = `
          (pad "" np_thru_hole circle (at 0.025 -1.5 ${90 + p.rot}) (size 0.9 0.9) (drill 0.9) (layers *.Cu *.Mask))
          (pad "" np_thru_hole circle (at 0.025 1.5 ${90 + p.rot}) (size 0.9 0.9) (drill 0.9) (layers *.Cu *.Mask))
        `

        let final = shared_1;

        if(p.side == "F" || p.reverse) {
          final += front_switch;
        }
        if(p.side == "B" || p.reverse) {
          final += back_switch;
        }


        final += shared_2;

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

        final += `
          )
        `

        return final;
    }
  }