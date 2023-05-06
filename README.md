# @infused-kim's ergogen PCB footprints

> **Warning**
>
> These footprints have not been tested and are still under active development. Use them at your own risk.

## Installation

### 1. Add the footprints as a git submodule

Add the footprint library as a git submodule to your project...

```bash
git submodule add git@github.com:infused-kim/kb_ergogen_fp.git ergogen/footprints/infused-kim/
```

Make sure to adjust the path to a subfolder in your ergogen folder (`ergogen/footprints/infused-kim/` in the example above.)

### 2. Use them in your ergogen config

You can then use the footprints in your ergogen config.yaml:

```yaml
[...]
pcbs:
    your_keyboard:
        footprints:
            # Controller
            promicro:
                what: infused-kim/nice_nano_pretty
                params:
                traces: true
                show_labels: false
[...]
```

### How to update the submodule

To update to a newer version...

```bash
# Pull updates inside the submodule repo
cd ergogen/footprints/infused-kim/
git checkout main
git pull

# Update the submodule in the parent repo
cd ..
git add .
git commit -m "Updated infused-kim footprint submodule"
```

## License

**TLDR:**

- Personal use with attribution
- Commercial use not allowed

Shield: [![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg
