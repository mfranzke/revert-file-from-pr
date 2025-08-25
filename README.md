<!--
SPDX-FileCopyrightText: 2025 Maximilian Franzke <mfr@nzke.net>

SPDX-License-Identifier: MIT
-->

# Revert File From Pull Request GitHub Action

[![MIT license](https://img.shields.io/github/license/mfranzke/ "license MIT badge")](https://opensource.org/licenses/mit-license.php)
[![Default CI/CD Pipeline](https://github.com/mfranzke//actions/workflows/test.yml/badge.svg)](https://github.com/mfranzke//actions/workflows/default.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](CODE-OF-CONDUCT.md)

This GitHub Action helps you revert a file in a Pull Request (PR) back to the base branch version when a comment like:

```
/revert-file path/to/file.txt
```

## Usage

```yaml
- uses: mfranzke/revert-file-from-pr@v0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```
