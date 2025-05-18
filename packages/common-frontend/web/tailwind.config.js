const radixColors = require('@radix-ui/colors');
const { createPlugin } = require('windy-radix-palette');

const colors = createPlugin({
    colors: {
        purple: radixColors.purple,
        purpleDark: radixColors.purpleDark,
        blue: radixColors.blue,
        blueDark: radixColors.blueDark,
        slate: radixColors.slate,
        slateDark: radixColors.slateDark,
        amber: radixColors.amber,
        amberDark: radixColors.amberDark,
    },
});

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/*.html', './src/partials/*.html', './src/scripts/*.ts'],
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

    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        colors.plugin,
    ],
};
