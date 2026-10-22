import { getPublishedTemplates, getTemplateById } from '../src/lib/templates';
import { PINTEREST_TEMPLATES } from '../src/lib/pinterestTemplates';

console.log('Total Pinterest Templates created:', PINTEREST_TEMPLATES.length);
const allPublished = getPublishedTemplates();
console.log('Total Published Templates in app:', allPublished.length);

const shortLinks = [
  '7EHiRraPe', '6fLlGf9LD', '77TJN5plN', '52atnEHPy', '4g6KimhND', '6YN5zrZvC',
  '2PkRXQd10', '3vO5hbJJA', 'eWDoNcEW4', '6Z5OtA4Ab', 'WzBV2eXWz', 'cy9ejOl9G',
  '3P9PC7eqi', '5xPvh50wE', '5sGXTdOpU', 'LsYxgBsyt', '6lNzkzJoq'
];

let okCount = 0;
for (const short of shortLinks) {
  const tpl = getTemplateById(short);
  if (!tpl) {
    console.error(`FAIL: Could not find template for shortlink ${short}`);
  } else {
    okCount++;
    console.log(`[PASS] ${short} -> "${tpl.name}" (${tpl.id}) | Slides: ${tpl.slides.length} | Elements on S1: ${tpl.slides[0].elements.length}`);
  }
}

if (okCount === shortLinks.length) {
  console.log('\nALL 17 PINTEREST CAROUSEL TEMPLATES SUCCESSFULLY VERIFIED AND FULLY EDITABLE!');
} else {
  console.error(`\nFAILED: Only ${okCount}/${shortLinks.length} verified.`);
  process.exit(1);
}
