/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    // directory name: 'build directory'
    public: "/",
    src: "/dist",
  },
  alias: {
    "@app": "./src",
  },
  plugins: ["@snowpack/plugin-typescript"],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: "es2015",
    treeshake: true,
    splitting: true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
