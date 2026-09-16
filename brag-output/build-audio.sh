#!/usr/bin/env bash
# Build the video's single master audio track.
#
# There is no music in this piece on purpose: the library bundled with /brag is
# upbeat corporate and an epic stock trailer bed is the sound of the generic
# fantasy advert this server is not. What carries it instead is a synthesised
# cold wind and six placed hits, mixed here rather than as separate <audio>
# elements so the balance is decided once and rendered identically every time.
#
# Wind is brown noise through a low pass with a slow swell. Hits are Kenney CC0
# samples, pitched down by resampling so metal reads as heavy rather than tinny.
set -euo pipefail

SFX="$HOME/.claude/skills/brag/assets/sfx"
OUT="composition/assets/bed.m4a"
DUR=22.0

ffmpeg -hide_banner -v error \
  -f lavfi -t "$DUR" -i "anoisesrc=color=brown:r=48000:amplitude=0.6" \
  -f lavfi -t "$DUR" -i "anoisesrc=color=pink:r=48000:amplitude=0.25" \
  -i "$SFX/impact/footstep_snow_000.ogg" \
  -i "$SFX/impact/footstep_snow_002.ogg" \
  -i "$SFX/impact/impactMetal_heavy_000.ogg" \
  -i "$SFX/impact/impactMetal_heavy_002.ogg" \
  -i "$SFX/impact/impactMetal_heavy_004.ogg" \
  -i "$SFX/interface/drop_001.ogg" \
  -i "$SFX/impact/impactBell_heavy_000.ogg" \
  -filter_complex "
    [0:a]lowpass=f=520,highpass=f=45,volume='0.58+0.22*sin(2*PI*t/11.5)':eval=frame,
         volume='min(1,t/2.5)*min(1,(22-t)/2.4)':eval=frame,aformat=channel_layouts=stereo[wind];
    [1:a]bandpass=f=1600:width_type=o:w=2,volume=0.09,
         volume='min(1,t/3)*min(1,(22-t)/2.6)':eval=frame,aformat=channel_layouts=stereo[hiss];

    [2:a]aresample=48000,volume=0.42,adelay=500|500[f1];
    [3:a]aresample=48000,volume=0.36,adelay=2000|2000[f2];

    [4:a]asetrate=44100*0.72,aresample=48000,volume=0.80,adelay=4550|4550[h1];
    [5:a]asetrate=44100*0.72,aresample=48000,volume=0.80,adelay=6850|6850[h2];
    [6:a]asetrate=44100*0.70,aresample=48000,volume=0.86,adelay=9150|9150[h3];

    [7:a]asetrate=44100*0.9,aresample=48000,volume=0.22,adelay=15150|15150[t1];

    [8:a]asetrate=44100*0.62,aresample=48000,volume=0.90,adelay=20250|20250[bell];

    [wind][hiss][f1][f2][h1][h2][h3][t1][bell]amix=inputs=9:duration=first:normalize=0,
      loudnorm=I=-19:TP=-1.5:LRA=11,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[out]
  " \
  -map "[out]" -t "$DUR" -c:a aac -b:a 192k -y "$OUT"

ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
ffmpeg -hide_banner -i "$OUT" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
