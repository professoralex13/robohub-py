module.exports = {
    root: true,
    extends: ['@synaptic-simulations/eslint-config', 'plugin:tailwindcss/recommended'],
    plugins: ['no-relative-import-paths'],
    rules: {
        'import/no-extraneous-dependencies': 'off',
        'tailwindcss/no-custom-classname': 'off',
        'no-relative-import-paths/no-relative-import-paths': [
            'error',
            { allowSameFolder: true, rootDir: 'src' },
        ],
    },
};
