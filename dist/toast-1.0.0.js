/**
 * The ToastJs notification library.
 *
 * @version 1.0.0
 */
const toast = {
    elements: {
        container: null, // Will hold the main container for toast notifications
    },

    /**
     * Initialize the library by creating and appending the toast container to the document.
     */
    init() {
        whenReady(() => { // Ensure DOM is fully loaded before executing
            const container = document.createElement('div');
            container.classList.add('toast', 'toast-container'); // Add necessary classes to the container

            this.elements.container = container; // Store reference to the container

            document.body.appendChild(container); // Append container to the body
        });
    },

    /**
     * Append a new toast element to the container.
     * @param {HTMLElement} elem - The toast element to append.
     */
    append(elem) {
        this.elements.container.appendChild(elem);
    },

    /**
     * Create a toast notification.
     * @param {string} message - The message to display in the toast.
     * @param {Object} [opt] - Options for customizing the toast.
     * @returns {Object} An object with a dismiss function for the toast.
     */
    create(message, opt = {}) {
        // Set default options and merge with user-supplied options
        opt = Object.assign({
            type: 'default', // Toast type (default, success, error, etc.)
            dismissAfter: null, // Time in ms to auto-dismiss (null means no auto-dismiss)
            showCloseButton: true, // Whether to show the close button
            buttons: [], // Array of buttons to display in the toast
        }, opt);

        // Create necessary HTML elements for the toast
        const elem = document.createElement('div');
        const elemContainer = document.createElement('div');
        const elemContentContainer = document.createElement('div');
        const elemContent = document.createElement('div');
        const elemButtons = document.createElement('div');
        const elemClose = document.createElement('div');

        elem.id = random(10); // Assign a random ID
        elem.classList.add('toast-message', ...opt.type.split(' ')); // Add type class (default, success, etc.)

        // Build the content container
        elemContentContainer.classList.add('toast-content-container');
        elemContent.classList.add('toast-content');
        elemContent.innerText = message;

        // Close button setup
        elemClose.classList.add('toast-close');
        elemClose.innerHTML = `<svg class="svg-icon" style="width: 10px; height: 10px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"><path d="M895.156706 86.256941a30.177882 30.177882 0 0 1 42.767059-0.180706c11.745882 11.745882 11.745882 30.870588-0.180706 42.767059L128.843294 937.743059c-11.866353 11.866353-30.930824 12.047059-42.767059 0.180706-11.745882-11.745882-11.745882-30.870588 0.180706-42.767059L895.156706 86.256941z"/><path d="M86.076235 86.076235c11.745882-11.745882 30.870588-11.745882 42.767059 0.180706l808.899765 808.899765c11.866353 11.866353 12.047059 30.930824 0.180706 42.767059-11.745882 11.745882-30.870588 11.745882-42.767059-0.180706L86.256941 128.843294a30.177882 30.177882 0 0 1-0.180706-42.767059z"/><path d="M0 0h1024v1024H0z" fill="#FFF4F4" fill-opacity="0" /></svg>`;
        elemClose.addEventListener('click', () => this.dismiss(elem));

        // Append content and close button to the container
        elemContentContainer.appendChild(elemContent);
        elemContainer.appendChild(elemContentContainer);
        if (opt.showCloseButton) {
            elemContainer.appendChild(elemClose);
        }
        elem.appendChild(elemContainer);

        // If there are buttons, create and append them
        if (opt.buttons.length > 0) {
            opt.buttons.forEach(button => {
                let elemButton = document.createElement(button.type || 'a');
                elemButton.className = button.className;
                elemButton.innerHTML = button.innerHTML;
                if (button.href) elemButton.href = button.href;
                if (button.onclick) elemButton.onclick = button.onclick;
                elemButtons.appendChild(elemButton);
            });
            elemContentContainer.appendChild(elemButtons);
        }

        // Append the toast to the container
        this.append(elem);

        // Open animation
        elem.style.maxHeight = `${elem.offsetHeight}px`; // Set the max height for transition
        setTimeout(() => elem.classList.add('should-open'), 1);

        // Auto-dismiss if specified
        if (opt.dismissAfter !== null) {
            this.dismiss(elem, opt.dismissAfter + 1);
        }

        // Return an object with a dismiss method
        return {
            dismiss: (delay) => this.dismiss(elem, delay),
        };
    },

    /**
     * Create a default notification with a 5-second dismiss timer.
     * @param {string} message - The message to display.
     * @param {Object} [opt] - Optional settings for the toast.
     */
    default(message, opt = {}) {
        return this.create(message, {
            dismissAfter: 5000,
            type: 'default',
            ...opt,
        });
    },

    /**
     * Create a success notification.
     * @param {string} message - The message to display.
     * @param {Object} [opt] - Optional settings for the toast.
     */
    success(message, opt = {}) {
        this.default(message, {
            type: 'success',
            ...opt,
        });
    },

    /**
     * Create an error notification.
     * @param {string} message - The message to display.
     * @param {Object} [opt] - Optional settings for the toast.
     */
    error(message, opt = {}) {
        this.default(message, {
            type: 'error',
            ...opt,
        });
    },

    /**
     * Dismiss a specific toast element or the last one in the container.
     * @param {HTMLElement} [toastMessage=null] - The toast element to dismiss.
     * @param {number} [delay=1] - Delay before dismissing (ms).
     */
    dismiss(toastMessage = null, delay = 1) {
        if (! toastMessage) {
            toastMessage = this.elements.container.lastChild;
        }

        // Add closing animation class and remove the element after a delay
        setTimeout(() => {
            toastMessage?.classList.add('should-close');

            setTimeout(() => {
                toastMessage?.remove();
            }, 200);
        }, delay);
    },

    /**
     * Dismiss all active toasts in the container.
     */
    dismissAll() {
        for (const toastMessage of this.elements.container.children) {
            this.dismiss(toastMessage);
        }
    },
};

// Initialize the toast system
toast.init();
