import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {App} from "./app";

ReactDOM.render(
    <Provider>
      <App/>
    </Provider>
    , document.getElementById('app')
);

