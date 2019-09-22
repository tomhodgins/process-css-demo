import element from '../index.vanilla.js'

export default () => `

  /* Min-scroll-y */
  ${element('.min-scroll-y', {minScrollY: 50}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-scroll-y */
  ${element('.max-scroll-y', {maxScrollY: 50}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Min-scroll-x */
  ${element('.min-scroll-x', {minScrollX: 50}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

  /* Max-scroll-x */
  ${element('.max-scroll-x', {maxScrollX: 50}, `
    :self {
      background: greenyellow;
      border-color: limegreen;
    }
  `)}

`