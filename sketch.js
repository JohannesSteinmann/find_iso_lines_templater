




show_values = true
discrete_values = true
show_tile_colors = true
show_tiles = true
random_displacement = false
random_text_color = false

range = [1, 10]
iso_value = 4.5
displacement_value = 0.2



tile_size = 50
grid_resolution = [11, 11]
grid_pixel_width = tile_size * grid_resolution[0]
grid_pixel_height = tile_size * grid_resolution[1]

range_buffer = []
value_buffer = []
displacement_buffer = []
text_color_buffer = []


function setup() {
  strokeWeight(0);
  createCanvas(grid_pixel_width + 300, grid_pixel_height);
  square_size_x = grid_pixel_width / grid_resolution[0]
  square_size_y = grid_pixel_height / grid_resolution[1]

  // initialize range buffer and displacement buffer
  for (let i = 0; i < grid_resolution[0]; i++) {
    range_buffer.push([])
    displacement_buffer.push([])

    for (let j = 0; j < grid_resolution[1]; j++) {
      range_buffer[i].push(0)
      displacement_buffer[i].push([0, 0])
    }
  }



  random_colors = [color('Blue'), color('Red'), color('Green')]

  generate_data()
  generate_text_colors()
  // generate_text_colors()



  textAlign('center')





  label_top_padding = 35 + 'px'





  // create container div
  let container = createDiv();
  container.style('display', 'flex');
  container.style('flex-direction', 'column');
  container.style('gap', '10px');
  container.position(grid_pixel_width + 10, 10);


  // create button to clear the grid
  let button6 = createButton('Export as PNG');
  button6.parent(container);
  button6.mousePressed(export_screenshot);
  button6.style('margin-bottom', '10px');
  button6.style('padding-top', label_top_padding);
  button6.style('padding-bottom', label_top_padding);

  // create button for import png
  let button_import = createButton('import PNG');
  button_import.parent(container);
  button_import.mousePressed(import_png);
  button_import.style('margin-bottom', '20px');
  // button_import.style('padding-top', label_top_padding);
  // button_import.style('padding-bottom', label_top_padding);



  // create checkbox to toggle between discrete and continuous
  let checkbox1 = createCheckbox('Discrete Values only', discrete_values);
  checkbox1.parent(container);
  checkbox1.changed(toggle_discrete);

  // create checkbox to toggle show values
  let checkbox2 = createCheckbox('Show values', show_values);
  checkbox2.parent(container);
  checkbox2.changed(toggle_show_values);

  // create checkbox to toggle tile colors
  let checkbox3 = createCheckbox('Show Tile Colors', show_tile_colors);
  checkbox3.parent(container);
  checkbox3.changed(toggle_tile_colors);

  // create checkbox to toggle show tiles
  let checkbox4 = createCheckbox('Toggle Tiles', show_tiles);
  checkbox4.parent(container);
  checkbox4.changed(toggle_show_tiles);


  // create checkbox to toggle show tiles
  let checkbox5 = createCheckbox('Random Displacement', random_displacement);
  checkbox5.parent(container);
  checkbox5.changed(toggle_random_displacement);
  checkbox5.style('margin-top', label_top_padding);

  let displacement_label = createDiv('Displacement distance:');
  displacement_label.parent(container);
  displacement_input = createInput();
  displacement_input.parent(container);
  displacement_input.value(displacement_value);
  displacement_input.input(update_displacement_value);


  // create button to generate new displacements
  let button8 = createButton('Generate displacements');
  button8.parent(container);
  button8.mousePressed(generate_displacements);
  button8.style('margin-bottom', label_top_padding);







  // create checkbox to toggle show tiles
  let color_checkbox = createCheckbox('Random Text Colors', random_text_color);
  color_checkbox.parent(container);
  color_checkbox.changed(toggle_random_text_color);
  color_checkbox.style('margin-top', label_top_padding);



  // =============== NICE TO HAVE: enter random colors as list of strings for random text colors
  // let text_color_label = createDiv('text_color distance:');
  // text_color_label.parent(container);
  // text_color_input = createInput();
  // text_color_input.parent(container);
  // text_color_input.value(text_color_value);
  // text_color_input.input(update_text_color_value);


  // create button to generate new displacements
  let button_colors = createButton('Generate Text Colors');
  button_colors.parent(container);
  button_colors.mousePressed(generate_text_colors);
  button_colors.style('margin-bottom', label_top_padding);



  // add inputs for range and iso value
  let range_label = createDiv('Range:');
  range_label.parent(container);
  range_label.style('padding-top', label_top_padding);
  range_input = createInput();
  range_input.parent(container);
  range_input.value(range);
  range_input.input(update_range);

  let iso_label = createDiv('Iso Value:');
  iso_label.parent(container);
  // iso_label.style('padding-top', label_top_padding);
  iso_input = createInput();
  iso_input.parent(container);
  iso_input.value(iso_value);
  iso_input.input(update_iso_value);


  // create radio button group label
  let radioLabel = createDiv('Drawing Mode:');
  radioLabel.parent(container);
  radioLabel.style('margin-top', '20px');
  radioLabel.style('margin-bottom', '20px');
  // create radio button group
  drawmode_radio = createRadio();
  drawmode_radio.option('Below');
  drawmode_radio.option('Iso');
  drawmode_radio.option('Above');
  drawmode_radio.parent(radioLabel);
  drawmode_radio.selected('Above');
  drawmode_radio.changed(handleRadioChange);

  // create button to generate new values
  let button3 = createButton('Generate values');
  button3.parent(container);
  button3.mousePressed(generate_data);

  // create button to clear the grid
  let button4 = createButton('Clear Grid');
  button4.parent(container);
  button4.mousePressed(clear_grid);


}



