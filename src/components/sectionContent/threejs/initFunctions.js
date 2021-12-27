export default function InitFunctions({type, title}) {
    return (
        <>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
        <p>The <code>init</code> functions are just holders for specific setup that aren't called by anything else, but wanted to keep the logic seperate from the <code>constructor</code>. A few important calls are made and properties setup within, which are pretty self-explanatory, so I wont go over them in  too much detail.</p>
        <pre><code>
{`initRenderer() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.sceneSettings.width, this.sceneSettings.height);
    this.sceneSettings.parent.appendChild(this.renderer.domElement);
    const colour = new THREE.Color('rgb(' + this.sceneSettings.colour.toString() + ')');
    this.sceneSettings.alpha ? this.renderer.setClearColor(colour, 0) : this.scene.background = colour;
}
`}
        </code></pre>
        <p>There are renderer settings that are hardcoded here that I will change in the future, like whether <code>shadowMap</code> is enabled and it's type, to which there are a few. <a href={'//developer.download.nvidia.com/shaderlibrary/docs/shadow_PCSS.pdf'} target='_blank' rel='noopener noreferrer'>PCF Shadows</a> are more true-to-life so are used as the default. <code>this.renderer.setSize</code> is simply a width and height of the container set in the <code>sceneSettings</code>, but there's a bit more to it than that - you could render to a lesser resolution, for mobile devices say, by introducing some factor in this method like <code>this.renderer.setSize(this.sceneSettings.width / x, this.sceneSettings.height / y);</code>. The other lines are appending the renderer's <code>domElement</code> or <code>{'<canvas>'}</code> to the parent container specified, and setting up the background colour of the scene - which doesn't <i>have</i> to be a colour if the <code>alpha</code> flag is set to true.</p>
        <pre><code>
{`initCamera() {
    this.controls.enableKeys = this.cameraSettings.enableKeys;
    this.controls.enableZoom = this.cameraSettings.enableZoom;
    this.controls.keys = {
        LEFT: this.cameraSettings.leftKey,
        UP: this.cameraSettings.upKey,
        RIGHT: this.cameraSettings.rightKey,
        BOTTOM: this.cameraSettings.downKey
    }
    this.controls.mouseButtons = {
        LEFT: this.cameraSettings.leftMouse,
        MIDDLE: this.cameraSettings.middleMouse,
        RIGHT: this.cameraSettings.rightMouse
    }
    this.controls.target = new THREE.Vector3(...this.cameraSettings.cameraTarget);
    this.setCameraPosition(...this.cameraSettings.cameraPosition);
    this.controls.update();
}
`}
        </code></pre>
        <p>Becuase the <code>camera</code> and <code>controls</code> are closely coupled, they are initialised together also. The camera is configured mainly in it's constructor, but here we are setting the position with <code>this.setCameraPosition(...this.cameraSettings.cameraPosition);</code> which is a function inside the <code>Scene</code> class we will see later. It's important to note that when we change the camera's transform, we must also update the control's matrix with <code>this.controls.update();</code> (but the previous mentioned Scene function will take care of that). The rest is just toggling some flags and setting up keys to be used to control the camera in the scene, as mentioned before, there's no need to reinvent the wheel, so we're using the <a href={'//threejs.org/docs/#examples/en/controls/OrbitControls'} target='_blank' rel='noopener noreferrer'>OrbitControls</a> class - feeding settings through in the <code>cameraSettings</code> object in the section above.</p>
        </div>
        </>
    );
}