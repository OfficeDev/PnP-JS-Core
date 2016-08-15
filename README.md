![Office 365 Developer Patterns and Practices](https://camo.githubusercontent.com/a732087ed949b0f2f84f5f02b8c79f1a9dd96f65/687474703a2f2f692e696d6775722e636f6d2f6c3031686876452e706e67)

# JavaScript Core Component #

[![npm version](https://badge.fury.io/js/sp-pnp-js.svg)](https://badge.fury.io/js/sp-pnp-js) [![Join the chat at https://gitter.im/OfficeDev/PnP-JS-Core](https://badges.gitter.im/OfficeDev/PnP-JS-Core.svg)](https://gitter.im/OfficeDev/PnP-JS-Core?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Downloads](https://img.shields.io/npm/dm/sp-pnp-js.svg)](https://www.npmjs.com/package/sp-pnp-js) [![bitHound Overall Score](https://www.bithound.io/github/OfficeDev/PnP-JS-Core/badges/score.svg)](https://www.bithound.io/github/OfficeDev/PnP-JS-Core)

The Patterns and Practices JavaScript Core Library was created to help developers by simplifying common operations within SharePoint. This is aligned with helping folks transitioning into client side development in support of the upcoming SharePoint Framework. Currently it contains a fluent API for working with the full SharePoint REST API as well as utility and helper functions. This takes the guess work out of creating REST requests, letting developers focus on the what and less on the how.

![pnp in action](http://i.imgur.com/TGT3Xs2.gif)

Please use [http://aka.ms/OfficeDevPnP](http://aka.ms/OfficeDevPnP) for getting latest information around the whole *Office 365 Developer Patterns and Practices program*.

### Get Started ###

**NPM**

Add the npm package to your project

    npm install sp-pnp-js --save-dev

Import the root object and start interacting with the SharePoint REST API

    import pnp from "sp-pnp-js"
	...
	pnp.sp.web.select("Title").get().then(() => ...);

**Bower**

Add the package from bower

    bower install sp-pnp-js


### API Documentation ###

Explore the [API documentation](http://officedev.github.io/PnP-JS-Core/).

These pages are generated from the source comments as part of each release. We are always looking for help making these resources better. To make updates, edit the comments in the source and submit a PR against the dev branch. We will merge it there and refresh the pages as part of each release. Updates made directly to the gh-pages branch will be overwritten.

### Samples Add-In ###

Checkout a [SharePoint hosted Add-In containing samples](https://github.com/OfficeDev/PnP/tree/dev/Samples/SharePoint.pnp-js-core) on using the library from both a SharePoint hosted add-in as well as a script editor web part. This will allow you to execute the samples as well as intract with the API.

### Get Help ###

We have active [Yammer](http://aka.ms/OfficeDevPnPSIGJavaScriptYammer) and [Gitter](https://gitter.im/OfficeDev/PnP-JS-Core) communities dedicated to this library, please join the conversation to ask questions. If you find an issue with the library, please [report it](https://github.com/OfficeDev/PnP-JS-Core/issues).


### Wiki ###

Please see [the wiki](https://github.com/OfficeDev/PnP-JS-Core/wiki) for tips on getting started, configuring your development environment, and using the library.


### Authors ###
This project's contributors include Microsoft and [community contributors](AUTHORS). Work is done as as open source community project.


### Code of Conduct ###
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

### "Sharing is Caring" ###

### Disclaimer ###
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**









