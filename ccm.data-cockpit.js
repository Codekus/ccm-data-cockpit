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
      "css": [ "ccm.load",
        [
        //  [
        //    "./libs/codemirror/codemirror.css",
        //    "./libs/codemirror/foldgutter.css"
        //  ],
          "./resources/styles.css"
        ]
      ],
      "data": {},
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
      addedTodos: [],
      user: [ "ccm.instance", "https://ccmjs.github.io/akless-components/user/ccm.user.js", [ "ccm.get", "https://ccmjs.github.io/akless-components/chat/resources/resources.js", "user" ] ]
    },
    Instance: function () {

      let $, data;
      this.init = async () => {
        $ = Object.assign( {}, this.ccm.helper, this.helper ); $.use( this.ccm );
      };
      this.ready = async () => {
        this.onready && await this.onready( { instance: this } );
      };
      this.start = async () => {

        await this.html.render( this.html.main( this ), this.element );

        const storedData = localStorage.getItem('todoList');
        if (storedData) {
          debugger
          this.addedTodos = JSON.parse(storedData);
          const shadowRoot = document.querySelector("ccm-todo_first > div").shadowRoot
          this.html.render(this.html.renderTodoList(this.addedTodos, this), shadowRoot.querySelector("#todo-container"));
        }
        data = await $.dataset( this.data );

        this.onstart && await this.onstart( { instance: this } );
      };
      this.events = {
        onSubmit: async (todoText) => {
          // push new todo item with empty state
          this.addedTodos.push([todoText, ""]);
          // container element to render in

          const container = document.querySelector("ccm-todo_first > div").shadowRoot.querySelector("#todo-container")
          this.html.render(this.html.renderTodoList(this.addedTodos, this), container);
          this.saveData();  // Save data to localStorage
          $.onFinish(this);
        }
      };
      this.saveData = () => {
        localStorage.setItem('todoList', JSON.stringify(this.addedTodos));
      }
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