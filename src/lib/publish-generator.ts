import type { Project } from '@shared/types';
const CANONICAL_BASE_URL = 'https://your-domain.com';
export function generatePublishConfig(project: Project) {
  const safeName = project.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50);
  const now = new Date().toISOString();
  // --- wrangler.toml ---
  const wranglerToml = `name = "${safeName}"
main = "src/index.ts"
compatibility_date = "2024-04-05"
[site]
bucket = "./public"
[durable_objects]
bindings = [
  { name = "YOUR_DO_BINDING", class_name = "YourDurableObject" }
]
[vars]
CANONICAL_URL = "${CANONICAL_BASE_URL}"
META_TITLE = "${project.title}"
META_DESCRIPTION = "${project.description}"
`;
  // --- sitemap.xml ---
  const headings = (project.markdown.match(/^#{1,3}\s(.+)/gm) || [])
    .map(h => h.replace(/^#{1,3}\s/, '').toLowerCase().replace(/\s/g, '-'));
  const sitemapUrls = ['', ...headings].map(slug => `
  <url>
    <loc>${CANONICAL_BASE_URL}/${slug ? `#${slug}` : ''}</loc>
    <lastmod>${now}</lastmod>
    <priority>${slug ? '0.8' : '1.0'}</priority>
  </url>`).join('');
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;
  // --- robots.txt ---
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${CANONICAL_BASE_URL}/sitemap.xml
`;
  // --- llm.txt ---
  const llmTxt = `User-agent: *
Disallow: /
`;
  return {
    wranglerToml,
    sitemapXml,
    robotsTxt,
    llmTxt,
  };
}