# Local web fonts

These fonts are distributed under the SIL Open Font License 1.1. The complete licenses are in `Fraunces-OFL.txt` and `MonaSans-OFL.txt` in this directory.

## Fraunces

Copyright 2018 The Fraunces Project Authors.
https://github.com/undercasetype/Fraunces

Source normal and italic variable TTF files came from https://github.com/google/fonts/tree/main/ofl/fraunces, version 1.000, b76b70a41.

The local WOFF2 subsets retain normal and italic styles, optical size 9-144, and SOFT 0-100. Dedicated weight-400 files serve regular text. Separate variable files retain weights 300-700 for other text; CSS declares their ranges as 300-399 and 401-700 so weight 400 selects the smaller files unambiguously. WONK is pinned at its original default of 1. Latin characters, common punctuation, and all font-supported characters present in the site are retained. All OpenType layout features are retained. TrueType hints are removed. Built with FontTools 4.67.0.

## Mona Sans

Copyright 2022 The Mona Sans Project Authors.
https://github.com/github/mona-sans
Reserved Font Name: Mona.

The local normal and italic WOFF2 Latin files are unchanged copies of the files served by Google Fonts for Mona Sans, weight 200-900, normal width. No local subsetting, instancing, or renaming was applied.

Normal: https://fonts.gstatic.com/s/monasans/v4/o-0bIpQmx24alC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2
Italic: https://fonts.gstatic.com/s/monasans/v4/o-0ZIpQmx24alC5A4PNr4C5OaxRsfNNlKbCePevtuXOm.woff2

## Delivery

The files in `src/assets/fonts` are referenced by `src/styles/fonts.css`. The production build emits content-hashed URLs. Font faces use `font-display: swap`; characters absent from a font use the declared system fallback stack.