// load image from file
function handleImportFile(file) {
  if (file.type === 'image') {
  
    loadImage(file.data, img => {
      // Convert the image to grayscale
      img.filter(GRAY);

      // Resize the image to grid size
      img.resize(grid_resolution[0], grid_resolution[1]);

      // Map the pixel values to [0, 2] and apply to range_buffer
      img.loadPixels();
      for (let i = 0; i < grid_resolution[0]; i++) {
        for (let j = 0; j < grid_resolution[1]; j++) {
          let index = (i + j * grid_resolution[0]) * 4;
          let grayValue = img.pixels[index] / 255; // Normalize to [0, 1]
          range_buffer[i][j] = Math.floor(grayValue * 2); // Map to [0, 2]
        }
      }


      img.updatePixels();

      // Optionally, you can call generate_data() or any other function to update the grid
      generate_data();
    });


  } else {
    console.log('Not an image file!');
  }
}


// map picture values to interval [0;2]

// apply picture to range_buffer



function import_png() {
  
  console.log('importing png!')
  // create hidden file input
  let file_input = createFileInput(handleImportFile);
  file_input.hide()
  file_input.elt.click()
  file_input.remove()
}








function export_screenshot() {
  // Save the current canvas size
  let originalWidth = width;
  let originalHeight = height;

  // Resize the canvas to grid pixel values
  resizeCanvas(grid_pixel_width, grid_pixel_height);

  // Take a screenshot and open a dialog window for saving
  saveCanvas('screenshot', 'png');

  // Restore the original canvas size
  resizeCanvas(originalWidth, originalHeight);
}

function toggle_show_tiles() {
  show_tiles = !show_tiles
}


function toggle_random_displacement() {
  random_displacement = !random_displacement
}

function handleRadioChange() {
  let val = drawmode_radio.value();
  console.log(val);
}

function update_range() {
  range = range_input.value().split(',').map(Number)
  // generate_data()
}


function update_iso_value() {

  iso_value = min(max(iso_input.value(), range[0]), range[1])
  iso_input.value(iso_value)
  // generate_data()
}

function update_displacement_value() {
  displacement_value = displacement_input.value()
}

function clear_grid() {
  for (let i = 0; i < grid_resolution[0]; i++) {
    for (let j = 0; j < grid_resolution[1]; j++) {
      range_buffer[i][j] = 0
    }
  }
  generate_data()
}

function toggle_show_values() {
  show_values = !show_values
}


