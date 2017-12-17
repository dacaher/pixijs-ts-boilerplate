export class Dom {
    public static getElementOrBody(elementId: string): HTMLElement {
        const element = document.getElementById(elementId);

        if (element !== null) {
            return element;
        } else {
            return document.body;
        }
    }
}
