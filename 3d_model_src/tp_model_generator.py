#!/usr/bin/env python3
import math
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


class TrackPointRedT460S():
    def __init__(
        self,
        rotation: bd.RotationLike = (0, 0, 0),
        align: bd.Union[
            bd.Align,
            tuple[bd.Align, bd.Align, bd.Align]
        ] = ALIGN_CENTER,
        mode: bd.Mode = bd.Mode.ADD,
    ):
        self.metal_thickness = 0.4
        self.metal_frame_width = 12.5

        self.platform_height_total = 1.2
        self.platform_height_actual = (
            self.platform_height_total - self.metal_thickness
        )
        self.platform_diameter = 8
        self.platform_radius = 4

        self.adapter_width = 2.2
        self.adapeter_height = 2.7

        return None

    def build_tp(self, pcb_vert_offset=0, z_offset=None):
        tp_sensor = self.build_tp_sensor(z_offset=z_offset)
        tp_fpc = self.build_sensor_fpc_cable(pcb_vert_offset)

        tp_assembly = bd.Compound(
            label='TrackPoint',
            children=[
                tp_sensor,
                tp_fpc,
            ]
        )

        return tp_assembly

    def build_tp_sensor(self, z_offset=None):
        metal_frame = self._build_sensor_metal_frame(self.metal_thickness)
        platform = self._build_sensor_platform(
            self.platform_height_actual,
            self.platform_diameter,
            z_offset=self.metal_thickness,
        )
        adapter = self._build_sensor_adapter(
            self.adapter_width,
            self.adapeter_height,
            z_offset=(self.platform_height_total),
        )
        platform_screws = self._build_sensor_platform_screws(
            height=(self.platform_height_total)
        )

        tp_sensor_assembly = bd.Compound(
            label='TrackPoint Sensor',
            children=[
                metal_frame,
                platform,
                adapter,
                platform_screws,
            ]
        )

        if z_offset is None:
            pcb_height_default = 1.6
            z_offset = -(self.platform_height_total + pcb_height_default)
        tp_sensor_assembly.move(bd.Location((0, 0, z_offset)))

        return tp_sensor_assembly

    def build_sensor_fpc_cable(self, pcb_vertical_offset=0):
        fpc_thickness = 0.1

        fpc_width_sensor = 3.0
        fpc_width_sensor_h = fpc_width_sensor / 2
        fpc_width = 5.0
        fpc_width_h = fpc_width / 2
        fpc_width_pcb = 11
        fpc_width_pcb_h = fpc_width_pcb / 2

        fpc_len_widening = 1.0
        fpc_len_between_sensor_pcb = 15.0

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
            line_length=fpc_len_between_sensor_pcb,
            vertical_offset=fpc_vertical_offset,
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
                self.platform_height_total
            ),
            (
                0,
                0,
                self.platform_height_total
            ),
            (
                0,
                fpc_width_sensor_h,
                self.platform_height_total
            ),
            (
                self.platform_radius,
                fpc_width_sensor_h,
                self.platform_height_total
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
                thickness=fpc_thickness,
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
        # TODO: Figure out proper way to set correct location
        fpc.part.move(bd.Location((0, 0, -self.adapeter_height)))

        fpc.part.color = bd.Color('orange')
        fpc.part.label = 'TrackPoint FPC Cable'

        return fpc.part

    def _build_sensor_metal_frame(self, metal_thickness):

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

        screw_mount_height_increase = 0.2
        screw_mount_width = 5.5
        screw_mount_hole_diameter = 1.6
        screw_mount_hole_radius = screw_mount_hole_diameter / 2
        screw_mount_hole_rim_diameter = 2.0
        screw_mount_hole_rim_radius = screw_mount_hole_rim_diameter / 2
        screw_mount_hole_rim_height = 0.7

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
                    (-11.5, screw_mount_height_increase),
                    (-7.0, screw_mount_height_increase),
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

    def _build_sensor_platform(self, height, diameter, z_offset):

        radius = diameter / 2

        with bd.BuildPart() as platform:
            with bd.Locations((0, 0, z_offset)):
                bd.Cylinder(
                    radius=radius,
                    height=height,
                    align=ALIGN_CENTER_BOTTOM,
                )

            # Cut hole for four screws
            bd.add(
                self._build_sensor_platform_screws(height + z_offset),
                mode=bd.Mode.SUBTRACT
            )

        platform.part.color = bd.Color('black')
        platform.part.label = 'Round Platform'

        return platform.part

    def _build_sensor_adapter(self, width, height, z_offset):
        with bd.BuildPart() as adapter:
            with bd.Locations((0, 0, z_offset)):
                bd.Box(
                    length=width,
                    width=width,
                    height=height,
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
        screws.part.label = 'TrackPoint Sensos - Platform Screws'

        return screws.part

    def _calc_offset_point(self, start_point, line_length, vertical_offset):
        pythagoras_a = vertical_offset
        pythagoras_c = line_length

        if pythagoras_a > pythagoras_c:
            raise ValueError(
                'The vertical offset cannot be longer than the diagonal line '
                ' length'
            )

        pythagoras_b = math.sqrt(pythagoras_c**2 - pythagoras_a**2)

        start_point_x, start_point_y = start_point
        offset_point = (
            start_point_x + pythagoras_b,
            start_point_y + pythagoras_a
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