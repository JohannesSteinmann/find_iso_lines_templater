
# Find-The-Iso-Lines-Templater

A simple browser-based application to generate random scalar fields.
These scalar fields can be exported as PNG files and used as number puzzles, where one has to find and draw a shape using a given iso-value.

## Installation (using VSCode)
Fairly straight forward:
- Open repo folder with VSCode
- Right-click "index.html"
- Click "Open with Live Server"

## Usage
Most interactions are quite self-explanatory.

___
*Import PNG* actually accepts any kind of image formats and works like this:
- Opens a file-dialog to select image
- Selected image is resized to size of the scalar grid (e.g. 21x21)
- Resulting image is converted to gray scale
- Gray scale image values are mapped to discrete values [0, 1, 2]
- Resulting values are applied to the grid like this:
  - 0 -> tile colored in white -> generates value **below** iso-value
  - 1 -> tile colored in orange -> is set to exact iso-value
  - 2 -> tile colored in dark gray -> generates value **above** iso-value
___

The grid resolution is still hard-coded in **sketch.js**
```
...

tile_size = 50
grid_resolution = [21, 21]
grid_pixel_width = tile_size * grid_resolution[0]
grid_pixel_height = tile_size * grid_resolution[1]

...
```

___

## Library
Used [p5js](https://p5js.org) v1.10.0.

