/**
 * @overview HTML templates of <i>ccmjs</i>-based web component for a code editor that uses CodeMirror 5.
 * @author André Kless <andre.kless@web.de> 2023
 * @license The MIT License (MIT)
 */

import { html, render } from './../libs/lit/lit.js';
export { render };

let appDatas, app, collections, $;

export const shareAppDatas = ( _appDatas ) => { appDatas = _appDatas };
export const shareApp = ( _app ) => { app = _app };
export const shareHelper = ( _$ ) => { $ = _$ };

export const shareCollections = ( _collections ) => { collections = _collections };

export function main() {
    let infoVisible = false;

    const toggleInfo = () => {
        infoVisible = !infoVisible;
        document.getElementById('info-box').hidden = !infoVisible;
    };

    return html`
        <div class="d-flex justify-content-end">
            <nav class="mx-2" id="lang"></nav>
            <button class="btn btn-success me-4" @click=${async () => {
                await app.events.onProfile();
            }}>My profile data</button>
            <button class="btn btn-secondary me-4" @click=${async () => {
                await app.events.onRefreshClick();
                alert("Data refreshed.")
            }}>Refresh data</button>
            <button class="btn btn-info me-4" @click=${toggleInfo}>Information</button>
            <div class="mt-2 ml" id="user"></div>
        </div>
        <div id="info-box" class="info-box p-3 mb-3 bg-light border rounded" hidden>
            <h4>Information</h4>
            <p>This Data-Cockpit shows data you created in Digital Makerspace apps and other ccm-based apps.</p>
            <p>ccm-based apps save data in MongoDB collections. Each collection contains user-created data. Data that doesn't belong to a DMS app will appear below.</p>
            <p>Press "Information" again to close this box.</p>

        </div>
        <main class="container">
            <h1 class="display-1 text-center fw-bold">Data-Cockpit</h1>
            <p class="lead text-muted text-center">View your data of Digital Makerspace apps here.</p>
            <div id="apps-container" class="row justify-content-center">
                ${dmsData(collections.dms)}
            </div>
            <h2 class="display-4 text-center my-4">Data from other ccm-based Apps</h2>
            <p class="lead text-muted text-center">These data stores contain data from the database collections.
                Data from these stores, do not belong to an app from the Digital Makerspace</p>
            <div id="apps-container-other" class="row justify-content-center">
                ${nonDmsData(collections.nonDms)}
            </div>
        </main>
    `;
}

export function dmsData(dmsDataObject) {
    return html`
        ${Object.entries(dmsDataObject).map(([key, value]) => dmsDataCard(value))}
    `;
}


