'use strict';

/**
 * @overview <i>ccmjs</i>-based web component for a code editor that uses CodeMirrow 5.
 * @author André Kless <andre.kless@web.de> 2023
 * @license The MIT License (MIT)
 */



( () => {

  const component = {
    name: 'data_cockpit',
    ccm: './libs/ccm/ccm.js',
    "tmp2": "tmp2 data",
    config: {
      name: "World",
      apps: [ "ccm.store" ],
      components: [ "ccm.store" ],
      user: [ "ccm.start", "https://ccmjs.github.io/akless-components/user/ccm.user.js", {
        realm: "cloud",
        store: "dms-user",
        url: "https://ccm2.inf.h-brs.de",
        title: "Please login with your Digital Makerspace Account",
        hash: [ "ccm.load", "https://ccmjs.github.io/akless-components/modules/md5.mjs" ]
      } ],
      "css": [ "ccm.load",
        [
          //  [
          //    "./libs/codemirror/codemirror.css",
          //    "./libs/codemirror/foldgutter.css"
          //  ],
          [
            "https://ccmjs.github.io/digital-makerspace/libs/bootstrap-5/css/bootstrap.min.css",
            "https://ccmjs.github.io/digital-makerspace/resources/styles.min.css"
          ],
          "https://ccmjs.github.io/digital-makerspace/libs/bootstrap-5/css/bootstrap-icons.min.css",
          { "url": "https://ccmjs.github.io/digital-makerspace/libs/bootstrap-5/css/bootstrap-fonts.min.css", "context": "head" },
          "./resources/styles.css"
        ]
      ],
      "data": { // todo (name) ist hier die collection der nosql datenbank --> so erstmal public data
        store: [ "ccm.store", { "name": "todo", "url": "https://ccm2.inf.h-brs.de" } ],
      //  key: "demo" // key worauf die daten gespeichert wruden
      },
      // "directly": true,
      "helper": [ "ccm.load", { "url": "./libs/ccm/helper.js", "type": "module" } ],
      "html": [ "ccm.load", { "url": "./resources/templates.js", "type": "module" } ],

      "libs": [ "ccm.load",
        [
          "./libs/codemirror/codemirror.js",
          [
            "./libs/codemirror/autorefresh.js",
            "./libs/codemirror/brace-fold.js",
            "./libs/codemirror/closebrackets.js",
            "./libs/codemirror/foldcode.js",
            "./libs/codemirror/foldgutter.js",
            "./libs/codemirror/matchbrackets.js"
          ]
        ]
      ],


      "onfinish": { "log": true },
      // "oninput": event => console.log( event ),
      "onready": event => console.log( event ),
      // "onstart": event => console.log( event ),
      // "preview": true,

      "settings": {
        "autoRefresh": true,
        "autoCloseBrackets": true,
        "autofocus": false,
        "foldGutter": true,
        "gutters": [ "CodeMirror-linenumbers", "CodeMirror-foldgutter" ],
        "lineNumbers": true,
        "lineWrapping": true,
        "matchBrackets": true,
        "tabSize": 2
      },


      "shadow": "open",
      "submit": true,
      //"text": [],
      addedTodosStore: {
        todo: [],
        key: "todo"
      },
      addedTodos: [],
      basicData: {
        // mandatory. Der Entwickler setzt nur den Key unter dem dieses Object
        // gespeichert wird
        created_at: Date.now(),
        updated_at: Date.now(),
        key: "A Key",
        // actual data here. can be anything
        message: "this is the text",
        confirmed: true,
        _: {
          creator: "markla",
          realm: "cloud",
          get: "all",
          set: "all",
          del: "all"
        }
      }
    },
    Instance: function () {

      let $, data;
      const appDatas = [
        {
          title: "App1",
          description: "This is a description of the first app", // description = subject beim dms
          img: "./resources/icon.png"//meta.icon || dms.icon
        },
        {
          title: "App2",
          description: "The second description of the 2nd app", // description = subject beim dms
          img: "./resources/icon2.png"
        }
      ]
      this.init = async () => {

        if (this.user) {
          // set user instance for datastore
          this.data.user = this.user
          this.user.onchange = () => {
            this.element.querySelector("#name").innerText = this.user.isLoggedIn() ? this.user.getUsername() : this.name;
          };
        }

        $ = Object.assign( {}, this.ccm.helper, this.helper ); $.use( this.ccm );
      };
      this.ready = async () => {
        this.onready && await this.onready( { instance: this } );
      };
      this.start = async () => {

        this.html.share(appDatas, this );
        await this.html.render( this.html.main( this ), this.element );
        await this.element.querySelector("#user").appendChild(this.user.root);
        data = await Promise.all( [
          this.components.get( { deleted: false } ),
          this.apps.get( { deleted: false } )
        ] );
        if (this.lang) {
          data[0].forEach(component => this.lang.translate(component));
        }
        data = {
          components: {
            arr: data[ 0 ],
            options: {
              title: {},
              creator: {},
              tags: {}
            }
          },
          apps: {
            arr: data[ 1 ],
            options: {
              title: {},
              tool: {},
              creator: {},
              tags: {}
            }
          }
        };

        // data = await $.dataset( this.data );


        this.onstart && await this.onstart( { instance: this } );
      };
      this.render = {
        data: async (dataArray) => {
          debugger
          this.html.render(this.html.renderDataOfApp(dataArray), this.element);
        }
      }
      this.events = {
        onDeleteAllData: async (appName) => {
          console.log(appName, " deleted all data")

        },
        onShowData: async (appName) => {
          console.log(appName, " show data")
          // fetch data dieser app und render diese auf einer neuen page. url parameter?
          debugger
          const todoData = await this.data.store.get();
          this.render.data(todoData)
      },
        onDeleteDataSet: async (key) => {
            console.log(key, " deleted")
          //this.data.store.del(key)
        },
      };
      this.saveData = async () => {
        debugger
        this.addedTodosStore.todo = this.addedTodos;
        console.log(await this.data.store.set(this.addedTodosStore))
        await localStorage.setItem('todoList', JSON.stringify(this.addedTodos));
      };

    }
  };
  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||[""])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){(c="latest"?window.ccm:window.ccm[c]).component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();

/*
todo-list daten:
[
  ["item1", ""],
  ["item2", "done"],
  ["item3", ""],
]



 */