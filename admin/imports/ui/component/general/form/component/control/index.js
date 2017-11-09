const confirmationMessage = `It looks like you have been editing something. 
If you leave before saving, your changes will be lost.`;

export default class Control
{
    constructor()
    {
        this.isModified = false;
        this.submitting = false;
    }

    isModified(previousModel, model)
    {
        const dirty = !_.deepEquals(previousModel, model);
        if (dirty) {
            setTimeout(() => {
                EventEmitter.emit('form-dirty'); // event caught by side-panel.jsx
            }, 0);
        } else {
            setTimeout(() => {
                EventEmitter.emit('form-clean'); // event caught by side-panel.jsx
            }, 0);
        }
        return dirty; // will set the dirty flag
    }

    /** * Pops alert when current window is closed
     * @params {object} e - event
     */
    onUnload(e) {
        if (this.submitting || !this.isModified) { // should a message appear?
            return undefined; // no
        }

        (e || window.event).returnValue = confirmationMessage;

        return confirmationMessage; // yes
    }

    /** * Sets isModified true or false
     * @params {object} oldModel - initial state of the form
     * @params {object} currentModel - current state of the form
     */
    setDirty(oldModel, currentModel) {
        this.isModified = this.isDirty(oldModel, currentModel);
        return this.isModified;
    }

    /** * Sets submittingFlag true or false
     * @params {boolean} value - new value of submittingFlag
     */
    setSubmitting(value) {
        this.submitting = value;
    }

    /** * Adds onbeforeunlnload trigger to window object
     */
    onMount() {
        window.onbeforeunload = this.onUnload.bind(this);
    }

    /** * Removes onbeforeunlnload trigger to window object
     * Emits form-clean event when done
     */
    onUnmount() {
        window.onbeforeunload = undefined;
        setTimeout(() => {
            EventEmitter.emit('form-clean'); // event caught by side-panel.jsx
        }, 0);
    }

    /** Pops alert if needed on go back button
     * @params {function} func - function to be called if checks pass
     */
    confirmSwitch(func) {
        if (!this.isModified) { // if the form has not been edited, proceed as normal
            func();
        } else {
            if (confirm(confirmationMessage)) { // confirm that you want to move away without saving
                func();
            }
        }
    }
}
