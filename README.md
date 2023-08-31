# tracker-wiki

> A wiki documenting tracking endpoints and how to extract data from requests to them.

This project automatically generates a human-readable documentation of the tracking adapters in [TrackHAR](https://github.com/tweaselORG/TrackHAR). It documents how TrackHAR recognizes the trackers and sorts them into adapters, what algorithms are used to decode the requests and the locations of data in the decoded requests. Also, we provide some sample information from research data to illustrate what types of data are typically extaracted (currently from @baltpeter's [thesis](https://github.com/baltpeter/thesis-mobile-consent-dialogs)). The aim is to provide a detailed enough documentation so that the results of TrackHAR can be verified independently, e.g in a court case.

The live version is hosted at [trackers.tweasel.org](https://trackers.tweasel.org/) and automatically deployed from this repository.

## Build

tracker-wiki is build statically using the extended version of [Hugo](https://gohugo.io/) (take a look at [how to install it](https://gohugo.io/installation/)). You need at least version `v0.105.0+extended` to build it yourself.
You'll also need a current version of [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) (or npm).

Then you can run the following to build the HTML:

```sh
yarn
yarn build
```

You can find the built HTML in the `public` directory.

If you want to run a development server, you can use:

```sh
yarn watch
```

## Contributing

First of all, contributions are very welcome! Please open a pull request and be available, so we can ask follow-up questions on your contribution, and be aware of the [license](#license) the project is published under.

### Adding a new language

To add a new language, the following things need to be done:

1. Create a new folder with the language code for a name in the `content/` directory by copying the `en` language as a reference. the folder should contain:
    - A `research/` folder containing an `_index.md`
    - A `t/` folder containing an `_index.md`
    - An `_index.md`
2. Delete the generated files in `t`.
3. Translate the titles and contents of the copied files, especially the `_index.md` files. Untranslated files should be deleted.
4. Translate the strings by adding a file named like the language code to the `i18n/` folder.
5. Add the new language to the `config/_default/languages.json` config file.

### Documenting tracker research

This is only a technical explanation of how to document tracker research. A guideline for the quality of the research will be added later.

Each page in the research documentation is added as a [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles). Create a folder for the page. It needs an `index.md` containing a title and some kind of content. If you don‘t want to write anything, you still need to add something like a `&nbsp;`, otherwise, the page won‘t be rendered. Sections, e.g. on specific properties, are added as separate markdown files in the same folder. The name of the file will be used as a fragment to the section on the page. You can specify a title in the frontmatter. If you don‘t, it defaults to: »*`<file basename>` Property*«

## License

This code and the wiki are licensed under a Creative Commons CC0 1.0 Universal license, see the [`LICENSE`](LICENSE) file for details.

Issues and pull requests are welcome! Please be aware that by contributing, you agree for your work to be licensed under a CC0 license.
