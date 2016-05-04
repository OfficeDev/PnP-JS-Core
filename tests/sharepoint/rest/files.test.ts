"use strict";

import { expect } from "chai";
import { Files, File, Versions, Version } from "../../../src/sharepoint/rest/files";

describe("Files", () => {

    let files: Files;

    beforeEach(() => {
        files = new Files("_api/web");
    });

    it("Should be an object", () => {
        expect(files).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/files", () => {
            expect(files.toUrl()).to.equal("_api/web/files");
        });
    });

    describe("getByName", () => {
        it("Should return _api/web/files('Doug Baldwin')", () => {
           let file = files.getByName("Doug Baldwin");
           expect(file.toUrl()).to.equal("_api/web/files('Doug Baldwin')");
        });
    });
});

describe("File", () => {

    let file: File;

    beforeEach(() => {
       file = new File("_api/web/files", "getByName('Thomas Rawls')");
    });

    it("Should be an object", () => {
        expect(file).to.be.a("object");
    });

    describe("author", () => {
       it("Should return _api/web/files/getByName('Thomas Rawls')/author", () => {
          expect(file.author.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/author");
       });
    });

    describe("checkedOutByUser", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/checkedOutByUser", () => {
            expect(file.checkedOutByUser.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/checkedOutByUser");
        });
    });

    describe("checkInComment", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/checkInComment", () => {
            expect(file.checkInComment.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/checkInComment");
        });
    });

    describe("checkOutType", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/checkOutType", () => {
            expect(file.checkOutType.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/checkOutType");
        });
    });

    describe("contentTag", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/contentTag", () => {
            expect(file.contentTag.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/contentTag");
        });
    });

    describe("customizedPageStatus", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/customizedPageStatus", () => {
            expect(file.customizedPageStatus.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/customizedPageStatus");
        });
    });

    describe("eTag", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/eTag", () => {
            expect(file.eTag.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/eTag");
        });
    });

    describe("exists", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/exists", () => {
            expect(file.exists.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/exists");
        });
    });

    describe("length", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/length", () => {
            expect(file.length.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/length");
        });
    });

    describe("level", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/level", () => {
            expect(file.level.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/level");
        });
    });

    describe("listItemAllFields", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/listItemAllFields", () => {
            expect(file.listItemAllFields.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/listItemAllFields");
        });
    });

    describe("lockedByUser", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/lockedByUser", () => {
            expect(file.lockedByUser.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/lockedByUser");
        });
    });

    describe("majorVersion", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/majorVersion", () => {
            expect(file.majorVersion.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/majorVersion");
        });
    });

    describe("minorVersion", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/minorVersion", () => {
            expect(file.minorVersion.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/minorVersion");
        });
    });

    describe("modifiedBy", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/modifiedBy", () => {
            expect(file.modifiedBy.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/modifiedBy");
        });
    });

    describe("name", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/name", () => {
            expect(file.name.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/name");
        });
    });

    describe("serverRelativeUrl", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/serverRelativeUrl", () => {
            expect(file.serverRelativeUrl.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/serverRelativeUrl");
        });
    });

    describe("timeCreated", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/timeCreated", () => {
            expect(file.timeCreated.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/timeCreated");
        });
    });

    describe("timeLastModified", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/timeLastModified", () => {
            expect(file.timeLastModified.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/timeLastModified");
        });
    });

    describe("title", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/title", () => {
            expect(file.title.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/title");
        });
    });

    describe("uiVersion", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/uiVersion", () => {
            expect(file.uiVersion.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/uiVersion");
        });
    });

    describe("uiVersionLabel", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/uiVersionLabel", () => {
            expect(file.uiVersionLabel.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/uiVersionLabel");
        });
    });

    describe("versions", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/versions", () => {
            expect(file.versions.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/versions");
        });
    });

    describe("value", () => {
        it("Should return _api/web/files/getByName('Thomas Rawls')/$value", () => {
            expect(file.value.toUrl()).to.equal("_api/web/files/getByName('Thomas Rawls')/$value");
        });
    });
});

describe("Versions", () => {

    let versions: Versions;

    beforeEach(() => {
       versions = new Versions("_api/web/getFileByServerRelativeUrl('Earl Thomas')");
    });

    it("Should be an object", () => {
        expect(versions).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Earl Thomas')/versions", () => {
            expect(versions.toUrl()).to.equal("_api/web/getFileByServerRelativeUrl('Earl Thomas')/versions");
        });
    });

    describe("getById", () => {
       it("Should return _api/web/getFileByServerRelativeUrl('Earl Thomas')/versions(1)", () => {
           let version = versions.getById(1);
           expect(version.toUrl()).to.equal("_api/web/getFileByServerRelativeUrl('Earl Thomas')/versions(1)");
       });
    });
});

describe("Version", () => {

    let version: Version;

    beforeEach(() => {
       version = new Version("_api/web/getFileByServerRelativeUrl('Richard Sherman')", "versions(1)");
    });

    it("Should be an object", () => {
        expect(version).to.be.a("object");
    });

    describe("checkInComment", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/checkInComment", () => {
            expect(version.checkInComment.toUrl())
            .to.equal("_api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/checkInComment");
       });
    });

    describe("created", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/created", () => {
            expect(version.created.toUrl()).to.equal("_api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/created");
       });
    });

    describe("createdBy", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/createdBy", () => {
            expect(version.createdBy.toUrl()).to.equal("_api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/createdBy");
       });
    });

    describe("id", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/id", () => {
            expect(version.id.toUrl()).to.equal("_api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/id");
       });
    });

    describe("isCurrentVersion", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/isCurrentVersion", () => {
            expect(version.isCurrentVersion.toUrl())
            .to.equal("_api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/isCurrentVersion");
       });
    });

    describe("size", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/size", () => {
            expect(version.size.toUrl()).to.equal("_api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/size");
       });
    });

    describe("url", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/url", () => {
            expect(version.url.toUrl()).to.equal("_api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/url");
       });
    });

    describe("versionLabel", () => {
        it("Should return _api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/versionLabel", () => {
            expect(version.versionLabel.toUrl())
                .to.equal("_api/web/getFileByServerRelativeUrl('Richard Sherman')/versions(1)/versionLabel");
       });
    });
});
