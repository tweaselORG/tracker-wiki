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

## License

This code and the wiki are licensed under a Creative Commons CC0 1.0 Universal license, see the [`LICENSE`](LICENSE) file for details.

Issues and pull requests are welcome! Please be aware that by contributing, you agree for your work to be licensed under a CC0 license.