function toggle_random_text_color() {
  random_text_color = !random_text_color
}

function toggle_tile_colors() {
  show_tile_colors = !show_tile_colors
}


function toggle_discrete() {
  discrete_values = !discrete_values
  // generate_data()
}

function generate_data() {

  // generate random values
  // if range_buffer is 1, value above iso_value, else below


  value_buffer = []
  for (let i = 0; i < grid_resolution[0]; i++) {
    value_buffer.push([])
    for (let j = 0; j < grid_resolution[1]; j++) {

      if (range_buffer[i][j] == 0) {

        if (discrete_values) {
          value_buffer[i].push(random(range[0], Math.floor(iso_value)))
        } else {
          value_buffer[i].push(random(range[0], iso_value))
        }
      }

      if (range_buffer[i][j] == 1) {
        value_buffer[i].push(iso_value)
      }

      if (range_buffer[i][j] == 2) {

        if (discrete_values) {
          value_buffer[i].push(random(Math.ceil(iso_value), range[1]))
        } else {
          value_buffer[i].push(random(iso_value, range[1]))
        }
      }


    }
  }

}


function generate_displacements() {

  // generate random d
  // if range_buffer is 1, value above iso_value, else below

  displacement_buffer = []
  for (let i = 0; i < grid_resolution[0]; i++) {
    displacement_buffer.push([])
    for (let j = 0; j < grid_resolution[1]; j++) {
      displacement_buffer[i].push([displacement_value - random(displacement_value * 2), displacement_value - random(displacement_value * 2)])
    }
  }

  // console.log('random displacements:')
  // console.log(displacement_buffer)

}
function generate_text_colors() {

  // generate random d
  // if range_buffer is 1, value above iso_value, else below

  text_color_buffer = []
  for (let i = 0; i < grid_resolution[0]; i++) {
    text_color_buffer.push([])
    for (let j = 0; j < grid_resolution[1]; j++) {
      text_color_buffer[i].push(random_colors[floor(random(random_colors.length))])

    }
  }
  // console.log(random_colors.length)
}



function draw() {
  background(220);


  // draw range and iso value text

  // if (!show_tiles) {
  //   fill(255)
  //   rect(0,0,grid_pixel_width, grid_pixel_height)
  // }


  for (let i = 0; i < grid_resolution[0]; i++) {
    for (let j = 0; j < grid_resolution[1]; j++) {

      fill(255);
      if (show_tile_colors) {
        if (range_buffer[i][j] == 1) {
          fill(color('Orange'));
        }
        if (range_buffer[i][j] == 2) {
          fill(100);
        }
      }

      // generate_text_colors()
      // generate_displacements()

      if (!show_tiles) {
        noStroke()
      } else {
        stroke(0)
      }
      rect(i * square_size_x, j * square_size_y, square_size_x, square_size_y,);
      noStroke()

      if (show_values) {

        displacement_x = 0
        displacement_y = 0

        if (random_displacement) {
          displacement_x = displacement_buffer[i][j][0]
          displacement_y = displacement_buffer[i][j][1]
        }


        fill(0)
        if (random_text_color && text_color_buffer.length > 0) {
          fill(text_color_buffer[i][j])
        }

        vertical_text_offset = 5
        value_text = str(discrete_values ? '' + floor(value_buffer[i][j]) : value_buffer[i][j].toFixed(2))
        text(value_text, square_size_x / 2 + i * square_size_x + displacement_x, square_size_y / 2 + j * square_size_y + vertical_text_offset + displacement_y)


        fill(0)
      }
    }
  }

  //handle drawing with pressed mouse
  if (mouseX < grid_pixel_width && mouseY < grid_pixel_height) {
    fill(150)
    text(str(floor(mouseX / square_size_x) + '-' + floor(mouseY / square_size_y)), mouseX, mouseY)

    if (mouseIsPressed) {

      drawmode = 0

      if (drawmode_radio.value() === 'Iso') { drawmode = 1 }
      if (drawmode_radio.value() === 'Above') { drawmode = 2 }

      range_buffer[floor(mouseX / square_size_x)][floor(mouseY / square_size_y)] = drawmode
    }
  }
}