import { getPublishedTemplates, getTemplateById } from '../src/lib/templates';

const t = getTemplateById('ref-weekend-ai-projects');
console.log('Template found:', !!t);
if (!t) {
  process.exit(1);
}

console.log('Template Name:', t.name);
console.log('Total Slides:', t.slides.length);
console.log('Category:', t.category);
console.log('Thumbnail URL:', t.thumbnailUrl);
console.log('Cover Slide background:', t.slides[0]?.background);
console.log('Cover Slide elements count:', t.slides[0]?.elements.length);
console.log('Project 01 Slide elements count:', t.slides[1]?.elements.length);
console.log('CTA Slide elements count:', t.slides[13]?.elements.length);

const all = getPublishedTemplates();
const inPublished = all.some(x => x.id === 'ref-weekend-ai-projects');
console.log('Present in getPublishedTemplates():', inPublished);

if (inPublished && t.slides.length === 14) {
  console.log('VERIFICATION_SUCCESSFUL: 14 slides fully configured and verified!');
} else {
  console.error('VERIFICATION_FAILED');
  process.exit(1);
}
