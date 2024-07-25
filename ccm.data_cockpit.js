'use strict';

/**
 * @overview App configurations of <i>ccmjs</i>-based web component for a data-cockpit
 * @author Markus Klassen <markusklassen1497@gmail.com> 2024
 * @license The MIT License (MIT)
 */

(() => {

    const component = {
        name: 'data_cockpit',
        ccm: './libs/ccm/ccm.js',
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
                    "./resources/styles.css"
                ]
            ],
            "data": { // todo (name) ist hier die collection der nosql datenbank --> so erstmal public data
                store: ["ccm.store", {"name": "dms2-comment-data", "url": "https://ccm2.inf.h-brs.de"}],
            },
            "helper": ["ccm.load", {"url": "./libs/ccm/helper.js", "type": "module"}],
            "html": ["ccm.load", {"url": "./resources/templates.js", "type": "module"}],

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
            ]


            this.init = async () => {

                if (this.user) {
                    // set user instance for datastore
                    this.data.user = this.user
                    this.user.onchange = () => {
                        //    this.element.querySelector("#name").innerText = this.user.isLoggedIn() ? this.user.getUsername() : this.name;
                        this.refresh()
                    };
                }

                $ = Object.assign({}, this.ccm.helper, this.helper);
                $.use(this.ccm);
                this.html.shareHelper($);
            };
            this.ready = async () => {
                window.addEventListener('popstate', this.refresh);
                this.onready && await this.onready({instance: this});
            };
            this.start = async () => {
                this.html.shareApp(this);
                if (!this.user.isLoggedIn()) {
                    this.removeParams()
                    this.html.render(this.html.mainLogin(), this.element);
                    await this.element.querySelector("#user").appendChild(this.user.root);
                    return
                }


                if ($.params().app) {
                    await this.events.onShowData($.params().app)
                } else {


                    this.html.shareCollections(await this.fetch.collectionNames())

                    this.html.shareAppDatas(await this.fetch.getAppDatas());
                    await this.html.render(this.html.main(), this.element);
                }
                await this.element.querySelector("#user").appendChild(this.user.root);


                // data = await $.dataset( this.data );


                this.onstart && await this.onstart({instance: this});
            };
            this.render = {
                data: async (dataArray, creatorData, title, appKey) => {
                    this.html.render(this.html.renderDataOfApp(dataArray, creatorData, title, appKey), this.element);
                    await this.element.querySelector("#user").appendChild(this.user.root);
                }
            }
            this.events = {
                onDeleteAllData: async (appKey, alertsOn) => {
                    console.log(appKey, " deleted all data")
                    const configObject = await this.configs.get({app: appKey})
                    if (!configObject[0].data) {
                        if (alertsOn) alert("No data to delete")
                        return
                    }
                    const appKeyInCollection = configObject[0].data.key
                    const collectionName = configObject[0].data.store[1].name
                    this.data.store.name = collectionName;
                    const data = await this.data.store.get({
                        "_.creator": this.user.getValue().user
                    });
                    const dataToDelete = data.filter(item => {
                        return item.key === appKeyInCollection || (Array.isArray(item.key) && item.key[0] === appKeyInCollection);
                    });
                    if (dataToDelete.length === 0) {
                        if (alertsOn) alert("No data to delete")
                        return
                    }
                    for (const dataset of dataToDelete) {
                        await this.data.store.del(dataset.key)
                    }
                    await this.refresh()
                    if (alertsOn) alert("All data deleted")
                },
                onShowData: async (appKey) => {
                    console.log(appKey, " show data");
                    debugger
                    if (!this.user.isLoggedIn()) {
                        this.removeParams();
                        await this.refresh();
                        return;
                    }
                    debugger
                    const metaData = await this.fetch.getMetaData(appKey);

                    // Fetch data of this app and render it on a new page
                    const configObject = await this.configs.get({app: appKey});
                    if (configObject.length === 0) {
                        await this.html.render(this.html.noDataView(), this.element);
                        return;
                    }

                    let creatorData;
                    let persData = [];

                    if (configObject[0]._.creator === this.user.getValue().user) {
                        creatorData = configObject;
                    }

                    if (configObject[0].data) {
                        const appKeyInCollection = configObject[0].data.key;
                        const collectionName = configObject[0].data.store[1].name;

                        // Fetch data entered under "data" in the app
                        // DMS Apps have 2 Keys: Key of the App and Key of the App in the Collection
                        persData = await this.fetch.getpersonalData(collectionName, appKeyInCollection);

                        // If no personal data and creator data is undefined, render noDataView
                    }
                    if (persData.length === 0 && !creatorData) {
                        await this.html.render(this.html.noDataView(), this.element);
                        return;
                    }

                    await this.render.data(persData, creatorData, metaData.title, appKey);

                },

                onDeleteDataSet: async (key) => {
                    this.data.store.del(key)
                    await this.refresh()
                },
                onHome: async () => {
                    this.removeParams()
                    await this.refresh()
                },
                onProfile: async () => {
                    debugger
                    this.data.store.name = "dms-user"
                    await this.render.data([this.user.getValue()], "", "My profile", this.user.getValue().key);
                },
                onDeleteProfile: async () => {
                    for (const key of appKeys) {
                        await this.events.onDeleteAllData(key, false)
                    }
                    alert("All data deleted")
                    if (confirm("All app data has been deleted. Do you want to delete your profile?")) {
                        this.data.store.name = "dms-user"
                        await this.events.onDeleteDataSet(this.user.getValue().key)
                        alert("Profile deleted")
                        await this.user.logout()
                        await this.refresh()
                    }
                },
                onChangePermission: async (newPermission) => {
                    await this.data.store.set(newPermission)
                    await this.refresh()
                }
            };
            this.fetch = {
                collectionNames: async () => {
                    // todo
                    // todo vincent API colleciton names
                    // todo aus den CollectionNames, appInfos holen
                    // todo unterscheidung DMS und weitere ccm apps

                    // todo datensatz aus this.store.get sortieren und nach app Mappen,
                   // debugger
                    const dmsAppDatas = await this.apps.get()
                    //const configData = await this.configs.get()



                    const dataConfigs = await this.configs.get({
                        'data.store.1.name': { $exists: true },
                        "_": {
                            $exists: true
                            // realm: "cloud"
                        }
                    });

                    debugger
                    const hasDmsData = [] // diese apps haben die gleiche collection wie die ich von vincent bekomme

                    dataConfigs.forEach(config => {
                       // debugger

                        if (collections.includes(config.data.store[1].name)) {
                            // todo
                            hasDmsData.push(config)
                        }
                    })

                    //todo hasDmsData: jedes element hat das attribut "app", dmsAppData danach filter

                    // in diesen DMS Apps werden Daten gespeichert
                    const filteredAppData = dmsAppDatas.filter(app => {
                        return hasDmsData.some(item => {
                            return item.app === app.app
                        })
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



                    // todo filteredAppData enthält alle DMS apps die daten speichern, jetzt gucken welcher meiner user daten in diesen DMS apps gespeichert sind

                    // hasDmsData filtern mit dem inhalt der collections dann habe ich alle DMS apps wo ich daten hinterlegt habe
                    debugger
                    const dmsAppKeyObjects = []
                    const nonDmsAppKeyObjects = []
                    for (const collection of collections) {

                        this.data.store.name = collection;
                        const data = await this.data.store.get({
                            "_.creator": this.user.getValue().user,
                            //app: {$exists: true}
                        });


                        for (const dataSet of data) {
                            if (dataSet.app) {
                                mappedData.forEach((value, key) => {
                                    if (value.config[0].data.key === dataSet.app || (Array.isArray(value.config[0].key) && value.config[0].data.key[0] === dataSet.app)){
                                        value.data.push(dataSet)
                                    }
                                })
                            } else {
                                nonDmsAppKeyObjects.push(dataSet)
                            }
                        }
                    }
                    debugger

                    return {
                        dms: mappedData,
                        nonDms: nonDmsAppKeyObjects
                    }
                },
                /**
                 *
                 * @param collectionName
                 * @param appKeyInCollection
                 * @returns {Promise<*>}
                 */
                getpersonalData: async (collectionName, appKeyInCollection) => {
                    this.data.store.name = collectionName;
                    const data = await this.data.store.get({
                        "_.creator": this.user.getValue().user
                    });
                    return data.filter(item => {
                            return item.key === appKeyInCollection || (Array.isArray(item.key) && item.key[0] === appKeyInCollection);
                    });
                },
                getMetaData: async (appKey) => {

                    const appInfo = await this.apps.get({app: appKey});
                    if (appInfo.length === 0) {
                        return {
                            title: "No Data",
                            description: "No Data",
                            icon: "",
                            key: ""
                        }
                    }
                    let obj = {
                        title: appInfo[0].title,
                        description: appInfo[0].description, // description = subject beim dms
                        img: appInfo[0].icon, //meta.icon || dms.icon
                        key: appKey
                    }
                    return obj
                },
                getAppDatas: async () => {
                    // todo Vincent API endpoint call hier um alle apps zu bekommen
                    const metaDataArr = [];
                    for (const key of appKeys) {
                        const m = await this.fetch.getMetaData(key)
                        metaDataArr.push(await this.fetch.getMetaData(key))
                    }
                    return metaDataArr

                }
            }
            this.refresh = async () => {

                // todo get url parameters
                // paremeters: app
                // wenn kein parameter dann render main, also this.start
                // wenn app parameter dann render data von dieser app also this.events.onShowData(app)

                const params = $.params();
                if (params.app) {
                    await this.events.onShowData(params.app)
                } else {
                    await this.start()
                }
            }
            this.onAppClick = async (appKey) => {
                await $.params(Object.assign({app: appKey}), true, true);
                await this.refresh()
            }
            this.removeParams = () => {
                const url = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, url);
            }
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
