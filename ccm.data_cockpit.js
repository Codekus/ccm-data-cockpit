'use strict';

/**
 * @overview App configurations of <i>ccmjs</i>-based web component for a data-cockpit
 * @author Markus Klassen <markusklassen1497@gmail.com> 2024
 * @license The MIT License (MIT)
 */
const de = {
    "btn_show": "Anzeigen",
    "btn_delete_all": "Alle Daten löschen",
    "btn_delete": "Löschen",
    "btn_my_profile_data": "Meine Profildaten",
    "btn_refresh_data": "Daten aktualisieren",
    "btn_information": "Informationen",
    "btn_home": "Home",
    "btn_delete_profile_and_data": "Profil und Daten löschen",
    "btn_view": "Anzeigen",
    "btn_close": "Schließen",
    "btn_save": "Speichern",
    "title_data_cockpit": "Daten-Cockpit",
    "text_description": "Hier können Sie Ihre Daten der Digital Makerspace Apps einsehen.",
    "title_other_ccm_data": "Daten von anderen ccm-basierten Apps",
    "text_other_description": "Diese Datenstores enthalten Daten aus den Datenbankkollektionen. Daten aus diesen Stores gehören nicht zu einer App aus dem Digital Makerspace"
};
const en = {
    "btn_show": "Show",
    "btn_delete_all": "Delete all data",
    "btn_delete": "Delete",
    "btn_my_profile_data": "My profile data",
    "btn_refresh_data": "Refresh data",
    "btn_information": "Information",
    "btn_home": "Home",
    "btn_delete_profile_and_data": "Delete profile and data",
    "btn_view": "View",
    "btn_close": "Close",
    "btn_save": "Save",
    "title_data_cockpit": "Data-Cockpit",
    "text_description": "View your data of Digital Makerspace apps here.",
    "title_other_ccm_data": "Data from other ccm-based Apps",
    "text_other_description": "These data stores contain data from the database collections. Data from these stores, do not belong to an app from the Digital Makerspace"

};

