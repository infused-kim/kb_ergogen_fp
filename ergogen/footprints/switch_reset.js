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
    },
    body: p => {
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

      final += bottom;

      return final;
    }
 }
