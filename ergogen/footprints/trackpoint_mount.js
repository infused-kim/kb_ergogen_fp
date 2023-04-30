module.exports = {
  params: {
    designator: 'TP',
    side: 'B',
    reverse: false,
    show_outline_t430: false,
    show_outline_x240: false,
  },
  body: p => {
    const top = `
      (module trackpoint_mount_t430 (layer F.Cu) (tedit 6449FFC5)
        ${p.at /* parametric position */}
        (attr virtual)

        (fp_text reference "${p.ref}" (at 0 0) (layer ${p.side}.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
    `;

    const front = `
        (fp_circle (center 0 -9.5) (end -2.15 -9.5) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 -9.5) (end -1.9 -9.5) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 9.5) (end -2.15 9.5) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 9.5) (end -1.9 9.5) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 0) (end -3.95 0) (layer F.CrtYd) (width 0.05))
        (fp_circle (center 0 0) (end -3.7 0) (layer Cmts.User) (width 0.15))

        (fp_text user %R (at 0 0 180) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )
    `
    const back = `
        (fp_circle (center 0 0) (end -3.95 0) (layer B.CrtYd) (width 0.05))
        (fp_circle (center 0 0) (end -3.7 0) (layer Cmts.User) (width 0.15))
        (fp_circle (center 0 9.5) (end -2.15 9.5) (layer B.CrtYd) (width 0.05))
        (fp_circle (center 0 -9.5) (end -2.15 -9.5) (layer B.CrtYd) (width 0.05))
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
        (fp_line (start 7.5 6.5) (end 7.5 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start -6 11.5) (end -6 -11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6 -11.5) (end -6 -11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6 11.5) (end -6 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6 6.5) (end 6 11.5) (layer F.Fab) (width 0.2))
        (fp_line (start 13 6.5) (end 13 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 13 6.5) (end 7.5 6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 7.5 6.5) (end 6 6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 13 -6.5) (end 7.5 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 7.5 -6.5) (end 6 -6.5) (layer F.Fab) (width 0.2))
        (fp_line (start 6 -11.5) (end 6 -6.5) (layer F.Fab) (width 0.2))
    `

    const outline_x240_back = `
        (fp_line (start 13 6.5) (end 7.5 6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 7.5 6.5) (end 6 6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6 11.5) (end 6 6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 7.5 -6.5) (end 7.5 6.5) (layer B.Fab) (width 0.2))
        (fp_line (start -6 -11.5) (end -6 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6 11.5) (end -6 11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6 -11.5) (end -6 -11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 6 -6.5) (end 6 -11.5) (layer B.Fab) (width 0.2))
        (fp_line (start 13 -6.5) (end 13 6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 13 -6.5) (end 7.5 -6.5) (layer B.Fab) (width 0.2))
        (fp_line (start 7.5 -6.5) (end 6 -6.5) (layer B.Fab) (width 0.2))
    `


    const bottom = `
        (pad "" thru_hole circle (at 0 -9.5 180) (size 3.8 3.8) (drill 2.2) (layers *.Cu *.Mask))
        (pad "" thru_hole circle (at 0 9.5 180) (size 3.8 3.8) (drill 2.2) (layers *.Cu *.Mask))
        (pad 1 np_thru_hole circle (at 0 0 180) (size 3.7 3.7) (drill 3.7) (layers *.Cu *.Mask))
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
    }
    if(p.side == "B" || p.reverse) {
      final += back;
      if(p.show_outline_t430) {
        final += outline_t430_back;
      }
      if(p.show_outline_x240) {
        final += outline_x240_back;
      }
    }

    final += bottom;

    return final;
  }
}
