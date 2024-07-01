/**
 * @overview HTML templates of <i>ccmjs</i>-based web component for a code editor that uses CodeMirror 5.
 * @author André Kless <andre.kless@web.de> 2023
 * @license The MIT License (MIT)
 */

import { html, render } from './../libs/lit/lit.js';
export { render };

export function main(app) {
  return html`
    <form @submit=${e => {
        e.preventDefault();
        const value = e.target.querySelector('#add-todo').value
        if (!value) return
      e.target.querySelector('#add-todo').value = ""
        app.events.onSubmit(value);
    }}>
      <input type="text" id="add-todo" name="add-todo" placeholder="Add todo">
      <button type="submit">Add</button>
    </form>
    <div id="todo-container"></div>
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



