import prisma from "@/lib/prisma";

function darken(hex, amount = 20) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return '#000000';
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Each font key maps to: Google Fonts URL + CSS font-family stack
const FONTS = {
  'Playfair': {
    url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap',
    heading: '"Playfair Display", Georgia, serif',
    body: '"Lato", ui-sans-serif, system-ui, sans-serif',
  },
  'Cormorant': {
    url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Nunito:wght@300;400;600&display=swap',
    heading: '"Cormorant Garamond", Georgia, serif',
    body: '"Nunito", ui-sans-serif, system-ui, sans-serif',
  },
  'Libre': {
    url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600&display=swap',
    heading: '"Libre Baskerville", Georgia, serif',
    body: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif',
  },
  'Modern': {
    url: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap',
    heading: '"DM Serif Display", Georgia, serif',
    body: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  },
  'Elegant': {
    url: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap',
    heading: '"EB Garamond", Georgia, serif',
    body: '"Jost", ui-sans-serif, system-ui, sans-serif',
  },
  'Clean': {
    url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',
    heading: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    body: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  },
};

export default async function StyleInjector() {
  const settingsArray = await prisma.setting.findMany();
  const settings = settingsArray.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const primary = settings.theme_primary || '#1a2b3c';
  const secondary = settings.theme_secondary || '#ffffff';
  const fontKey = settings.theme_font || 'Playfair';
  const font = FONTS[fontKey] || FONTS.Playfair;
  const primaryHover = darken(primary);

  // Determine if background is dark to adjust text color
  const r = parseInt(secondary.slice(1, 3), 16) || 255;
  const g = parseInt(secondary.slice(3, 5), 16) || 255;
  const b = parseInt(secondary.slice(5, 7), 16) || 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.5 ? '#1a1a1a' : '#f5f5f5';
  const mutedColor = luminance > 0.5 ? '#6b7280' : '#a1a1aa';

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={font.url} rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${primary};
          --primary-hover: ${primaryHover};
          --secondary-color: ${secondary};
          --text-color: ${textColor};
          --muted-color: ${mutedColor};
          --heading-font: ${font.heading};
          --body-font: ${font.body};
        }
        body {
          background-color: var(--secondary-color);
          color: var(--text-color);
          font-family: var(--body-font);
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--heading-font);
          color: var(--primary-color);
        }
        .font-serif {
          font-family: var(--heading-font) !important;
        }
      `}} />
    </>
  );
}