(() => {

    const component = {
        name: 'data_cockpit',
        ccm: 'https://codekus.github.io/ccm-data-cockpit/libs/ccm/ccm-27.5.0.js',
        config: {
            name: "World",
            "apps": ["ccm.store", {"url": "https://ccm2.inf.h-brs.de", "name": "dms2-apps"}],
            "components": ["ccm.store", {"url": "https://ccm2.inf.h-brs.de", "name": "dms2-components"}],
            "configs": ["ccm.store", {"url": "https://ccm2.inf.h-brs.de", "name": "dms2-configs"}],
            user: ["ccm.start", "https://ccmjs.github.io/akless-components/user/ccm.user.js", {
                realm: "cloud",
                store: "dms-user",
                url: "https://ccm2.inf.h-brs.de",
                title: "Please login with your Digital Makerspace Account",
                hash: ["ccm.load", "https://ccmjs.github.io/akless-components/modules/md5.mjs"]
            }],
            "css": ["ccm.load",
                [
                    [
                        "https://ccmjs.github.io/digital-makerspace/libs/bootstrap-5/css/bootstrap.min.css",
                        "https://ccmjs.github.io/digital-makerspace/resources/styles.min.css"
                    ],
                    "https://ccmjs.github.io/digital-makerspace/libs/bootstrap-5/css/bootstrap-icons.min.css",
                    {
                        "url": "https://ccmjs.github.io/digital-makerspace/libs/bootstrap-5/css/bootstrap-fonts.min.css",
                        "context": "head"
                    },
                    "https://codekus.github.io/ccm-data-cockpit/resources/styles.css"
                ]
            ],
            "data": { // todo (name) ist hier die collection der nosql datenbank --> so erstmal public data
                store: ["ccm.store", {"name": "dms2-comment-data", "url": "https://ccm2.inf.h-brs.de"}],
            },
            "helper": ["ccm.load", {"url": "https://codekus.github.io/ccm-data-cockpit/libs/ccm/helper.js", "type": "module"}],
            "html": ["ccm.load", {"url": "https://codekus.github.io/ccm-data-cockpit/resources/templates.js", "type": "module"}],
            "libs": ["ccm.load",
                [
                    "https://ccmjs.github.io/digital-makerspace/libs/bootstrap-5/js/bootstrap.bundle.min.js",
                ]
            ],


            "onfinish": {"log": true},
            // "oninput": event => console.log( event ),
            "onready": event => console.log(event),
            // "onstart": event => console.log( event ),
            // "preview": true,

            "settings": {
                "autoRefresh": true,
                "autoCloseBrackets": true,
                "autofocus": false,
                "foldGutter": true,
                "gutters": ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                "lineNumbers": true,
                "lineWrapping": true,
                "matchBrackets": true,
                "tabSize": 2
            },


            "shadow": "none",
            "submit": true,
            userData: undefined,
            "lang": [ "ccm.start", "https://ccmjs.github.io/akless-components/lang/versions/ccm.lang-1.2.0.min.js", {
                "translations": { "de": de, "en": en }
            } ],
            de : de,
            en : en

        },
        Instance: function () {

            let $, data;
            const appKeys = [
                "1719994026117X18424967169684558", // test comment kless app https://ccmjs.github.io/digital-makerspace/app.html?app=comment,1719994026117X18424967169684558
                "1720011698695X2920675973648237", // test comment meine ungelistet app https://ccmjs.github.io/digital-makerspace/app.html?app=comment,1720011698695X2920675973648237
                "1720084530064X2287127424685247", // poll debug app https://ccmjs.github.io/digital-makerspace/app.html?app=live_poll,1720084530064X2287127424685247
                "1720598582962X08744772963471159",
                "1720950403494X31874311848526005",
              //  "1720950403494X31874311848526005" // https://ccmjs.github.io/digital-makerspace/app.html?app=comment,1721827357615X8754038256524665
            ]

            const collections = [
                "dms2-comment-data",
                "live_poll_data",
                "todo",
                "chat-data",
                "debugstore"
            ]


            this.init = async () => {

                if (this.user) {
                    // set user instance for datastore
                    this.data.user = this.user
                    this.user.onchange = () => {
                        this.refresh()
                    };
                }

                $ = Object.assign({}, this.ccm.helper, this.helper);
                $.use(this.ccm);
                this.html.shareHelper($);
            };
            this.ready = async () => {
                window.addEventListener('popstate', async () => {
                   await this.refresh()
                });

                this.onready && await this.onready({instance: this});
                this.lang && this.lang.observe( lang => {

                    $.params( { lang } );
                    this.refresh();

                } );
            };
            this.start = async () => {
                this.html.shareApp(this);
                if (!this.user.isLoggedIn()) {
                    // destroy userData if user is not logged in
                    // this prevents previous users data from being displayed
                    this.userData = undefined
                    this.removeParams()
                    this.html.render(this.html.mainLogin(), this.element);
                    await this.element.querySelector("#user").appendChild(this.user.root);
                    return
                }


                if ($.params().app || $.params().ccm) {
                    await this.refresh()
                } else {
                    // if userdata was already loaded, dont load it again
                    if (!this.userData) {
                        await this.fetch.setUserData()
                    }
                    await this.html.render(this.html.main(), this.element);
                }
                await this.element.querySelector("#user").appendChild(this.user.root);

                this.onstart && await this.onstart({instance: this});
                const lang = this.lang && this.lang.active;
                if ( this.lang ) $.params( { lang: lang } );
                this.lang && $.setContent( this.element.querySelector( '#lang' ), this.lang.root );
                this.lang && this.lang.translate();
            };
            this.render = {
                dmsData: async (data) => {
                    if (data.app._.creator !== this.user.getValue().user) {
                        // User is not creator of app, render data without app configs
                        this.html.render(this.html.renderDataOfApp(data, data.title), this.element);
                    } else {
                        // user is owner of app, render data with app configs
                        this.html.render(this.html.renderDataOfApp(data, data.title, {app: data.app, config:data.config}), this.element);
                    }
                    await this.element.querySelector("#user").appendChild(this.user.root);
                },
                nonDmsData: async (data, title) => {
                    this.html.render(this.html.renderDataOfApp({data: data}, title), this.element);
                    await this.element.querySelector("#user").appendChild(this.user.root);
                }



            }
            this.events = {
                onShowDMSData: async (dataSet) => {
                    // set app id as URL parameter

                    await $.params(Object.assign({app: dataSet.app.app}), true);
                    await this.refresh()
                },
                onShowNonDMSData: async (collection) => {
                    // set collection name as URL parameter
                    await $.params(Object.assign({ccm: collection}), true);
                    await this.refresh()
                },
                onDeleteAllData: async (dataSetArray, alertsOn) => {
                    for (const dataset of dataSetArray.data) {
                        this.data.store.name = dataset.__collectionName__
                        await this.data.store.del(dataset.key)
                    }
                    await this.fetch.setUserData()
                    await this.refresh()
                    if (alertsOn) alert("All data deleted")
                },
                onDeleteDataSet: async (key, collection) => {
                    this.data.store.name = collection
                    this.data.store.del(key)
                    await this.fetch.setUserData()
                    await this.refresh()
                },
                onHome: async () => {
                    this.removeParams()
                    await this.refresh()
                },
                onProfile: async () => {
                    await this.render.nonDmsData([this.user.getValue()], "My profile")
                },
                onDeleteProfile: async () => {
                    const obj = this.userData.dms
                    const obj2 = this.userData.nonDms
                    for (const key in obj) {
                        await this.events.onDeleteAllData(obj[key], false)
                    }

                    for (const key in obj2) {
                        await this.events.onDeleteAllData({data: obj2[key]}, false)
                    }


                    alert("All data deleted")
                    if (confirm("All app data has been deleted. Do you want to delete your profile?")) {
                        await this.events.onDeleteDataSet(this.user.getValue().key, "dms-user")
                        alert("Profile deleted")
                        await this.user.logout()
                        await this.refresh()
                    }
                },
                onChangePermission: async (newPermission, collectionName) => {
                    this.data.store.name = collectionName
                    await this.data.store.set(newPermission)
                    await this.fetch.setUserData()
                    await this.refresh()
                },
                onRefreshClick: async () => {
                    await this.fetch.setUserData()
                    await this.refresh()
                }
            };
            this.fetch = {
                setUserData: async () => {
                        this.userData = await this.fetch.collectionNames()
                        this.html.shareCollections(this.userData)

                },
                /**
                 * Fetches all collections from the database
                 * Map all Datasets to a DMS app or nonDMS app
                 * @returns {Promise<{nonDms: {app: {}, config: {}, data: []}, dms: {}>}
                 */
                collectionNames: async () => {

                    // find DMS app configs that store data
                    const dataConfigs = await this.configs.get({
                        'data.store.1.name': { $exists: true },
                        "_": {
                            $exists: true
                            // realm: "cloud"
                        }
                    });
                    const hasDmsData = [] // diese apps haben die gleiche collection wie die ich von vincent bekomme

                    dataConfigs.forEach(config => {
                        if (collections.includes(config.data.store[1].name)) {
                            hasDmsData.push(config)
                        }
                    })

                    //todo hasDmsData: jedes element hat das attribut "app", dmsAppData danach filter
                    // in diesen DMS Apps werden Daten gespeichert

                    const filteredAppData = await this.apps.get({
                        app: {$in: hasDmsData.map(item => item.app)}
                    })




                    const mappedData = new Map()
                    filteredAppData.forEach(app => {
                        mappedData.set(app.app, {
                            app: app,
                            config: hasDmsData.filter(item => {
                                return item.app === app.app
                            }),
                            data: []
                        })
                    })

                    // find user created data from each collection and map it to a DMS app or nonDMS app
                    // nonDMS data will be mapped to the collection its in
                    // dms data will be mapped the the App ID it belongs to
                    const nonDmsAppKeyObjects = new Map()
                    for (const collection of collections) {

                        this.data.store.name = collection;
                        const data = await this.data.store.get({
                            "_.creator": this.user.getValue().user,
                            //app: {$exists: true}
                        });


                        for (const dataSet of data) {
                            let isPartOfDmsApp = false;
                            if (dataSet.app) {
                                mappedData.forEach((value, key) => {
                                    if (value.config[0].data.key === dataSet.app || (Array.isArray(value.config[0].key) && value.config[0].data.key[0] === dataSet.app)){
                                        dataSet.__collectionName__ = collection
                                        value.data.push(dataSet)
                                        isPartOfDmsApp = true;
                                    }
                                })
                                // if an app has "app" property but is not part of DMS app
                                if (!isPartOfDmsApp) {
                                    dataSet.__collectionName__ = collection
                                    if(nonDmsAppKeyObjects.has(collection)) {
                                        nonDmsAppKeyObjects.get(collection).push(dataSet)
                                    } else {
                                        nonDmsAppKeyObjects.set(collection, [dataSet])
                                    }
                                }
                            } else {
                                dataSet.__collectionName__ = collection
                                if(nonDmsAppKeyObjects.has(collection)) {
                                    nonDmsAppKeyObjects.get(collection).push(dataSet)
                                } else {
                                    nonDmsAppKeyObjects.set(collection, [dataSet])
                                }

                            }
                        }
                    }

                    // find apps that the user created
                    const dataConfigsCreator = await this.configs.get({
                        "_.creator": this.user.getValue().user,
                    });
                    const dataAppsCreator = await this.apps.get({
                        "_.creator": this.user.getValue().user,
                    })
                    const creatorMapped = new Map()
                    // map configs to apps
                    dataConfigsCreator.forEach(config => {
                        if (dataAppsCreator.find(app => app.app === config.app)) {
                            creatorMapped.set(config.app, {
                                app: dataAppsCreator.find(app => app.app === config.app),
                                config: config,
                                data: []
                            })
                        }
                    });

                    // remove empty data objects
                    const dms = Object.fromEntries(Array.from(mappedData).filter(([key, value]) => value.data.length > 0))

                    // if creatorMapped data is not in dms then add it dms
                    creatorMapped.forEach((value, key) => {
                        if (!dms[key]) {
                            dms[key] = value
                        }
                    })

                    return {
                        dms: dms,
                        nonDms: Object.fromEntries(nonDmsAppKeyObjects)
                    };

                }

            }
            this.refresh = async () => {
                if (!this.userData) {
                    await this.fetch.setUserData()
                }
                const params = $.params();
                const lang = this.lang && this.lang.active;
                if ( this.lang ) $.params( { lang: lang } );
                if (params.app) {
                    if (!this.userData.dms[params.app]) {
                        await this.html.render(this.html.noDataView(), this.element);
                        this.lang && this.lang.translate();
                        return;
                    }
                    await this.render.dmsData(this.userData.dms[params.app])
                    this.lang && this.lang.translate();
                } else if(params.ccm) {
                    if (!this.userData.nonDms[params.ccm]) {
                        await this.html.render(this.html.noDataView(), this.element);
                        this.lang && this.lang.translate();
                        return;
                    }
                    await this.render.nonDmsData(this.userData.nonDms[params.ccm], params.ccm)
                    this.lang && this.lang.translate();
                }else {
                    await this.start()
                    this.lang && this.lang.translate();

                }
            }

            this.removeParams = () => {
                const url = new URL(window.location);
                url.searchParams.delete('app');
                url.searchParams.delete('ccm');
                window.history.replaceState({}, document.title, url.toString());
            };

            this.debug = async () => {
                debugger
                //   const x = await this.apps.get()
                //   const y = await this.components.get()
                //   const z = await this.configs.get()
                //    this.data.store.name = ""
                //    const key_or_query = {$eval: 'db.getMongo().getDBNames()'}
                //  const a = await this.data.store.get(key_or_query)
                debugger
            }

        }
    };
    let b = "ccm." + component.name + (component.version ? "-" + component.version.join(".") : "") + ".js";
    if (window.ccm && null === window.ccm.files[b]) return window.ccm.files[b] = component;
    (b = window.ccm && window.ccm.components[component.name]) && b.ccm && (component.ccm = b.ccm);
    "string" === typeof component.ccm && (component.ccm = {url: component.ccm});
    let c = (component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/) || [""])[0];
    if (window.ccm && window.ccm[c]) window.ccm[c].component(component); else {
        var a = document.createElement("script");
        document.head.appendChild(a);
        component.ccm.integrity && a.setAttribute("integrity", component.ccm.integrity);
        component.ccm.crossorigin && a.setAttribute("crossorigin", component.ccm.crossorigin);
        a.onload = function () {
            (c = "latest" ? window.ccm : window.ccm[c]).component(component);
            document.head.removeChild(a)
        };
        a.src = component.ccm.url
    }
})();
