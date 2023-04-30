module.exports = {
  params: {
    designator: 'TXT',
    side: 'F',
    reverse: false,
    text: 'Awesomeness',
  },
  body: p => {
    const top = `
      (module text (layer F.Cu) (tedit 6449CD11)
        ${p.at /* parametric position */}
        (attr virtual)

      `;

    const front = `
      (fp_text user "${p.text}" (at 0 0) (layer F.SilkS)
        (effects (font (size 1 1) (thickness 0.15)))
      )
    `
    const back = `
      (fp_text user "${p.text}" (at 0 0) (layer B.SilkS)
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
