module.exports = {
  include: ["**/*.spec.ts"],
  disclude: [/node_modules/],
  add: ["**/*.include.ts"],
  flags: {
    /** To keep the size of the test binary small, the runtime must be minimal. */
    "--runtime": ["minimal"]
  },
  outputBinary: false
};