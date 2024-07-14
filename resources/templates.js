/**
 * @overview HTML templates of <i>ccmjs</i>-based web component for a code editor that uses CodeMirror 5.
 * @author André Kless <andre.kless@web.de> 2023
 * @license The MIT License (MIT)
 */

import { html, render } from './../libs/lit/lit.js';
export { render };

let appDatas, app, $;

export const shareAppDatas = ( _appDatas ) => { appDatas = _appDatas };
export const shareApp = ( _app ) => { app = _app };
export const shareHelper = ( _$ ) => { $ = _$ };

export function main() {
    return html`
    <div class="d-flex justify-content-end">
        <button class="btn btn-success me-4" @click=${event => {
            app.events.onProfile();
        }}>My profile data</button>
      <div class="mt-2 ml" id="user"></div>
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
                            <button class="btn btn-danger" @click=${() => {
                                if (confirm("Are you sure you want to delete all data? This won't delete the app.")) {
                                    app.events.onDeleteAllData(appInfo.key, true);
                                }
                            }}>Delete all data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 *
 * @param dataArray array of data objects
 * @param creatorData is undefined if logged-in user is not the creator of the app
 * @param title title of app
 * @param appKey appkey of dataset in collection
 * @returns {TemplateResult}
 */
export function renderDataOfApp(dataArray, creatorData, title, appKey) {

    let isProfile = dataArray.length > 0 && (dataArray[0].key === app.user.getValue().key && dataArray[0].token === app.user.getValue().token);

    return html`
        <div class="d-flex justify-content-end ">
            <div id="user"></div>
        </div>
        
        <button @click=${() => app.events.onHome()} type="button" class="btn btn-primary">
            <i class="bi bi-house"></i> Home
        </button>
        ${!isProfile ? html`<button @click=${() => {
            if (confirm("Are you sure you want to delete all data? This won't delete the app.")) {
                app.events.onDeleteAllData(appKey, true)
                app.refresh()
            }}

        } type="button" class="btn btn-danger">
            <i class="bi bi-house"></i> Delete all data
        </button>` : html`
            <button @click=${() => {
                if (confirm("Are you sure you want to delete your profile and all your data? This can't be undone.")) {
                    if (confirm("Are you really sure?")) {
                        app.events.onDeleteProfile()
                    }
                }
            }
            } type="button" class="btn btn-danger">
                <i class="bi bi-house"></i> Delete profile and all data
            </button>
        `}
        <h1 class="mt-3">${title}</h1>
        <div>
            ${creatorData ? renderConfigCard(creatorData[0]) : html``}
      ${dataArray.map(data => renderAppDataCard(data, isProfile))}
    </div>
  `;
}

export function renderConfigCard(config) {
    // Recursive function to render nested objects
    function renderValue(value) {
        if (typeof value === 'object' && value !== null) {
            return html`
                <table class="table table-bordered">
                    <tbody>
                        ${Object.entries(value).map(([nestedKey, nestedValue]) => {
                const isIndex = !isNaN(parseInt(nestedKey, 10));
                return html`
                                <tr>
                                    ${isIndex ? html`` : html`<th>${nestedKey}</th>`}
                                    <td>${renderValue(nestedValue)}</td>
                                </tr>
                            `;
            })}
                    </tbody>
                </table>
            `;
        } else {
            return html`${value}`;
        }
    }
    const togglePopup = (event) => {
        const popup = document.getElementById('config');
        if (!popup) return;

        const isHidden = popup.style.display === 'none';
        popup.style.display = isHidden ? '' : 'none';
        event.target.textContent = isHidden ? 'minimize' : 'maximize';
    };


    return html`
        <div class="card mt-3 mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5>Configuration Details</h5>
                    <p>Configuration settings for this application:</p>

                </div>
                <button class="btn btn-primary" @click=${event => {
                    togglePopup(event)
                }}>maximize</button>
            </div>
        </div>

        <div id="config" class="card-body" style="display: none">
                <table class="table">
                    <tbody>
                        ${Object.entries(config).map(([key, value]) => {
        const isIndex = !isNaN(parseInt(key, 10));
        return html`
                                <tr>
                                    ${isIndex ? html`` : html`<th>${key}</th>`}
                                    <td>${renderValue(value)}</td>
                                </tr>
                            `;
    })}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}






