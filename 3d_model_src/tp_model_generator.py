#!/usr/bin/env python3

import math
import os
import build123d as bd


ALIGN_CENTER = (
    bd.Align.CENTER,
    bd.Align.CENTER,
    bd.Align.CENTER,
)

ALIGN_CENTER_BOTTOM = (
    bd.Align.CENTER,
    bd.Align.CENTER,
    bd.Align.MIN,
)

ALIGN_CENTER_TOP = (
    bd.Align.CENTER,
    bd.Align.CENTER,
    bd.Align.MAX,
)

COLOR_SILVER = bd.Color(0xC0C0C0)

DEFAULT_KB_PCB_HEIGHT = 1.6


class TrackPointRedT460S(bd.Compound):

    metal_thickness = 0.4
    screw_mount_height_increase = 0.2
    screw_mount_height = (
        metal_thickness + screw_mount_height_increase
    )

    metal_frame_width = 12.5

    fpc_len_between_sensor_pcb = 16.0
    fpc_thickness = 0.1

    platform_height_total = 1.2
    platform_height_actual = (
        platform_height_total - metal_thickness
        - fpc_thickness
    )
    platform_diameter = 8
    platform_radius = 4

    adapter_width = 2.2
    adapter_height = 2.7

    pcb_width = 15.8
    pcb_length = 34.2
    pcb_thickness = 0.5
    pcb_chip_height = 1.0
    pcb_total_height = (
        pcb_thickness + pcb_chip_height
    )
    pcb_fpc_edge_distance = 12.5

    def __init__(self, pcb_vert_offset=0, z_offset=0):
        tp_sensor = self._build_tp_sensor()
        tp_fpc = self._build_sensor_fpc_cable(pcb_vert_offset)

        tp_pcb = self._build_pcb()
        tp_pcb.move(self._get_pcb_location(pcb_vert_offset))

        super().__init__(
            label='TrackPoint: T460S',
            children=[
                tp_sensor,
                tp_fpc,
                tp_pcb,
            ]
        )

        self.move(bd.Location((0, 0, z_offset)))

    @classmethod
    def build_tp_aligned_to_platform(cls,
                                     pcb_vert_offset=0,
                                     kb_pcb_height=DEFAULT_KB_PCB_HEIGHT,
                                     z_offset=0):
        '''
        Alignes the top of the pcb (including chips) with the round
        platform and then moves the TP down so that the platform top
        is at z=-1.6.

        Use this method to generate a TP that you want to mount to the
        PCB with the platform touching the PCB.

        You can use pcb_vert_offset=-2 to move the PCB above hotswap
        sockets.
        '''

        final_pcb_vert_offset = (
            0
            + cls.platform_height_total
            - cls.pcb_total_height
            + pcb_vert_offset
        )
        final_z_offset = (
            0
            - cls.platform_height_total
            - kb_pcb_height
            + z_offset
        )

        tp = cls(
            pcb_vert_offset=final_pcb_vert_offset,
            z_offset=final_z_offset
        )

        return tp

    @classmethod
    def build_tp_aligned_to_screw_mount(cls,
                                        pcb_vert_offset=0,
                                        kb_pcb_height=DEFAULT_KB_PCB_HEIGHT,
                                        z_offset=0):
        '''
        Alignes the top of the pcb (including chips) with the metal screw
        mount and then moves the TP down so that the platform top is at
        z=-1.6.

        Use this method to generate a TP that you want to mount to the
        PCB with the screw mounting touching the PCB.

        But keep in mind that the round platform is 0.6mm higher than the
        screw mount and is 8mm wide. So you need to cut a very big hole
        into the pcb.

        You can use pcb_vert_offset=-2 to move the PCB above hotswap
        sockets.
        '''

        final_pcb_vert_offset = (
            0
            + cls.screw_mount_height
            - cls.pcb_total_height
            + pcb_vert_offset
        )
        final_z_offset = (
            0
            - cls.screw_mount_height
            - kb_pcb_height
            + z_offset
        )

        tp = cls(
            pcb_vert_offset=final_pcb_vert_offset,
            z_offset=final_z_offset
        )

        return tp

    def print_sizes(self):
        sensor = self._get_part_with_label(self, 'TP Sensor')
        sensor_frame = self._get_part_with_label(sensor, 'Metal Frame')
        sensor_platform = self._get_part_with_label(sensor, 'Round Platform')
        pcb = self._get_part_with_label(self, 'TP PCB')

        sensor_children_without_adapter = [
            c.copy()
            for c in sensor.children
            if c.label != 'White Cap Adapter'
        ]

        tp_sensor_no_adapter = bd.Compound(
            label='TP Sensor (Without Adapter)',
            children=sensor_children_without_adapter
        )

        print(
            f'Sensor size: {sensor.bounding_box().size}\n'
            f'Sensor size without white adapter: '
            f'{tp_sensor_no_adapter.bounding_box().size}\n'
            f'Metal frame size: {sensor_frame.bounding_box().size}\n'
            f'Platform size: {sensor_platform.bounding_box().size}\n'
            f'PCB size: {pcb.bounding_box().size}\n'
        )

    def _build_tp_sensor(self):
        metal_frame = self._build_sensor_metal_frame(self.metal_thickness)
        platform = self._build_sensor_platform(
            self.platform_height_actual,
            self.platform_diameter,
        )
        platform.move(bd.Location((0, 0, self.metal_thickness)))

        adapter = self._build_sensor_adapter(
            self.adapter_width,
            self.adapter_height,
        )
        adapter.move(bd.Location((0, 0, self.platform_height_total)))

        platform_screws = self._build_sensor_platform_screws(
            height=(self.platform_height_total)
        )

        tp_sensor_assembly = bd.Compound(
            label='TP Sensor',
            children=[
                metal_frame,
                platform,
                adapter,
                platform_screws,
            ]
        )

        return tp_sensor_assembly

    def _build_sensor_fpc_cable(self, pcb_vertical_offset=0):
        fpc_width_sensor = 3.0
        fpc_width_sensor_h = fpc_width_sensor / 2
        fpc_width = 5.0
        fpc_width_h = fpc_width / 2
        fpc_width_pcb = 11
        fpc_width_pcb_h = fpc_width_pcb / 2

        fpc_len_widening = 1.0

        point_fpc_main_start_xz, point_fpc_main_end_xz = self._get_fpc_points(
            pcb_vertical_offset
        )

        point_fpc_main_widening = self._calc_point_on_line_at_length(
            length=fpc_len_widening,
            point_a=point_fpc_main_start_xz,
            point_b=point_fpc_main_end_xz,
        )

        fpc_len_on_pcb = 4.0
        pcb_offset_cable = (
            point_fpc_main_end_xz[0] + fpc_len_on_pcb
        )

        fpc_contacts_len = 0.75
        fpc_contacts_width = 0.5
        fpc_contacts_spacing = 2.0
        fpc_contacts_count = 4

        pcb_offset_cable_contacts = pcb_offset_cable + fpc_contacts_len

        fpc_line = [
            (
                -self.platform_radius,
                0,
                self.platform_height_total - self.fpc_thickness
            ),
            (
                0,
                0,
                self.platform_height_total - self.fpc_thickness
            ),
            (
                0,
                fpc_width_sensor_h,
                self.platform_height_total - self.fpc_thickness
            ),
            (
                self.platform_radius,
                fpc_width_sensor_h,
                self.platform_height_total - self.fpc_thickness
            ),
            (
                self.platform_radius + 0.7,
                fpc_width_sensor_h,
                self.metal_thickness
            ),
            (
                point_fpc_main_start_xz[0],
                fpc_width_sensor_h,
                point_fpc_main_start_xz[1]
            ),
            (
                point_fpc_main_widening[0],
                fpc_width_h,
                point_fpc_main_widening[1]
            ),
            (
                point_fpc_main_end_xz[0],
                fpc_width_h,
                point_fpc_main_end_xz[1]
            ),
            (
                point_fpc_main_end_xz[0],
                fpc_width_pcb_h,
                point_fpc_main_end_xz[1]
            ),
            (
                pcb_offset_cable_contacts,
                fpc_width_pcb_h,
                point_fpc_main_end_xz[1]
            ),
            (
                pcb_offset_cable_contacts,
                0,
                point_fpc_main_end_xz[1]
            )
        ]

        fpc_points_xz = self._get_points_for_axes(fpc_line, 'x', 'z')
        fpc_points_xy = self._get_points_for_axes(fpc_line, 'x', 'y')

        with bd.BuildPart() as fpc:
            with bd.BuildLine(bd.Plane.XZ):
                bd.Polyline(fpc_points_xz)
            bd.make_brake_formed(
                thickness=self.fpc_thickness,
                station_widths=fpc_width * 2,
                side=bd.Side.LEFT,
            )
            bd.mirror(about=bd.Plane.XZ)

            with bd.BuildSketch(bd.Plane.XY.offset(5)):

                # We create a large rectangle that will subtract from the cable
                bd.Rectangle(
                    width=100,
                    height=50,
                )

                # Then we cut holes into that rectangle, which will not be
                # subsacted from the FPC cable, such as the platform circle
                bd.Circle(
                    self.platform_radius,
                    mode=bd.Mode.SUBTRACT,
                )

                # And the XY outline of the cable
                with bd.BuildLine() as ln:
                    bd.Polyline(fpc_points_xy)
                bd.mirror(ln.line, about=bd.Plane.XZ)
                bd.make_face(mode=bd.Mode.SUBTRACT)

                # And the solder contacts
                with bd.Locations((pcb_offset_cable, 0)):
                    # First fill the stencil with a rect where the contacts
                    # will be
                    bd.Rectangle(
                        width=fpc_contacts_len,
                        height=fpc_width_pcb,
                        align=(bd.Align.MIN, bd.Align.CENTER),
                        mode=bd.Mode.ADD,
                    )

                    # And then cut out the actual contacts from it
                    solder_contact_locs = bd.GridLocations(
                        x_spacing=0,
                        y_spacing=fpc_contacts_spacing,
                        x_count=1,
                        y_count=fpc_contacts_count,
                    )
                    with solder_contact_locs:
                        bd.Rectangle(
                            width=fpc_contacts_len,
                            height=fpc_contacts_width,
                            align=(bd.Align.MIN, bd.Align.CENTER),
                            mode=bd.Mode.SUBTRACT,
                        )

                bd.Rectangle(
                    width=self.adapter_width + 0.2,
                    height=self.adapter_width + 0.2,
                )
            bd.extrude(
                amount=20,
                both=True,
                mode=bd.Mode.SUBTRACT,
            )

        # Workaround for strange bug where the location changes at higher
        # offset values
        if pcb_vertical_offset > 3.0:
            fpc.part.move(bd.Location((0, 0, self.fpc_thickness)))

        fpc.part.color = bd.Color('orange')
        fpc.part.label = 'TP FPC Cable'

        return fpc.part

    def _build_pcb(self):
        pcb_board = self._build_pcb_board()
        solder_pads = self._build_pcb_solder_pads()
        chip_large = self._build_pcb_chip_large()
        chip_small = self._build_pcb_chip_small()

        tp_pcb_assembly = bd.Compound(
            label='TP PCB',
            children=[
                pcb_board,
                solder_pads,
                chip_large,
                chip_small,
            ]
        )

        return tp_pcb_assembly

    def _build_pcb_board(self):
        pcb_screw_cutout_radius = 1.0
        pcb_ridge_spacing = 23.5
        pcb_ridge_holes = 3
        pcb_ridge_hole_spacing = 1.0
        pcb_ridge_hole_radius = 0.3

        with bd.BuildPart() as pcb:
            with bd.BuildSketch():
                bd.Rectangle(
                    width=self.pcb_width,
                    height=self.pcb_length,
                )

                # Screw Cutouts
                screw_cutout_locs = bd.GridLocations(
                    x_spacing=0, y_spacing=self.pcb_length,
                    x_count=1, y_count=2,
                )
                with screw_cutout_locs:
                    bd.Circle(
                        radius=pcb_screw_cutout_radius,
                        mode=bd.Mode.SUBTRACT,
                    )

                # Ridges
                ridge_locs = bd.GridLocations(
                    x_spacing=self.pcb_width, y_spacing=pcb_ridge_spacing,
                    x_count=2, y_count=2,
                )
                with ridge_locs:
                    ridge_hole_locs = bd.GridLocations(
                        x_spacing=0, y_spacing=pcb_ridge_hole_spacing,
                        x_count=1, y_count=pcb_ridge_holes,
                    )
                    with ridge_hole_locs:
                        bd.Circle(
                            radius=pcb_ridge_hole_radius,
                            mode=bd.Mode.SUBTRACT,
                        )

            bd.extrude(amount=self.pcb_thickness)

            # Cut holes for solder pads so that they can be flush with the
            # board.
            bd.add(
                self._build_pcb_solder_pads(),
                mode=bd.Mode.SUBTRACT,
            )

        pcb.part.color = bd.Color('red')
        pcb.part.label = 'Board'

        return pcb.part

    def _build_pcb_solder_pads(self):
        solder_pad_height = 0.1
        ffc_pad_count = 8
        ffc_pad_len = 2.0
        ffc_pad_width = 0.5
        ffc_pad_spacing = 1.0
        ffc_pad_edge_distance_x = 4.5
        ffc_pad_edge_distance_y = 3.0 + ffc_pad_len/2

        sensor_pad_count = 4
        sensor_pad_len = 2.0
        sensor_pad_width = 1.5
        sensor_pad_spacing = 2.0
        sensor_pad_edge_distance_x = 3.5 + sensor_pad_width/2
        sensor_pad_edge_distance_y = 12.5

        with bd.BuildPart() as solder_pads:

            # FFC Pads
            ffc_pad_loc = (
                -self.pcb_width/2 + ffc_pad_edge_distance_x,
                self.pcb_length/2 - ffc_pad_edge_distance_y,
                solder_pad_height,
            )
            with bd.Locations(ffc_pad_loc):
                ffc_pad_grid_loc = bd.GridLocations(
                    x_spacing=ffc_pad_spacing,
                    y_spacing=0,
                    x_count=ffc_pad_count,
                    y_count=1,
                )
                with ffc_pad_grid_loc:
                    bd.Box(
                        length=ffc_pad_width,
                        width=ffc_pad_len,
                        height=solder_pad_height,
                        align=ALIGN_CENTER_TOP,
                    )

            # Sensor FPC Pads
            sensor_pad_loc = (
                -self.pcb_width/2 + sensor_pad_edge_distance_x,
                self.pcb_length/2 - sensor_pad_edge_distance_y,
                solder_pad_height,
            )
            with bd.Locations(sensor_pad_loc):
                sensor_pad_grid_loc = bd.GridLocations(
                    x_spacing=0,
                    y_spacing=sensor_pad_spacing,
                    x_count=1,
                    y_count=sensor_pad_count,
                )
                with sensor_pad_grid_loc:
                    bd.Box(
                        length=sensor_pad_len,
                        width=sensor_pad_width,
                        height=solder_pad_height,
                        align=ALIGN_CENTER_TOP,
                    )

        solder_pads.part.color = COLOR_SILVER
        solder_pads.part.label = 'Solder Pads'

        return solder_pads.part

    def _build_pcb_chip_large(self):
        chip_edge_distance_x = 2.0
        chip_edge_distance_y = 2.0

        chip = self._build_pcb_chip(
            width=6.0,
            length=11.0,
            height=self.pcb_chip_height,
            pin_count=16,
        )

        chip_size = chip.bounding_box().size
        chip_loc = bd.Location((
            self.pcb_width/2 - chip_edge_distance_x - chip_size.X/2,
            -self.pcb_length/2 + chip_edge_distance_y + chip_size.Y/2,
            0
        ))
        chip.move(chip_loc)

        chip.label = 'Large Chip'

        return chip

    def _build_pcb_chip_small(self):
        chip_edge_distance_x = 6.0
        chip_edge_distance_y = 6.0

        chip = self._build_pcb_chip(
            width=3.0,
            length=3.0,
            height=self.pcb_chip_height,
            pin_count=4,
        )

        chip_size = chip.bounding_box().size
        chip_loc = bd.Location(
            (
                self.pcb_width/2 - chip_edge_distance_x - chip_size.Y/2,
                self.pcb_length/2 - chip_edge_distance_y - chip_size.X/2,
                0
            ),
            (
                0,
                0,
                90,
            )
        )
        chip.move(chip_loc)

        chip.label = 'Small Chip'

        return chip

    def _build_pcb_chip(self,
                        width,
                        length,
                        height,
                        pin_count,
                        color=bd.Color("black")):

        with bd.BuildPart() as chip:
            bd.Box(
                width=length,
                length=width,
                height=height,
                align=ALIGN_CENTER_BOTTOM,
            )

        leg_length = 1.0
        leg_width = 0.4
        leg_height = height * 0.7
        leg_spacing = 0.7
        leg_row_spacing = width + leg_length

        with bd.BuildPart() as legs:
            leg_locations = bd.GridLocations(
                x_spacing=leg_row_spacing,
                y_spacing=leg_spacing,
                x_count=2,
                y_count=pin_count,
            )
            with leg_locations:
                bd.Box(
                    length=leg_length,
                    width=leg_width,
                    height=leg_height,
                    align=ALIGN_CENTER_BOTTOM,
                )

        chip.part.color = color
        chip.part.label = 'Body'
        legs.part.color = COLOR_SILVER
        legs.part.label = 'Legs'

        chip_assembly = bd.Compound(
            label='Chip',
            children=[
                chip.part,
                legs.part,
            ]
        )

        chip_assembly.move(bd.Location((0, 0, self.pcb_thickness)))

        return chip_assembly

    def _build_sensor_metal_frame(self, metal_thickness=None):

        if metal_thickness is None:
            metal_thickness = self.metal_thickness

        with bd.BuildPart() as hexagon:
            with bd.BuildSketch():
                with bd.BuildLine() as ln:
                    pts = [
                        (-6.25, 0),
                        (-6.25, 3),
                        (-2.75, 6.5),
                        (2.75, 6.5),
                        (0, 6.5),
                    ]
                    bd.Polyline(*pts)
                    bd.mirror(ln.line, about=bd.Plane.YZ)
                    bd.mirror(ln.line, about=bd.Plane.XZ)
                bd.make_face()
            bd.extrude(amount=metal_thickness)

            bd.add(
                self._build_sensor_platform_screws(metal_thickness+0.5),
                mode=bd.Mode.SUBTRACT,
            )

            bottom_face = hexagon.faces().sort_by(bd.Axis.Z)[0]
            hole_edges = bottom_face.edges().filter_by(bd.GeomType.CIRCLE)
            bd.chamfer(hole_edges, length=0.1)

        screw_mount_width = 5.5
        screw_mount_hole_diameter = 1.6
        screw_mount_hole_radius = screw_mount_hole_diameter / 2
        screw_mount_hole_rim_diameter = 2.0
        screw_mount_hole_rim_radius = screw_mount_hole_rim_diameter / 2
        screw_mount_hole_rim_height = 0.6

        # Since this is a super important piece, we locate it using
        # absolute coordinates.
        screw_mount_screw_hole_distance = 19.5
        screw_mount_hole_abs_y = -screw_mount_screw_hole_distance / 2
        screw_mount_hole_abs_loc = (0, screw_mount_hole_abs_y)

        screw_mount_ridge_radius = 0.25
        screw_mount_ridge_locs = [
            (screw_mount_width/2, screw_mount_hole_abs_y),
            (-screw_mount_width/2, screw_mount_hole_abs_y)
        ]

        with bd.BuildPart() as screw_mount:
            with bd.BuildLine(bd.Plane.YZ):
                bd.Polyline(
                    (-11.5, self.screw_mount_height_increase),
                    (-7.0, self.screw_mount_height_increase),
                    (-6.5, 0),
                    (-6, 0, 0),
                )
            bd.make_brake_formed(
                thickness=metal_thickness,
                station_widths=screw_mount_width / 2,
                side=bd.Side.LEFT,
            )
            bd.mirror(about=bd.Plane.YZ)

            # Cut screw hole
            screw_mount_face = screw_mount.faces().sort_by(bd.Axis.Z)[-1]
            screw_mount_face_z = screw_mount_face.center().Z
            screw_hole_abs_plane = bd.Plane.XY.offset(screw_mount_face_z)
            with bd.BuildSketch(screw_hole_abs_plane):
                with bd.Locations(screw_mount_hole_abs_loc):
                    bd.Circle(
                        radius=screw_mount_hole_radius,
                    )
            bd.extrude(
                amount=-metal_thickness,
                mode=bd.Mode.SUBTRACT,
                both=True,
            )

            # Create screw hole rim
            with bd.BuildSketch(screw_hole_abs_plane):
                with bd.Locations(screw_mount_hole_abs_loc):
                    bd.Circle(
                        radius=screw_mount_hole_rim_radius
                    )
                    bd.Circle(
                        radius=screw_mount_hole_radius,
                        mode=bd.Mode.SUBTRACT
                    )
            bd.extrude(
                amount=-screw_mount_hole_rim_height,
                mode=bd.Mode.ADD,
            )

            # Create little ridges
            with bd.BuildSketch(screw_hole_abs_plane):
                with bd.Locations(screw_mount_ridge_locs):
                    bd.Circle(
                        radius=screw_mount_ridge_radius
                    )
            bd.extrude(
                amount=-metal_thickness,
                mode=bd.Mode.SUBTRACT,
            )

            bd.mirror(about=bd.Plane.XZ)

        with bd.BuildPart() as metal_frame:
            bd.add([
                screw_mount,
                hexagon,
            ])

        metal_frame.part.color = COLOR_SILVER
        metal_frame.part.label = 'Metal Frame'

        return metal_frame.part

    def _build_sensor_platform(self, height, diameter):

        radius = diameter / 2

        with bd.BuildPart() as platform:
            bd.Cylinder(
                radius=radius,
                height=height,
                align=ALIGN_CENTER_BOTTOM,
            )

            # Cut hole for four screws
            bd.add(
                self._build_sensor_platform_screws(height),
                mode=bd.Mode.SUBTRACT
            )

        platform.part.color = bd.Color('black')
        platform.part.label = 'Round Platform'

        return platform.part

    def _build_sensor_adapter(self, width, height):

        # We make the platform smaller by the fpc cable thickness.
        # So, here we compensate for that to get to the correct final
        # height.
        final_height = height + self.fpc_thickness

        with bd.BuildPart() as adapter:
            bd.Box(
                length=width,
                width=width,
                height=final_height,
                align=ALIGN_CENTER_BOTTOM,
            )

        adapter.part.color = bd.Color('white')
        adapter.part.label = 'White Cap Adapter'

        return adapter.part

    def _build_sensor_platform_screws(self, height):
        with bd.BuildPart(mode=bd.Mode.SUBTRACT) as screws:
            with bd.BuildSketch():
                with bd.GridLocations(4.5, 4.5, 2, 2):
                    bd.Circle(radius=0.5)
            bd.extrude(
                amount=height,
            )

        screws.part.color = COLOR_SILVER
        screws.part.label = 'Platform Screws'

        return screws.part

    def _calc_distance_for_vert_offset(self, vert_offset, diagonal_line_len):

        pythagoras_a = vert_offset
        pythagoras_c = diagonal_line_len

        if pythagoras_a > pythagoras_c:
            raise ValueError(
                'The vertical offset cannot be longer than the diagonal line '
                ' length'
            )

        pythagoras_b = math.sqrt(pythagoras_c**2 - pythagoras_a**2)

        return pythagoras_b

    def _calc_offset_point(self, start_point, line_length, vertical_offset):

        distance = self._calc_distance_for_vert_offset(
            vertical_offset,
            line_length,
        )

        start_point_x, start_point_y = start_point
        offset_point = (
            start_point_x + distance,
            start_point_y + vertical_offset
        )

        return offset_point

    def _calc_point_on_line_at_length(self, length, point_a, point_b):
        x1, y1 = point_a
        x2, y2 = point_b

        total_distance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

        if length > total_distance:
            raise ValueError(
                'The specified length is greater than the distance between '
                'the points.'
            )

        proportion = length / total_distance

        x = x1 + proportion * (x2 - x1)
        y = y1 + proportion * (y2 - y1)

        return (x, y)

    def _get_fpc_points(self, pcb_vertical_offset):
        # We always need to bring the fpc cable down from the metal part.
        # And on top of that the pcb can also be offset.
        fpc_vertical_offset = (
            0 - self.metal_thickness + pcb_vertical_offset
        )

        # The points between the metal frame and pcb that the
        # fpc cable connects (on the xz axes)
        point_fpc_main_start_xz = (
            self.metal_frame_width / 2,
            self.metal_thickness
        )

        point_fpc_main_end_xz = self._calc_offset_point(
            start_point=point_fpc_main_start_xz,
            line_length=self.fpc_len_between_sensor_pcb,
            vertical_offset=fpc_vertical_offset,
        )

        return (point_fpc_main_start_xz, point_fpc_main_end_xz)

    def _get_pcb_location(self, pcb_vertical_offset):
        _, end_point = self._get_fpc_points(pcb_vertical_offset)

        y_loc = -(self.pcb_length/2 - self.pcb_fpc_edge_distance)

        pcb_loc = bd.Location((
            end_point[0] + self.pcb_width/2,
            y_loc,
            end_point[1] + self.fpc_thickness
        ))

        return pcb_loc

    def _get_points_for_axes(self, points, axis_1, axis_2):
        allowed_axes = ['x', 'y', 'z']
        if axis_1 not in allowed_axes or axis_2 not in allowed_axes:
            raise ValueError(
                f'Axes have to be one of these: {", ".join(allowed_axes)}'
            )

        index_1 = allowed_axes.index(axis_1)
        index_2 = allowed_axes.index(axis_2)

        new_points = []
        for point in points:
            point_new = (point[index_1], point[index_2])

            # If the point is the same as the previous point, then
            # skip it
            try:
                prev_point = new_points[-1]
                if point_new == prev_point:
                    continue
            except IndexError:
                pass

            new_points.append(point_new)

        return new_points

    def _get_part_with_label(self, compound, label):
        for child in compound.children:
            if child.label == label:
                return child

        return None


