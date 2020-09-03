import styles, { stylesheet } from '../css/Setting.module.css';

const MIN_VERSION = '1.10.0';

const defaultData = {
    version: GM.info.script.version,
    refreshTime: 5,
    hideRefresher: false,
    useShortcut: false,
    hideNotice: false,
    hideAvatar: true,
    hideMedia: false,
    hideModified: false,
    hideSideMenu: false,
    myImage: '',
    filteredCategory: {},
    blockRatedown: false,
    blockKeyword: [],
    blockUser: [],
    blockEmoticon: {},
    userMemo: {},
    useAutoRemoverTest: true,
    autoRemoveUser: [],
    autoRemoveKeyword: [],
};

const defaultCategory = {
    전체: false,
    일반: false,
};

export function load() {
    let loadData = JSON.parse(GM_getValue('Setting', '{}'));

    if(compareVersion(loadData.version, MIN_VERSION)) {
        loadData = defaultData;
    }
    else {
        loadData = Object.assign(defaultData, loadData);
        loadData.version = GM.info.script.version;
    }

    return loadData;
}

export function save(data) {
    GM_setValue('Setting', JSON.stringify(data));
}

function reset() {
    GM_setValue('Setting', '{}');
}

function compareVersion(a, b) {
    if(a == undefined) return true;

    const c = a.split('.');
    const d = b.split('.');

    for(let i = 0; i < a.length; i += 1) {
        if(parseInt(c[i], 10) > parseInt(d[i], 10)) break;
        else if(parseInt(c[i], 10) < parseInt(d[i], 10)) return true;
    }

    return false;
}

