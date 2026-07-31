$inputs = @(
  "sine=frequency=146.83:duration=7.5:sample_rate=48000", "sine=frequency=220:duration=7.5:sample_rate=48000", "sine=frequency=293.66:duration=7.5:sample_rate=48000", "sine=frequency=349.23:duration=7.5:sample_rate=48000",
  "sine=frequency=116.54:duration=7.5:sample_rate=48000", "sine=frequency=174.61:duration=7.5:sample_rate=48000", "sine=frequency=233.08:duration=7.5:sample_rate=48000", "sine=frequency=293.66:duration=7.5:sample_rate=48000",
  "sine=frequency=130.81:duration=7.5:sample_rate=48000", "sine=frequency=196:duration=7.5:sample_rate=48000", "sine=frequency=261.63:duration=7.5:sample_rate=48000", "sine=frequency=349.23:duration=7.5:sample_rate=48000",
  "sine=frequency=130.81:duration=4.5:sample_rate=48000", "sine=frequency=196:duration=4.5:sample_rate=48000", "sine=frequency=261.63:duration=4.5:sample_rate=48000", "sine=frequency=329.63:duration=4.5:sample_rate=48000",
  "sine=frequency=146.83:duration=3:sample_rate=48000", "sine=frequency=220:duration=3:sample_rate=48000", "sine=frequency=293.66:duration=3:sample_rate=48000", "sine=frequency=349.23:duration=3:sample_rate=48000",
  "sine=frequency=587.33:duration=3:sample_rate=48000", "sine=frequency=698.46:duration=3:sample_rate=48000", "sine=frequency=783.99:duration=3:sample_rate=48000", "sine=frequency=698.46:duration=3:sample_rate=48000", "sine=frequency=523.25:duration=3:sample_rate=48000", "sine=frequency=587.33:duration=3:sample_rate=48000", "sine=frequency=698.46:duration=3:sample_rate=48000", "sine=frequency=783.99:duration=3:sample_rate=48000", "sine=frequency=880:duration=3:sample_rate=48000", "sine=frequency=587.33:duration=3:sample_rate=48000",
  "sine=frequency=73.42:duration=30:sample_rate=48000"
)
$arguments = @("-y")
foreach ($input in $inputs) {
  $arguments += @("-f", "lavfi", "-i", $input)
}
$arguments += @("-filter_complex_script", ".hyperframes/music-filter.txt", "-map", "[out]", "-c:a", "pcm_s16le", ".hyperframes/thalia-orchestral.wav")
& ffmpeg @arguments
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
