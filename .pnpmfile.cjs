/**
 * This file is used to enforce pnpm as the package manager for this project.
 * It will throw an error if npm or yarn is used.
 */
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Add engines field if it doesn't exist
      if (!pkg.engines) {
        pkg.engines = { node: '>=22.0.0', pnpm: '>=8.7.1' };
      }
      return pkg;
    },
  },
};
