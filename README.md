# FAR Portfolio

Personal portfolio for Felipe Augusto Rieck, built with Astro, React, and Three.js.

## Development

```sh
yarn install
yarn dev
```

## Build

```sh
yarn build
```

The production output is generated in `dist/`.

## Deployment

This project is configured for GitHub Pages using GitHub Actions.

Required repository setting:

- `Settings > Pages > Build and deployment > Source`: `GitHub Actions`

Custom domain:

```txt
felipe.farsystems.com.br
```

DNS record for the `farsystems.com.br` zone:

```txt
CNAME  felipe  <github-username>.github.io
```

Replace `<github-username>` with the GitHub account or organization that owns the Pages site.

## License

Source code is licensed under MIT. Personal content, resume text, biographical information, brand names, logos, and visual identity assets are all rights reserved.
