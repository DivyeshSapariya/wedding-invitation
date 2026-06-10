/* Functional SVG Mandala — adapted for wedding hero (gold strokes) */
window.initMandalaSvg = function (svgId) {
  const DEFAULT_MANDALA_FILL = 'transparent';
  const DEFAULT_MANDALA_STROKE = '#d4af37';
  const DEFAULT_STROKE_WIDTH = 2;
  const BASE_ANGULAR_VELOCITY = 12;

  function createElement(elementType, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    const { children, ...attrs } = attributes;
    if (children) children.forEach(child => child && element.appendChild(child));
    Object.keys(attrs).forEach(key => element.setAttributeNS(null, key, attributes[key]));
    return element;
  }

  const defaultAttributes = {
    stroke: DEFAULT_MANDALA_STROKE,
    fill: DEFAULT_MANDALA_FILL,
    strokeWidth: DEFAULT_STROKE_WIDTH
  };

  function createCircleElement(attributes = {}) {
    return createElement('circle', { ...defaultAttributes, ...attributes });
  }

  function createPathElement(attributes = {}) {
    return createElement('path', { ...defaultAttributes, ...attributes });
  }

  function createGroupElement(attributes = {}) {
    return createElement('g', attributes);
  }

  function getTransformationString(position, phi = 0) {
    const [x, y] = position;
    let transformation = '';
    if (phi) transformation += `rotate(${phi}, ${x}, ${y}) `;
    transformation += `translate(${x}, ${y})`;
    return transformation;
  }

  function defaultTransform(t) {
    if (!this.angularVelocity) return;
    this.element.setAttributeNS(null, 'transform',
      getTransformationString(this.position, this.phi + t * (this.angularVelocity || 0)));
  }

  function transformCircle(t) {
    if (!this.angularVelocity) return;
    let theta = t * this.angularVelocity * Math.PI / 180;
    theta += this.phase * Math.PI / 180;
    const dRadius = this.dRadius * Math.sin(theta);
    this.element.setAttributeNS(null, 'r', this.radius + dRadius);
  }

  const Component = ({ position = [0, 0], phi = 0, phase = 0, angularVelocity = 0, transform = defaultTransform, ...rest }) =>
    () => ({ position, phi, phase, angularVelocity, transform, ...rest });

  const Circle = ({ position = [0, 0], radius = 10, dRadius = 0, ...rest } = {}) =>
    Component({
      ...rest, radius, dRadius, transform: transformCircle,
      element: createCircleElement({ r: radius, transform: getTransformationString(position) })
    });

  const Path = ({ position = [0, 0], phi = 0, path = '', ...rest } = {}) =>
    Component({
      ...rest, phi, position,
      element: createPathElement({ d: path, transform: getTransformationString(position, phi) })
    });

  const Group = ({ position = [0, 0], phi = 0, children = [], ...rest }) =>
    Component({
      ...rest, phi, position, children,
      element: createGroupElement({ transform: getTransformationString(position, phi) })
    });

  function TearDrop({ a = 1, b = 1, m = 1, ...rest }) {
    let path = '';
    for (let i = 0; i < 360; i++) {
      const rad = i * Math.PI / 180;
      const x = a * Math.cos(rad);
      const y = b * Math.sin(rad) * Math.pow(Math.sin(rad / 2), m);
      path += ` ${i ? 'L' : 'M'} ${x} ${y}`;
    }
    return Path({ path, ...rest });
  }

  function Talon({ radius, reverse, ...rest }) {
    const center = { x: 0, y: 0 };
    let path = '';
    let r = radius;
    for (let i = 0; i <= 360; i++) {
      let rad = i * Math.PI / 180;
      if (i === 181) { r /= 2; center.x = -r; }
      if (i >= 180) { rad *= -2; rad += Math.PI; }
      if (i === 270) center.x = r;
      if (i >= 270) { rad *= -1; rad += Math.PI; }
      if (reverse) rad *= -1;
      path += `${i ? 'L' : 'M'} ${center.x + r * Math.cos(rad)} ${center.y + r * Math.sin(rad)} `;
    }
    return Path({ path, ...rest });
  }

  function rotateVector2(position = [0, 0], theta = 0) {
    let [x, y] = position;
    x = +x; y = +y;
    if (!x && !y) return [0, 0];
    if (!theta) return position;
    const c = Math.PI / 180;
    return [
      Math.cos(theta * c) * x - Math.sin(theta * c) * y,
      Math.sin(theta * c) * x + Math.cos(theta * c) * y
    ];
  }

  function iterateOverCircle({ initialAngle = 0, steps = 0, position = [0, -1], component, withArgs = {}, angularVelocity = 0 }) {
    const dTheta = 360 / steps;
    const phi = i => initialAngle + dTheta * i;
    const { children, ...args } = withArgs;
    return Group({
      angularVelocity,
      children: [...Array(steps)].map((e, i) => component({
        ...args,
        children: children && children.map(c => c()),
        phi: phi(i) + (withArgs.phi || 0),
        position: rotateVector2(position, phi(i))
      }))
    });
  }

  function createComponent(c) {
    const component = c();
    if (component.children) {
      component.children = component.children.map(ch => {
        const child = createComponent(ch);
        component.element.appendChild(child.element);
        return child;
      });
    }
    return component;
  }

  function transformComponent(t, component) {
    component.transform(t);
    if (component.children) component.children.forEach(child => transformComponent(t, child));
  }

  const OuterRing = () => Group({
    children: [
      Circle({ radius: 500 }), Circle({ radius: 490 }), Circle({ radius: 475 }),
      iterateOverCircle({ component: Circle, steps: 48, withArgs: { radius: 10 }, position: [450, 0] }),
      Circle({ radius: 430 }), Circle({ radius: 420 }),
      iterateOverCircle({ component: Path, steps: 48, withArgs: { path: 'M 0 0 L 420 0' }, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ component: Path, steps: 48, withArgs: { path: 'M 0 0 L 420 0' } }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: TearDrop, withArgs: { a: 100, b: 150, m: 1.5 }, initialAngle: 30, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: Circle, withArgs: { radius: 70 }, initialAngle: 30, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: Circle, withArgs: { radius: 55 }, initialAngle: 30, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], initialAngle: 30, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY, component: Group, withArgs: { children: [() => iterateOverCircle({ angularVelocity: 3 * BASE_ANGULAR_VELOCITY, steps: 12, component: Path, withArgs: { path: 'M 0 0 L 55 0' } })] } }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: Circle, withArgs: { radius: 25 }, initialAngle: 30, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: Circle, withArgs: { radius: 15 }, initialAngle: 30, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: TearDrop, withArgs: { a: 120, b: 150, m: 1.25 }, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: TearDrop, withArgs: { a: 100, b: 125, m: 1 }, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: Circle, withArgs: { radius: 80, dRadius: 5, angularVelocity: 3 * BASE_ANGULAR_VELOCITY }, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: Group, withArgs: { angularVelocity: -3 * BASE_ANGULAR_VELOCITY, children: [() => Talon({ radius: 65 }), () => Talon({ radius: 65, phi: 180 }), () => iterateOverCircle({ component: Group, steps: 2, withArgs: { children: [() => Circle({ radius: 10, position: [30, 0] }), () => Circle({ radius: 6, position: [30, 30] }), () => Circle({ radius: 4, position: [10, 40] })] } })] }, angularVelocity: -.5 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ component: Circle, steps: 48, withArgs: { radius: 7 }, position: [330, 0] }),
      Circle({ radius: 300 }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: TearDrop, withArgs: { a: 140, b: 220, m: 1.75 }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [350, 0], component: TearDrop, withArgs: { a: 110, b: 160, m: 1.5 }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, position: [330, 0], component: Circle, angularVelocity: BASE_ANGULAR_VELOCITY, withArgs: { radius: 90 } }),
      iterateOverCircle({ steps: 6, position: [330, 0], component: Circle, angularVelocity: BASE_ANGULAR_VELOCITY, withArgs: { radius: 70, dRadius: 10, angularVelocity: 3 * BASE_ANGULAR_VELOCITY } }),
      iterateOverCircle({ steps: 6, position: [330, 0], component: Group, angularVelocity: BASE_ANGULAR_VELOCITY, withArgs: { children: [
        () => iterateOverCircle({ steps: 6, component: TearDrop, withArgs: { a: 20, b: 40, m: 2 }, position: [60, 0], angularVelocity: -2 * BASE_ANGULAR_VELOCITY }),
        () => iterateOverCircle({ steps: 6, component: TearDrop, withArgs: { a: 30, b: 40, m: 2 }, position: [60, 0], initialAngle: 30, angularVelocity: -2 * BASE_ANGULAR_VELOCITY }),
        () => iterateOverCircle({ steps: 6, component: TearDrop, withArgs: { a: 20, b: 20, m: 3 }, position: [60, 0], initialAngle: 30, angularVelocity: -2 * BASE_ANGULAR_VELOCITY }),
        () => Circle({ radius: 45 }), () => Circle({ radius: 35 }),
        () => iterateOverCircle({ steps: 12, component: Path, withArgs: { path: 'M 0 0 L 35 0' }, angularVelocity: BASE_ANGULAR_VELOCITY }),
        () => Circle({ radius: 18 }), () => Circle({ radius: 10, dRadius: 2, angularVelocity: BASE_ANGULAR_VELOCITY })
      ] } })
    ]
  });

  const MiddleRing = () => Group({
    children: [
      Circle({ radius: 300 }), Circle({ radius: 290 }),
      iterateOverCircle({ component: Circle, withArgs: { radius: 30 }, position: [258, 0], steps: 24 }),
      Circle({ radius: 260 }), Circle({ radius: 250 }),
      iterateOverCircle({ component: Path, withArgs: { path: 'M 0 0 L 250 0' }, steps: 24, angularVelocity: -BASE_ANGULAR_VELOCITY }),
      Circle({ radius: 233 }),
      iterateOverCircle({ steps: 6, component: Group, withArgs: { children: [() => Circle({ radius: 40, dRadius: 3, angularVelocity: 2 * BASE_ANGULAR_VELOCITY }), () => Circle({ radius: 33 }), () => iterateOverCircle({ steps: 3, component: Talon, position: [17, 0], withArgs: { radius: 10, phi: 180 }, angularVelocity: 2 * BASE_ANGULAR_VELOCITY })] }, position: [200, 0] }),
      iterateOverCircle({ steps: 6, initialAngle: 30, component: Group, position: [170, 0], withArgs: { children: [() => Circle({ radius: 60, dRadius: 4, angularVelocity: 3 * BASE_ANGULAR_VELOCITY }), () => Circle({ radius: 50 }), () => iterateOverCircle({ steps: 12, component: Path, withArgs: { path: 'M 0 0 L 50 0' }, angularVelocity: -BASE_ANGULAR_VELOCITY }), () => Circle({ radius: 15 })] } }),
      iterateOverCircle({ steps: 6, component: TearDrop, position: [160, 0], withArgs: { a: 50, b: 130, m: 2.5 }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, component: Group, position: [160, 0], withArgs: { angularVelocity: -3 * BASE_ANGULAR_VELOCITY, children: [() => Circle({ radius: 30, dRadius: 3, angularVelocity: 3 * BASE_ANGULAR_VELOCITY }), () => Talon({ radius: 20 }), () => Talon({ radius: 20, phi: 180 }), () => Circle({ radius: 3, position: [10, 5] }), () => Circle({ radius: 3, position: [-10, -5] })] }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, component: TearDrop, position: [110, 0], withArgs: { a: 100, b: 155, m: 2 }, angularVelocity: BASE_ANGULAR_VELOCITY, initialAngle: 30 }),
      iterateOverCircle({ steps: 6, component: TearDrop, position: [110, 0], withArgs: { a: 80, b: 120, m: 2.3 }, angularVelocity: BASE_ANGULAR_VELOCITY, initialAngle: 30 }),
      iterateOverCircle({ steps: 6, component: Talon, position: [130, 0], withArgs: { radius: 15, phi: 210 }, angularVelocity: BASE_ANGULAR_VELOCITY, initialAngle: 25 }),
      iterateOverCircle({ steps: 6, component: Talon, position: [-130, 0], withArgs: { radius: 15, phi: -30, reverse: true }, angularVelocity: BASE_ANGULAR_VELOCITY, initialAngle: -25 }),
      iterateOverCircle({ steps: 12, component: Circle, position: [150, 0], withArgs: { radius: 10 } }),
      iterateOverCircle({ steps: 12, position: [95, 0], component: Group, angularVelocity: -BASE_ANGULAR_VELOCITY, withArgs: { children: [() => Circle({ radius: 30 }), () => Circle({ radius: 22, dRadius: 2, angularVelocity: 3 * BASE_ANGULAR_VELOCITY })] } })
    ]
  });

  const InnerRing = () => Group({
    children: [
      Circle({ radius: 105 }), Circle({ radius: 95, dRadius: 3, angularVeloctiy: 3 * BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, component: Talon, withArgs: { radius: 10 }, position: [80, 0] }),
      iterateOverCircle({ steps: 6, component: TearDrop, position: [60, 0], withArgs: { a: 40, b: 40, m: 2 }, initialAngle: 30 }),
      iterateOverCircle({ steps: 6, component: TearDrop, position: [60, 0], withArgs: { a: 40, b: 60, m: 1.5 }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, component: TearDrop, position: [63, 0], withArgs: { a: 27, b: 41, m: 1.5 }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, component: Talon, position: [60, 0], withArgs: { radius: 15, phi: 180 }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      iterateOverCircle({ steps: 6, component: Circle, position: [69, 0], withArgs: { radius: 5 }, angularVelocity: BASE_ANGULAR_VELOCITY, initialAngle: 8 }),
      iterateOverCircle({ steps: 6, component: Circle, position: [103, 0], withArgs: { radius: 7 }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      Circle({ radius: 55 }), Circle({ radius: 45 }),
      iterateOverCircle({ steps: 12, position: [0, 0], component: Path, withArgs: { path: 'M 45 0 L 0 0' }, angularVelocity: BASE_ANGULAR_VELOCITY }),
      Circle({ radius: 30, dRadius: 3, angularVelocity: 3 * BASE_ANGULAR_VELOCITY }),
      Circle({ radius: 20 })
    ]
  });

  const mandala = Group({
    position: [500, 500],
    children: [OuterRing(), MiddleRing(), InnerRing()]
  });

  const svg = document.getElementById(svgId);
  if (!svg) return;

  const component = createComponent(mandala);
  svg.appendChild(component.element);

  const start = Date.now();
  function render() {
    const dt = (Date.now() - start) / 1000;
    transformComponent(dt, component);
    requestAnimationFrame(render);
  }
  render();
};
