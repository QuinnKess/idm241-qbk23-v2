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

## Beta: Save to a Board

Write-up of the Beta "medium" microinteractions: the **Board button**, the **Board Row** in the "Save" board picker, and the **Save button**.

- **Board button:** hover shows a dark gray background; click opens the "Save" board picker.
- **Board Row:** hover turns the row light gray and shows a red Save button; click saves the pin to that board.
- **Save button:** same as the Alpha (turns black and reads "Saved").

## Beta Build: Save to a Board

A working recreation of the image card's Board button, board picker window and Save button, built with HTML, CSS and a small amount of JavaScript.

- **Board button:** hover fades in a dark rounded background; click slides the board picker window down from the top over 0.2 seconds.
- **Board row:** hover turns the row light gray and fades in a Row Save button; click saves to that board.
- **Save button:** hover turns it darker red; click turns it black and changes the text to "Saved".
- **Search:** typing in the board picker's search bar filters the boards.

Live: [idm241-qbk23.vercel.app/idm241_qbk23/beta/build/build.html](https://idm241-qbk23.vercel.app/idm241_qbk23/beta/build/build.html)

## Files

```
idm241_qbk23/
├── alpha/
│   ├── index.html        Alpha write-up with screenshots
│   ├── images/           Screenshots and GIF of the original interaction
│   └── build/
│       ├── build.html    Working Alpha Build page
│       ├── style.css     Styles and hover/click states
│       └── images/
│           └── pin.jpg   Pin image
└── beta/
    ├── index.html        Beta write-up with screenshots
    ├── style.css         Beta page styles
    ├── images/           Screenshots and GIF of the board picker
    └── build/
        ├── build.html    Working Beta Build page
        ├── style.css     Styles, hover/click states and timing
        ├── script.js     Opens/closes the picker, saves, search
        └── images/       Image card photo and board thumbnails
```

## View it

Live site: [idm241-qbk23.vercel.app/idm241_qbk23/alpha/build/build.html](https://idm241-qbk23.vercel.app/idm241_qbk23/alpha/build/build.html)
