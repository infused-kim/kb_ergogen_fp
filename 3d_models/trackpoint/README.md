# Trackpoint 3D Models

## Keycaps

To use these keycaps, you have to create separate footprint config items for the 4 switches around the TrackPoint.

Since the TP hole cut is exactly between all keys and the MBK keycap is symmetrical, you only need two keycap models. You just have to rotate them correctly for each key.

Here is a simplified example config:

```yaml
[...]
pcbs:
  your_keeb:
    [...]
    footprints:
      [...]

      # Keys around trackpoint mount
      choc_tp_index_top:
        what: infused-kim/choc
        where: matrix_index_top
        params:
          keycap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Keycap_MBK_Black_stagger_2.375_small.step'
          keycap_3dmodel_xyz_rotation: [0, 0, 0]


      choc_tp_index_home:
        what: infused-kim/choc
        where: matrix_index_home
        params:
          keycap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Keycap_MBK_Black_stagger_2.375_large.step'
          keycap_3dmodel_xyz_rotation: [0, 0, 180]

      choc_tp_inner_top:
        what: infused-kim/choc
        where: matrix_inner_top
        params:
          keycap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Keycap_MBK_Black_stagger_2.375_large.step'
          keycap_3dmodel_xyz_rotation: [0, 0, 180]

      choc_tp_inner_home:
        what: infused-kim/choc
        where: matrix_inner_home
        params:
          keycap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/trackpoint/TP_Keycap_MBK_Black_stagger_2.375_small.step'
          keycap_3dmodel_xyz_rotation: [0, 0, 180]
```

### Create custom keycaps for different staggers

The keycaps included here are for the 2.375mm stagger that is used by the corne and many other keyboards.

If your keyboard uses a different stagger for the two inner rows, then you will need to create keycaps cut for it.

You can do it using [my TrackPoint keycap cutter script](https://github.com/infused-kim/kb_keycaps_trackpoint).

It supports MBK and Chicago Stenographer keycaps. And you can easily add support for other keycaps.

But it uses OpenSCAD, which can't generate STEP files, which KiCad needs.

But you can use the free version of Fusion360 to convert STL into STEP files.

#### Convert from STL to Step

* Create a new file
  * Do not open the STL directly. That will mess up the units
* Select the `Mesh` tab on the top toolbar
* Select `Insert Mesh` (first icon)
  * Select the STL file and click `Open`
  * This will load the model and show a `Insert Mesh` window
  * Make sure the `Unit Type` is set to `Millimeter`
  * Press the `OK` button
* Select `Modify -> Convert Mash`
    * Click on the keycap
    * Set the settings:
        * Operation: `Parametric`
        * Method: `Faceted` (First Icon)
    * Press `OK`
* Change the color of the keycap
    * Select `Modify -> Appearance`
    * In the list find `Plastic -> Nylon 12 (with Formlabs Fuse 1 3D Printer)` (to get the same black color as the other keycaps)
    * Drag it on top of the keycap
* Export it using `File -> Export` (select step as the format)
