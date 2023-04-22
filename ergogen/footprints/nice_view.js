
module.exports = {
    params: {
        designator: 'DISP',
        side: 'F',
        MOSI: {type: 'net', value: 'MOSI'},
        SCK: {type: 'net', value: 'SCK'},
        VCC: {type: 'net', value: 'VCC'},
        GND: {type: 'net', value: 'GND'},
        CS: {type: 'net', value: 'CS'},
        show_labels: {type: 'boolean', value: true},
    },
    body: p => {
      const standard = `
      (module nice!view (layer F.Cu) (tedit 644356EB)
        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 4.35 ${p.rot}) (layer F.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (fp_line (start 3.76 -3.43) (end 3.76 -0.13) (layer F.CrtYd) (width 0.05))
        (fp_line (start 1.26 -0.13) (end 3.76 -0.13) (layer F.CrtYd) (width 0.05))
        (fp_line (start 1.26 -0.13) (end 1.26 -3.43) (layer F.CrtYd) (width 0.05))
        (fp_line (start 3.76 -3.43) (end 1.26 -3.43) (layer B.CrtYd) (width 0.05))
        (fp_line (start 3.76 -3.43) (end 3.76 -0.13) (layer B.CrtYd) (width 0.05))
        (fp_line (start 3.76 -3.43) (end 1.26 -3.43) (layer F.CrtYd) (width 0.05))
        (fp_line (start 1.26 -0.13) (end 3.76 -0.13) (layer B.CrtYd) (width 0.05))
        (fp_line (start 1.26 -0.13) (end 1.26 -3.43) (layer B.CrtYd) (width 0.05))
        (fp_line (start -6.44 0.345) (end -6.44 3.005) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.38 3.005) (end -6.44 3.005) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.85 -0.125) (end 6.85 3.425) (layer F.CrtYd) (width 0.05))
        (fp_line (start 6.85 3.425) (end -6.85 3.425) (layer F.CrtYd) (width 0.05))
        (fp_line (start -6.85 3.425) (end -6.85 -0.125) (layer F.CrtYd) (width 0.05))
        (fp_line (start -6.85 -0.125) (end 6.85 -0.125) (layer F.CrtYd) (width 0.05))
        (fp_line (start 6.38 0.345) (end 6.38 3.005) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.38 0.345) (end -6.44 0.345) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.3 -3.43) (end 3.8 -3.43) (layer B.CrtYd) (width 0.05))
        (fp_line (start 3.8 -0.13) (end 3.8 -3.43) (layer F.CrtYd) (width 0.05))
        (fp_line (start 3.8 -0.13) (end 6.3 -0.13) (layer F.CrtYd) (width 0.05))
        (fp_line (start 3.8 -0.13) (end 3.8 -3.43) (layer B.CrtYd) (width 0.05))
        (fp_line (start 6.3 -3.43) (end 6.3 -0.13) (layer F.CrtYd) (width 0.05))
        (fp_line (start 6.3 -3.43) (end 6.3 -0.13) (layer B.CrtYd) (width 0.05))
        (fp_line (start 3.8 -0.13) (end 6.3 -0.13) (layer B.CrtYd) (width 0.05))
        (fp_line (start 6.3 -3.43) (end 3.8 -3.43) (layer F.CrtYd) (width 0.05))
        (fp_line (start -3.82 -0.13) (end -3.82 -3.43) (layer B.CrtYd) (width 0.05))
        (fp_line (start -1.32 -3.43) (end -3.82 -3.43) (layer B.CrtYd) (width 0.05))
        (fp_line (start -3.82 -0.13) (end -1.32 -0.13) (layer B.CrtYd) (width 0.05))
        (fp_line (start -1.32 -3.43) (end -1.32 -0.13) (layer B.CrtYd) (width 0.05))
        (fp_line (start -1.32 -3.43) (end -1.32 -0.13) (layer F.CrtYd) (width 0.05))
        (fp_line (start -3.82 -0.13) (end -1.32 -0.13) (layer F.CrtYd) (width 0.05))
        (fp_line (start -1.32 -3.43) (end -3.82 -3.43) (layer F.CrtYd) (width 0.05))
        (fp_line (start -3.82 -0.13) (end -3.82 -3.43) (layer F.CrtYd) (width 0.05))
        (fp_line (start -6.36 -0.13) (end -6.36 -3.43) (layer B.CrtYd) (width 0.05))
        (fp_line (start -6.36 -0.13) (end -3.86 -0.13) (layer F.CrtYd) (width 0.05))
        (fp_line (start -3.86 -3.43) (end -6.36 -3.43) (layer F.CrtYd) (width 0.05))
        (fp_line (start -6.36 -0.13) (end -6.36 -3.43) (layer F.CrtYd) (width 0.05))
        (fp_line (start -6.36 -0.13) (end -3.86 -0.13) (layer B.CrtYd) (width 0.05))
        (fp_line (start -3.86 -3.43) (end -3.86 -0.13) (layer B.CrtYd) (width 0.05))
        (fp_line (start -3.86 -3.43) (end -3.86 -0.13) (layer F.CrtYd) (width 0.05))
        (fp_line (start -3.86 -3.43) (end -6.36 -3.43) (layer B.CrtYd) (width 0.05))
        (fp_line (start 6.38 0.345) (end 6.38 3.005) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.38 0.345) (end -6.44 0.345) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.38 3.005) (end -6.44 3.005) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.85 -0.125) (end 6.85 3.425) (layer B.CrtYd) (width 0.05))
        (fp_line (start 6.85 3.425) (end -6.85 3.425) (layer B.CrtYd) (width 0.05))
        (fp_line (start -6.85 3.425) (end -6.85 -0.125) (layer B.CrtYd) (width 0.05))
        (fp_line (start -6.85 -0.125) (end 6.85 -0.125) (layer B.CrtYd) (width 0.05))
        (fp_line (start -6.44 0.345) (end -6.44 3.005) (layer B.SilkS) (width 0.12))
        (fp_text user %R (at 0 4.35 ${p.rot}) (layer F.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (fp_text user %R (at 0 4.35 ${p.rot}) (layer B.Fab)
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (pad 16 smd custom (at 2.51 -2.505 ${90 + p.rot}) (size 0.3 0.3) (layers F.Cu F.Mask)
          ${p.GND.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.75) (xy 0.5 -0.75) (xy 0.5 0.75) (xy -0.65 0.75) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 21 smd custom (at 2.51 -1.055 ${90 + p.rot}) (size 0.3 0.3) (layers B.Cu B.Mask)
          ${p.local_net("4").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.75) (xy 0.5 -0.75) (xy 1 0) (xy 0.5 0.75) (xy -0.5 0.75)
      ) (width 0))
          ))
        (pad 25 smd custom (at 2.51 -2.505 ${90 + p.rot}) (size 0.3 0.3) (layers B.Cu B.Mask)
          ${p.SCK.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.75) (xy 0.5 -0.75) (xy 0.5 0.75) (xy -0.65 0.75) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 12 smd custom (at 2.51 -1.055 ${90 + p.rot}) (size 0.3 0.3) (layers F.Cu F.Mask)
          ${p.local_net("4").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.75) (xy 0.5 -0.75) (xy 1 0) (xy 0.5 0.75) (xy -0.5 0.75)
      ) (width 0))
          ))
        (pad 3 thru_hole oval (at -0.03 1.675 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask))
        (pad 1 thru_hole oval (at -5.11 1.675 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("1").str})
        (pad 2 thru_hole oval (at -2.57 1.675 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("2").str})
        (pad 4 thru_hole oval (at 2.51 1.675 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("4").str})
        (pad 5 thru_hole circle (at 5.05 1.675 ${270 + p.rot}) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("5").str})
        (pad 24 smd custom (at 5.05 -2.505 ${90 + p.rot}) (size 0.3 0.3) (layers B.Cu B.Mask)
          ${p.MOSI.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.75) (xy 0.5 -0.75) (xy 0.5 0.75) (xy -0.65 0.75) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 17 smd custom (at 5.05 -2.505 ${90 + p.rot}) (size 0.3 0.3) (layers F.Cu F.Mask)
          ${p.CS.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.75) (xy 0.5 -0.75) (xy 0.5 0.75) (xy -0.65 0.75) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 20 smd custom (at 5.05 -1.055 ${90 + p.rot}) (size 0.3 0.3) (layers B.Cu B.Mask)
          ${p.local_net("5").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.75) (xy 0.5 -0.75) (xy 1 0) (xy 0.5 0.75) (xy -0.5 0.75)
      ) (width 0))
          ))
        (pad 13 smd custom (at 5.05 -1.055 ${90 + p.rot}) (size 0.3 0.3) (layers F.Cu F.Mask)
          ${p.local_net("5").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.75) (xy 0.5 -0.75) (xy 1 0) (xy 0.5 0.75) (xy -0.5 0.75)
      ) (width 0))
          ))
        (pad 22 smd custom (at -2.57 -1.055 ${90 + p.rot}) (size 0.3 0.3) (layers B.Cu B.Mask)
          ${p.local_net("2").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.75) (xy 0.5 -0.75) (xy 1 0) (xy 0.5 0.75) (xy -0.5 0.75)
      ) (width 0))
          ))
        (pad 26 smd custom (at -2.57 -2.505 ${90 + p.rot}) (size 0.3 0.3) (layers B.Cu B.Mask)
          ${p.GND.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.75) (xy 0.5 -0.75) (xy 0.5 0.75) (xy -0.65 0.75) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 11 smd custom (at -2.57 -1.055 ${90 + p.rot}) (size 0.3 0.3) (layers F.Cu F.Mask)
          ${p.local_net("2").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.75) (xy 0.5 -0.75) (xy 1 0) (xy 0.5 0.75) (xy -0.5 0.75)
      ) (width 0))
          ))
        (pad 15 smd custom (at -2.57 -2.505 ${90 + p.rot}) (size 0.3 0.3) (layers F.Cu F.Mask)
          ${p.SCK.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.75) (xy 0.5 -0.75) (xy 0.5 0.75) (xy -0.65 0.75) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 27 smd custom (at -5.11 -2.505 ${90 + p.rot}) (size 0.3 0.3) (layers B.Cu B.Mask)
        ${p.CS.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.75) (xy 0.5 -0.75) (xy 0.5 0.75) (xy -0.65 0.75) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 10 smd custom (at -5.11 -1.055 ${90 + p.rot}) (size 0.3 0.3) (layers F.Cu F.Mask)
          ${p.local_net("1").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.75) (xy 0.5 -0.75) (xy 1 0) (xy 0.5 0.75) (xy -0.5 0.75)
      ) (width 0))
          ))
        (pad 14 smd custom (at -5.11 -2.505 ${90 + p.rot}) (size 0.3 0.3) (layers F.Cu F.Mask)
          ${p.MOSI.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.75) (xy 0.5 -0.75) (xy 0.5 0.75) (xy -0.65 0.75) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 23 smd custom (at -5.11 -1.055 ${90 + p.rot}) (size 0.3 0.3) (layers B.Cu B.Mask)
          ${p.local_net("1").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.75) (xy 0.5 -0.75) (xy 1 0) (xy 0.5 0.75) (xy -0.5 0.75)
      ) (width 0))
          ))
      `
    const labels = `
      ${'' /* Add the optional parts here */}
      (fp_text user DA (at -5.23 -3.65 ${p.rot}) (layer F.SilkS)
      (effects (font (size 1 0.7) (thickness 0.1)))
      )
      (fp_text user CL (at -2.63 -3.65 ${p.rot}) (layer F.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)))
      )
      (fp_text user VCC (at 0 -0.65 ${p.rot}) (layer F.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)))
      )
      (fp_text user GND (at 2.47 -3.65 ${p.rot}) (layer F.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)))
      )
      (fp_text user CS (at -5.13 -3.95 ${p.rot}) (layer B.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
      )
      (fp_text user DA (at 5.07 -3.95 ${p.rot}) (layer B.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
      )
      (fp_text user CL (at 2.57 -3.95 ${p.rot}) (layer B.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
      )
      (fp_text user VCC (at 0 -0.65 ${p.rot}) (layer B.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
      )
      (fp_text user GND (at -2.53 -3.95 ${p.rot}) (layer B.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)) (justify mirror))
      )
      (fp_text user CS (at 4.97 -3.65 ${p.rot}) (layer F.SilkS)
        (effects (font (size 1 0.7) (thickness 0.1)))
      )
      `
    return `
      ${standard}
      ${p.show_labels ? labels : ''}
      )
    `
  }
}