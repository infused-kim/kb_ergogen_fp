#!/usr/bin/env python3
import os

from build123d import (
    BasePartObject,
    BuildPart,
    BuildSketch,
    BuildLine,
    Line,
    ThreePointArc,
    Circle,
    Cylinder,
    Box,
    Plane,
    Axis,
    Mode,
    Align,
    Union,
    Locations,
    GridLocations,
    RotationLike,
    Color,
    validate_inputs,
    tuplify,
    mirror,
    make_face,
    extrude,
    revolve,
    add,
    export_step,
    export_stl,
)

DEFAULT_DOME_DOT_HEIGHT = 0.2
DEFAULT_DOME_DOT_RADIUS = 0.3
DEFAULT_DOME_DOT_SPACING = 0.85
DEFAULT_DOME_DOT_ROWS = [
    3,
    7,
    7,
    9,
    9,
    9,
    7,
    7,
    3,
]

ALIGN_CENTER = (
    Align.CENTER,
    Align.CENTER,
    Align.CENTER,
)

ALIGN_CENTER_BOTTOM = (
    Align.CENTER,
    Align.CENTER,
    Align.MIN,
)

ALIGN_CENTER_TOP = (
    Align.CENTER,
    Align.CENTER,
    Align.MAX,
)


class TrackPointCap(BasePartObject):
    def __init__(
        self,
        total_height: float,
        base_height: float,
        base_diameter: float,
        dome_diameter: float,
        hole_length: float,
        hole_width: float,
        hole_depth: float,
        dome_dot_height: float = DEFAULT_DOME_DOT_HEIGHT,
        dome_dot_radius: float = DEFAULT_DOME_DOT_RADIUS,
        dome_dot_spacing: float = DEFAULT_DOME_DOT_SPACING,
        dome_dot_rows: list[int] = DEFAULT_DOME_DOT_ROWS,
        color: Color = Color('red'),
        rotation: RotationLike = (0, 0, 0),
        align: Union[Align, tuple[Align, Align, Align]] = ALIGN_CENTER,
        mode: Mode = Mode.ADD,
    ):
        context: BuildPart = BuildPart._get_context(self)
        validate_inputs(context, self)

        self.total_height = total_height

        self.base_height = base_height
        self.base_diameter = base_diameter

        self.dome_height = total_height - base_height - dome_dot_height
        self.dome_diameter = dome_diameter

        self.dome_dot_height = dome_dot_height
        self.dome_dot_radius = dome_dot_radius
        self.dome_dot_spacing = dome_dot_spacing
        self.dome_dot_rows = dome_dot_rows

        self.hole_length = hole_length
        self.hole_width = hole_width
        self.hole_depth = hole_depth

        base_height_total = base_height + (self.dome_height / 2)

        with BuildPart() as tp_cap:
            dome = self._build_dome(
                self.dome_diameter,
                self.dome_height,
                self.dome_dot_height,
                self.dome_dot_radius,
                self.dome_dot_spacing,
                self.dome_dot_rows,
            )
            base = self._build_base(base_diameter, base_height_total)
            add([dome, base], mode=Mode.ADD)

            with Locations((0, 0, -base_height_total)):
                Box(
                    length=self.hole_length,
                    width=self.hole_width,
                    height=self.hole_depth,
                    align=(Align.CENTER, Align.CENTER, Align.MIN),
                    mode=Mode.SUBTRACT,
                )

        super().__init__(
            part=tp_cap.part,
            rotation=rotation,
            align=tuplify(align, 3),
            mode=mode,
        )

        self.color = color

    def _build_dome(self,
                    diameter,
                    height,
                    dot_height=DEFAULT_DOME_DOT_HEIGHT,
                    dot_radius=DEFAULT_DOME_DOT_RADIUS,
                    dot_spacing=DEFAULT_DOME_DOT_SPACING,
                    dot_rows=DEFAULT_DOME_DOT_ROWS):
        radius = diameter / 2
        height_h = height / 2

        with BuildPart() as dome:

            # This is not the actual curvature of the TP dome, but
            # it's close enough.
            with BuildSketch(Plane.XZ):
                with BuildLine() as dome_ln:
                    arc_start = (radius * 0.4, height_h)
                    arc_end = (radius, 0)

                    arc_mid_x = (arc_start[0] + arc_end[0]) / 2
                    arc_mid_y = (arc_start[1] + arc_end[1]) / 2
                    arc_mid_y_incr = arc_mid_y * 1.5

                    arc_third = (arc_mid_x, arc_mid_y_incr)

                    flat_top_start = (0, height_h)

                    # side
                    Line((0, 0), flat_top_start)

                    # flat top
                    Line(flat_top_start, arc_start)

                    # Rounding of edge
                    ThreePointArc(
                        arc_start,
                        arc_third,
                        arc_end
                    )
                    mirror(dome_ln.line, about=Plane.XZ)
                make_face()
            revolve(axis=Axis.Z)

            # Dome Dots
            with BuildSketch(Plane.XY):
                for row_num, dot_num in enumerate(dot_rows):
                    row_offset = (
                        row_num * dot_spacing -
                        ((len(dot_rows) - 1) * dot_spacing) / 2
                    )
                    with Locations((0, row_offset, 0)):
                        grid_loc = GridLocations(
                            dot_spacing, dot_spacing, dot_num, 1
                        )
                        with grid_loc:
                            Circle(
                                dot_radius,
                            )
            extrude(amount=height_h + dot_height)

        return dome.part

    def _build_base(self, diameter, height, align=ALIGN_CENTER_TOP):
        radius = diameter / 2

        with BuildPart() as base:
            Cylinder(
                radius=radius,
                height=height,
                align=align,
            )

        return base.part


