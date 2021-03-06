'use strict';

const fs = require('fs-extra');
const micromatch = require('micromatch');
const path = require('path');

module.exports = findWorkspaceRoot;

/**
 * Adapted from:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 * @param {string} initial
 * @return {string|null}
 */
function findWorkspaceRoot(initial) {
  let previous = null;
  let current = path.normalize(initial);

  do {
    const manifest = readPackageJSON(current);
    if (manifest && manifest.workspaces) {
      const relativePath = path.relative(current, initial);
      if (relativePath === '' || micromatch([relativePath], manifest.workspaces).length > 0) {
        return current;
      } else {
        return null;
      }
    }

    previous = current;
    current = path.dirname(current);
  } while (current !== previous);

  return null;
}

function readPackageJSON(dir) {
  const file = path.join(dir, 'package.json');
  if (fs.pathExistsSync(file)) {
    return fs.readJsonSync(file);
  }
  return null;
}
