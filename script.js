const canvas = document.querySelector(".canvas")
const ctx = canvas.getContext("2d")
const size = { width: 300, height: 300 }
canvas.width = size.width
canvas.height = size.height

const randBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

/*
Statistics of Alphabet frequency from https://www3.nd.edu/~busiforc/handouts/cryptography/letterfrequencies.html

E	11.1607%	56.88	M	3.0129%	15.36
A	8.4966%	43.31	H	3.0034%	15.31
R	7.5809%	38.64	G	2.4705%	12.59
I	7.5448%	38.45	B	2.0720%	10.56
O	7.1635%	36.51	F	1.8121%	9.24
T	6.9509%	35.43	Y	1.7779%	9.06
N	6.6544%	33.92	W	1.2899%	6.57
S	5.7351%	29.23	K	1.1016%	5.61
L	5.4893%	27.98	V	1.0074%	5.13
C	4.5388%	23.13	X	0.2902%	1.48
U	3.6308%	18.51	Z	0.2722%	1.39
D	3.3844%	17.25	J	0.1965%	1.00
P	3.1671%	16.14	Q	0.1962%	(1)



*/
const englishLetters = [
  {
    letter: "a",
    frequency: 8.4966,
    isVowel: true
  },
  {
    letter: "b",
    frequency: 2.072,
    isVowel: false
  },
  {
    letter: "c",
    frequency: 4.5388,
    isVowel: false
  },
  {
    letter: "d",
    frequency: 3.3844,
    isVowel: false
  },
  {
    letter: "e",
    frequency: 11.1607,
    isVowel: true
  },
  {
    letter: "f",
    frequency: 1.8121,
    isVowel: false
  },
  {
    letter: "g",
    frequency: 2.4705,
    isVowel: false
  },
  {
    letter: "h",
    frequency: 3.0034,
    isVowel: false
  },
  {
    letter: "i",
    frequency: 7.5448,
    isVowel: true
  },
  {
    letter: "j",
    frequency: 0.1965,
    isVowel: false
  },
  {
    letter: "k",
    frequency: 1.1016,
    isVowel: false
  },
  {
    letter: "l",
    frequency: 5.4893,
    isVowel: false
  },
  {
    letter: "m",
    frequency: 3.0129,
    isVowel: false
  },
  {
    letter: "n",
    frequency: 6.6544,
    isVowel: false
  },
  {
    letter: "o",
    frequency: 7.1635,
    isVowel: true
  },
  {
    letter: "p",
    frequency: 3.1671,
    isVowel: false
  },
  {
    letter: "q",
    frequency: 0.1962,
    isVowel: false
  },
  {
    letter: "r",
    frequency: 7.5809,
    isVowel: false
  },
  {
    letter: "s",
    frequency: 5.7351,
    isVowel: false
  },
  {
    letter: "t",
    frequency: 6.9509,
    isVowel: false
  },
  {
    letter: "u",
    frequency: 3.6308,
    isVowel: true
  },
  {
    letter: "v",
    frequency: 1.0074,
    isVowel: false
  },
  {
    letter: "w",
    frequency: 1.2899,
    isVowel: false
  },
  {
    letter: "x",
    frequency: 0.2902,
    isVowel: false
  },
  {
    letter: "y",
    frequency: 1.7779,
    isVowel: false
  },
  {
    letter: "z",
    frequency: 0.2722,
    isVowel: false
  }
]

const ALPHABETS = {
  ENGLISH: {
    code: "En-US",
    letters: englishLetters
  },
  PERSIAN: {
    letters: "آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی".split(""),
    vowels: "اآویه".split("")
  }
}

const config = {
  wordTable: {
    alphabet: ALPHABETS.ENGLISH,
    columns: 4,
    rows: 4,
    // The chance that a letter of higher frequency will appear
    frequentWordLikelihood: 0.3,

    letter: {
      backgroundColor: "#feffd4",
      borderColor: "black",
      borderWidth: 3,
      fontFamily: "sans-serif",
      fontSize: 32,
      foregroundColor: "black"
    }
  }
}

class WordTable {
  constructor(tableConfig) {
    this.tableConfig = tableConfig
    this.tableRows = []
  }

  generateRandomLetter = () => {
    const { letters } = this.tableConfig.alphabet

    const random = window.crypto.getRandomValues(new Uint8Array(1))[0] / 255

    const averageFrequency =
      letters.reduce((acc, cur) => acc + cur.frequency, 0) / letters.length

    const belowAverage = letters
      .filter(letter => letter.frequency < averageFrequency)
      .map(letter => letter.letter.toUpperCase())
      .map(letter => (letter === "Q" ? "Qu" : letter))

    const aboveAverage = letters
      .filter(letter => letter.frequency >= averageFrequency)
      .map(letter => letter.letter.toUpperCase())
      .map(letter => (letter === "Q" ? "Qu" : letter))

    return random > this.tableConfig.frequentWordLikelihood
      ? belowAverage[randBetween(0, belowAverage.length - 1)]
      : aboveAverage[randBetween(0, aboveAverage.length - 1)]
  }

  generateRow = () => {
    const { columns } = this.tableConfig
    return Array(columns)
      .fill()
      .map(() => this.generateRandomLetter())
  }

  fillWithWords = () => {
    const { rows } = this.tableConfig
    return (this.tableRows = Array(rows)
      .fill()
      .map(() => this.generateRow()))
  }

  drawTile = (x, y, letter) => {
    const { width, height } = size
    const { columns, rows } = this.tableConfig
    const {
      backgroundColor,
      borderColor,
      borderWidth,
      fontFamily,
      fontSize,
      foregroundColor
    } = this.tableConfig.letter

    ctx.fillStyle = backgroundColor
    ctx.fillRect(
      x * (width / columns),
      y * (height / rows),
      width / columns,
      height / rows
    )
    ctx.fillStyle = foregroundColor
    ctx.font = `${fontSize}px ${fontFamily}`
    ctx.fillText(
      letter,
      x * (width / columns) + width / columns / 2 - fontSize / 2,
      y * (height / rows) + height / rows / 2 + fontSize / 2
    )
    ctx.lineWidth = borderWidth
    ctx.strokeStyle = borderColor
    ctx.strokeRect(
      x * (width / columns),
      y * (height / rows),
      width / columns,
      height / rows
    )
  }

  draw = () => {
    const { width, height } = size

    // draw table
    ctx.fillStyle = this.tableConfig.letterBackgroundColor
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = this.tableConfig.letterBorders
    ctx.strokeRect(0, 0, width, height)

    // draw letters
    this.tableRows.forEach((row, y) => {
      row.forEach((letter, x) => {
        this.drawTile(x, y, letter)
      })
    })
  }
}

const wordTable = new WordTable(config.wordTable)
const backTable = new WordTable(config.wordTable)

wordTable.fillWithWords()
wordTable.draw()
