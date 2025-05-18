import {
    amber,
    amberDark,
    purple,
    purpleDark,
    blue,
    blueDark,
    slate,
    slateDark,
} from '@radix-ui/colors';
import { createPlugin } from 'windy-radix-palette';
import { resolveCommonPath } from '@vorschlagswesen/common-frontend';

import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

const colors = createPlugin({
    colors: {
        purple,
        purpleDark,
        blue,
        blueDark,
        slate,
        slateDark,
        amber,
        amberDark,
    },
});

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/*.html',
        './src/partials/*.html',
        './src/scripts/*.ts',
        `${resolveCommonPath('partials')}/*.html`,
        `${resolveCommonPath('scripts')}/*.ts`,
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: colors.alias('blue'),
                secondary: colors.alias('purple'),
                neutral: colors.alias('slate'),
                standout: colors.alias('amber'),
            },
        },
    },

    plugins: [typography, aspectRatio, colors.plugin],
};
