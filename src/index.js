import * as Setting from './module/setting.js';

import headerfix from './css/headerfix.css';
import fade from './css/fade.css';

(async function() {
    document.head.append(<style>{headerfix}</style>);
    document.head.append(<style>{fade}</style>);
    
    const path = location.pathname.split('/');

    if(path[1] != 'b')
        return;

    window.channel = path[2] || '';
    window.setting = await Setting.load(window.channel);
    Setting.setup(window.channel);

    if(path[3] == undefined || path[3] == '') {
        // Board Page
        initBoard();
    }
    else if(path[3] == 'write') {
        // Write Article Page
        initWrite(false);
    }
    else if(/[0-9]+/.test(path[3])) {
        if(path[4] == 'edit') {
            // Edit Article Page
            initWrite(true);
        }
        else {
            // Article View Page
            initArticle();
            initBoard();
        }
    }
})();

function initBoard() {
    // TODO : Refresher
    // TODO : Preview Filter
    // TODO : Hide Notice
    // TODO : Article Block System
}

function initArticle() {
    // TODO : Reply Refresh Button
    // TODO : Add Image Context Menu
    // TODO : Comment Block System
}

function initWrite(editMode) {
    if(!editMode) {
        // TODO : My Image Feature
    }

    // TODO : Advanced Image Uploader
}