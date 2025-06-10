// import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import ecTwoSlash from 'expressive-code-twoslash'

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default {
	// themes: ['vitesse-black'],
	// You can optionally override the plugin's default settings here
	frames: {
		// Example: Hide the "Copy to clipboard" button
		showCopyToClipboardButton: true,
	},
	styleOverrides: {
		// You can optionally override the plugin's default styles here
		// borderColor: 'green',
		frames: {
			// shadowColor: '#124',
		},
	},
	plugins: [ecTwoSlash({
		explicitTrigger: true,
		includeJsDoc: true,
		languages: ['ts'],
		// twoslashOptions: {
		// 	extraFiles: {
		// 		'green_dot.ts': `declare const env: 'string'`,
		// 	},
		// }
	})],

}