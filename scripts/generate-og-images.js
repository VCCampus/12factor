const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

function createOGImage(text, outputPath) {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#059669');
  gradient.addColorStop(0.5, '#10b981');
  gradient.addColorStop(1, '#34d399');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Add geometric pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 100, 0);
    ctx.lineTo(i * 100, 630);
    ctx.stroke();
  }
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 90);
    ctx.lineTo(1200, i * 90);
    ctx.stroke();
  }

  // Main title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('12Factor.me', 600, 250);

  // Subtitle
  ctx.font = '36px sans-serif';
  ctx.fillText(text, 600, 350);

  // Footer
  ctx.font = '24px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('Four-Stage Twelve-Principle Programming Methodology', 600, 450);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

// Generate English version
createOGImage(
  'Vibe Coding for 10x Engineering',
  path.join(__dirname, '../public/og-image.png')
);

// Generate Chinese version
createOGImage(
  'Vibe Coding 实现 10x Engineering',
  path.join(__dirname, '../public/og-image-zh.png')
);

console.log('OG images generated successfully!');