function dmsDataCard(dmsDataObject) {
    // if true -> render config + app, else only data
    const isOwner = dmsDataObject.app._.creator === app.user.getValue().user;

    const title = dmsDataObject.app.title;
    const description = dmsDataObject.app.subject.replace(/<[^>]+(>|$)/g, "");
    const img = dmsDataObject.app.icon;

    return html`
        <div class="card mb-3 p-2 mx-auto" style="max-width: 600px;">
            <div class="row g-3">
                <div class="col-4">
                    <img src="${img}" class="img-fluid w-100 h-100" alt="${title}">
                </div>
                <div class="col-8">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description}</p>
                        <div class="d-flex">
                            ${showDeleteButtons(() => {
                                app.events.onShowDMSData(dmsDataObject)
                            }, () => {
                                app.events.onDeleteAllData(dmsDataObject, true)
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

}

export function nonDmsData(nonDmsData) {

    return html`
        ${Object.entries(nonDmsData).map(([key, value]) => nonDmsDataCard(value, key))}
    `

}

function nonDmsDataCard(nonDmsDataObject, collection) {
    // todo diese Karten haben nur einen Titel und Buttons
    const title = collection

    return html`
        <div class="card mb-3 p-2 mx-auto" style="max-width: 600px;">
            <div class="row g-3">
                <div class="col-4">
                    <img src="https://ccmjs.github.io/akless-components/live_poll/resources/icon.svg" class="img-fluid w-100 h-100" alt="${title}">
                </div>
                <div class="col-8">
                    <div class="card-body">
                        <h5 class="card-title">Collection name: ${title}</h5>
                        <div class="d-flex">
                            ${showDeleteButtons(() => {
                                app.events.onShowNonDMSData(collection)
                            }, () => {
                                app.events.onDeleteAllData({data: nonDmsDataObject}, true)
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

}






function showDeleteButtons(showFunction, deleteFunction) {
    return html`
        <button data-lang="btn-show" class="btn btn-primary me-2" @click=${() => {
            showFunction();
        }}>${app.en["btn-show"]}</button>
        <button class="btn btn-danger" @click=${() => {
            if (confirm("Are you sure you want to delete all data? This won't delete the app.")) {
                deleteFunction();
            }
        }}>Delete all data</button>
    `
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


/**
 *
 * @param dataArray array of data objects
 * @param creatorData is undefined if logged-in user is not the creator of the app
 * @param title title of app
 * @param appKey appkey of dataset in collection
 * @returns {TemplateResult}
 */
export function renderDataOfApp(dataArray, title, configObject) {

    let isProfile = title === "My profile"

    return html`
        <div class="d-flex justify-content-end ">
            <div id="user"></div>
        </div>

        <div class="d-flex gap-2">
            <button @click=${() => app.events.onHome()} type="button" class="btn btn-primary">
                <i class="bi bi-house"></i> Home
            </button>
            <button class="btn btn-secondary" @click=${async () => {
                await app.events.onRefreshClick();
                alert("Data refreshed.")
            }}>Refresh data</button>
            ${!isProfile ? html`
                <button @click=${() => {
                    if (confirm("Are you sure you want to delete all data? This won't delete the app.")) {
                        app.events.onDeleteAllData(dataArray, true)
                        app.refresh()
                    }}
                } type="button" class="btn btn-danger">
                    <i class="bi bi-house"></i> Delete all data
                </button>
            ` : html`
                <button @click=${() => {
                    if (confirm("Are you sure you want to delete your profile and all your data? This can't be undone.")) {
                        if (confirm("Are you really sure?")) {
                            app.events.onDeleteProfile()
                        }
                    }
                }} type="button" class="btn btn-danger">
                    <i class="bi bi-house"></i> Delete profile and all data
                </button>
            `}
        </div>



        <h1 class="mt-3">${title}</h1>
        <div>
            ${configObject ? renderConfigCard(configObject.config, "config", "Configuration details", "Configuration settings for this application:") : html``}
            ${configObject ? renderConfigCard(configObject.app, "app", "App details", "App settings for this application:") : html``}
      ${dataArray.data.map(data => renderAppDataCard(data, isProfile))}
    </div>
  `;
}

export function renderConfigCard(config, id, title, description) {
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
        const popup = document.getElementById(id);
        if (!popup) return;

        const isHidden = popup.style.display === 'none';
        popup.style.display = isHidden ? '' : 'none';
        event.target.textContent = isHidden ? 'minimize' : 'maximize';
    };


    return html`
        <div class="card mt-3 mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5>${title}</h5>
                    <p>${description}</p>

                </div>
                <button class="btn btn-primary" @click=${event => {
                    togglePopup(event)
                }}>maximize</button>
            </div>
        </div>

        <div id=${id} class="card-body" style="display: none">
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
                                ${isProfile ? html`` : html`
                                    <button type="button" class="btn btn-success" @click=${async () => {
                                        const selectGroup = document.querySelectorAll(`#permissions-table-${datasetKey} select`);
                                        const permission = {
                                            get: selectGroup[0].value.toLowerCase(),
                                            set: selectGroup[1].value.toLowerCase(),
                                            del: selectGroup[2].value.toLowerCase()
                                        };
                                        const copyObject = $.clone(appData);
                                        copyObject._.access = permission;
                                        delete copyObject.__collectionName__
                                        await app.events.onChangePermission(copyObject, appData.__collectionName__);
                                        await alert("Permissions changed.")
                                    }}>Save</button>`}
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
                    ${!isProfile ? html`<button class="btn btn-danger" @click=${async () => {
            if (confirm('Are you sure you want to delete this')) {
                await app.events.onDeleteDataSet(appData.key, appData.__collectionName__);
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

