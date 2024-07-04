/**
 * @overview HTML templates of <i>ccmjs</i>-based web component for a code editor that uses CodeMirror 5.
 * @author André Kless <andre.kless@web.de> 2023
 * @license The MIT License (MIT)
 */

import { html, render } from './../libs/lit/lit.js';
export { render };

let appDatas, app;

export const share = ( _appDatas, _app ) => { appDatas = _appDatas; app = _app };

export function main() {
    return html`
    <div class="d-flex justify-content-end">
      <div id="user"></div>
    </div>
    <main class="container">
      <h1 class="display-4 text-center my-4">Data-Cockpit</h1>
      <p class="lead text-muted text-center">View your data of Digital Makerspace apps here.</p>
      <div id="apps-container" class="row justify-content-center">
        ${appDatas.map(appInfo => html`<div class="col-md-8">${renderAppCard(appInfo)}</div>`)}
      </div>
    </main>
  `;
}


export function mainLogin() {
    return html`
    <div class="d-flex justify-content-end p-3">
      <div id="user"></div>
    </div>
    <main class="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div class="card shadow-lg p-4">
        <div class="card-body">
          <h1 class="card-title text-center mb-4">Welcome</h1>
          <p class="lead text-center text-muted">Login to view your data of Digital Makerspace apps here.</p>
        </div>
      </div>
    </main>
  `;
}






function renderAppCard(appInfo) {
    /*
    appInfo: {
        title: "",
        description: "" // description = subject beim dms
        img: meta.icon || dms.icon
        key: ""
    }
     */
    const cleanDescription = appInfo.description.replace(/<[^>]+(>|$)/g, "");
    return html`
        <div class="card mb-3 p-2">
            <div class="row g-3">
                <div class="col-md-2">
                    <img src="${appInfo.img}" class="img-fluid w-100 h-100" alt="${appInfo.title}">
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <h5 class="card-title">${appInfo.title}</h5>
                        <p class="card-text">${cleanDescription}</p>
                        <div class="d-flex">
                            <button class="btn btn-primary me-2" @click=${event => {
                                app.onAppClick(appInfo.key);
                            }}>Show data</button>
                            <button class="btn btn-danger" @click=${event => {
                                if (confirm("Are you sure you want to delete all data? This won't delete the app.")) {
                                    app.events.onDeleteAllData(appInfo.key);
                                }
                            }}>Delete all data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
export function renderDataOfApp(dataArray, title) {
    return html`
        <div class="d-flex justify-content-end ">
            <div id="user"></div>
        </div>
        <button @click=${() => app.events.onHome()} type="button" class="btn btn-primary">
            <i class="bi bi-house"></i> Home
        </button>
        <h1 class="mt-3">${title}</h1>
        <div>
      ${dataArray.map(data => renderAppDataCard(data))}
    </div>
  `;
}


export function renderAppDataCard(appData) {
    appData = sortObjectByKeys(appData)
    const togglePopup = (key) => {
        const popup = document.getElementById(`popup-${key}`);
        if (popup) {
            popup.style.display = popup.style.display === 'none' ? '' : 'none';
        }
    };
    const permissions = (permissionsObj) => {
        let flattenedObj = flattenObject(permissionsObj);
        return html`
    <table class="table">
        <tbody>
            ${Object.entries(flattenedObj).map(([key, value]) => html`
            <tr>
                <th scope="row">${key}</th>
                <td>${value}</td>
            </tr>
            `)}
        </tbody>
    </table>
    `;
    }
    const datasetKey = typeof appData.key === 'string' ? appData.key : appData.key[1];
    const rows = Object.entries(appData).map(([key, value]) => {
        if (key === 'created_at' || key === 'updated_at' || key === 'key') return '';
        return html`
      <tr>
        <th scope="row">${key === "_" ? "Permissions" : key}</th>
        <td>
          ${key !== '_' ? value : html`
            <button type="button" class="btn btn-primary" @click=${() => {debugger; togglePopup(datasetKey)}}>View</button>
            <div id="popup-${datasetKey}" class="card" style="display: none;">
                <div class="card-body border border-dark">
                    ${permissions(value)}
                    <button type="button" class="btn btn-secondary" @click=${() => togglePopup(datasetKey)}>Close</button>
                </div>
            </div>
          `}
        </td>
      </tr>
    `;
    });

    return html`
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between">
        <div>Created at: ${appData.created_at}</div>
        <div>Updated at: ${appData.updated_at}</div>
      </div>
      <div class="card-body">
        <table class="table">
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="d-flex">
          <button class="btn btn-danger" @click=${event => {
        if (confirm('Are you sure you want to delete this')) {
            app.events.onDeleteDataSet(appData.key);
        }
    }}>Delete</button>
        </div>
      </div>
    </div>
  `;
}


function renderRights(dataObject) {
    return html`
    <div>
      ${dataObject.map(data => renderAppDataCard(data))}
    </div>
  `;
}

function flattenObject(obj, parent = '', res = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let propName = parent ? key : key;
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
    }
    return res;
}

function sortObjectByKeys(obj) {
    return Object.keys(obj).sort((a, b) => {
        if (a === '_') return 1;
        if (b === '_') return -1;
        return a.localeCompare(b);
    }).reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {});
}