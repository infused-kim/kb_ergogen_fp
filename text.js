// Author: @infused-kim
//
// Description:
// Allows oyu to place text on the PCB.

module.exports = {
  params: {
    designator: 'TXT',
    side: 'F',
    reverse: false,
    text: 'Awesomeness',
  },
  body: p => {
    const front = `
      (gr_text "${p.text}" ${p.at} (layer F.SilkS)
        (effects (font (size 1 1) (thickness 0.15)))
      )
    `
    const back = `
      (gr_text "${p.text}" ${p.at} (layer B.SilkS)
        (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      )
    `

    let final = '';

    if(p.side == "F" || p.reverse) {
      final += front;
    }
    if(p.side == "B" || p.reverse) {
      final += back;
    }

    return final;
  }
}
