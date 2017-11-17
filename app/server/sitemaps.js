/**
 * This file is loaded outside the main initialization workflow, so we include here startup/both/index.js manually.
 */
import '../imports/startup/both/index.js';
import SiteMapGenerator from '../imports/lib/util/sitemap-generator.js';

sitemaps.add('/sitemap.xml', SiteMapGenerator.generate());
