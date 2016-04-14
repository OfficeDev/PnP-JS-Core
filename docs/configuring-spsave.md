#PnP JavaScript Core#
##Configuring spsave##

The PnP JavaScript Core project uses [gulp-spsave](https://www.npmjs.com/package/gulp-spsave) in order to upload to SharePoint and requires a little configuration before you get going. 

1. Take a local copy of the [example settings](https://github.com/OfficeDev/PnP-JS-Core/blob/master/settings.example.js), and rename it to `settings.js`

2. This file stores the information regarding your Tenant/Farm. 

Example configuration for O365 and on-premise is shown below. 

#### O365

```javascript

var settings = {
    username: "develina.devsson@mydevtenant.onmicrosoft.com",
    password: "pass@word1",
    siteUrl: "https://mydevtenant.sharepoint.com/" 
}

module.exports = settings;

``` 

#### On-Premise

```javascript

var settings = {
    username: "AUser",
    domain: "DOMAIN",
    workstation: "YOURWORKSTATION"
    password: "pass@word1",
    siteUrl: "https://yoursharepointfarm.domain.com/" 
}

module.exports = settings;

``` 

#### More Settings

Please go to [spsave](https://github.com/s-KaiNet/spsave) for complete documentation