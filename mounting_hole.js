// Author: @infused-kim
//
// Description:
// Simple mounting hole with gold rim.
//
// Parameters:
//   - outline: The width of the gold rim around the hole (Default: 0.8mm)
//   - drill: The actual size for the hole (Default 2.2mm - for m2 screws)
//   - drill_y: The height if you want an oval hole (Default: off)

module.exports = {
    params: {
      designator: 'H',
      outline: 0.8,
      drill: 2.2,
      drill_y: 0,
    },
    body: p => {
        if(p.drill_y == 0) {
            p.drill_y = p.drill
        }

        const size_x = p.drill + p.outline * 2
        const size_y = p.drill_y + p.outline * 2

        const courtyard_offset = 0.25
        const courtyard_x = size_x / 2 + courtyard_offset
        const courtyard_y = size_y / 2 + courtyard_offset

        const top = `
            (module mounting_hole (layer F.Cu) (tedit 64B5A986)
                ${p.at /* parametric position */}
                (fp_text reference "${p.ref}" (at 0 3) (layer F.SilkS) ${p.ref_hide}
                    (effects (font (size 1 1) (thickness 0.15)))
                )
        `

        const pad_circle = `
                (pad "" thru_hole circle (at 0 0 180) (size ${size_x} ${size_y}) (drill ${p.drill}) (layers *.Cu *.Mask))
        `
        const courtyard_circle = `
                (fp_circle (center 0 0) (end -${courtyard_x} 0) (layer F.CrtYd) (width 0.05))
                (fp_circle (center 0 0) (end -${courtyard_x} 0) (layer B.CrtYd) (width 0.05))
        `
        const pad_oval = `
                (pad "" thru_hole oval (at 0 0 180) (size ${size_x} ${size_y}) (drill oval ${p.drill} ${p.drill_y}) (layers *.Cu *.Mask))
        `
        const courtyard_oval = `
                (fp_line (start ${courtyard_x} -${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer F.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} -${courtyard_y}) (end -${courtyard_x} ${courtyard_y}) (layer F.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} ${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer F.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} -${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer F.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} ${courtyard_y}) (end ${courtyard_x} ${courtyard_y}) (layer B.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} ${courtyard_y}) (end -${courtyard_x} -${courtyard_y}) (layer B.CrtYd) (width 0.05))
                (fp_line (start -${courtyard_x} -${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer B.CrtYd) (width 0.05))
                (fp_line (start ${courtyard_x} ${courtyard_y}) (end ${courtyard_x} -${courtyard_y}) (layer B.CrtYd) (width 0.05))
        `

        const bottom = `
            )
        `

        let final = top
        if(size_x == size_y) {
            final += pad_circle
            final += courtyard_circle
        } else {
            final += pad_oval
            final += courtyard_oval
        }

        final += bottom

        return final
    }
}
