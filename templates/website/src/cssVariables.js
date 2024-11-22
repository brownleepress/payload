// Keep these in sync with the CSS variables in the `_css` directory

const cssVariables = {
  breakpoints: {
    l: 1440,
    m: 1024,
    s: 768,
  },
  colors: {
    base0: 'rgb(255, 255, 255)',
    base100: 'rgb(235, 235, 235)',
    base500: 'rgb(128, 128, 128)',
    base850: 'rgb(34, 34, 34)',
    base1000: 'rgb(0, 0, 0)',
    error500: 'rgb(255, 111, 118)',
  },
  /* Import Poppins font from Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');

  /* Set default styles */
  :root {
    --font-family: 'Poppins', sans-serif;
    --font-size: 18pt;
    --line-height: 1rem;
  }

  body {
    font-family: var(--font-family);
    font-size: var(--font-size);
    line-height: var(--line-height);
    color: var(--text-color, rgb(0, 0, 0)); /* Default text color */
  }

  /* For paragraphs or other text elements, you can define additional styles */
  p {
    font-size: var(--font-size);
    line-height: var(--line-height);
  }
}

export default cssVariables
