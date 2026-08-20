# earth_explorer

An interactive 3D learning game built with three.js.

## About this project

This project was created as a semester project (*Semesterarbeit*) submitted in lieu of a written exam. That framing explains some of its priorities: the goal was to work hands-on with three.js and 3D rendering concepts within a fixed timeframe, not to ship a finished game. Some features are therefore prototypical or incomplete. They are documented openly below rather than quietly removed.

## Concept

The concept evolved over the course of the project. The intended end result is a learning game in which you fly an aircraft over the globe, pick any country you like, and start an "exploration" there. An exploration combines a knowledge-acquisition step with a subsequent quiz that awards points. Since building out the quiz was not the focus of the project, the knowledge step is simply a link to the Wikipedia page of the respective country.

To make countries selectable, the idea was to create a clickable polygon for each country. Rendering those polygons is the one part I did not get working, even though the underlying data appears to be correct (see console output).

## Known limitations

- Handling more than one scene — controls and camera still overlap
- Drawing the country polygons
- Aligning model and camera during movement
- Adjustable sound volume, and positional sound for the flying objects

## Possible next steps

- **Game loop** — to improve playability, the idea was a shop where points earned from completed quizzes could be spent on new flying objects and after-effects.
- Atmosphere, clouds, and randomised flocks of birds, so the exploration scene feels less empty
- Measures against loading times (loading sequence, async loading, or even partial loading)

## Sources

Besides the three.js documentation, I used a number of other sources. They are listed below and are additionally referenced in the respective source file.

I distinguish between three types of source:

- **Type 1** — inspiration only, written by myself
- **Type 2** — inspiration, rewritten
- **Type 3** — source adopted as-is

| Purpose | Source | Type |
| --- | --- | --- |
| Combining three.js and HTML elements | https://jsfiddle.net/9tng8dp0/2/ | 1 |
| Inspiration for the start scene | https://www.youtube.com/watch?v=FntV9iEJ0tU (`getFresnelMat.js` is a Type 3 source) | 2 |
| 3D text | https://www.youtube.com/watch?v=JxXqPvZNQP4 | 2 |
| Model controls for the exploration scene | https://www.youtube.com/watch?v=C3s0UHpwlf8 | 2 |
| Using an image as a displacement map | https://sbcode.net/threejs/displacmentmap/ | 2 |
| Inspiration for the country-polygon idea | https://www.youtube.com/watch?v=f4zncVufL_I | 1 |
| Creating a 3D mesh from a 2D polygon | https://stackoverflow.com/questions/74358515/how-to-draw-polygon-in-three-js-using-vertices | 3 |
| Raycaster for clicking objects | https://www.youtube.com/watch?v=XkZSAkjM4-A | 2 |
