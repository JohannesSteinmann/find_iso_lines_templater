




show_values = true
discrete_values = true
show_tile_colors = true
show_tiles = true

range = [3, 6]
iso_value = 4.5
// grid_resolution = [16,16]
// grid_pixel_width = 800
// grid_pixel_height = 800


grid_resolution = [16,20]
grid_pixel_width = 50 * grid_resolution[0]
grid_pixel_height = 50 * grid_resolution[1]

range_buffer = []
value_buffer = []

function setup() {
  createCanvas(grid_pixel_width + 300, grid_pixel_height);
  square_size_x = grid_pixel_width / grid_resolution[0]
  square_size_y = grid_pixel_height / grid_resolution[1]

  // initialize buffer
  for (let i = 0; i < grid_resolution[0]; i++) {
    range_buffer.push([])
    for (let j = 0; j < grid_resolution[1]; j++) {
      range_buffer[i].push(0)
    }
  }

  generate_values()




  label_top_padding = 35 + 'px'
  // create container div
  let container = createDiv();
  container.style('display', 'flex');
  container.style('flex-direction', 'column');
  container.style('gap', '10px');
  container.position(grid_pixel_width + 10, 100);

  // create button to toggle between discrete and continuous
  let button = createButton('Toggle Discrete Values');
  button.parent(container);
  button.mousePressed(toggle_discrete);

  // create button to toggle show values
  let button2 = createButton('Show values');
  button2.parent(container);
  button2.mousePressed(toggle_show_values);

  // create button to generate new values
  let button3 = createButton('Generate values');
  button3.parent(container);
  button3.mousePressed(generate_values);

  // create button to clear the grid
  let button4 = createButton('Clear Grid');
  button4.parent(container);
  button4.mousePressed(clear_grid);


  // create button to clear the grid
  let button5 = createButton('Toggle Tile Colors');
  button5.parent(container);
  button5.mousePressed(toggle_tile_colors);


  // create button to clear the grid
  let button7 = createButton('Toggle Tiles');
  button7.parent(container);
  button7.mousePressed(toggle_show_tiles);

  // create button to clear the grid
  let button6 = createButton('Export Screenshot');
  button6.parent(container);
  button6.mousePressed(export_screenshot);

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
  iso_label.style('padding-top', label_top_padding);
  iso_input = createInput();
  iso_input.parent(container);
  iso_input.value(iso_value);
  iso_input.input(update_iso_value);



  // create radio button group label
  let radioLabel = createDiv('Drawing Mode:');
  radioLabel.parent(container);
  radioLabel.style('padding-top', label_top_padding);
  // create radio button group
  drawmode_radio = createRadio();
  drawmode_radio.option('Below');
  drawmode_radio.option('Iso');
  drawmode_radio.option('Above');
  drawmode_radio.parent(container);
  drawmode_radio.selected('Iso');
  drawmode_radio.changed(handleRadioChange);

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

function handleRadioChange() {
  let val = drawmode_radio.value();
  console.log(val);
}

function update_range() {
  range = range_input.value().split(',').map(Number)
  // generate_values()
}


function update_iso_value() {

  iso_value = iso_input.value()
  // generate_values()
}

function clear_grid() {
  for (let i = 0; i < grid_resolution[0]; i++) {
    for (let j = 0; j < grid_resolution[1]; j++) {
      range_buffer[i][j] = 0
    }
  }
}

function toggle_show_values() {
  show_values = !show_values
}

function toggle_tile_colors() {
  show_tile_colors = !show_tile_colors
}


function toggle_discrete() {
  discrete_values = !discrete_values
  // generate_values()
}

function generate_values() {
  
  // generate random values
  // if range_buffer is 1, value above iso_value, else below

  value_buffer = []
  for (let i = 0; i < grid_resolution[0]; i++) {
    value_buffer.push([])
    for (let j = 0; j < grid_resolution[1]; j++) {



      if (range_buffer[i][j] == 0) {
        value_buffer[i].push(random(range[0], iso_value))
      }

      if (range_buffer[i][j] == 1) {
        value_buffer[i].push(iso_value)
      }

      if (range_buffer[i][j] == 2) {
        value_buffer[i].push(random(iso_value, range[1]))
      }
      
      
    }
  }

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
      // if (range_buffer[i][j] == 0) {
      //   fill(255);
      // }
      // else if (range_buffer[i][j] == 1) {
      //   if (show_values) {
      //     fill(100)
      //   } else {
      //     fill(0);
      //   }
      // }
      // circle(square_size_x / 2 + i * square_size_x, square_size_y / 2 + j * square_size_y, 40, 40);

      fill(255);

      if (show_tile_colors) {
        if (range_buffer[i][j] == 1) {
          fill(color('Orange'));
        }
        if (range_buffer[i][j] == 2) {
          fill(100);
        }
      }


      
      if (!show_tiles) {
        noStroke()
      }
      rect(i * square_size_x, j * square_size_y, square_size_x, square_size_y,);


      if (show_values) {
        fill(0)
        value_text = str(discrete_values ? value_buffer[i][j].toFixed(2) : '  ' + floor(value_buffer[i][j]) )        
        text(value_text, square_size_x / 4 + i * square_size_x + 5, square_size_y / 3 + j * square_size_y + 15)
      }
    }
  }

  //when mouse button is pressed, circles turn black
  if (mouseX < grid_pixel_width && mouseY < grid_pixel_height) {
    fill(150)
    text(str(floor(mouseX / square_size_x) + '-' + floor(mouseY / square_size_y)), mouseX, mouseY)
    
    // if mouse pressed and shift-key on hold set range_buffer on that location = 0

    
    
    if (mouseIsPressed) {

      drawmode = 0

      if (drawmode_radio.value() === 'Iso') {drawmode = 1}
      if (drawmode_radio.value() === 'Above') {drawmode = 2}

      range_buffer[floor(mouseX / square_size_x)][floor(mouseY / square_size_y)] = drawmode
    }
  }
  //white circles drawn at mouse position
  // circle(mouseX, mouseY, 100);
}