export function setup(channel, data) {
    const showSettingBtn = (
        <li class="nav-item dropdown">
            <a aria-expanded="false" class="nav-link" href="#">
                <span class="hidden-sm-down">스크립트 설정</span>
                <span class="hidden-md-up"><span class="ion-gear-a" /></span>
            </a>
        </li>
    );

    const settingWrapper = (
        <div class={`${styles.wrapper} hidden clearfix`}>
            <div class="row">
                <div class="col-sm-0 col-md-2" />
                <div class="col-sm-12 col-md-8">
                    <div class="dialog card">
                        <form class="card-block">
                            <h4 class="card-title">아카 리프레셔(Arca Refresher) 설정</h4>
                            <hr />
                            <h5 class="card-title">유틸리티</h5>
                            <div class="row">
                                <label class="col-md-3">자동 새로고침</label>
                                <div class="col-md-9">
                                    <select id="refreshTime">
                                        <option value="0">사용 안 함</option>
                                        <option value="3">3초</option>
                                        <option value="5">5초</option>
                                        <option value="10">10초</option>
                                    </select>
                                    <p class="text-muted">일정 시간마다 게시물 목록을 갱신합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">새로고침 애니메이션 숨김</label>
                                <div class="col-md-9">
                                    <select id="hideRefresher">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p class="text-muted">자동 새로고침 애니메이션을 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">단축키 사용 (Beta)</label>
                                <div class="col-md-9">
                                    <select id="useShortcut">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p class="text-muted">
                                        채널 활동을 빠르게 할 수 있는 단축키를 사용합니다.<br />
                                        <a href="https://github.com/lekakid/ArcaRefresher/wiki/Feature#%EB%8B%A8%EC%B6%95%ED%82%A4%EB%A1%9C-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EB%8F%99" target="_blank" rel="noreferrer">
                                            단축키 안내 바로가기
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">비추천 방지</label>
                                <div class="col-md-9">
                                    <select id="blockRatedown">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p class="text-muted">비추천을 클릭하면 확인창을 띄웁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">자짤 관리</label>
                                <div class="col-md-9">
                                    <a href="#" id="removeMyImage" class="btn btn-success">삭제</a>
                                    <p class="text-muted">등록된 자짤을 삭제합니다.</p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">요소 숨김</h5>
                            <div class="row">
                                <label class="col-md-3">우측 사이드 메뉴</label>
                                <div class="col-md-9">
                                    <select id="hideSideMenu">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p class="text-muted">베스트 라이브, 헤드라인 등 우측 사이드 메뉴를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">프로필 아바타</label>
                                <div class="col-md-9">
                                    <select id="hideAvatar">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p class="text-muted">게시물 조회 시 프로필 아바타를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">본문 이미지, 동영상</label>
                                <div class="col-md-9">
                                    <select id="hideMedia">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p class="text-muted">게시물 조회 시 본문에 나오는 이미지와 동영상을 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">댓글 *수정됨</label>
                                <div class="col-md-9">
                                    <select id="hideModified">
                                        <option value="false">보임</option>
                                        <option value="true">숨김</option>
                                    </select>
                                    <p class="text-muted">수정된 댓글의 수정됨 표기를 숨깁니다.</p>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">차단 기능</h5>
                            <div class="row">
                                <label class="col-md-3">미리보기 필터</label>
                                <div class="col-md-9">
                                    <div class="category-group" />
                                    <p class="text-muted">지정한 카테고리의 미리보기를 숨깁니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">유저 차단</label>
                                <div class="col-md-9">
                                    <textarea id="blockUser" rows="6" placeholder="차단할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />
                                    <p class="text-muted">지정한 유저의 게시물과 댓글을 차단합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">키워드 차단</label>
                                <div class="col-md-9">
                                    <textarea id="blockKeyword" rows="6" placeholder="차단할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                    <p class="text-muted">지정한 키워드가 포함된 제목을 가진 게시물과 댓글을 차단합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">차단된 아카콘</label>
                                <div class="col-md-9">
                                    <select id="blockEmoticon" size="6" multiple />
                                    <div class="col-md-10">
                                        <p class="text-muted">차단된 아카콘 리스트입니다. 차단은 댓글에서 할 수 있습니다.</p>
                                    </div>
                                    <div class={`col-md-2 ${styles['align-right']} ${styles.fit}`}>
                                        <a href="#" id="removeEmoticon" class="btn btn-success">삭제</a>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <h5 class="card-title">채널 관리자 전용</h5>
                            <div class="row">
                                <label class="col-md-3">삭제 테스트 모드</label>
                                <div class="col-md-9">
                                    <select id="useAutoRemoverTest">
                                        <option value="false">사용 안 함</option>
                                        <option value="true">사용</option>
                                    </select>
                                    <p class="text-muted">게시물을 삭제하지 않고 어떤 게시물이 선택되는지 붉은 색으로 보여줍니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">유저 게시물 삭제</label>
                                <div class="col-md-9">
                                    <textarea id="autoRemoveUser" rows="6" placeholder="대상 이용자를 줄바꿈으로 구별하여 입력합니다." />
                                    <p class="text-muted">지정한 유저의 게시물을 자동으로 삭제합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <label class="col-md-3">키워드 포함 게시물 삭제</label>
                                <div class="col-md-9">
                                    <textarea id="autoRemoveKeyword" rows="6" placeholder="삭제할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                    <p class="text-muted">지정한 키워드가 포함된 제목을 가진 게시물을 삭제합니다.</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <a href="#" id="resetSetting" class="btn btn-danger">설정 초기화</a>
                                </div>
                                <div class={`col-md-6 ${styles['align-right']}`}>
                                    <a href="#" id="saveAndClose" class="btn btn-primary">저장</a>
                                    <a href="#" id="closeSetting" class="btn btn-success">닫기</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
    const contentWrapper = document.querySelector('.content-wrapper');
    const categoryGroup = settingWrapper.querySelector('.category-group');

    showSettingBtn.addEventListener('click', () => {
        if(settingWrapper.classList.contains('hidden')) {
            contentWrapper.classList.add('disappear');
        }
        else {
            settingWrapper.classList.add('disappear');
        }
    });

    document.querySelector('ul.navbar-nav').append(showSettingBtn);

    document.head.append(<style>{ stylesheet }</style>);
    contentWrapper.insertAdjacentElement('afterend', settingWrapper);

    if(channel != '') {
        const categoryButton = <span><input type="checkbox" id="" /><label for="" /></span>;
        const category = document.querySelectorAll('.board-category a');

        categoryGroup.append(<span><input type="checkbox" id="전체" /><label for="전체">전체</label></span>);

        category.forEach(element => {
            const categoryName = (element.textContent == '전체') ? '일반' : element.textContent;
            const btn = categoryButton.cloneNode(true);
            btn.querySelector('input').id = categoryName;
            btn.querySelector('label').setAttribute('for', categoryName);
            btn.querySelector('label').textContent = categoryName;
            categoryGroup.append(btn);
        });
    }
    else {
        categoryGroup.append(<span>카테고리 목록을 확인할 수 없습니다. 채널 게시판에서 확인바랍니다.</span>);
    }

    contentWrapper.addEventListener('animationend', event => {
        if(event.target.classList.contains('disappear')) {
            event.target.classList.add('hidden');
            event.target.classList.remove('disappear');
            settingWrapper.classList.add('appear');
            settingWrapper.classList.remove('hidden');
        }
        else if(event.target.classList.contains('appear')) {
            event.target.classList.remove('appear');
        }
    });
    settingWrapper.addEventListener('animationend', event => {
        if(event.target.classList.contains('disappear')) {
            event.target.classList.add('hidden');
            event.target.classList.remove('disappear');
            contentWrapper.classList.add('appear');
            contentWrapper.classList.remove('hidden');
        }
        else if(event.target.classList.contains('appear')) {
            event.target.classList.remove('appear');
        }
    });

    settingWrapper.querySelector('#refreshTime').value = data.refreshTime;
    settingWrapper.querySelector('#hideRefresher').value = data.hideRefresher;
    settingWrapper.querySelector('#useShortcut').value = data.useShortcut;
    settingWrapper.querySelector('#hideAvatar').value = data.hideAvatar;
    settingWrapper.querySelector('#hideMedia').value = data.hideMedia;
    settingWrapper.querySelector('#hideModified').value = data.hideModified;
    settingWrapper.querySelector('#hideSideMenu').value = data.hideSideMenu;
    settingWrapper.querySelector('#blockRatedown').value = data.blockRatedown;
    settingWrapper.querySelector('#blockUser').value = data.blockUser.join('\n');
    settingWrapper.querySelector('#blockKeyword').value = data.blockKeyword.join('\n');

    if(data.filteredCategory[channel] == undefined) {
        data.filteredCategory[channel] = Object.assign({}, defaultCategory);
    }
    for(const key in data.filteredCategory[channel]) {
        if(data.filteredCategory[channel][key]) {
            const checkbox = document.getElementById(key);
            if(checkbox) checkbox.checked = true;
        }
    }

    const emoticonList = settingWrapper.querySelector('#blockEmoticon');
    for(const key in data.blockEmoticon) {
        if({}.hasOwnProperty.call(data.blockEmoticon, key)) {
            const opt = <option value="" />;
            opt.value = key;
            opt.innerText = `${data.blockEmoticon[key].name}`;
            emoticonList.append(opt);
        }
    }
    settingWrapper.querySelector('#useAutoRemoverTest').value = data.useAutoRemoverTest ? 1 : 0;
    settingWrapper.querySelector('#autoRemoveUser').value = data.autoRemoveUser.join('\n');
    settingWrapper.querySelector('#autoRemoveKeyword').value = data.autoRemoveKeyword.join('\n');

    settingWrapper.querySelector('#removeMyImage').addEventListener('click', event => {
        event.preventDefault();
        if(!confirm('등록한 자짤을 삭제하시겠습니까?')) return;

        data.myImage = '';
        save(data);
        alert('삭제되었습니다.');
    });
    settingWrapper.querySelector('#removeEmoticon').addEventListener('click', event => {
        event.preventDefault();

        const removeItems = settingWrapper.querySelector('#blockEmoticon').selectedOptions;
        while(removeItems.length > 0) {
            removeItems[0].remove();
        }
    });
    settingWrapper.querySelector('#resetSetting').addEventListener('click', event => {
        event.preventDefault();

        if(!confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;

        reset();
        location.reload();
    });
    settingWrapper.querySelector('#saveAndClose').addEventListener('click', event => {
        event.preventDefault();

        data.refreshTime = settingWrapper.querySelector('#refreshTime').value;
        data.hideRefresher = settingWrapper.querySelector('#hideRefresher').value == 'true';
        data.useShortcut = settingWrapper.querySelector('#useShortcut').value == 'true';
        data.hideAvatar = settingWrapper.querySelector('#hideAvatar').value == 'true';
        data.hideMedia = settingWrapper.querySelector('#hideMedia').value == 'true';
        data.hideSideMenu = settingWrapper.querySelector('#hideSideMenu').value == 'true';
        data.hideModified = settingWrapper.querySelector('#hideModified').value == 'true';
        data.blockRatedown = settingWrapper.querySelector('#blockRatedown').value == 'true';

        if(channel != '') {
            const checkboxes = settingWrapper.querySelectorAll('.category-group input');
            checkboxes.forEach(element => {
                data.filteredCategory[channel][element.id] = element.checked;
            });
        }

        const blockUser = settingWrapper.querySelector('#blockUser').value;
        if(blockUser == '') {
            data.blockUser = [];
        }
        else {
            let tmp = blockUser.split('\n');
            tmp = tmp.filter(item => {
                return item != '' && item != undefined && item != null;
            });
            data.blockUser = tmp;
        }

        const blockKeyword = settingWrapper.querySelector('#blockKeyword').value;
        if(blockKeyword == '') {
            data.blockKeyword = [];
        }
        else {
            let tmp = blockKeyword.split('\n');
            tmp = tmp.filter(item => {
                return item != '' && item != undefined && item != null;
            });
            data.blockKeyword = tmp;
        }

        const emoticons = {};
        const blockOptions = settingWrapper.querySelectorAll('#blockEmoticon option');
        blockOptions.forEach(item => {
            emoticons[item.value] = data.blockEmoticon[item.value];
        });
        data.blockEmoticon = emoticons;

        data.useAutoRemoverTest = settingWrapper.querySelector('#useAutoRemoverTest').value == 1;

        const autoRemoveUser = settingWrapper.querySelector('#autoRemoveUser').value;
        if(autoRemoveUser == '') {
            data.autoRemoveUser = [];
        }
        else {
            let tmp = autoRemoveUser.split('\n');
            tmp = tmp.filter(item => {
                return item != '' && item != undefined && item != null;
            });
            data.autoRemoveUser = tmp;
        }

        const autoRemoveKeyword = settingWrapper.querySelector('#autoRemoveKeyword').value;
        if(autoRemoveKeyword == '') {
            data.autoRemoveKeyword = [];
        }
        else {
            let tmp = autoRemoveKeyword.split('\n');
            tmp = tmp.filter(item => {
                return item != '' && item != undefined && item != null;
            });
            data.autoRemoveKeyword = tmp;
        }

        save(data);
        location.reload();
    });
    settingWrapper.querySelector('#closeSetting').addEventListener('click', () => {
        settingWrapper.classList.add('disappear');
    });
}
