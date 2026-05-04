#!/usr/bin/env bash
set -euo pipefail

# Settings
WIDTH=10   # target width in px
QUALITY=65 # WebP quality (0-100, lower = smaller)
CLEVEL=6   # WebP compression level (0-6, higher = slower/smaller)

# Only the 11 images used in ServiceMeta
files=(
   "Services-1.TherapeuticMassage.jpg"
   "Services-2.DeepTissueMassage.jpg"
   "swedish-massage.jpg"
   "Services-4.CuppingMassage.jpg"
   "Services-6.LymphaticMassage.jpg"
   "Services-7.jpg"
   "Services-8.jpg"
   "bucal-massage.jpg"
   "couples-massage.jpg"
   "injury.png"
   "hilot.png"
)

for src in "${files[@]}"; do
   if [[ ! -f "$src" ]]; then
      echo "WARN: not found: $src" >&2
      continue
   fi

   base="${src%.*}"
   out="blur-${base}.webp"

   # -2 for height keeps aspect ratio and rounds to even (safer for codecs)
   # 'area' kernel is good for strong downscaling; then apply Gaussian blur.
   ffmpeg -hide_banner -loglevel error -y \
      -i "$src" \
      -vf "scale=${WIDTH}:-2:flags=area" \
      -map_metadata -1 \
      -c:v libwebp -q:v ${QUALITY} -compression_level ${CLEVEL} \
      "$out"

   echo "Wrote $out"
done

echo "Done."
