// Author: @infused-kim
//
// A re-implementation of the promicro_pretty footprint that uses real traces
// instead of pads. This prevents it from raising hundreds of DRC errors.
//
// Placement and jumper soldering:
// The footprint is meant to be used with a nice!nano (or any other pro micro
// compatible board) that is placed on the top side of the PCB with the
// components facing down.
//
// This means when you look down at it, the RAW pin is in the upper left
// corner and the 006 pin in the upper right corner.
//
// To make it work in this configuration, you solder the jumpers on the
// OPPOSITE side.
//
// Due to the way how this footprint works, you can also place it with the
// components facing up or even at the bottom. You just need to make sure you
// solder the jumpers on the correct side.
//
// Regardless, the silkscreen labels are displayed in location that match when
// the controller is placed with the components facing down.
//
// This footprint is based on this ergogen footprint:
// https://github.com/Albert-IV/ergogen-contrib/blob/main/src/footprints/promicro_pretty.js
//
// And this KiCad footprint:
// https://github.com/50an6xy06r6n/keyboard_reversible.pretty

module.exports =  {
    params: {
      designator: 'MCU',
      RAW: {type: 'net', value: 'RAW'},
      GND: {type: 'net', value: 'GND'},
      RST: {type: 'net', value: 'RST'},
      VCC: {type: 'net', value: 'VCC'},
      P21: {type: 'net', value: 'P21'},
      P20: {type: 'net', value: 'P20'},
      P19: {type: 'net', value: 'P19'},
      P18: {type: 'net', value: 'P18'},
      P15: {type: 'net', value: 'P15'},
      P14: {type: 'net', value: 'P14'},
      P16: {type: 'net', value: 'P16'},
      P10: {type: 'net', value: 'P10'},
      P1: {type: 'net', value: 'P1'},
      P0: {type: 'net', value: 'P0'},
      P2: {type: 'net', value: 'P2'},
      P3: {type: 'net', value: 'P3'},
      P4: {type: 'net', value: 'P4'},
      P5: {type: 'net', value: 'P5'},
      P6: {type: 'net', value: 'P6'},
      P7: {type: 'net', value: 'P7'},
      P8: {type: 'net', value: 'P8'},
      P9: {type: 'net', value: 'P9'},

      show_labels: false,
      RAW_label: '',
      GND_label: '',
      RST_label: '',
      VCC_label: '',
      P21_label: '',
      P20_label: '',
      P19_label: '',
      P18_label: '',
      P15_label: '',
      P14_label: '',
      P16_label: '',
      P10_label: '',
      P1_label: '',
      P0_label: '',
      P2_label: '',
      P3_label: '',
      P4_label: '',
      P5_label: '',
      P6_label: '',
      P7_label: '',
      P8_label: '',
      P9_label: '',
    },
    body: p => {
      const get_pin_net_name = (p, pin_name) => {
        return p[pin_name].name;
      };

      const get_pin_label_override = (p, pin_name) => {
        prop_name = `${pin_name}_label`;
        return p[prop_name];
      };

      const get_pin_label = (p, pin_name) => {
        label = get_pin_label_override(p, pin_name);
        if(label == '') {
          label = get_pin_net_name(p, pin_name);
        }

        if(label === undefined) {
          label = '""';
        }

        return label;
      };

      const get_at_coordinates = () => {
        const pattern = /\(at (-?[\d\.]*) (-?[\d\.]*) (-?[\d\.]*)\)/;
        console.log(`Getting coordinates from pat: ${p.at}`);
        const matches = p.at.match(pattern);
        if (matches && matches.length == 4) {
          return [parseFloat(matches[1]), parseFloat(matches[2]), parseFloat(matches[3])];
        } else {
          return null;
        }
      }

      const adjust_point = (x, y) => {
        const at_l = get_at_coordinates();
        if(at_l == null) {
          throw new Error(
            `Could not get x and y coordinates from p.at: ${p.at}`
          );
        }
        const at_x = at_l[0];
        const at_y = at_l[1];
        const at_angle = at_l[2];
        const adj_x = at_x + x;
        const adj_y = at_y + y;
        console.log(`Got at coordinates ${at_x} ${at_y}`);

        console.log(`Adjusted point ${x} ${y} to ${adj_x} ${adj_y}`);

        const radians = (Math.PI / 180) * at_angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (adj_x - at_x)) + (sin * (adj_y - at_y)) + at_x,
          ny = (cos * (adj_y - at_y)) - (sin * (adj_x - at_x)) + at_y;

        const point_str = `${nx.toFixed(2)} ${ny.toFixed(2)}`;
        console.log(`Rotate point ${adj_x} ${adj_y} to: ${point_str}`);
        return point_str;
      }

      const pin_labels = `
      (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 15.24) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 15.24) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 12.7) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 12.7) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 10.16) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 10.16) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 7.62) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 7.62) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 5.08) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 5.08) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 2.54) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 2.54) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 0) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 0) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -12.7) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 -12.7) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -10.16) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 -10.16) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -7.62) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 -7.62) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -5.08) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 -5.08) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 -2.54) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -2.54) (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 1.27 270) (layer F.SilkS)
      (effects (font (size 1.27 1.27) (thickness 0.15)))
    )


    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -10.16 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 -10.16 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -7.62 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -5.08 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -2.54 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 -2.54 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 1.27 -90) (layer B.SilkS)
      (effects (font (size 1.27 1.27) (thickness 0.15)) (justify mirror))
    )

    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 12.7 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 -12.7 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 7.62 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 7.62 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 10.16 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 2.54 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 5.08 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 15.24 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 5.08 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 0 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 -12.7 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 12.7 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 15.24 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at 2.75 10.16 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 0 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )
    (fp_text user ${ get_pin_label(p, '$2') } (at -2.75 2.54 180) (layer B.SilkS)
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
    )

      `

      return `
      (segment (start ${ adjust_point(-16.3, -4.4) }) (end ${ adjust_point(-16.3, 2.9) }) (width 0.25) (layer F.Cu) (net 0))


      (module nice_nano (layer F.Cu) (tedit 6451A4F1)
        ${p.at /* parametric position */}
        (fp_text reference "${p.ref}" (at 0 -15) (layer F.SilkS) ${p.ref_hide}
          (effects (font (size 1 1) (thickness 0.15)))
        )

        ${''/* USB Socket Outline */}
        (fp_line (start 3.556 -18.034) (end 3.556 -16.51) (layer Dwgs.User) (width 0.15))
        (fp_line (start -3.81 -16.51) (end -3.81 -18.034) (layer Dwgs.User) (width 0.15))
        (fp_line (start -3.81 -18.034) (end 3.556 -18.034) (layer Dwgs.User) (width 0.15))

        ${''/* Courtyard Outline */}
        (fp_line (start 8.89 16.51) (end 8.89 -14.03) (layer F.CrtYd) (width 0.15))
        (fp_line (start 8.89 -14.03) (end -8.89 -14.03) (layer F.CrtYd) (width 0.15))
        (fp_line (start -8.89 -14.03) (end -8.89 16.51) (layer F.CrtYd) (width 0.15))
        (fp_line (start -8.89 16.51) (end 8.89 16.51) (layer F.CrtYd) (width 0.15))
        (fp_line (start -8.89 16.51) (end -8.89 -14.03) (layer B.CrtYd) (width 0.15))
        (fp_line (start -8.89 -14.03) (end 8.89 -14.03) (layer B.CrtYd) (width 0.15))
        (fp_line (start 8.89 -14.03) (end 8.89 16.51) (layer B.CrtYd) (width 0.15))
        (fp_line (start 8.89 16.51) (end -8.89 16.51) (layer B.CrtYd) (width 0.15))


        ${''/* Controller top part outline */}
        (fp_line (start -8.89 -16.51) (end 8.89 -16.51) (layer F.Fab) (width 0.12))
        (fp_line (start -8.89 -16.51) (end -8.89 -14) (layer F.Fab) (width 0.12))
        (fp_line (start 8.89 -16.51) (end 8.89 -14) (layer F.Fab) (width 0.12))
        (fp_line (start -8.89 -16.5) (end -8.89 -13.99) (layer B.Fab) (width 0.12))
        (fp_line (start 8.89 -16.51) (end 8.89 -14) (layer B.Fab) (width 0.12))
        (fp_line (start -8.89 -16.51) (end 8.89 -16.51) (layer B.Fab) (width 0.12))

        ${''/* Socket outlines */}
        (fp_line (start 6.29 -11.43) (end 8.95 -11.43) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.29 -14.03) (end 8.95 -14.03) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.29 -14.03) (end 6.29 16.57) (layer F.SilkS) (width 0.12))
        (fp_line (start 6.29 16.57) (end 8.95 16.57) (layer F.SilkS) (width 0.12))
        (fp_line (start 8.95 -14.03) (end 8.95 16.57) (layer F.SilkS) (width 0.12))
        (fp_line (start -8.95 -14.03) (end -6.29 -14.03) (layer F.SilkS) (width 0.12))
        (fp_line (start -8.95 -14.03) (end -8.95 16.57) (layer F.SilkS) (width 0.12))
        (fp_line (start -8.95 16.57) (end -6.29 16.57) (layer F.SilkS) (width 0.12))
        (fp_line (start -6.29 -14.03) (end -6.29 16.57) (layer F.SilkS) (width 0.12))
        (fp_line (start -8.95 -11.43) (end -6.29 -11.43) (layer B.SilkS) (width 0.12))
        (fp_line (start -6.29 -14.03) (end -8.95 -14.03) (layer B.SilkS) (width 0.12))
        (fp_line (start -6.29 -14.03) (end -6.29 16.57) (layer B.SilkS) (width 0.12))
        (fp_line (start -6.29 16.57) (end -8.95 16.57) (layer B.SilkS) (width 0.12))
        (fp_line (start -8.95 -14.03) (end -8.95 16.57) (layer B.SilkS) (width 0.12))
        (fp_line (start 8.95 -14.03) (end 6.29 -14.03) (layer B.SilkS) (width 0.12))
        (fp_line (start 8.95 -14.03) (end 8.95 16.57) (layer B.SilkS) (width 0.12))
        (fp_line (start 8.95 16.57) (end 6.29 16.57) (layer B.SilkS) (width 0.12))
        (fp_line (start 6.29 -14.03) (end 6.29 16.57) (layer B.SilkS) (width 0.12))


        ${''/* VIA Labels */}
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -13.5) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -10.96) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -8.42) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -5.88) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -0.8) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -3.34) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 1.74) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 4.28) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 9.36) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 6.82) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 14.44) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 11.9) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -5.88) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -8.42) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -3.34) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -0.8) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 4.28) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 1.74) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 14.44) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 11.9) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 9.36) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 6.82) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -13.5) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -10.96) (layer F.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 1.74 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -3.34 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -13.5 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -10.96 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -8.42 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -5.88 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 -0.8 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -13.5 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -10.96 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 4.28 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 9.36 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 6.82 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 14.44 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at 0.762 11.9 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -5.88 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -8.42 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -3.34 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 -0.8 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 4.28 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 1.74 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 14.44 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 11.9 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 9.36 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )
        (fp_text user ${ get_pin_label(p, '$2') } (at -0.762 6.82 180) (layer B.Fab)
          (effects (font (size 0.5 0.5) (thickness 0.08)) (justify mirror))
        )


        ${''/* Inside VIAS */}
        (pad 124 thru_hole circle (at 0.762 -12.7) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.RAW.str})
        (pad 101 thru_hole circle (at -0.762 -12.7) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P1.str})
        (pad 123 thru_hole circle (at 0.762 -10.16) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.GND.str})
        (pad 102 thru_hole circle (at -0.762 -10.16) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P0.str})
        (pad 121 thru_hole circle (at 0.762 -5.08) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.VCC.str})
        (pad 104 thru_hole circle (at -0.762 -5.08) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.GND.str})
        (pad 122 thru_hole circle (at 0.762 -7.62) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.RST.str})
        (pad 103 thru_hole circle (at -0.762 -7.62) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.GND.str})
        (pad 120 thru_hole circle (at 0.762 -2.54) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P21.str})
        (pad 105 thru_hole circle (at -0.762 -2.54) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P2.str})
        (pad 119 thru_hole circle (at 0.762 0) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P20.str})
        (pad 106 thru_hole circle (at -0.762 0) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P3.str})
        (pad 117 thru_hole circle (at 0.762 5.08) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P18.str})
        (pad 108 thru_hole circle (at -0.762 5.08) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P5.str})
        (pad 118 thru_hole circle (at 0.762 2.54) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P19.str})
        (pad 107 thru_hole circle (at -0.762 2.54) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P4.str})
        (pad 116 thru_hole circle (at 0.762 7.62) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P15.str})
        (pad 115 thru_hole circle (at 0.762 10.16) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P14.str})
        (pad 110 thru_hole circle (at -0.762 10.16) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P7.str})
        (pad 114 thru_hole circle (at 0.762 12.7) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P16.str})
        (pad 111 thru_hole circle (at -0.762 12.7) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P8.str})
        (pad 109 thru_hole circle (at -0.762 7.62) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P6.str})
        (pad 113 thru_hole circle (at 0.762 15.24) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P10.str})
        (pad 112 thru_hole circle (at -0.762 15.24) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.P9.str})

        ${''/* Jumper Pads */}
        (pad 101 smd custom (at -4.775 -12.7) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P1.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 24 smd custom (at -5.5 -12.7) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("24").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 1 smd custom (at 5.5 -12.7 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("1").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 124 smd custom (at 4.775 -12.7 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.RAW.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 123 smd custom (at 4.775 -10.16 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.GND.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 2 smd custom (at 5.5 -10.16 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("2").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 23 smd custom (at -5.5 -10.16) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("23").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 102 smd custom (at -4.775 -10.16) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P0.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 22 smd custom (at -5.5 -7.62) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("22").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 103 smd custom (at -4.775 -7.62) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.GND.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 122 smd custom (at 4.775 -7.62 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.RST.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 3 smd custom (at 5.5 -7.62 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("3").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 21 smd custom (at -5.5 -5.08) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("21").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 104 smd custom (at -4.775 -5.08) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.GND.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 121 smd custom (at 4.775 -5.08 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.VCC.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 4 smd custom (at 5.5 -5.08 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("4").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 105 smd custom (at -4.775 -2.54) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P2.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 120 smd custom (at 4.775 -2.54 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P21.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 5 smd custom (at 5.5 -2.54 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("5").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 20 smd custom (at -5.5 -2.54) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("20").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 106 smd custom (at -4.775 0) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P3.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 119 smd custom (at 4.775 0 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P20.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 6 smd custom (at 5.5 0 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("6").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 19 smd custom (at -5.5 0) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("19").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 118 smd custom (at 4.775 2.54 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P19.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 7 smd custom (at 5.5 2.54 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("7").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 18 smd custom (at -5.5 2.54) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("18").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 107 smd custom (at -4.775 2.54) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P4.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 8 smd custom (at 5.5 5.08 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("8").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 17 smd custom (at -5.5 5.08) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("17").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 117 smd custom (at 4.775 5.08 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P18.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 108 smd custom (at -4.775 5.08) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P5.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 9 smd custom (at 5.5 7.62 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("9").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 16 smd custom (at -5.5 7.62) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("16").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 116 smd custom (at 4.775 7.62 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P15.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 109 smd custom (at -4.775 7.62) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P6.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 15 smd custom (at -5.5 10.16) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("15").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 110 smd custom (at -4.775 10.16) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P7.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 115 smd custom (at 4.775 10.16 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P14.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 10 smd custom (at 5.5 10.16 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("10").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 14 smd custom (at -5.5 12.7) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("14").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 111 smd custom (at -4.775 12.7) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P8.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 11 smd custom (at 5.5 12.7 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("11").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 114 smd custom (at 4.775 12.7 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P16.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 13 smd custom (at -5.5 15.24) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("13").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 112 smd custom (at -4.775 15.24) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P9.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 12 smd custom (at 5.5 15.24 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net("12").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 -0.625) (xy -0.25 -0.625) (xy 0.25 0) (xy -0.25 0.625) (xy -0.5 0.625)
      ) (width 0))
          ))
        (pad 113 smd custom (at 4.775 15.24 180) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.P10.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 -0.625) (xy 0.5 -0.625) (xy 0.5 0.625) (xy -0.65 0.625) (xy -0.15 0)
      ) (width 0))
          ))

          (pad 120 smd custom (at -4.775 -2.54) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P21.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 104 smd custom (at 4.775 -5.08 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.GND.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 23 smd custom (at -5.5 -10.16) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("23").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
      ) (width 0))
          ))
        (pad 123 smd custom (at -4.775 -10.16) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.GND.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 101 smd custom (at 4.775 -12.7 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P1.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 103 smd custom (at 4.775 -7.62 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.GND.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0))
          ))
        (pad 21 smd custom (at -5.5 -5.08) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("21").str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
      ) (width 0))
          ))
        (pad 105 smd custom (at 4.775 -2.54 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P2.str}
          (zone_connect 2)
          (options (clearance outline) (anchor rect))
          (primitives
            (gr_poly (pts
              (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
      ) (width 0))
          ))


        (pad 4 smd custom (at 5.5 -5.08 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("4").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))

      (pad 106 smd custom (at 4.775 0 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P3.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 3 smd custom (at 5.5 -7.62 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("3").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 22 smd custom (at -5.5 -7.62) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("22").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 124 smd custom (at -4.775 -12.7) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.RAW.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 24 smd custom (at -5.5 -12.7) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("24").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 5 smd custom (at 5.5 -2.54 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("5").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 122 smd custom (at -4.775 -7.62) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.RST.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 1 smd custom (at 5.5 -12.7 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("1").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 119 smd custom (at -4.775 0) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P20.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 19 smd custom (at -5.5 0) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("19").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 6 smd custom (at 5.5 0 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("6").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 118 smd custom (at -4.775 2.54) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P19.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 121 smd custom (at -4.775 -5.08) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.VCC.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 18 smd custom (at -5.5 2.54) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("18").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 7 smd custom (at 5.5 2.54 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("7").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 107 smd custom (at 4.775 2.54 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P4.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 102 smd custom (at 4.775 -10.16 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P0.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 2 smd custom (at 5.5 -10.16 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("2").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 20 smd custom (at -5.5 -2.54) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("20").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 17 smd custom (at -5.5 5.08) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("17").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 8 smd custom (at 5.5 5.08 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("8").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 117 smd custom (at -4.775 5.08) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P18.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 108 smd custom (at 4.775 5.08 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P5.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 16 smd custom (at -5.5 7.62) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("16").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 9 smd custom (at 5.5 7.62 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("9").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 116 smd custom (at -4.775 7.62) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P15.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 109 smd custom (at 4.775 7.62 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P6.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 10 smd custom (at 5.5 10.16 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("10").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 110 smd custom (at 4.775 10.16 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P7.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 115 smd custom (at -4.775 10.16) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P14.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 15 smd custom (at -5.5 10.16) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("15").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 11 smd custom (at 5.5 12.7 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("11").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 111 smd custom (at 4.775 12.7 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P8.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 14 smd custom (at -5.5 12.7) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("14").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 114 smd custom (at -4.775 12.7) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P16.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 12 smd custom (at 5.5 15.24 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("12").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 112 smd custom (at 4.775 15.24 180) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P9.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))
      (pad 13 smd custom (at -5.5 15.24) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net("13").str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.5 0.625) (xy -0.25 0.625) (xy 0.25 0) (xy -0.25 -0.625) (xy -0.5 -0.625)
    ) (width 0))
        ))
      (pad 113 smd custom (at -4.775 15.24) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.P10.str}
        (zone_connect 2)
        (options (clearance outline) (anchor rect))
        (primitives
          (gr_poly (pts
            (xy -0.65 0.625) (xy 0.5 0.625) (xy 0.5 -0.625) (xy -0.65 -0.625) (xy -0.15 0)
    ) (width 0))
        ))


        ${''/* Sockets */}
        (pad 18 thru_hole oval (at -7.62 2.54) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("18").str})
        (pad 15 thru_hole oval (at -7.62 10.16) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("15").str})
        (pad 24 thru_hole circle (at -7.62 -12.7) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("24").str})
        (pad 19 thru_hole oval (at -7.62 0) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("19").str})
        (pad 22 thru_hole oval (at -7.62 -7.62) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("22").str})
        (pad 17 thru_hole oval (at -7.62 5.08) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("17").str})
        (pad 20 thru_hole oval (at -7.62 -2.54) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("20").str})
        (pad 14 thru_hole oval (at -7.62 12.7) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("14").str})
        (pad 13 thru_hole oval (at -7.62 15.24) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("13").str})
        (pad 16 thru_hole oval (at -7.62 7.62) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("16").str})
        (pad 21 thru_hole oval (at -7.62 -5.08) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("21").str})
        (pad 23 thru_hole oval (at -7.62 -10.16) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("23").str})
        (pad 7 thru_hole oval (at 7.62 2.54) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("7").str})
        (pad 10 thru_hole oval (at 7.62 10.16) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("10").str})
        (pad 1 thru_hole circle (at 7.62 -12.7) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("1").str})
        (pad 6 thru_hole oval (at 7.62 0) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("6").str})
        (pad 3 thru_hole oval (at 7.62 -7.62) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("3").str})
        (pad 8 thru_hole oval (at 7.62 5.08) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("8").str})
        (pad 5 thru_hole oval (at 7.62 -2.54) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("5").str})
        (pad 11 thru_hole oval (at 7.62 12.7) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("11").str})
        (pad 12 thru_hole oval (at 7.62 15.24) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("12").str})
        (pad 9 thru_hole oval (at 7.62 7.62) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("9").str})
        (pad 4 thru_hole oval (at 7.62 -5.08) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("4").str})
        (pad 2 thru_hole oval (at 7.62 -10.16) (size 1.7 1.7) (drill 1) (layers *.Cu *.Mask) ${p.local_net("2").str})

        ${''/* Labels for pins */}
        ${ p.show_labels ? pin_labels : ''}
      )

      ${'' /* Traces */}
      (segment (start ${ adjust_point(192.95, 69.53) }) (end ${ adjust_point(192.95, 76.83) }) (width 0.25) (layer F.Cu) (net 0))
      (segment (start ${ adjust_point(4.775, -2.54) }) (end ${ adjust_point(0.762, -2.54) }) (width 0.25) (layer F.Cu) (net 1))
      (segment (start ${ adjust_point(-4.049999, -3.265001) }) (end ${ adjust_point(-4.775, -2.54) }) (width 0.25) (layer B.Cu) (net 1))
      (segment (start ${ adjust_point(0.036999, -3.265001) }) (end ${ adjust_point(-4.049999, -3.265001) }) (width 0.25) (layer B.Cu) (net 1))
      (segment (start ${ adjust_point(0.762, -2.54) }) (end ${ adjust_point(0.036999, -3.265001) }) (width 0.25) (layer B.Cu) (net 1))
      (segment (start ${ adjust_point(4.775, 0) }) (end ${ adjust_point(0.762, 0) }) (width 0.25) (layer F.Cu) (net 5))
      (segment (start ${ adjust_point(-4.049999, -0.725001) }) (end ${ adjust_point(-4.775, 0) }) (width 0.25) (layer B.Cu) (net 5))
      (segment (start ${ adjust_point(0.036999, -0.725001) }) (end ${ adjust_point(-4.049999, -0.725001) }) (width 0.25) (layer B.Cu) (net 5))
      (segment (start ${ adjust_point(0.762, 0) }) (end ${ adjust_point(0.036999, -0.725001) }) (width 0.25) (layer B.Cu) (net 5))
      (segment (start ${ adjust_point(4.775, 2.54) }) (end ${ adjust_point(0.762, 2.54) }) (width 0.25) (layer F.Cu) (net 9))
      (segment (start ${ adjust_point(-4.049999, 1.814999) }) (end ${ adjust_point(-4.775, 2.54) }) (width 0.25) (layer B.Cu) (net 9))
      (segment (start ${ adjust_point(0.036999, 1.814999) }) (end ${ adjust_point(-4.049999, 1.814999) }) (width 0.25) (layer B.Cu) (net 9))
      (segment (start ${ adjust_point(0.762, 2.54) }) (end ${ adjust_point(0.036999, 1.814999) }) (width 0.25) (layer B.Cu) (net 9))
      (segment (start ${ adjust_point(4.775, 5.08) }) (end ${ adjust_point(0.762, 5.08) }) (width 0.25) (layer F.Cu) (net 13))
      (segment (start ${ adjust_point(-4.049999, 4.354999) }) (end ${ adjust_point(-4.775, 5.08) }) (width 0.25) (layer B.Cu) (net 13))
      (segment (start ${ adjust_point(0.036999, 4.354999) }) (end ${ adjust_point(-4.049999, 4.354999) }) (width 0.25) (layer B.Cu) (net 13))
      (segment (start ${ adjust_point(0.762, 5.08) }) (end ${ adjust_point(0.036999, 4.354999) }) (width 0.25) (layer B.Cu) (net 13))
      (segment (start ${ adjust_point(4.775, 7.62) }) (end ${ adjust_point(0.762, 7.62) }) (width 0.25) (layer F.Cu) (net 17))
      (segment (start ${ adjust_point(-4.049999, 6.894999) }) (end ${ adjust_point(-4.775, 7.62) }) (width 0.25) (layer B.Cu) (net 17))
      (segment (start ${ adjust_point(0.036999, 6.894999) }) (end ${ adjust_point(-4.049999, 6.894999) }) (width 0.25) (layer B.Cu) (net 17))
      (segment (start ${ adjust_point(0.762, 7.62) }) (end ${ adjust_point(0.036999, 6.894999) }) (width 0.25) (layer B.Cu) (net 17))
      (segment (start ${ adjust_point(4.775, 10.16) }) (end ${ adjust_point(0.762, 10.16) }) (width 0.25) (layer F.Cu) (net 19))
      (segment (start ${ adjust_point(-4.049999, 9.434999) }) (end ${ adjust_point(-4.775, 10.16) }) (width 0.25) (layer B.Cu) (net 19))
      (segment (start ${ adjust_point(0.036999, 9.434999) }) (end ${ adjust_point(-4.049999, 9.434999) }) (width 0.25) (layer B.Cu) (net 19))
      (segment (start ${ adjust_point(0.762, 10.16) }) (end ${ adjust_point(0.036999, 9.434999) }) (width 0.25) (layer B.Cu) (net 19))
      (segment (start ${ adjust_point(-4.775, 7.62) }) (end ${ adjust_point(-0.762, 7.62) }) (width 0.25) (layer F.Cu) (net 26))
      (segment (start ${ adjust_point(-0.036999, 8.345001) }) (end ${ adjust_point(4.049999, 8.345001) }) (width 0.25) (layer B.Cu) (net 26))
      (segment (start ${ adjust_point(4.049999, 8.345001) }) (end ${ adjust_point(4.775, 7.62) }) (width 0.25) (layer B.Cu) (net 26))
      (segment (start ${ adjust_point(-0.762, 7.62) }) (end ${ adjust_point(-0.036999, 8.345001) }) (width 0.25) (layer B.Cu) (net 26))
      (segment (start ${ adjust_point(-4.775, 5.08) }) (end ${ adjust_point(-0.762, 5.08) }) (width 0.25) (layer F.Cu) (net 27))
      (segment (start ${ adjust_point(-0.036999, 5.805001) }) (end ${ adjust_point(4.049999, 5.805001) }) (width 0.25) (layer B.Cu) (net 27))
      (segment (start ${ adjust_point(4.049999, 5.805001) }) (end ${ adjust_point(4.775, 5.08) }) (width 0.25) (layer B.Cu) (net 27))
      (segment (start ${ adjust_point(-0.762, 5.08) }) (end ${ adjust_point(-0.036999, 5.805001) }) (width 0.25) (layer B.Cu) (net 27))
      (segment (start ${ adjust_point(-4.775, 2.54) }) (end ${ adjust_point(-0.762, 2.54) }) (width 0.25) (layer F.Cu) (net 28))
      (segment (start ${ adjust_point(4.049999, 3.265001) }) (end ${ adjust_point(4.775, 2.54) }) (width 0.25) (layer B.Cu) (net 28))
      (segment (start ${ adjust_point(-0.036999, 3.265001) }) (end ${ adjust_point(4.049999, 3.265001) }) (width 0.25) (layer B.Cu) (net 28))
      (segment (start ${ adjust_point(-0.762, 2.54) }) (end ${ adjust_point(-0.036999, 3.265001) }) (width 0.25) (layer B.Cu) (net 28))
      (segment (start ${ adjust_point(-4.775, 10.16) }) (end ${ adjust_point(-0.762, 10.16) }) (width 0.25) (layer F.Cu) (net 29))
      (segment (start ${ adjust_point(4.049999, 10.885001) }) (end ${ adjust_point(4.775, 10.16) }) (width 0.25) (layer B.Cu) (net 29))
      (segment (start ${ adjust_point(-0.704998, 10.16) }) (end ${ adjust_point(0.020003, 10.885001) }) (width 0.25) (layer B.Cu) (net 29))
      (segment (start ${ adjust_point(0.020003, 10.885001) }) (end ${ adjust_point(4.049999, 10.885001) }) (width 0.25) (layer B.Cu) (net 29))
      (segment (start ${ adjust_point(-0.762, 10.16) }) (end ${ adjust_point(-0.704998, 10.16) }) (width 0.25) (layer B.Cu) (net 29))
      (segment (start ${ adjust_point(0.762, -12.7) }) (end ${ adjust_point(4.775, -12.7) }) (width 0.25) (layer F.Cu) (net 32))
      (segment (start ${ adjust_point(-4.049999, -13.425001) }) (end ${ adjust_point(-4.775, -12.7) }) (width 0.25) (layer B.Cu) (net 32))
      (segment (start ${ adjust_point(0.036999, -13.425001) }) (end ${ adjust_point(-4.049999, -13.425001) }) (width 0.25) (layer B.Cu) (net 32))
      (segment (start ${ adjust_point(0.762, -12.7) }) (end ${ adjust_point(0.036999, -13.425001) }) (width 0.25) (layer B.Cu) (net 32))
      (segment (start ${ adjust_point(-4.775, -7.62) }) (end ${ adjust_point(-0.762, -7.62) }) (width 0.25) (layer F.Cu) (net 33))
      (segment (start ${ adjust_point(-4.775, -5.08) }) (end ${ adjust_point(-0.762, -5.08) }) (width 0.25) (layer F.Cu) (net 33))
      (segment (start ${ adjust_point(4.775, -10.16) }) (end ${ adjust_point(0.762, -10.16) }) (width 0.25) (layer F.Cu) (net 33))
      (segment (start ${ adjust_point(-4.049999, -10.885001) }) (end ${ adjust_point(-4.775, -10.16) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(0.036999, -10.885001) }) (end ${ adjust_point(-4.049999, -10.885001) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(0.762, -10.16) }) (end ${ adjust_point(0.036999, -10.885001) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(4.049999, -6.894999) }) (end ${ adjust_point(4.775, -7.62) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(-0.036999, -6.894999) }) (end ${ adjust_point(4.049999, -6.894999) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(-0.762, -7.62) }) (end ${ adjust_point(-0.036999, -6.894999) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(4.049999, -4.354999) }) (end ${ adjust_point(4.775, -5.08) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(-0.036999, -4.354999) }) (end ${ adjust_point(4.049999, -4.354999) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(-0.762, -5.08) }) (end ${ adjust_point(-0.036999, -4.354999) }) (width 0.25) (layer B.Cu) (net 33))
      (segment (start ${ adjust_point(4.775, -7.62) }) (end ${ adjust_point(0.762, -7.62) }) (width 0.25) (layer F.Cu) (net 34))
      (segment (start ${ adjust_point(-4.049999, -8.345001) }) (end ${ adjust_point(-4.775, -7.62) }) (width 0.25) (layer B.Cu) (net 34))
      (segment (start ${ adjust_point(0.036999, -8.345001) }) (end ${ adjust_point(-4.049999, -8.345001) }) (width 0.25) (layer B.Cu) (net 34))
      (segment (start ${ adjust_point(0.762, -7.62) }) (end ${ adjust_point(0.036999, -8.345001) }) (width 0.25) (layer B.Cu) (net 34))
      (segment (start ${ adjust_point(4.775, -5.08) }) (end ${ adjust_point(0.762, -5.08) }) (width 0.25) (layer F.Cu) (net 35))
      (segment (start ${ adjust_point(0.036999, -5.805001) }) (end ${ adjust_point(-4.049999, -5.805001) }) (width 0.25) (layer B.Cu) (net 35))
      (segment (start ${ adjust_point(-4.049999, -5.805001) }) (end ${ adjust_point(-4.775, -5.08) }) (width 0.25) (layer B.Cu) (net 35))
      (segment (start ${ adjust_point(0.762, -5.08) }) (end ${ adjust_point(0.036999, -5.805001) }) (width 0.25) (layer B.Cu) (net 35))
      (segment (start ${ adjust_point(4.775, 12.7) }) (end ${ adjust_point(0.762, 12.7) }) (width 0.25) (layer F.Cu) (net 36))
      (segment (start ${ adjust_point(-4.049999, 11.974999) }) (end ${ adjust_point(-4.775, 12.7) }) (width 0.25) (layer B.Cu) (net 36))
      (segment (start ${ adjust_point(0.036999, 11.974999) }) (end ${ adjust_point(-4.049999, 11.974999) }) (width 0.25) (layer B.Cu) (net 36))
      (segment (start ${ adjust_point(0.762, 12.7) }) (end ${ adjust_point(0.036999, 11.974999) }) (width 0.25) (layer B.Cu) (net 36))
      (segment (start ${ adjust_point(4.775, 15.24) }) (end ${ adjust_point(0.762, 15.24) }) (width 0.25) (layer F.Cu) (net 37))
      (segment (start ${ adjust_point(-4.049999, 14.514999) }) (end ${ adjust_point(-4.775, 15.24) }) (width 0.25) (layer B.Cu) (net 37))
      (segment (start ${ adjust_point(0.036999, 14.514999) }) (end ${ adjust_point(-4.049999, 14.514999) }) (width 0.25) (layer B.Cu) (net 37))
      (segment (start ${ adjust_point(0.762, 15.24) }) (end ${ adjust_point(0.036999, 14.514999) }) (width 0.25) (layer B.Cu) (net 37))
      (segment (start ${ adjust_point(-4.775, -12.7) }) (end ${ adjust_point(-4.775, -12.725) }) (width 0.25) (layer F.Cu) (net 38))
      (segment (start ${ adjust_point(-0.762, -12.7) }) (end ${ adjust_point(-4.775, -12.7) }) (width 0.25) (layer F.Cu) (net 38))
      (segment (start ${ adjust_point(4.049999, -11.974999) }) (end ${ adjust_point(4.775, -12.7) }) (width 0.25) (layer B.Cu) (net 38))
      (segment (start ${ adjust_point(-0.036999, -11.974999) }) (end ${ adjust_point(4.049999, -11.974999) }) (width 0.25) (layer B.Cu) (net 38))
      (segment (start ${ adjust_point(-0.762, -12.7) }) (end ${ adjust_point(-0.036999, -11.974999) }) (width 0.25) (layer B.Cu) (net 38))
      (segment (start ${ adjust_point(-4.775, -10.16) }) (end ${ adjust_point(-0.762, -10.16) }) (width 0.25) (layer F.Cu) (net 39))
      (segment (start ${ adjust_point(-0.036999, -9.434999) }) (end ${ adjust_point(4.049999, -9.434999) }) (width 0.25) (layer B.Cu) (net 39))
      (segment (start ${ adjust_point(4.049999, -9.434999) }) (end ${ adjust_point(4.775, -10.16) }) (width 0.25) (layer B.Cu) (net 39))
      (segment (start ${ adjust_point(-0.762, -10.16) }) (end ${ adjust_point(-0.036999, -9.434999) }) (width 0.25) (layer B.Cu) (net 39))
      (segment (start ${ adjust_point(-4.775, -2.54) }) (end ${ adjust_point(-0.762, -2.54) }) (width 0.25) (layer F.Cu) (net 40))
      (segment (start ${ adjust_point(4.049999, -1.814999) }) (end ${ adjust_point(4.775, -2.54) }) (width 0.25) (layer B.Cu) (net 40))
      (segment (start ${ adjust_point(-0.036999, -1.814999) }) (end ${ adjust_point(4.049999, -1.814999) }) (width 0.25) (layer B.Cu) (net 40))
      (segment (start ${ adjust_point(-0.762, -2.54) }) (end ${ adjust_point(-0.036999, -1.814999) }) (width 0.25) (layer B.Cu) (net 40))
      (segment (start ${ adjust_point(-4.775, 0) }) (end ${ adjust_point(-0.762, 0) }) (width 0.25) (layer F.Cu) (net 41))
      (segment (start ${ adjust_point(4.049999, 0.725001) }) (end ${ adjust_point(4.775, 0) }) (width 0.25) (layer B.Cu) (net 41))
      (segment (start ${ adjust_point(-0.036999, 0.725001) }) (end ${ adjust_point(4.049999, 0.725001) }) (width 0.25) (layer B.Cu) (net 41))
      (segment (start ${ adjust_point(-0.762, 0) }) (end ${ adjust_point(-0.036999, 0.725001) }) (width 0.25) (layer B.Cu) (net 41))
      (segment (start ${ adjust_point(-4.775, 12.7) }) (end ${ adjust_point(-0.762, 12.7) }) (width 0.25) (layer F.Cu) (net 42))
      (segment (start ${ adjust_point(4.049999, 13.425001) }) (end ${ adjust_point(4.775, 12.7) }) (width 0.25) (layer B.Cu) (net 42))
      (segment (start ${ adjust_point(-0.036999, 13.425001) }) (end ${ adjust_point(4.049999, 13.425001) }) (width 0.25) (layer B.Cu) (net 42))
      (segment (start ${ adjust_point(-0.762, 12.7) }) (end ${ adjust_point(-0.036999, 13.425001) }) (width 0.25) (layer B.Cu) (net 42))
      (segment (start ${ adjust_point(-4.775, 15.24) }) (end ${ adjust_point(-0.762, 15.24) }) (width 0.25) (layer F.Cu) (net 43))
      (segment (start ${ adjust_point(-0.036999, 15.965001) }) (end ${ adjust_point(4.049999, 15.965001) }) (width 0.25) (layer B.Cu) (net 43))
      (segment (start ${ adjust_point(4.049999, 15.965001) }) (end ${ adjust_point(4.775, 15.24) }) (width 0.25) (layer B.Cu) (net 43))
      (segment (start ${ adjust_point(-0.762, 15.24) }) (end ${ adjust_point(-0.036999, 15.965001) }) (width 0.25) (layer B.Cu) (net 43))
      (segment (start ${ adjust_point(-7.62, -12.7) }) (end ${ adjust_point(-5.5, -12.7) }) (width 0.25) (layer F.Cu) (net 44))
      (segment (start ${ adjust_point(-7.62, -12.7) }) (end ${ adjust_point(-5.5, -12.7) }) (width 0.25) (layer B.Cu) (net 44))
      (segment (start ${ adjust_point(7.62, -12.7) }) (end ${ adjust_point(5.5, -12.7) }) (width 0.25) (layer F.Cu) (net 45))
      (segment (start ${ adjust_point(7.62, -12.7) }) (end ${ adjust_point(5.5, -12.7) }) (width 0.25) (layer B.Cu) (net 45))
      (segment (start ${ adjust_point(7.62, -10.16) }) (end ${ adjust_point(5.5, -10.16) }) (width 0.25) (layer F.Cu) (net 46))
      (segment (start ${ adjust_point(7.62, -10.16) }) (end ${ adjust_point(5.5, -10.16) }) (width 0.25) (layer B.Cu) (net 46))
      (segment (start ${ adjust_point(-7.62, -10.16) }) (end ${ adjust_point(-5.5, -10.16) }) (width 0.25) (layer F.Cu) (net 47))
      (segment (start ${ adjust_point(-7.62, -10.16) }) (end ${ adjust_point(-5.5, -10.16) }) (width 0.25) (layer B.Cu) (net 47))
      (segment (start ${ adjust_point(-7.62, -7.62) }) (end ${ adjust_point(-5.5, -7.62) }) (width 0.25) (layer F.Cu) (net 48))
      (segment (start ${ adjust_point(-7.62, -7.62) }) (end ${ adjust_point(-5.5, -7.62) }) (width 0.25) (layer B.Cu) (net 48))
      (segment (start ${ adjust_point(7.62, -7.62) }) (end ${ adjust_point(5.5, -7.62) }) (width 0.25) (layer F.Cu) (net 49))
      (segment (start ${ adjust_point(7.62, -7.62) }) (end ${ adjust_point(5.5, -7.62) }) (width 0.25) (layer B.Cu) (net 49))
      (segment (start ${ adjust_point(-7.62, -5.08) }) (end ${ adjust_point(-5.5, -5.08) }) (width 0.25) (layer F.Cu) (net 50))
      (segment (start ${ adjust_point(-7.62, -5.08) }) (end ${ adjust_point(-5.5, -5.08) }) (width 0.25) (layer B.Cu) (net 50))
      (segment (start ${ adjust_point(7.62, -5.08) }) (end ${ adjust_point(5.5, -5.08) }) (width 0.25) (layer F.Cu) (net 51))
      (segment (start ${ adjust_point(7.62, -5.08) }) (end ${ adjust_point(5.5, -5.08) }) (width 0.25) (layer B.Cu) (net 51))
      (segment (start ${ adjust_point(7.62, -2.54) }) (end ${ adjust_point(5.5, -2.54) }) (width 0.25) (layer F.Cu) (net 52))
      (segment (start ${ adjust_point(7.62, -2.54) }) (end ${ adjust_point(5.5, -2.54) }) (width 0.25) (layer B.Cu) (net 52))
      (segment (start ${ adjust_point(-7.62, -2.54) }) (end ${ adjust_point(-5.5, -2.54) }) (width 0.25) (layer F.Cu) (net 53))
      (segment (start ${ adjust_point(-7.62, -2.54) }) (end ${ adjust_point(-5.5, -2.54) }) (width 0.25) (layer B.Cu) (net 53))
      (segment (start ${ adjust_point(7.62, 0) }) (end ${ adjust_point(5.5, 0) }) (width 0.25) (layer F.Cu) (net 54))
      (segment (start ${ adjust_point(7.62, 0) }) (end ${ adjust_point(5.5, 0) }) (width 0.25) (layer B.Cu) (net 54))
      (segment (start ${ adjust_point(-7.62, 0) }) (end ${ adjust_point(-5.5, 0) }) (width 0.25) (layer F.Cu) (net 55))
      (segment (start ${ adjust_point(-7.62, 0) }) (end ${ adjust_point(-5.5, 0) }) (width 0.25) (layer B.Cu) (net 55))
      (segment (start ${ adjust_point(7.62, 2.54) }) (end ${ adjust_point(5.5, 2.54) }) (width 0.25) (layer F.Cu) (net 56))
      (segment (start ${ adjust_point(7.62, 2.54) }) (end ${ adjust_point(5.5, 2.54) }) (width 0.25) (layer B.Cu) (net 56))
      (segment (start ${ adjust_point(-7.62, 2.54) }) (end ${ adjust_point(-5.5, 2.54) }) (width 0.25) (layer F.Cu) (net 57))
      (segment (start ${ adjust_point(-7.62, 2.54) }) (end ${ adjust_point(-5.5, 2.54) }) (width 0.25) (layer B.Cu) (net 57))
      (segment (start ${ adjust_point(7.62, 5.08) }) (end ${ adjust_point(5.5, 5.08) }) (width 0.25) (layer F.Cu) (net 58))
      (segment (start ${ adjust_point(7.62, 5.08) }) (end ${ adjust_point(5.5, 5.08) }) (width 0.25) (layer B.Cu) (net 58))
      (segment (start ${ adjust_point(-7.62, 5.08) }) (end ${ adjust_point(-5.5, 5.08) }) (width 0.25) (layer F.Cu) (net 59))
      (segment (start ${ adjust_point(-7.62, 5.08) }) (end ${ adjust_point(-5.5, 5.08) }) (width 0.25) (layer B.Cu) (net 59))
      (segment (start ${ adjust_point(7.62, 7.62) }) (end ${ adjust_point(5.5, 7.62) }) (width 0.25) (layer F.Cu) (net 60))
      (segment (start ${ adjust_point(7.62, 7.62) }) (end ${ adjust_point(5.5, 7.62) }) (width 0.25) (layer B.Cu) (net 60))
      (segment (start ${ adjust_point(-7.62, 7.62) }) (end ${ adjust_point(-5.5, 7.62) }) (width 0.25) (layer F.Cu) (net 61))
      (segment (start ${ adjust_point(-7.62, 7.62) }) (end ${ adjust_point(-5.5, 7.62) }) (width 0.25) (layer B.Cu) (net 61))
      (segment (start ${ adjust_point(-7.62, 10.16) }) (end ${ adjust_point(-5.5, 10.16) }) (width 0.25) (layer F.Cu) (net 62))
      (segment (start ${ adjust_point(-7.62, 10.16) }) (end ${ adjust_point(-5.5, 10.16) }) (width 0.25) (layer B.Cu) (net 62))
      (segment (start ${ adjust_point(7.62, 10.16) }) (end ${ adjust_point(5.5, 10.16) }) (width 0.25) (layer F.Cu) (net 63))
      (segment (start ${ adjust_point(7.62, 10.16) }) (end ${ adjust_point(5.5, 10.16) }) (width 0.25) (layer B.Cu) (net 63))
      (segment (start ${ adjust_point(-7.62, 12.7) }) (end ${ adjust_point(-5.5, 12.7) }) (width 0.25) (layer F.Cu) (net 64))
      (segment (start ${ adjust_point(-7.62, 12.7) }) (end ${ adjust_point(-5.5, 12.7) }) (width 0.25) (layer B.Cu) (net 64))
      (segment (start ${ adjust_point(7.62, 12.7) }) (end ${ adjust_point(5.5, 12.7) }) (width 0.25) (layer F.Cu) (net 65))
      (segment (start ${ adjust_point(7.62, 12.7) }) (end ${ adjust_point(5.5, 12.7) }) (width 0.25) (layer B.Cu) (net 65))
      (segment (start ${ adjust_point(-7.62, 15.24) }) (end ${ adjust_point(-5.5, 15.24) }) (width 0.25) (layer F.Cu) (net 66))
      (segment (start ${ adjust_point(-7.62, 15.24) }) (end ${ adjust_point(-5.5, 15.24) }) (width 0.25) (layer B.Cu) (net 66))
      (segment (start ${ adjust_point(7.62, 15.24) }) (end ${ adjust_point(5.5, 15.24) }) (width 0.25) (layer F.Cu) (net 67))
      (segment (start ${ adjust_point(7.62, 15.24) }) (end ${ adjust_point(5.5, 15.24) }) (width 0.25) (layer B.Cu) (net 67))
    )
    `
    }
  }
