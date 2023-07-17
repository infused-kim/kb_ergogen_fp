// Author: @infused-kim
//
// Description:
// Simple mounting hole with gold rim.
//
// Parameters:
//   - size: The total size of the hole, including gold rim (Default: 3.8mm)
//   - drill: The actual size for the hole (Default 2.2mm - for m2 screws)

module.exports = {
    params: {
      designator: 'H',
      size: 3.8,
      drill: 2.2,
    },
    body: p => {
        const footprint = `
            (module mounting_hole (layer F.Cu) (tedit 64B5A986)
                ${p.at /* parametric position */}
                (fp_text reference "${p.ref}" (at 0 3) (layer F.SilkS) ${p.ref_hide}
                    (effects (font (size 1 1) (thickness 0.15)))
                )
                (fp_circle (center 0 0) (end -${p.size / 2 - 0.05} 0) (layer F.CrtYd) (width 0.05))
                (fp_circle (center 0 0) (end -${p.size / 2 - 0.05} 0) (layer B.CrtYd) (width 0.05))
                (fp_circle (center 0 0) (end -${p.drill / 2 - 0.05} 0) (layer Dwgs.User) (width 0.05))
                (pad "" thru_hole circle (at 0 0 180) (size ${p.size} ${p.size}) (drill ${p.drill}) (layers *.Cu *.Mask))
            )
        `

        return footprint;
    }
}
