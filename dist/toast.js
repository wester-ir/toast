/**
 * The Toast notification library.
 *
 * @github  https://github.com/weska-ir/toast
 * @version 1.0
 */
const toast = {
    elements: {
        container: null,
    },

    init() {
        this.whenReady(() => {
            const elem = document.createElement('div');

            elem.classList.add('toast', 'toast-container');

            this.elements.container = elem;

            document.body.appendChild(elem);
        });
    },

    whenReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
    
            return;
        }
    
        document.addEventListener('DOMContentLoaded', fn);
    },

    append(elem) {
        this.elements.container.appendChild(elem);
    },

    create(message, opt = {}) {
        opt = Object.assign({
            type: 'default',
            dismissAfter: null,
            showCloseButton: true,
            buttons: [],
        }, opt);

        const elem = document.createElement('div');
        const elemContainer = document.createElement('div');
        const elemContentContainer = document.createElement('div');
        const elemContent = document.createElement('div');
        const elemButtons = document.createElement('div');
        const elemClose = this._createCloseButton(elem);

        elem.id = random(10);
        elem.classList.add('toast-message', ...opt.type.split(' '));
        elemContentContainer.classList.add('toast-content-container');
        elemContent.classList.add('toast-content');
        elemContent.innerText = message;
        elemButtons.className = 'toast-buttons';
        
        elemContentContainer.appendChild(elemContent);
        elemContainer.appendChild(elemContentContainer);

        if (opt.showCloseButton) {
            elemContainer.appendChild(elemClose);
        }

        elem.appendChild(elemContainer);

        // Buttons
        if (opt.buttons.length > 0) {
            for (const button of opt.buttons) {
                let elemButton = document.createElement(button.type ? button.type : 'a');

                elemButton.className = button.className;
                elemButton.innerHTML = button.innerHTML;

                if (button.href) {
                    elemButton.href = button.href;
                }

                if (button.onclick) {
                    elemButton.onclick = button.onclick;
                }

                elemButtons.appendChild(elemButton);
            }

            elemContentContainer.appendChild(elemButtons);
        }

        this.append(elem);

        elem.style.maxHeight = `${elem.offsetHeight}px`;

        setTimeout(() => {
            elem.classList.add('should-open');
        }, 1);

        if (opt.dismissAfter !== null) {
            this.dismiss(elem, opt.dismissAfter + 1);
        }

        return {
            dismiss: (delay) => this.dismiss(elem, delay),
        };
    },

    _createCloseButton(elem) {
        const btn = document.createElement('div');

        btn.classList.add('toast-close');
        btn.addEventListener('click', () => this.dismiss(elem));
        btn.innerHTML = '<svg class="svg-icon" style="width: 10px; height: 10px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M895.156706 86.256941a30.177882 30.177882 0 0 1 42.767059-0.180706c11.745882 11.745882 11.745882 30.870588-0.180706 42.767059L128.843294 937.743059c-11.866353 11.866353-30.930824 12.047059-42.767059 0.180706-11.745882-11.745882-11.745882-30.870588 0.180706-42.767059L895.156706 86.256941z" fill="#000000" /><path d="M86.076235 86.076235c11.745882-11.745882 30.870588-11.745882 42.767059 0.180706l808.899765 808.899765c11.866353 11.866353 12.047059 30.930824 0.180706 42.767059-11.745882 11.745882-30.870588 11.745882-42.767059-0.180706L86.256941 128.843294a30.177882 30.177882 0 0 1-0.180706-42.767059z" fill="#000000" /><path d="M0 0h1024v1024H0z" fill="#FFF4F4" fill-opacity="0" /></svg>';

        return btn;
    },

    default(message, opt = {}) {
        return this.create(message, {
            dismissAfter: 5000,
            type: 'default',
            ...opt,
        });
    },

    success(message, opt = {}) {
        this.default(message, {
            type: 'success',
            ...opt,
        });
    },

    error(message, opt = {}) {
        this.default(message, {
            type: 'error',
            ...opt,
        });
    },

    dismiss(toastMessage = null, delay = 1) {
        if (! toastMessage) {
            toastMessage = this.elements.container.lastChild;
        }

        setTimeout(() => {
            toastMessage?.classList?.add?.('should-close');

            setTimeout(() => {
                toastMessage?.remove();
            }, 200);
        }, delay);
    },

    dismissAll() {
        for (const toastMessage of this.elements.container.children) {
            this.dismiss(toastMessage);
        }
    },
};

toast.init();
