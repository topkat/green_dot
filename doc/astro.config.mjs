// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'

import tailwindcss from '@tailwindcss/vite'


// https://astro.build/config
export default defineConfig({
	site: 'https://greendotjs.com', // TODO replace when in prod
	integrations: [
		react(),
		starlight({
			title: 'green_dot documentation',
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Hero: './src/components/SiteHero.astro',
			},
			editLink: {
				baseUrl: 'https://github.com/topkat/green_dot', // TODO
			},
			logo: { src: './src/assets/green_dot-logo.png' },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/topkat/green_dot' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Quick Start', slug: 'guides/quickstart' },
						{ label: 'Key Concepts', slug: 'guides/main-concepts' },
						{ label: 'API Services', slug: 'guides/api-services' },
						{ label: 'Using Database', slug: 'guides/using-database' },
						{ label: 'Models And DAOs', slug: 'guides/models-and-daos' },
						{ label: 'Context Object (ctx)', slug: 'guides/ctx' },
						{ label: 'Error Handling', slug: 'guides/error-handling' },
						{ label: 'Tips and Helpers', slug: 'guides/tips-and-helpers' },
						{ label: 'Schedules', slug: 'guides/schedules' },
						{ label: 'Hooks', slug: 'guides/hook-service' },
						{ label: 'Usage in Frontend', slug: 'guides/frontend-usage' },
					],
				},
				{
					label: 'Plugins',
					autogenerate: { directory: 'plugins' },
					// items: [
					// 	{ label: 'API Key Authentication', slug: 'plugins/api-key-authentication' },
					// 	{ label: 'Double Authentication', slug: 'plugins/double-authentication' },
					// 	{ label: 'Managed Authentication', slug: 'plugins/managed-authentication' },
					// ],
				},
			],
			customCss: [
				// Fontsource files for to regular and semi-bold font weights.
				'@fontsource/dm-mono/300.css',
				'@fontsource/dm-mono/400.css',
				'@fontsource/dm-mono/500.css',
				// Path to your Tailwind base styles:
				'./src/global.css',
			],
		}),
	],

	vite: {
		plugins: [tailwindcss()],
	},
})