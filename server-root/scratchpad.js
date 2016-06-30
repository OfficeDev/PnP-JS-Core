require.config({
    paths: {
        //'jquery': '../Style Library/test/jquery',
        'pnp': 'https://localhost:3000/scripts/pnp'
    },
    shim: {
        'jquery': {
            exports: 'jQuery'
        }
    }
});

require(["pnp"], function (pnp) {
    let rStr = pnp.util.getRandomString(10);

    let show = function (data) {
        $(function () {
            var str = syntaxHighlight(JSON.stringify(data, undefined, 4));
            $("#testingshow").append("<pre>" + str + "</pre>");
        });
    }

    let showRaw = function (data) {
        $(function () {
            $("#testingshow").append("<div>" + data + "</div>");
        });
    }

    pnp.setup({
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    });

    pnp.sp.web.lists.getByTitle("Config").items.add({ Title: "Another Item" }).then(function (result) {
        show(result.data);
    });

    //pnp.sp.web.lists.getByTitle("Config3").items.get().then(show);

    // pnp.sp.web.lists.getByTitle("Config3").items.orderBy("Title").top(1).getPaged().then(d => {
    //     show(d);
    //     d.getNext().then(d => show(d));
    // });    
    // pnp.sp.web.siteGroups.get().then(show);
    // pnp.sp.web.siteGroups.add({ "Title": "Test Group 1" }).then(show);
    // pnp.sp.web.siteGroups.getById(11).get().then(show);
    // pnp.sp.web.siteGroups.removeById(13).get().then(show);
    // pnp.sp.web.siteGroups.removeByLoginName("Delete My By Name").then(show);        
    // pnp.sp.web.siteGroups.getByName("Test Group 1").get().then(show);
    // pnp.sp.web.siteGroups.getById(11).users.get().then(show);
    // pnp.sp.web.siteGroups.getByName("Test Group 1").update({ Title: "Test Group 1-2" }).then((r) => {        
    //     r.group.users.get().then(show);        
    // });
    //pnp.sp.web.roleDefinitions.add("Test1", "Description", 180, { High: '176', Low: '138612801' }).then(show);
    //pnp.sp.web.roleDefinitions.getByName("Test1").update({ BasePermissions: { High: '0', Low: '138612801' }, Name: "Fred" }).then(show);
    // pnp.sp.web.userCustomActions.get().then(show);
    // pnp.sp.web.lists.getByTitle("Documents").userCustomActions.get().then(show);
    // pnp.sp.web.siteUsers.get().then(show);
    // pnp.sp.web.siteUsers.getById(9).get().then(show);
    // pnp.sp.web.lists.filter("Title eq 'Documents'").filter("Title eq 'Config'").select("Title", "Description").get().then(show);
    // pnp.sp.web.lists.getByTitle("Documents").items.get().then(show);
    // pnp.sp.web.roleAssignments.get().then(show);
    // pnp.sp.web.lists.getByTitle("Documents").views.get().then(show);
    // pnp.sp.site.rootWeb.folders.get().then(show);        
    // pnp.sp.site.rootWeb.folders.getByName("Shared Documents").select("Title").get().then(show); 
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("sites/dev/Style Library/test").select("Name").get().then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library/test").parentFolder.select("Name").get().then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library").folders.get().then(show);    
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library").name.get().then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library").properties.select("vti_x005f_dirlateststamp").get().then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library/test").files.get().then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library/test").files.getByName("tests.js").get().then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library/test").files.getByName("tests.js").value.get((r) => r.text()).then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library/test").files.getByName("tests.js").eTag.get((r) => r.json().then((d) => d.value)).then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library/test").files.getByName("tests.js").versions.select("ID", "IsCurrentVersion").filter("IsCurrentVersion eq false").get().then(show);
    // pnp.sp.site.rootWeb.getFolderByServerRelativeUrl("/sites/dev/Style Library/test").files.getByName("tests.js").versions.getById(1536).select("IsCurrentVersion").get().then(show);
    // pnp.sp.web.lists.getByTitle("Documents").eventReceivers.get().then(show);
    // pnp.sp.web.lists.getByTitle("Documents").eventReceivers.select("ReceiverName").filter("SequenceNumber ne 10000").get().then(show);
    // pnp.sp.web.lists.getByTitle("Documents").getUserEffectivePermissions("i:0h.f|membership|10037ffe82c3e2e1@live.com").get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).attachmentFiles.get().then(show);    
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).attachmentFiles.select("ServerRelativeUrl").filter("FileName eq 'SP Customizations.pptx'").get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).contentType.select("Id", "Name").get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).effectiveBasePermissions.get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).effectiveBasePermissionsForUI.get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).fieldValuesAsHTML.get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).fieldValuesAsHTML.select("GUID", "Title").get().then(show);    
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).fieldValuesAsText.select("GUID", "Title").get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).fieldValuesForEdit.select("GUID", "Title").get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).firstUniqueAncestorSecurableObject.get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(1).firstUniqueAncestorSecurableObject.select("odata.type").get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(2).folder.get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(3).getUserEffectivePermissions("i:0h.f|membership|10037ffe82c3e2e1@live.com").get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(3).roleAssignments.get().then(show);
    // pnp.sp.web.lists.getByTitle("Test List").items.getById(3).roleAssignments.select("PrincipalId").filter("PrincipalId eq 8").get().then(show)        
    // pnp.sp.web.lists.add("My first list").then(function(result) {
    //     result.list.update({ Title: "New Title!!" }).then(function(result) {
    //         show(result.data);
    //     });
    // });   
    // pnp.sp.web.lists.getByTitle("New Title!!").delete().then(show);
    // pnp.sp.web.lists.add("My first list").then(function(result) {
    //     result.list.update({ Title: "New Title!!" }).then(function(result2) {            
    //         result2.list.breakRoleInheritance().then(show);
    //     });
    // });    
    // pnp.sp.web.lists.getByTitle("New Title!!").resetRoleInheritance().then(show);
    // pnp.sp.web.lists.getByTitle("New Title!!").roleAssignments.get().then(show);    
    // let provider = new pnp.configuration.Providers.SPListConfigurationProvider("https://318studios.sharepoint.com/sites/dev");
    // provider.getConfiguration().then(show);    
    // pnp.sp.web.lists.getByTitle("Config").items.add({
    //     Title: "Title 2",
    //     Value: "Value 2"
    // }).then(show);         
    //    pnp.sp.web.lists.getByTitle("Config").items.getById(4).update({
    //        Value: "Different"
    //    }).then(show);
    // pnp.sp.web.lists.getByTitle("Config").items.getById(4).delete();
    //pnp.sp.web.lists.getByTitle("Config").getChanges({ Add: true, Item: true }).then(show);
    //pnp.sp.web.lists.getByTitle("Config").getItemsByCAMLQuery({ ViewXml: "<View><Query><Where><IsNotNull><FieldRef Name='Title' /></IsNotNull></Where></Query></View>" }).then(show);
    //pnp.sp.web.lists.getByTitle("Config").recycle().then(show);
    //pnp.sp.web.lists.getByTitle("Config").renderListData("<View><RowLimit>10</RowLimit></View>").then(show);
    //pnp.sp.web.lists.getByTitle("Config").renderListFormData(5, "b770fbff-d39d-49ac-9a3e-fb8653df133d", 2).then(show);
    //pnp.sp.web.lists.getByTitle("Config").reserveListItemId().then(show);
    //pnp.sp.web.lists.ensureSiteAssetsLibrary().then(show);
    // pnp.sp.web.lists.ensureSiteAssetsLibrary().then(function(list) {
    //     list.items.get().then(show);
    // });
    // pnp.sp.web.lists.ensureSitePagesLibrary().then(function(list) {
    //     list.items.get().then(show);
    // });   
    //pnp.sp.web.lists.ensureSitePagesLibrary().then(show);
    //pnp.sp.web.lists.getByTitle("Config").items.getById(5).validateUpdateListItem([{ FieldName: "Title", FieldValue: "So different, much woot."}]).then(show);
    //pnp.sp.web.lists.getByTitle("Config").views.getById("66e251c3-1362-4e86-90f2-1a8dacd655a5").renderAsHtml().then(showRaw);
    //pnp.sp.web.lists.getByTitle("Config").views.add("My New View").then(show);    
    // pnp.sp.web.lists.getByTitle("Config").views.add("My New View 3").then(function(result) {
    //    result.view.fields.getSchemaXml().then(show);
    // });
    // pnp.sp.web.lists.getByTitle("Config").views.add("My New View 4").then(function(result) {
    //    result.view.fields.add("Modified").then(show);
    // });
    // pnp.sp.web.lists.getByTitle("Config").views.add("My New View 5").then(function (result) {
    //     result.view.fields.add("Modified").then(function () {
    //         result.view.fields.move("Modified", 0).then(show);
    //     });
    // });    
    //pnp.sp.web.lists.getByTitle("Config").fields.addText("MyNewField3").then(show);
    //pnp.sp.web.lists.getByTitle("Config").fields.addCalculated("calc", "=[Title]", 1, 2).then(show);
    //pnp.sp.web.lists.getByTitle("Config").fields.addDateTime("datetimefield").then(show);
    //pnp.sp.web.lists.getByTitle("Config").fields.addCurrency("currencyfield").then(show);
    //pnp.sp.web.lists.getByTitle("Config").fields.addNumber("numberfield").then(show);
    //pnp.sp.web.lists.getByTitle("Config").fields.addMultilineText("multilinefield").then(show);
    //pnp.sp.web.lists.getByTitle("Config").fields.addUrl("urlfield").then(show);
    //pnp.sp.web.webs.add("my new sub web", "subweb1").then(show);
    //pnp.sp.web.getUserById(9).get().then(show);
    //pnp.sp.web.customListTemplate.get().then(show);
    //pnp.sp.web.doesUserHavePermissions({ High: "432", Low: "1011028719" }).then(show);
    //pnp.sp.web.ensureUser("i:0#.f|membership|patrick@three18studios.com").then(show);
    //pnp.sp.web.getCatalog(116).then(show);
    //pnp.sp.site.getContextInfo().then(show);
    //pnp.sp.site.getDocumentLibraries("https://318studios.sharepoint.com/sites/dev/").then(show);
    //pnp.sp.web.applyTheme("/sites/dev/_catalogs/theme/15/palette011.spcolor", "/sites/dev/_catalogs/theme/15/fontscheme007.spfont", "/sites/dev/Style%20Library/DSC_0024.JPG", false).then(show);
    //pnp.sp.site.getWebUrlFromPageUrl("https://318studios.sharepoint.com/sites/dev/SitePages/DevHome.aspx").then(show);
    //pnp.sp.web.mapToIcon("blah.xlsx").then(show);    
    // pnp.sp.profiles.editProfileLink.then(show);
    // pnp.sp.profiles.isMyPeopleListPublic.then(show);
    // pnp.sp.profiles.amIFollowedBy("i:0#.w|ylo001\_spocrawler_18_3996").then(show);
    // pnp.sp.profiles.amIFollowing("i:0#.w|ylo001\_spocrawler_18_3996").then(show);
    //pnp.sp.profiles.getFollowedTags().then(show);
    //pnp.sp.profiles.getFollowersFor("i:0#.f|membership|patrick@three18studios.com").then(show);
    //pnp.sp.profiles.myFollowers.get().then(show);
    //pnp.sp.profiles.myProperties.select("AccountName", "DisplayName", "PersonalSpace").get().then(show);
    //pnp.sp.profiles.getPeopleFollowedBy("i:0#.f|membership|patrick@three18studios.com").then(show);
    //pnp.sp.profiles.getPropertiesFor("i:0#.f|membership|patrick@three18studios.com").then(show);
    //pnp.sp.profiles.trendingTags.then(show);
    //pnp.sp.profiles.getUserProfilePropertyFor("i:0#.f|membership|patrick@three18studios.com", "AccountName").then(show);
    //pnp.sp.profiles.isFollowing("i:0#.w|ylo001\_spocrawler_18_3996", "i:0#.f|membership|patrick@three18studios.com").then(show);
    //pnp.sp.profiles.ownerUserProfile.then(show);
    //pnp.sp.profiles.userProfile.then(show);
    // test profile image upload
    // $(function() {        
    //     $("#testingshow").append("<div id='profiletest'><input type='file' /><button>Upload</button></div>");        
    //     var div = $("#testingshow").find("#profiletest");
    //     var btn = div.find("button");

    //     btn.on('click', function(e) {
    //        e.preventDefault();           
    //        var file = $(this).closest("div").find("input")[0].files[0];
    //        pnp.sp.profiles.setMyProfilePic(file).then(show);
    //     });
    // });

    // var caml = { ViewXml: "<View><ViewFields><FieldRef Name='Title' /><FieldRef Name='RoleAssignments' /></ViewFields><RowLimit>10</RowLimit></View>" };

    // pnp.sp.web.lists.getByTitle("Config3").getItemsByCAMLQuery(caml, "RoleAssignments").then(show);  

    //pnp.sp.search("Title").then(show);


    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }


});