def gen_step_screw_mount(z_offset, pcb_vert_offset):
    file_name = (
        f'TP_Red_T460S_screw_mount_z_offset_{z_offset:+.1f}_'
        f'pcb_{pcb_vert_offset:+.1f}.step'
    )

    print(f'Generating {file_name}...')
    tp = TrackPointRedT460S.build_tp_aligned_to_screw_mount(
        z_offset=z_offset,
        pcb_vert_offset=pcb_vert_offset,
    )

    path = os.path.join('export/', file_name)
    bd.export_step(tp, path)


def gen_step_platform(z_offset, pcb_vert_offset):
    file_name = (
        f'TP_Red_T460S_platform_z_offset_{z_offset:+.1f}'
        f'_pcb_offset_{pcb_vert_offset:+.1f}.step'
    )

    print(f'Generating {file_name}...')
    tp = TrackPointRedT460S.build_tp_aligned_to_platform(
        z_offset=z_offset,
        pcb_vert_offset=pcb_vert_offset,
    )

    path = os.path.join('export/', file_name)
    bd.export_step(tp, path)


def gen_kicad_models():
    print('Generating KiCad models...')
    gen_step_screw_mount(z_offset=0, pcb_vert_offset=-2)
    gen_step_screw_mount(z_offset=-2.0, pcb_vert_offset=0)
    gen_step_platform(z_offset=0, pcb_vert_offset=-2)


def main():
    gen_kicad_models()


if __name__ == "__main__":
    main()
