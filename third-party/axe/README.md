# Axe

We use the internal `valid-langs.js` module in the axe package in the `href` audit.

The axe package is not published with the correct `package.json` to allow importing
of its `lib`, so we must extract it.

## Update

```bash
sh lighthouse-core/scripts/copy-axe-valid-langs.sh
```
