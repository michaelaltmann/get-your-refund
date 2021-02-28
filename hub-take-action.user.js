// ==UserScript==
// @name         Take Action on GetYourRefund
// @updateURL    https://raw.githubusercontent.com/michaelaltmann/get-your-refund/gh-pages/hub-take-action.user.js
// @namespace    http://getyourrefund.org/
// @version      0.2
// @description  Adds a Send + Next  button that 
//   sends the message, 
//   resets the client status to Not Ready
//   returns to the client list.
// @match        https://*.getyourrefund.org/en/hub/clients/*/edit_take_action*intake_info_requested
// @grant        none
// ==/UserScript==
javascript: (function () {
    var st = document.createElement('style');
    st.innerHTML = `
    .gyr-config-panel {
        width: 100%;
        background-color: paleyellow
    }
    `
    document.getElementsByTagName('head')[0].appendChild(st);
    var CLIENT_LIST_URL_KEY = 'CLIENT_LIST_URL'
    var USER_KEY = 'USER'
    var configKeys = [CLIENT_LIST_URL_KEY, USER_KEY]

    function promptForConfiguration(key, force) {
        var configPanel = document.getElementById('configPanel')
        if (!configPanel) {
            configPanel = document.createElement('div')
            configPanel.id = 'configPanel'
            var body = document.getElementsByTagName('body')[0]
            body.prepend(configPanel);
            for (let key of configKeys) {
                var configPanelRow = document.createElement('div')
                var label = document.createElement('span')
                label.innerText = key
                var input = document.createElement('input')
                input.id = key
                input.value = localStorage.getItem(key)
                configPanelRow.appendChild(label)
                configPanelRow.appendChild(input)
                configPanel.appendChild(configPanelRow)
            }

            var ok = document.createElement('button')
            ok.innerText = 'OK'
            ok.onclick = function (ev) {
                for (let key of configKeys) {
                    var input = document.getElementById(key)
                    var value = input.value
                    localStorage.setItem(key, value)
                }

                configPanel.style.display = 'hidden'
            }
            configPanel.appendChild(ok)
            configPanel.style.display = 'visible'
        }
    }

    // Set the status in the bg
    function setStatus(status) {
        var selects = document.getElementsByName('hub_take_action_form[status]')
        for (let select of selects) {
            select.value = status
        }
    }
    function addFinishButton() {
        var commits = Array.from(document.getElementsByClassName('button'))
        console.log(commits)
        for (let commit of commits) {
            if (commit.innerText == 'Send') {
                var finish = document.createElement('button')
                finish.className = 'button button--cta'
                finish.innerText = 'Send + Next'
                finish.form = commit.form
                finish.onclick = (ev) => {
                    ev.preventDefault();
                    var form = ev.target.form;
                    console.log('Submitting in the bg to ' + form.action);
                    var xhr = new XMLHttpRequest();
                    xhr.open(form.method, form.action);
                    setStatus('intake_in_progress');
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            console.log('Submitted note and status');
                            var nextUrl = localStorage.getItem(CLIENT_LIST_URL_KEY);
                            if (nextUrl) {
                                window.location.href = nextUrl;
                            }
                        }
                    };
                    xhr.send(new FormData(form));

                }
                commit.insertAdjacentElement('beforebegin', finish)
            }
        }
    }

    promptForConfiguration()
    addFinishButton()

})();

