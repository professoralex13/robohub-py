module.exports = {
    root: true,
    extends: ['@synaptic-simulations/eslint-config', 'plugin:tailwindcss/recommended'],
    rules: {
        'import/no-extraneous-dependencies': 'off',
        'tailwindcss/no-custom-classname': 'off',
    },
};
