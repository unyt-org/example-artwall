export type Point = { x: number, y: number };
export type Position = Point & { scale: number};
export const COLORS = [
	"transparent",
	"black",
	"white",
	"#5856d6",
	"#007aff",
	"#34aadc",
	"#5ac8fa",
	"#4cd964",
	"#ff2d55",
	"#ff3b30",
	"#ff9500",
	"#ffcc00",
	"#8e8e93",
];

export const SIZE = {
	width: 250,
	height: 250
};

const M = (e: string) => e.split("\n").filter(e => !!e).map(e => e.trim().split('').map(e => +e));

export const QRCODE = M(`
11111110000001011011101111111
10000010010101011110101000001
10111010000000101000001011101
10111010001100101100101011101
10111010100011011111001011101
10000010001110010111001000001
11111110101010101010101111111
00000000100100110111100000000
00110011111001010001111010000
11011101010001101111101111101
01111010011101001100001110110
01001101001110011100100110001
10011110111000101001110100111
00110000000000100111001101101
10000011110110100001100111011
00001101100001101010000011000
11001011001101010110110111000
01011001001001001100110100100
10001110010111011000001110000
00101101001101111111011000100
01111011010010000110111111100
00000000100010111100100011011
11111110101110010011101010110
10000010000000110000100010010
10111010010111011110111111100
10111010101100100111000011010
10111010111111000100100101101
10000010010001000000100011010
11111110011011011100100101010`);

export const DIGITS = {
	'0':  M(`01110
			 10001
			 10001
			 10001
			 10001
			 10001
			 10001
			 01110`),
	'1':  M(`00100
			 01100
			 00100
			 00100
			 00100
			 00100
			 00100
			 01110`),
	'2':  M(`01110
			 10001
			 00001
			 00010
			 00100
			 01000
			 10000
			 11111`),
	'3':  M(`01110
			 10001
			 00001
			 00110
			 00001
			 00001
			 10001
			 01110`),
	'4':  M(`00010
			 00110
			 01010
			 10010
			 11111
			 00010
			 10010
			 00010`),
	'5':  M(`11111
			 10000
			 10000
			 11110
			 00001
			 00001
			 10001
			 01110`),
	'6':  M(`00110
			 01000
			 10000
			 11110
			 10001
			 10001
			 10001
			 01110`),
	'7':  M(`11111
			 00001
			 00010
			 00010
			 00100
			 00100
			 01000
			 10000`),
	'8':  M(`01110
			 10001
			 10001
			 01110
			 10001
			 10001
			 10001
			 01110`),
	'9':  M(`01110
			 10001
			 10001
			 10001
			 01111
			 00001
			 00010
			 01100`)
};