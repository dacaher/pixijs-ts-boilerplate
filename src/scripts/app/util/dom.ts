export class Dom {

    /**
     * Returns element with given id or document body if not found.
     * @param {string} elementId - Element id.
     * @returns {HTMLElement} Element or body.
     */
    public static getElementOrBody(elementId: string): HTMLElement {
        const element = document.getElementById(elementId);

        if (element !== null) {
            return element;
        } else {
            return document.body;
        }
    }

    /**
     * Returns element wih given id. If not found, a new element is created and appended to specified container or document body.
     * @param {string} elementId - Element id.
     * @param {string} tagName - Tag name to create the element if not found.
     * @param {Element} container - Container to append the new element. Defaults to document body.
     * @returns {T} Element or a new one if not found.
     */
    public static getElementOrCreateNew<T extends HTMLElement>(elementId: string, tagName: string, container?: Element | null): T {
        let element = document.getElementById(elementId);

        if (element === null) {
            element = document.createElement(tagName);
            element.id = elementId;

            container = container ? container : document.body;
            container.appendChild(element);
        }

        return element as T;
    }
}
