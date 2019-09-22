import element from '../index.vanilla.js'

export default () => `

  /* Min-width */
  ${element('.minwidth', {minWidth: 300}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-width in px */
  ${element('.maxwidth', {maxWidth: 300}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Min-height in px */
  ${element('.minheight', {minHeight: 200}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-height in px */
  ${element('.maxheight', {maxHeight: 200}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Min-characters on block elements */
  ${element('.mincharacters', {minCharacters: 35}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Min-characters on input */
  ${element('.mincharacters-input', {minCharacters: 35}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Min-characters on textarea */
  ${element('.mincharacters-textarea', {minCharacters: 35}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Characters on block elements */
  ${element('.characters', {characters: 5}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Characters on input */
  ${element('.characters-input', {characters: 5}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Characters on textarea */
  ${element('.characters-textarea', {characters: 5}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-characters */
  ${element('.maxcharacters', {maxCharacters: 35}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-characters on input */
  ${element('.maxcharacters-input', {maxCharacters: 35}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-characters on textarea */
  ${element('.maxcharacters-textarea', {maxCharacters: 35}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Min-children */
  ${element('.minchildren', {minChildren: 5}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Children */
  ${element('.children', {children: 5}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-children */
  ${element('.maxchildren', {maxChildren: 5}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Square Orientation */
  ${element('.orientation', {orientation: 'square'}, `
    :self {
      background: orchid;
    }
  `)}

  /* Portrait Orientation */
  ${element('.orientation', {orientation: 'portrait'}, `
    :self {
      background: darkturquoise;
    }
  `)}

  /* Landscape Orientation */
  ${element('.orientation', {orientation: 'landscape'}, `
    :self {
      background: greenyellow;
    }
  `)}

  /* Min-aspect ratio */
  ${element('.minaspectratio', {minAspectRatio: 16/9}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-aspect-ratio */
  ${element('.maxaspectratio', {maxAspectRatio: 16/9}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

`