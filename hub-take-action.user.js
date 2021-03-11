// ==UserScript==
// @name         Take Action on GetYourRefund
// @updateURL    https://raw.githubusercontent.com/michaelaltmann/get-your-refund/gh-pages/hub-take-action.user.js
// @namespace    http://getyourrefund.org/
// @version      0.7
// @description  Adds a Send + Next button that 
//   sends the message, 
//   returns to the client list, if that has been configured.
// @match        https://*.getyourrefund.org/en/hub/clients/*/edit_take_action*
// ==/UserScript==
javascript: (function () {
    // Log errors instead of throwing them
    try {
        var st = document.createElement('style');
        st.innerHTML = `
        .gyr-config-panel {
            width: 100%;
            background-color: paleyellow
        }
        .gyr-config-input {
            width: 70%;

        }
        `
        document.getElementsByTagName('head')[0].appendChild(st);
        var CLIENT_LIST_URL_KEY = 'CLIENT_LIST_URL'
        var USER_KEY = 'USER'
        var configKeys = [CLIENT_LIST_URL_KEY]

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
                    input.className = 'gyr-config-input'
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

        function submitForm(form, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open(form.method, form.action);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callback()
                }
            };
            xhr.send(new FormData(form));
        }
        // Set the status in the bg
        function setStatus(status, callback) {
            var selects = document.getElementsByName('hub_take_action_form[status]')
            for (let select of selects) {
                select.value = status
                if (select.form) submitForm(select.form, callback)
            }
        }
        function addFinishButton() {
            var commits = Array.from(document.getElementsByClassName('button'))
            for (let commit of commits) {
                if (commit.innerText == 'Send') {
                    var finish = document.createElement('button')
                    finish.className = 'button button--cta'
                    finish.innerText = 'Send + Next'
                    finish.form = commit.form
                    finish.onclick = (ev) => {
                        ev.preventDefault();
                        var form = ev.target.form;
                        var callback = () => {
                            var nextUrl = localStorage.getItem(CLIENT_LIST_URL_KEY);
                            if (!nextUrl) {
                                // Go to the usual place, the client's overview
                                nextUrl = window.location.href
                                let i = nextUrl.indexOf('/edit_take_action')
                                nextUrl = nextUrl.substring(0, i)
                            }
                            window.location.href = nextUrl;
                        }
                        submitForm(form, callback)
                    };
                    commit.insertAdjacentElement('beforebegin', finish)
                }
            }
        }


        promptForConfiguration()
        addFinishButton()
    
    // Avoid throwing errors so that other things, possibly other bookmarklets, can work on the page
    } catch (err) {
      // Do show the error to the developer, though
      console.error( err );
    }  // ends try/catch
})();

