export class CustomShader {
    #content;

    constructor(content) {
        this.#content = content;
    }

    getContent = () => { return this.#content }
}