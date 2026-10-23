# IDM 241 — Microinteractions

**Quinn Kessler** · Drexel University · Fall 2026

Coursework for IDM 241. Each assignment recreates a real-world microinteraction in HTML and CSS.

## Alpha Build: Pinterest Save Button

A working recreation of a Pinterest pin and its Save button, built with **HTML and CSS only** (no JavaScript).

- **Hover the pin:** a dark overlay appears with a Board button, a Save button and a share icon.
- **Hover the Board button:** a gray background appears.
- **Hover the Save button:** it turns darker red.
- **Click Save:** the button turns black and reads "Saved", and the Board button becomes underlined.

The click works with a hidden checkbox and a `<label>`: clicking Save checks the box, and the `:checked` selector in CSS switches the pin to its saved look.

Original interaction: [pinterest.com](https://www.pinterest.com/). Log in, then hover any pin on the Home feed.

## Files

```
idm241_qbk23/
└── alpha/
    ├── index.html        Alpha write-up with screenshots
    ├── images/           Screenshots and GIF of the original interaction
    └── build/
        ├── build.html    Working Alpha Build page
        ├── style.css     Styles and hover/click states
        └── images/
            └── pin.jpg   Pin image
```

## View it

Live site: [idm241-qbk23.vercel.app/idm241_qbk23/alpha/build/build.html](https://idm241-qbk23.vercel.app/idm241_qbk23/alpha/build/build.html)
