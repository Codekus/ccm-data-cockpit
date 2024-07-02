/**
 * @overview HTML templates of <i>ccmjs</i>-based web component for a code editor that uses CodeMirror 5.
 * @author André Kless <andre.kless@web.de> 2023
 * @license The MIT License (MIT)
 */

import { html, render } from './../libs/lit/lit.js';
export { render };

let appDatas, app;

export const share = ( _appDatas, _app ) => { appDatas = _appDatas; app = _app };

export function main(app) {
    return html`
    <style>
    </style>
    <div class="d-flex justify-content-end ">
      <div id="user"></div>
    </div>
    <main>
      <h1 class="">Data-Cockpit</h1>
        <br>
      <div id="apps-container">
        <!-- apps here -->
          ${appDatas.map(appInfo => renderAppCard(appInfo))}
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
    }
     */
    return html`
        <div class="card mb-3 p-2">
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="${appInfo.img}" class="img-fluid rounded-start" alt="${appInfo.title}">
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <h5 class="card-title">${appInfo.title}</h5>
                        <p class="card-text">${appInfo.description}</p>
                        <div class="d-flex">
                            <button class="btn btn-primary me-2" @click=${event => {
                                app.events.onShowData(appInfo.title)
                            }}
                            >Show data
                            </button>
                            <button class="btn btn-danger" @click=${event => {
                                app.events.onDeleteAllData(appInfo.title)
                            }}>Delete all data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function renderDataOfApp(dataArray) {
    return html`
    <div>
      ${dataArray.map(data => renderAppDataCard(data))}
    </div>
  `;
}


export function renderAppDataCard(appData) {

    const rows = Object.entries(appData).map(([key, value]) => {
        if (key === 'created_at' || key === 'updated_at' || key === 'key') return '';
        return html`
      <tr>
        <th scope="row">${key}</th>
        <td>${value}</td>
      </tr>
    `;
    });
    debugger
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
                  debugger
                  app.events.onDeleteDataSet(appData.key)
              }}>Delete
              </button>
          </div>
      </div>
    </div>
  `;
}







export function todoContainer() {
  return html`

  `
}

export function getTodoElement([todoText, status], app, index) {
  return html`
    <div >
      <span style="text-decoration: ${status === 'done' ? 'line-through' : ''}">${todoText}</span>
      <input type="checkbox" .checked=${status === 'done'} @click=${e => {
        if (e.target.checked) {
          e.target.parentElement.querySelector("span").style.textDecoration = 'line-through';
          app.addedTodos[index][1] = 'done';
        } else {
          e.target.parentElement.querySelector("span").style.textDecoration = '';
          app.addedTodos[index][1] = '';
        }
        app.saveData();  // Save updated status to localStorage
      }}>Done</input>
    </div>
  `;
}

export function renderTodoList(todosList, app) {
  return html`
    ${todosList.map((todoItem, index) => getTodoElement(todoItem, app, index))}
  `;
}