class TrackPointCapRedT460S(TrackPointCap):
    def __init__(self,
                 rotation: RotationLike = (0, 0, 0),
                 align: Union[Align, tuple[Align, Align, Align]] = (
                      ALIGN_CENTER
                 ),
                 mode: Mode = Mode.ADD):

        super().__init__(
            total_height=4.0,
            base_height=2.0,
            base_diameter=6.5,
            dome_diameter=8.5,
            hole_width=2.5,
            hole_length=2.5,
            hole_depth=3.0,

            rotation=rotation,
            align=tuplify(align, 3),
            mode=mode,
        )


class TrackPointCapGreenT430(TrackPointCap):
    def __init__(self,
                 rotation: RotationLike = (0, 0, 0),
                 align: Union[Align, tuple[Align, Align, Align]] = (
                     ALIGN_CENTER
                 ),
                 mode: Mode = Mode.ADD):

        super().__init__(
            total_height=6.2,
            base_height=4.5,
            base_diameter=6.8,
            dome_diameter=8.0,
            hole_width=2.3,
            hole_length=2.3,
            hole_depth=5.3,

            rotation=rotation,
            align=tuplify(align, 3),
            mode=mode,
        )


def get_models(align=ALIGN_CENTER_TOP):
    model_generators = TrackPointCap.__subclasses__()

    models = []
    for model_gen in model_generators:
        part = model_gen(align=align)
        model_name = model_gen.__name__
        models.append({
            'name': model_name,
            'part': part,
        })

    return models


def export_models(models, exporter, extension):
    for model in models:
        file_name = f'{model["name"]}.{extension}'
        part = model['part']
        print(f'Exporting {file_name}')

        path = os.path.join('export/', file_name)
        exporter(part, path)


def export_models_stl(models):
    export_models(
        models=models,
        exporter=export_stl,
        extension='stl',
    )


def export_models_step(models):
    export_models(
        models=models,
        exporter=export_step,
        extension='step',
    )


def main():
    print('Generating models...')
    models = get_models(align=ALIGN_CENTER_TOP)

    export_models_step(models)
    export_models_stl(models)


if __name__ == "__main__":
    main()
