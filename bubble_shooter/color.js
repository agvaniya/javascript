// conversions are based on https://css-tricks.com/converting-color-spaces-in-javascript/
class Color {
  constructor(r, g, b, a) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a || 1;
    [this._h, this._s, this._l] = this._hsl();
  }

  get r() {
    return this._r;
  }

  get g() {
    return this._g;
  }

  get b() {
    return this._b;
  }

  set r(rr) {
    this._r = rr;
    [this._h, this._s, this._l] = this._hsl();
  }

  set g(gg) {
    this._g = gg;
    [this._h, this._s, this._l] = this._hsl();
  }

  set b(bb) {
    this._b = bb;
    [this._h, this._s, this._l] = this._hsl();
  }

  get h() {
    return this._h;
  }

  get s() {
    return this._s;
  }

  get l() {
    return this._l;
  }

  set h(hh) {
    this._h = hh;
    [this._r, this._g, this._b] = this._rgb();
  }

  set s(ss) {
    this._s = ss;
    [this._r, this._g, this._b] = this._rgb();
  }

  set l(ll) {
    this._l = ll;
    [this._r, this._g, this._b] = this._rgb();
  }

  get a() {
    return this._a;
  }

  set a(aa) {
    this._a = Math.max(0, aa);
  }

  rgb() {
    return `rgb(${this._r},${this._g},${this._b})`;
  }

  rgba() {
    return `rgba(${this._r},${this._g},${this._b}, ${this._a})`;
  }

  _hsl() {
    const r = this.r / 255,
      g = this.g / 255,
      b = this.b / 255;
    let h = 0,
      s = 0,
      l = 0;
    const cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin;
    if (delta == 0) h = 0;
    // Red is max
    else if (cmax == r) h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g) h = (b - r) / delta + 2;
    // Blue is max
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    // Make negative hues positive behind 360°
    if (h < 0) h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
  }

  _rgb() {
    const h = this.h,
      s = this.s / 100,
      l = this.l / 100,
      c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return [r, g, b];
  }

  hsla() {
    return `hsla(${this.h},${this.s},${this.l},${this.a}`;
  }
}