export function renderAppDataCard(appData, isProfile) {
    appData = sortObjectByKeys(appData);

    const togglePopup = (key) => {
        const popup = document.getElementById(`popup-${key}`);
        if (popup) {
            popup.style.display = popup.style.display === 'none' ? '' : 'none';
        }
    };

    const renderValue = (value) => {
        if (typeof value === 'object' && value !== null) {
            return html`
                <table class="table table-bordered">
                    <tbody>
                        ${Object.entries(value).map(([nestedKey, nestedValue]) => {
                            const isIndex = !isNaN(parseInt(nestedKey, 10));
                            return html`
                                <tr>
                                    ${isIndex ? html`` : html`<td>${nestedKey}</td>`}
                                    <td>${renderValue(nestedValue)}</td>
                                </tr>
                            `;
            })}
                    </tbody>
                </table>
            `;
        } else {
            return html`${value}`;
        }
    };

    const permissions = (permissionsObj) => {
        let flattenedObj = flattenObject(permissionsObj);
        return html`
        <table class="table">
            <tbody id="permissions-table-${datasetKey}">
                ${Object.entries(flattenedObj).map(([key, value], index) => html`
                <tr>
                    <th scope="row">${key}</th>
                    <td>
                        ${isProfile ? html`
                            <td>${renderValue(value)}</td>
                        ` : html`
                            ${key === 'get' || key === 'set' || key === 'del' ? html`
                        <select id="select-${datasetKey}-${index}" class="form-select" aria-label="Default select example">
                            <option value="all" ?selected=${value === 'all'}>All</option>
                            <option value="creator" ?selected=${value === 'creator'}>Creator</option>
                        </select>
                        ` : renderValue(value)}`}
                    </td>
                </tr>
                `)}
            </tbody>
        </table>
    `;
    };


    const datasetKey = typeof appData.key === 'string' ? appData.key : appData.key[1];
    const rows = Object.entries(appData).map(([key, value]) => {
        if (key === 'created_at' || key === 'updated_at' ) return '';
        return html`
            <tr>
                <th scope="row">${key === "_" ? "Permissions" : key}</th>
                <td>
                    ${key !== '_' ? renderValue(value) : html`
                        <button type="button" class="btn btn-primary" @click=${() => togglePopup(datasetKey)}>View</button>
                        <div id="popup-${datasetKey}" class="card" style="display: none;">
                            <div class="card-body border border-dark">
                                ${permissions(value)}
                                <button type="button" class="btn btn-secondary me-2" @click=${() => togglePopup(datasetKey)}>Close</button>
                                <button type="button" class="btn btn-success" @click=${async () => {
                                    const selectGroup = document.querySelectorAll(`#permissions-table-${datasetKey} select`);
                                    const permission = {
                                        get: selectGroup[0].value.toLowerCase(),
                                        set: selectGroup[1].value.toLowerCase(),
                                        del: selectGroup[2].value.toLowerCase()
                                    };
                                    const copyObject = $.clone(appData);
                                    copyObject._.access = permission;
                                    await app.events.onChangePermission(copyObject);
                                    await alert("Permissions changed.")
                                }}>Save</button>
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
                    ${!isProfile ? html`<button class="btn btn-danger" @click=${() => {
            if (confirm('Are you sure you want to delete this')) {
                app.events.onDeleteDataSet(appData.key);
            }
        }}>Delete</button>` : html``}
                </div>
            </div>
        </div>
    `;
}


export function noDataView() {
    return html`
    <div class="d-flex justify-content-end">
      <div id="user"></div>
    </div>
    <main class="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div class="card shadow-lg p-4">
        <div class="card-body">
          <h1 class="card-title text-center mb-4">No data found</h1>
          <p class="lead text-center text-muted">You don't have any data connected to this app.</p>
          <div class="d-flex justify-content-center">
            <button @click=${() => app.events.onHome()} type="button" class="btn btn-primary text-center">
              <i class="bi bi-house"></i> Home
            </button>
          </div>
        </div>
      </div>
    </main>
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