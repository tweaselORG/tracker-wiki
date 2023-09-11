{
  "title": "Research documentation",
  "weight": 0,
  "bookCollapseSection": true,
  "bookFlatSection": true,
  "cascade": [
        {
            "type": "research",
            "_target": {
                "path": "/research/**"
            }
        }
    ]
}

# Research documentation

In the documentation for the tracker adapters, we attribute types of data to paths in the decoded requests. These attributions are the result of our research and we provide the reasons in the tables in the tracker documentation and in the adapter objects in TrackHAR (in the `reasoning` field), so that others don’t have to trust our results blindly. We decided on a finite set of justifications that we will give listed here in the order that we will go through when choosing a reason:

1. **Public documentation**  
  Sometimes, we might find documentation by the tracking company itself on which data is being transmitted. If this is the case, we will link to the relevant sections of this documentation instead of giving a simple reason for why we classified a particular path.
2. **Tracker SDK source code**  
  If we can find or otherwise analyze the source code of the tracker SDK, we will try to use it to find out what data is transmitted in the end. We will explain that in a short write-up of our investigation, contained in this section and linked to from the adapter.
3. **Obvious property name**  
  Often, the (decoded) properties just have unambiguously obvious names that match up to the data types we want to detect, such as `operatingSystem` or `idfa`. If this is the case, we give this reason and sort the path to the property after a small coherence check with our observed data.  
4. **Observed values match known device parameters**  
  Since we know and control (some of) the environment the apps and trackers are running in, we can correlate the transmitted data to the device parameters. If we suspect a particular data type at a path and it always contains the data we expect for the used test environment, we give this reason.  
5. **Obvious observed values**  
  If we always find the same kind of data that is consistent with the format and/or content of a particular data type, we assume that it will always contain such data. Consider one example of a set of data we found at the same path in several requests: `com.elevateapp.elevate`, `com.nike.onenikecommerce`, `com.oyo.consumer`. Those all look like app IDs of the apps we tested, so from the values we can conclude that this must be the app ID of the the app the tracker is implemented in.
6. **Experiments**  
  If we don’t find any documentation, but the type of data in a path is also not obvious at first, we will do some experiments and try to get at which type of data is transmitted by correlating the data transmission to what we know about their circumstances. We will then do a write-up of the results and why we think that they constitute a specific type of data transmission, to which we will also link in the adapter. This documentation of our research can be found in this section.
