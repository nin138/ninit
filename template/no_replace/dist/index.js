import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { App } from "./app";
import Store from './Store';
ReactDOM.render(React.createElement(Provider, { store: Store },
    React.createElement(App, null)), document.getElementById('app'));
//# sourceMappingURL=index.js.map