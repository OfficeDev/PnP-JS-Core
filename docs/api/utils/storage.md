#PnP JavaScript Core#
##API Reference - Storage##

A utility library to provide global methods to support common actions.
Storage provides a wrapper that let's you work with storage in a consistent way in
your applications.

Surfaced in pnp.js as .storage

**Source**: [storage.ts](../../../src/utils/storage.ts)
**Tests**: [storage.test.ts](../../../src/utils/storage.test.ts)

###Properties of PnP.storage###

Name | Description
---- | -----------
local | PnPClientStorageWrapper wrapped around localStorage
session | PnPClientStorageWrapper wrapped around sessionStorage

###PnPClientStorageWrapper properties###

Name | Description
---- | -----------
enabled | Is storage available?

###PnPClientStorageWrapper functions###

Name | Description
---- | -----------
put | Usage: ```.storage.local.put("Hello", "Hi", new Date())``` - Stores ```Hello : "{"expiration":"2016-04-02T08:36:28.000Z","value":"Hi"}"``` in localStorage. Date param is optional.
get | Usage: ```.storage.local.get("Hello")```
delete |  Usage: ```.storage.local.delete("Hello")```
getOrPut | Usage: ```.storage.local.getOrPut("HelloDoesNotExistWhenGetOrPutWasCalled", function() { console.log("I was found"); })``` - Will always call the passed in function
