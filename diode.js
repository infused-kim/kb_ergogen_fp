// Author: Ergogen + @infused-kim improvements
//
// @infused-kim's improvements:
//  - Added option to hide thru-holes
//  - Added virtual attribute to silence DRC error

module.exports = {
    params: {
        designator: 'D',
        include_tht: true,
        from: undefined,
        to: undefined,

        diode_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Diode_1N4148W.step',
        diode_3dmodel_side: '',
        diode_3dmodel_xyz_scale: '',
        diode_3dmodel_xyz_rotation: '',
        diode_3dmodel_xyz_offset: '',
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

        const tht = `
        (pad 1 thru_hole rect (at -3.81 0 ${p.rot}) (size 1.778 1.778) (drill 0.9906) (layers *.Cu *.Mask) ${p.to.str})
        (pad 2 thru_hole circle (at 3.81 0 ${p.rot}) (size 1.905 1.905) (drill 0.9906) (layers *.Cu *.Mask) ${p.from.str})
        `;

        const footprint = `
    (module ComboDiode (layer F.Cu) (tedit 5B24D78E)
        ${p.at /* parametric position */}
        (attr virtual)

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        ${''/* diode symbols */}
        (fp_line (start 0.25 0) (end 0.75 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer F.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer F.SilkS) (width 0.1))
        (fp_line (start 0.25 0) (end 0.75 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 0.4) (end -0.35 0) (layer B.SilkS) (width 0.1))
        (fp_line (start 0.25 -0.4) (end 0.25 0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end 0.25 -0.4) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.35 0) (end -0.35 -0.55) (layer B.SilkS) (width 0.1))
        (fp_line (start -0.75 0) (end -0.35 0) (layer B.SilkS) (width 0.1))

        ${''/* SMD pads on both sides */}
        (pad 1 smd rect (at -1.65 0 ${p.rot}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.to.str})
        (pad 2 smd rect (at 1.65 0 ${p.rot}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.from.str})
        (pad 1 smd rect (at -1.65 0 ${p.rot}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) ${p.to.str})
        (pad 2 smd rect (at 1.65 0 ${p.rot}) (size 0.9 1.2) (layers F.Cu F.Paste F.Mask) ${p.from.str})

        ${''/* THT terminals */}
        ${ p.include_tht ? tht : '' }
        ${ gen_3d_model(
            p.diode_3dmodel_filename,
            p.diode_3dmodel_xyz_scale,
            p.diode_3dmodel_xyz_rotation,
            p.diode_3dmodel_xyz_offset,
            p.diode_3dmodel_side,
            {
              default_side: 'B',

              rotation_f: [-90, 0, 0],
              offset_f: [0, 0, 0.7],

              rotation_b: [-90, 180, 180],
              offset_b: [0, 0, -2.3],
            },
        )}
    )
    `

    return footprint;
    }
}
