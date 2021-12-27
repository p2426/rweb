export default function TheCube({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>We need something to render! Let's close on the most basic of shapes - the cube. There are many classes in 3JS for rendering simple shapes, and we will piggyback of the <a href={'//threejs.org/docs/#api/en/geometries/BoxGeometry'} target='_blank' rel='noopener noreferrer'><code>THREE.BoxGeometry</code></a> for our cube. This class is an extension on <code>BufferGeometry</code>, which is what it sounds like, just an array of points in space that can represent anything, from a single line to a huge natural environment.</p>
            <pre><code>
{`properties = {
    id: "unset",
    shader: undefined,
    material: undefined,
    scale: [1, 1, 1],
    segments: [1, 1, 1],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    colour: [135, 206, 235],
    update: () => {},
}

constructor(settings) {
    super();

    this.properties = { ...this.properties, ...settings };

    this.geometry = new THREE.BoxGeometry(...this.properties.scale, ...this.properties.segments);

    if (this.properties.shader) {
        this.properties.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: this.properties.shader.getUniforms(),
            vertexShader: this.properties.shader.vertexShader.getContent(),
            fragmentShader: this.properties.shader.fragmentShader.getContent()
        });
        this.properties.shader.init(this.geometry);
    } else {
        this.properties.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color('rgb(' + this.properties.colour.toString() + ')')
        });
    }

    this.mesh = new THREE.Mesh(this.geometry, this.properties.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.setId(this.properties.id);
    this.setPosition(...this.properties.position);
    this.setRotation(...this.properties.rotation);
}
`}
            </code></pre>
            <p>As always, our class will be given some defaults, and options passed into the constructor will overwrite those that match the keys. Ultimately, a scene object is made up of 3 parts - a <code>geometry</code>, this makes up the vertices, or points in space that make up the object. A <code>material</code>, AKA a shader, which will determine the look of the object, both it's vertices and pixels filling the vertices. And a <code>mesh</code>, the representation of both the <code>geometry</code> and <code>material</code> to perform transformations on.</p>
            <p>Wrapping this up into a small class and given defaults, creating a cube is less verbose and now a maximum of a few lines of code. All that's left to do is add <i>the mesh</i> to the scene with <code>scene.addObjectToScene(cube);</code>. Like a single frame, we've come full circle, and hopefully having a peak at the code (with some details left out) gives you the confidence to play with 3JS and start creating some nice visuals!</p>
        </div>
        </>
    );
}