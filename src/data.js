// Traditional housie/tambola caller rhymes
export const TAMBOLA_RHYMES = {
  1: "Kelly's eye",
  2: "One little duck",
  3: "Cup of tea",
  4: "Knock at the door",
  5: "Man alive",
  6: "Half a dozen",
  7: "Lucky seven",
  8: "Garden gate",
  9: "Doctor's orders",
  10: "Boss's den",
  11: "Legs eleven",
  12: "One dozen",
  13: "Unlucky for some",
  14: "Valentine's day",
  15: "Young and keen",
  16: "Sweet sixteen",
  17: "Dancing queen",
  18: "Coming of age",
  19: "Goodbye teens",
  20: "One score",
  21: "Key of the door",
  22: "Two little ducks",
  23: "Thee and me",
  24: "Two dozen",
  25: "Duck and dive",
  26: "Pick and mix",
  27: "Gateway to heaven",
  28: "In a state",
  29: "Rise and shine",
  30: "Dirty Gertie",
  31: "Get up and run",
  32: "Buckle my shoe",
  33: "All the threes",
  34: "Ask for more",
  35: "Jump and jive",
  36: "Three dozen",
  37: "A flea in heaven",
  38: "Christmas cake",
  39: "Steps",
  40: "Life begins",
  41: "Time for fun",
  42: "Winnie the Pooh",
  43: "Down on your knees",
  44: "Droopy drawers",
  45: "Halfway there",
  46: "Up to tricks",
  47: "Four and seven",
  48: "Four dozen",
  49: "Rise and shine",
  50: "Half a century",
  51: "Tweak of the thumb",
  52: "Deck of cards",
  53: "Stuck in the tree",
  54: "Clean the floor",
  55: "Snakes alive",
  56: "Shotts bus",
  57: "Heinz varieties",
  58: "Make them wait",
  59: "Brighton line",
  60: "Five dozen",
  61: "Baker's bun",
  62: "Turn on the screw",
  63: "Tickle me",
  64: "Red raw",
  65: "Old age pension",
  66: "Clickety click",
  67: "Made in heaven",
  68: "Saving grace",
  69: "Favourite of mine",
  70: "Three score and ten",
  71: "Bang on the drum",
  72: "Six dozen",
  73: "Queen bee",
  74: "Hit the floor",
  75: "Strive and strive",
  76: "Trombones",
  77: "Sunset strip",
  78: "Heaven's gate",
  79: "One more time",
  80: "Gandhi's breakfast",
  81: "Stop and run",
  82: "Straight on through",
  83: "Time for tea",
  84: "Seven dozen",
  85: "Staying alive",
  86: "Between the sticks",
  87: "Torquay in Devon",
  88: "Two fat ladies",
  89: "Nearly there",
  90: "Top of the shop",
};

// Band colour mapping (1-10 -> band 1, 11-20 -> band 2, ..., 81-90 -> band 9)
function bandOf(n) {
  if (n <= 0 || n > 90) return 0;
  return Math.min(9, Math.ceil(n / 10));
}

const BAND_COLORS = {
  1: { light: '#ff97a2', color: '#dc354b', deep: '#8a1623' }, // red
  2: { light: '#ffe167', color: '#ffa61a', deep: '#b46a00' }, // orange
  3: { light: '#fff2a8', color: '#ffcc00', deep: '#b38e00' }, // yellow
  4: { light: '#a8f0b8', color: '#28cd4c', deep: '#1a7a2c' }, // green
  5: { light: '#7ed7c0', color: '#038770', deep: '#04473b' }, // teal
  6: { light: '#a0beff', color: '#3e6eea', deep: '#1d3d9a' }, // blue
  7: { light: '#c8a8ff', color: '#5f22a8', deep: '#351362' }, // indigo
  8: { light: '#d6a8ff', color: '#8a38f5', deep: '#4c1a8a' }, // violet
  9: { light: '#ffb8c4', color: '#ff5264', deep: '#8a1623' }, // pink
};

export function ballStyle(n) {
  const b = BAND_COLORS[bandOf(n)] || BAND_COLORS[1];
  return { '--ball-light': b.light, '--ball-color': b.color, '--ball-deep': b.deep };
}

export const PRIZES = [
  { id: 'early5', label: 'Early Five', desc: 'First 5 marks' },
  { id: 'top', label: 'Top Row', desc: '5 top-row numbers' },
  { id: 'mid', label: 'Middle Row', desc: '5 mid-row numbers' },
  { id: 'bot', label: 'Bottom Row', desc: '5 bottom-row numbers' },
  { id: 'fullhouse', label: 'Full House', desc: 'All 15 marks' },
];
