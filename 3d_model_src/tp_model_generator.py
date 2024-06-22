#!/usr/bin/env python3
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
        return None

    def build_tp(self, z_offset=None):
        metal_thickness = 0.4

        platform_height_total = 1.2
        platform_height_actual = platform_height_total - metal_thickness
        platform_diameter = 8

        adapter_width = 2.2
        adapeter_height = 2.7

        metal_frame = self._build_sensor_metal_frame(metal_thickness)
        platform = self._build_sensor_platform(
            platform_height_actual,
            platform_diameter,
            z_offset=metal_thickness,
        )
        adapter = self._build_sensor_adapter(
            adapter_width,
            adapeter_height,
            z_offset=(platform_height_total),
        )
        platform_screws = self._build_sensor_platform_screws(
            height=(platform_height_total)
        )

        tp_assembly = bd.Compound(
            label='TrackPoint',
            children=[
                metal_frame,
                platform,
                adapter,
                platform_screws,
            ]
        )

        if z_offset is None:
            pcb_height_default = 1.6
            z_offset = -(platform_height_total + pcb_height_default)
        tp_assembly.move(bd.Location((0, 0, z_offset)))

        return tp_assembly

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
        metal_frame.part.label = 'TrackPoint Sensor - Metal Frame'

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
        platform.part.label = 'TrackPoint Sensor - Round Platform'

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
        adapter.part.label = 'TrackPoint Sensor - White Cap Adapter'

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
