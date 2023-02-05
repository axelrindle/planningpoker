// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Planning Poker',
    tagline: 'Yet another Planning Poker application.',
    favicon: 'icons/favicon.ico',

    url: 'https://axelrindle.github.io',
    baseUrl: '/planningpoker/',

    organizationName: 'axelrindle',
    projectName: 'planningpoker',

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/axelrindle/planningpoker/tree/main/docs/docs',
                    showLastUpdateTime: true
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    plugins: [
        [
            '@cmfcmf/docusaurus-search-local',
            {
                indexBlog: false
            }
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: 'Planning Poker',
                logo: {
                    alt: 'Planning Poker Card',
                    src: 'icons/icon-192.png',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'index',
                        position: 'left',
                        label: 'Documentation',
                    },
                    {
                        href: 'https://github.com/axelrindle/planningpoker',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                logo: {
                    alt: 'version-checker logo',
                    src: 'icons/icon-192.png',
                    href: '/',
                    height: 48,
                    style: {
                        margin: 0
                    }
                },
                copyright: `Copyright © ${new Date().getFullYear()} Axel Rindle & Contributors. Built with <a href="https://docusaurus.io/">Docusaurus</a>. Illustrations by <a href="https://undraw.co/">Katerina Limpitsouni</a>.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
