#!/usr/bin/env python3
"""
Original background score for the Rana service videos.

Pure synthesis (numpy) — no samples, no third-party music, so there are no
licensing questions. Cinematic-corporate electronic: four-on-the-floor kick,
off-beat hats, sub bass on chord roots, detuned saw pad chords, a riser + whoosh
into every scene change, and an impact hit + tail on the final call-to-action.

usage: make-music.py OUT.wav DURATION BPM KEY_MIDI "cut1,cut2,..." CTA_TIME [variant]
"""
import sys
import wave

import numpy as np

SR = 44100


def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    sus = max(0, n - a - d - r)
    e = np.concatenate([
        np.linspace(0, 1, max(a, 1)),
        np.linspace(1, s, max(d, 1)),
        np.full(sus, s),
        np.linspace(s, 0, max(r, 1)),
    ])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def lowpass(x, cutoff):
    """one-pole low-pass; cutoff may be an array (per-sample sweep)"""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def lowpass_fast(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    from scipy.signal import lfilter  # noqa: F401 (optional speed-up)

    return lfilter([1 - a], [1, -a], x)


def lp(x, cutoff):
    try:
        if np.isscalar(cutoff):
            return lowpass_fast(x, cutoff)
    except Exception:
        pass
    return lowpass(x, cutoff)


def hp(x, cutoff):
    return x - lp(x, cutoff)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def saw(f, t, phase=0.0):
    return 2 * ((f * t + phase) % 1.0) - 1


def place(buf, sig, start):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def main():
    out, dur, bpm, key, cuts, cta = sys.argv[1:7]
    variant = int(sys.argv[7]) if len(sys.argv) > 7 else 0
    dur, bpm, key, cta = float(dur), float(bpm), int(key), float(cta)
    cuts = [float(c) for c in cuts.split(",") if c]
    rng = np.random.default_rng(42 + variant)
    n = int(dur * SR)
    t = np.arange(n) / SR
    beat = 60.0 / bpm
    L = np.zeros(n)
    R = np.zeros(n)

    # chord progression (minor key, cinematic): i – VI – III – VII
    prog = [
        [0, 3, 7, 12],
        [-4, 0, 3, 8],
        [3, 7, 10, 15],
        [-2, 2, 5, 10],
    ]
    if variant == 1:
        prog = [[0, 3, 7, 10], [-4, 0, 3, 7], [-7, -3, 0, 5], [-2, 2, 5, 9]]
    if variant == 2:
        prog = [[0, 4, 7, 11], [-3, 0, 4, 9], [-5, -1, 2, 7], [-7, -3, 0, 4]]  # brighter major for corporate
    bar = beat * 4
    chord_len = bar * 2

    # ── pad ──
    pad = np.zeros(n)
    k = 0
    start = 0.0
    while start < dur:
        notes = prog[k % len(prog)]
        seg_n = int(min(chord_len, dur - start) * SR) + int(0.6 * SR)
        tt = np.arange(seg_n) / SR
        s = np.zeros(seg_n)
        for m in notes:
            f = midi(key + 12 + m)
            for det in (-0.12, 0.0, 0.11):
                s += saw(f * 2 ** (det / 12), tt, rng.random())
        s /= len(notes) * 3
        s *= env_adsr(seg_n, 0.6, 0.4, 0.85, 0.7)
        place(pad, s, start)
        start += chord_len
        k += 1
    # slow filter sweep opening across the piece
    sweep = 500 + 2600 * (0.5 - 0.5 * np.cos(np.minimum(t / dur, 1) * np.pi))
    pad = lowpass(pad, sweep)
    pad_gain = 0.32

    # ── sub bass (roots, eighth-note pulse) ──
    bass = np.zeros(n)
    step = beat / 2
    i = 0
    tm = beat * 4  # bass enters after one bar
    while tm < dur:
        chord = prog[int(tm // chord_len) % len(prog)]
        f = midi(key - 12 + chord[0])
        ln = int(step * 0.9 * SR)
        tt = np.arange(ln) / SR
        s = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt)
        s *= env_adsr(ln, 0.005, 0.08, 0.6, 0.05) * (1.0 if i % 2 == 0 else 0.7)
        place(bass, s, tm)
        tm += step
        i += 1
    bass_gain = 0.34

    # ── drums ──
    kick = np.zeros(n)
    hats = np.zeros(n)
    kl = int(0.32 * SR)
    kt = np.arange(kl) / SR
    kf = 48 + 110 * np.exp(-kt * 28)
    ksig = np.sin(2 * np.pi * np.cumsum(kf) / SR) * np.exp(-kt * 9)
    ksig += 0.25 * np.exp(-kt * 120) * rng.standard_normal(kl) * 0.3
    hl = int(0.06 * SR)
    hsig = hp(rng.standard_normal(hl), 7000) * np.exp(-np.arange(hl) / SR * 70)
    tm = bar * 1  # drums after first bar
    b = 0
    while tm < dur - 0.05:
        # drop drums briefly before each cut (tension) and in the last 0.6s
        near_cut = any(c - beat * 1.0 < tm < c for c in cuts)
        if not near_cut and tm < dur - 0.6:
            place(kick, ksig, tm)
            place(hats, hsig * (0.6 if b % 2 else 0.35), tm + beat / 2)
            if b % 2 == 1:
                place(hats, hsig * 0.25, tm + beat * 0.75)
        tm += beat
        b += 1
    kick_gain, hat_gain = 0.55, 0.16

    # ── risers + whooshes into each cut ──
    fx = np.zeros(n)
    for c in cuts:
        rl = int(1.4 * SR)
        rt = np.arange(rl) / SR
        noise = rng.standard_normal(rl)
        rise = lowpass(noise, 300 + 6000 * (rt / rt[-1]) ** 2) * (rt / rt[-1]) ** 2
        place(fx, rise * 0.55, c - 1.4)
        wl = int(0.7 * SR)
        wt = np.arange(wl) / SR
        wh = lowpass(rng.standard_normal(wl), 4000 * np.exp(-wt * 5) + 200) * np.exp(-wt * 6)
        place(fx, wh * 0.9, c)
        # soft boom
        bl = int(1.2 * SR)
        bt = np.arange(bl) / SR
        place(fx, np.sin(2 * np.pi * (40 + 30 * np.exp(-bt * 8)) * bt) * np.exp(-bt * 3.2) * 0.55, c)

    # ── final impact + shimmer tail on the CTA ──
    il = int(3.5 * SR)
    it = np.arange(il) / SR
    impact = np.sin(2 * np.pi * (36 + 60 * np.exp(-it * 10)) * it) * np.exp(-it * 2.2)
    impact += lowpass(rng.standard_normal(il), 2500) * np.exp(-it * 6) * 0.5
    chord = prog[0]
    shimmer = sum(np.sin(2 * np.pi * midi(key + 24 + m) * it) for m in chord) / len(chord)
    impact += shimmer * np.exp(-it * 0.9) * 0.18
    place(fx, impact * 0.9, cta)

    mono = pad * pad_gain + bass * bass_gain + kick * kick_gain + fx * 0.45
    # stereo: hats & pad width
    L = mono + hats * hat_gain * 0.8 + np.roll(pad, int(0.011 * SR)) * 0.08
    R = mono + hats * hat_gain * 1.2 + np.roll(pad, int(0.017 * SR)) * 0.08

    # fades
    fade_in = np.clip(t / 0.4, 0, 1)
    fade_out = np.clip((dur - t) / 1.2, 0, 1)
    L *= fade_in * fade_out
    R *= fade_in * fade_out

    # soft clip + normalise to -1 dBFS peak
    st = np.stack([L, R], axis=1)
    st = np.tanh(st * 1.2)
    st /= np.max(np.abs(st)) / 0.89
    data = (st * 32767).astype("<i2")
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print("wrote", out, f"{dur:.1f}s")


if __name__ == "__main__":
    main()
