var settings = {

    spsave: {
        username: "develina.devsson@mydevtenant.onmicrosoft.com",
        password: "pass@word1",
        siteUrl: "https://mydevtenant.sharepoint.com/"
    },
    testing: {
        enableWebTests: true,
        siteUrl: "{ site collection url }",
        /* any credentialOptions given by https://github.com/s-KaiNet/node-sp-auth#params */
        credentials: {
            clientId: '{ client id }',
		    clientSecret: '{client secret}'
        }
    }
}

module.exports = settings;