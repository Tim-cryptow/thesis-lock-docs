// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

const SITE = 'https://thesis-lock-docs.vercel.app';
const REPO = 'https://github.com/Tim-cryptow/thesis-lock';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: 'ThesisLock Docs',
      description:
        'Documentation for ThesisLock, a hash-anchoring proof-of-existence service for documents on the Stacks blockchain, secured by Bitcoin.',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: `${SITE}/og.png` },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: REPO },
        { icon: 'external', label: 'Live app', href: 'https://thesis-lock.vercel.app' },
      ],
      editLink: {
        baseUrl:
          'https://github.com/Tim-cryptow/thesis-lock-docs/edit/main/',
      },
      lastUpdated: true,
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          errorOnFallbackPages: false,
        }),
      ],
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Introduction', slug: 'introduction' },
            { label: 'Quickstart', slug: 'quickstart' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'Anchor types', slug: 'concepts/anchor-types' },
            { label: 'The SHA-256 model', slug: 'concepts/hashing-model' },
            { label: 'On-chain truth vs the index', slug: 'concepts/on-chain-vs-index' },
            { label: 'Blocks, timestamps, finality', slug: 'concepts/blocks-and-finality' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Web app', slug: 'guides/web-app' },
            { label: 'Verifying a document', slug: 'guides/verifying' },
            { label: 'Scripting and CI', slug: 'guides/scripting-and-ci' },
          ],
        },
        {
          label: 'Reference',
          items: [
            {
              label: 'Smart contracts',
              items: [
                { label: 'Overview', slug: 'reference/contracts/overview' },
                { label: 'thesislock', slug: 'reference/contracts/thesislock' },
                { label: 'thesislock-batch', slug: 'reference/contracts/thesislock-batch' },
                { label: 'thesislock-registry', slug: 'reference/contracts/thesislock-registry' },
                { label: 'thesislock-proof', slug: 'reference/contracts/thesislock-proof' },
                { label: 'thesislock-groups', slug: 'reference/contracts/thesislock-groups' },
                { label: 'Error codes', slug: 'reference/contracts/error-codes' },
                { label: 'Calling read-only functions', slug: 'reference/contracts/calling-read-only' },
              ],
            },
            { label: 'SDK', slug: 'reference/sdk' },
            { label: 'CLI', slug: 'reference/cli' },
            { label: 'REST API', slug: 'reference/rest-api' },
            { label: 'GitHub Action', slug: 'reference/github-action' },
            { label: 'Feeds and Webhooks', slug: 'reference/feeds-and-webhooks' },
          ],
        },
        {
          label: 'Resources',
          items: [
            { label: 'FAQ', slug: 'resources/faq' },
            { label: 'Glossary', slug: 'resources/glossary' },
            { label: 'Troubleshooting', slug: 'resources/troubleshooting' },
            { label: 'Changelog and links', slug: 'resources/changelog' },
            { label: 'Contributing', slug: 'resources/contributing' },
          ],
        },
      ],
    }),
  ],
});
