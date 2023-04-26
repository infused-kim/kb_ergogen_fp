module.exports = {
  params: {
    designator: 'DISP',
    side: 'F',
    reverse: false,
    MOSI: {type: 'net', value: 'MOSI'},
    SCK: {type: 'net', value: 'SCK'},
    VCC: {type: 'net', value: 'VCC'},
    GND: {type: 'net', value: 'GND'},
    CS: {type: 'net', value: 'CS'},
    show_labels: {type: 'boolean', value: true},
  },
  body: p => {

    let pad_1 = p.MOSI.str;
    let pad_2 = p.SCK.str;
    let pad_4 = p.GND.str;
    let pad_5 = p.CS.str;
    if(p.reverse) {
      pad_1 = p.local_net("1").str;
      pad_2 = p.local_net("2").str;
      pad_4 = p.local_net("4").str;
      pad_5 = p.local_net("5").str;
    } else if(p.side == 'B') {
      pad_1 = p.CS.str;
      pad_2 = p.GND.str;
      pad_4 = p.SCK.str;
      pad_5 = p.MOSI.str;
    }

    const top = `
      (module nice!view (layer F.Cu) (tedit 6448AF5B)
        ${p.at /* parametric position */}
        (fp_text reference "${p.ref}" (at 0 20 ${p.rot}) (layer ${p.side}.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
        `
    const front = `
        (fp_line (start -6.5 -18) (end 6.5 -18) (layer F.Fab) (width 0.15))
        (fp_line (start 6.5 18) (end -6.5 18) (layer F.Fab) (width 0.15))
        (fp_line (start -7 17.5) (end -7 -17.5) (layer F.Fab) (width 0.15))
        (fp_line (start 7 17.5) (end 7 -17.5) (layer F.Fab) (width 0.15))
        (fp_line (start -6.41 15.37) (end -6.41 18.03) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.41 18.03) (end -6.41 18.03) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.88 14.9) (end 6.88 18.45) (layer F.CrtYd) (width 0.15))
        (fp_line (start 6.88 18.45) (end -6.82 18.45) (layer F.CrtYd) (width 0.15))
        (fp_line (start -6.82 18.45) (end -6.82 14.9) (layer F.CrtYd) (width 0.15))
        (fp_line (start -6.82 14.9) (end 6.88 14.9) (layer F.CrtYd) (width 0.15))
        (fp_line (start 6.41 15.37) (end 6.41 18.03) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.41 15.37) (end -6.41 15.37) (layer F.SilkS) (width 0.12))
        (fp_arc (start -6.5 17.5) (end -7 17.5) (angle -90) (layer F.Fab) (width 0.15))
        (fp_arc (start 6.5 17.5) (end 6.5 18) (angle -90) (layer F.Fab) (width 0.15))
        (fp_arc (start 6.5 -17.5) (end 6.5 -18) (angle 90) (layer F.Fab) (width 0.15))
        (fp_arc (start -6.5 -17.5) (end -6.5 -18) (angle -90) (layer F.Fab) (width 0.15))
        (fp_text user %R (at 0 20 ${p.rot}) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )

    `

    const front_jumpers = `
        (fp_line (start 5.93 12.9) (end 5.93 14.9) (layer F.Fab) (width 0.15))
        (fp_line (start -5.93 14.9) (end -5.93 12.9) (layer F.Fab) (width 0.15))
        (fp_line (start -5.93 12.9) (end -4.23 12.9) (layer F.Fab) (width 0.15))
        (fp_line (start -4.23 14.9) (end -5.93 14.9) (layer F.Fab) (width 0.15))
        (fp_line (start -4.23 12.9) (end -4.23 14.9) (layer F.Fab) (width 0.15))
        (fp_line (start -3.39 14.9) (end -3.39 12.9) (layer F.Fab) (width 0.15))
        (fp_line (start -3.39 12.9) (end -1.69 12.9) (layer F.Fab) (width 0.15))
        (fp_line (start -1.69 14.9) (end -3.39 14.9) (layer F.Fab) (width 0.15))
        (fp_line (start -1.69 12.9) (end -1.69 14.9) (layer F.Fab) (width 0.15))
        (fp_line (start 3.39 12.9) (end 3.39 14.9) (layer F.Fab) (width 0.15))
        (fp_line (start 3.39 14.9) (end 1.69 14.9) (layer F.Fab) (width 0.15))
        (fp_line (start 1.69 14.9) (end 1.69 12.9) (layer F.Fab) (width 0.15))
        (fp_line (start 1.69 12.9) (end 3.39 12.9) (layer F.Fab) (width 0.15))
        (fp_line (start 5.93 14.9) (end 4.23 14.9) (layer F.Fab) (width 0.15))
        (fp_line (start 4.23 14.9) (end 4.23 12.9) (layer F.Fab) (width 0.15))
        (fp_line (start 4.23 12.9) (end 5.93 12.9) (layer F.Fab) (width 0.15))
        (pad 10 smd rect (at -5.08 14.35 ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ pad_1 })
        (pad 14 smd rect (at -5.08 13.45 ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${p.MOSI.str})
        (pad 11 smd rect (at -2.54 14.35 ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ pad_2 })
        (pad 15 smd rect (at -2.54 13.45 ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${p.SCK.str})
        (pad 12 smd rect (at 2.54 14.35 ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ pad_4 })
        (pad 16 smd rect (at 2.54 13.45 ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${p.GND.str})
        (pad 13 smd rect (at 5.08 14.35 ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${ pad_5 })
        (pad 17 smd rect (at 5.08 13.45 ${90 + p.rot}) (size 0.6 1.2) (layers F.Cu F.Mask) ${p.CS.str})
    `

    const back = `
        (fp_line (start 6.41 15.37) (end 6.41 18.03) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.41 15.37) (end -6.41 15.37) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.41 18.03) (end -6.41 18.03) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.88 14.9) (end 6.88 18.45) (layer B.CrtYd) (width 0.15))
        (fp_line (start 6.88 18.45) (end -6.82 18.45) (layer B.CrtYd) (width 0.15))
        (fp_line (start -6.82 18.45) (end -6.82 14.9) (layer B.CrtYd) (width 0.15))
        (fp_line (start -6.82 14.9) (end 6.88 14.9) (layer B.CrtYd) (width 0.15))
        (fp_line (start -6.41 15.37) (end -6.41 18.03) (layer B.SilkS) (width 0.12))
        (fp_line (start -6.5 18) (end 6.5 18) (layer B.Fab) (width 0.15))
        (fp_line (start 7 -17.5) (end 7 17.5) (layer B.Fab) (width 0.15))
        (fp_line (start 6.5 -18) (end -6.5 -18) (layer B.Fab) (width 0.15))
        (fp_line (start -7 -17.5) (end -7 17.5) (layer B.Fab) (width 0.15))
        (fp_arc (start -6.5 -17.5) (end -7 -17.5) (angle 90) (layer B.Fab) (width 0.15))
        (fp_arc (start 6.5 -17.5) (end 6.5 -18) (angle 90) (layer B.Fab) (width 0.15))
        (fp_arc (start 6.5 17.5) (end 6.5 18) (angle -90) (layer B.Fab) (width 0.15))
        (fp_arc (start -6.5 17.5) (end -6.5 18) (angle 90) (layer B.Fab) (width 0.15))
    `

    const back_jumpers = `
        (fp_line (start -5.93 12.9) (end -5.93 14.9) (layer B.Fab) (width 0.15))
        (fp_line (start -5.93 14.9) (end -4.23 14.9) (layer B.Fab) (width 0.15))
        (fp_line (start -4.23 12.9) (end -5.93 12.9) (layer B.Fab) (width 0.15))
        (fp_line (start -4.23 14.9) (end -4.23 12.9) (layer B.Fab) (width 0.15))
        (fp_line (start -3.39 14.9) (end -1.69 14.9) (layer B.Fab) (width 0.15))
        (fp_line (start -1.69 12.9) (end -3.39 12.9) (layer B.Fab) (width 0.15))
        (fp_line (start 4.23 14.9) (end 5.93 14.9) (layer B.Fab) (width 0.15))
        (fp_line (start 5.93 14.9) (end 5.93 12.9) (layer B.Fab) (width 0.15))
        (fp_line (start 3.39 12.9) (end 1.69 12.9) (layer B.Fab) (width 0.15))
        (fp_line (start -1.69 14.9) (end -1.69 12.9) (layer B.Fab) (width 0.15))
        (fp_line (start -3.39 12.9) (end -3.39 14.9) (layer B.Fab) (width 0.15))
        (fp_line (start 1.69 12.9) (end 1.69 14.9) (layer B.Fab) (width 0.15))
        (fp_line (start 1.69 14.9) (end 3.39 14.9) (layer B.Fab) (width 0.15))
        (fp_line (start 3.39 14.9) (end 3.39 12.9) (layer B.Fab) (width 0.15))
        (fp_line (start 5.93 12.9) (end 4.23 12.9) (layer B.Fab) (width 0.15))
        (fp_line (start 4.23 12.9) (end 4.23 14.9) (layer B.Fab) (width 0.15))
        (pad 25 smd rect (at 2.54 13.45 ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${p.SCK.str})
        (pad 27 smd rect (at -5.08 13.45 ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${p.CS.str})
        (pad 23 smd rect (at -5.08 14.35 ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${pad_1})
        (pad 20 smd rect (at 5.08 14.35 ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ pad_5 })
        (pad 24 smd rect (at 5.08 13.45 ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${p.MOSI.str})
        (pad 26 smd rect (at -2.54 13.45 ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${p.GND.str})
        (pad 21 smd rect (at 2.54 14.35 ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ pad_4 })
        (pad 22 smd rect (at -2.54 14.35 ${270 + p.rot}) (size 0.6 1.2) (layers B.Cu B.Mask) ${ pad_2 })
    `

    const labels = `
        (fp_text user DA (at -5.08 12.5 ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user CS (at 5.12 12.5 ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user GND (at 2.62 12.5 ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user VCC (at 0.15 14.4 ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user CL (at -2.48 12.5 ${p.rot}) (layer F.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)))
        )
        (fp_text user CS (at -4.98 12.5 ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
        (fp_text user VCC (at 0.15 14.4 ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
        (fp_text user DA (at 5.22 12.5 ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
        (fp_text user CL (at 2.72 12.5 ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
        (fp_text user GND (at -2.38 12.5 ${p.rot}) (layer B.SilkS)
          (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
        )
    `

    const bottom = `
      (pad 5 thru_hole circle (at 5.08 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ pad_5 })
      (pad 4 thru_hole oval (at 2.54 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ pad_4 })
      (pad 2 thru_hole oval (at -2.54 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ pad_2 })
      (pad 1 thru_hole oval (at -5.08 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${ pad_1 })
      (pad 3 thru_hole oval (at 0 16.7 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.VCC.str})
      (fp_line (start 5.4 13.4) (end 5.4 -11.9) (layer Dwgs.User) (width 0.15))
      (fp_line (start -5.4 13.4) (end -5.4 -11.9) (layer Dwgs.User) (width 0.15))
      (fp_line (start 5.4 -11.9) (end -5.4 -11.9) (layer Dwgs.User) (width 0.15))
      (fp_line (start -5.4 13.4) (end 5.4 13.4) (layer Dwgs.User) (width 0.15))
    )
    `

    let final = top;

    if(p.side == "F" || p.reverse) {
      final += front;
    }
    if(p.side == "B" || p.reverse) {
      final += back;
    }

    if(p.reverse) {
      final += front_jumpers;
      final += back_jumpers;

      if(p.show_labels) {
        final += labels;
      }
    }

    final += bottom;

    return final;
  }
}