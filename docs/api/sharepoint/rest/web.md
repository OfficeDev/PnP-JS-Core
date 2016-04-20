
#PnP JavaScript Core#
##API Reference - PnP##

Object, contains methods for working with a sharepoint web

**Source**: [rest.ts](../../../../src/sharepoint/rest/rest.ts)

###Properties###
Name | Description
---- | -----------
contentTypes| ContentTypes
roleAssignments| RoleAssignments
lists| Lists
navigation| Navigation
siteUsers| SiteUsers

###Functions###

Name | Description
---- | -----------
get() | Return a promise which when resolved will get the properties of the current web
select(params) | Add OData select params to the query. When .get() is called it will execute the build query inside a promise. Usage: ```.sharepoint.rest.web.select("Created", "MasterUrl", "ServerRelativeUrl").get().then(function(data) { console.log(data.Created); })```
filter(params) | Add OData select params to the query. When .get() is called it will execute the build query inside a promise. Usage: ```pnp.sharepoint.rest.web.filter("Title eq 'WouldProbablyNotFilterByWebTitle').get().then(function(data) { console.log(data[0]); })```
