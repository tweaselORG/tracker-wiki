{
  "title": "Tracker Wiki",
  "cascade": [
    {
      "type": "docs",
      "_target": {
        "path": "/**"
      }
    },
    {
      "bookCollapseSection": true,
      "_target": {
        "path": "/**/_index.md"
      }
    }
  ]
}

This wiki documents the tracker adapters used by [TrackHAR](https://github.com/tweaselORG/TrackHAR) to extract transmitted data from tracking requests in mobile apps. The adapter pages are automatically generated from the TrackHAR code and grouped by their tracking company. The wiki is maintained by [Datenanfragen.de e.&thinsp;V.](https://www.datarequests.org/verein) and all information is published under a Creative Commons CC0 1.0 Universal license.

## What is adapter-based matching?

In order to attribute tracking violations to data transmissions, one needs to detect that data has actually been transmitted. To find the data in a HTTP(S) request, the typical approach is to use indicator-based matching. In that case, the tracking software is seeded with known honey data, such as the advertising ID, location data, name or address. This known data is then searched in the request data. This approach has some merit, but also introduces some problems, in particular:

- Typically, the requests use formats which are encoded in non-standard, nested ways. Because of that, indicators are hard to find in the request.
- Not all data types are able to be matched using indicator-based matching, e.g. the OS version or battery state might only be one number that could change often.

For these reasons, we use an adapter-based approach. That means, we have written code for several typical tracking endpoints we observed in the analysis of mobile app traffic. It decodes the particular encoding format for the endpoint and extracts the transmitted data from the decoded request. Writing these adapters requires a lot of manual research, but our findings suggest that we can find a lot of tracking data with only a fairly small number of adapters.

## How to use the adapters?

You can use the adapters with [TrackHAR](https://github.com/tweaselORG/TrackHAR), a JavaScript library that extracts data from a HAR file containing your request data. You can read more on how to use TrackHAR in the [GitHub repository](https://github.com/tweaselORG/TrackHAR).
