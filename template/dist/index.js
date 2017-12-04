import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { App } from "./app";
ReactDOM.render(React.createElement(Provider, null,
    React.createElement(App, null)), document.getElementById('app'));
//# sourceMappingURL=index.js.map