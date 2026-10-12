import { SVGLoader } from '@yushu/three-base/three-extends/jsm/loaders/SVGLoader';
import * as THREE from '@yushu/three-base';

interface Option {
    drawFillShapes?: boolean; // 是否绘制填充
    drawStrokes?: boolean; // 是否绘制描边
    fillShapesWireframe?: boolean; // 绘制形状线框
    strokesWireframe?: boolean; // 绘制描边线框
}

export const getMeshFromSvgString = (svgString: string, option: Option = {}) => {
    const innerOption: Option = {
        drawFillShapes: true,
        drawStrokes: true,
        fillShapesWireframe: false,
        strokesWireframe: false,
        ...option
    };
    const svgLoader = new SVGLoader();
    const data = svgLoader.parse(svgString);

    const { paths } = data;

    const group = new THREE.Group();

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i] as any;
        // console.log(path);

        const fillColor = path.userData.style.fill;
        if (innerOption.drawFillShapes && fillColor !== undefined && fillColor !== 'none') {
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setStyle(fillColor),
                opacity: path.userData.style.opacity !== undefined ? path.userData.style.opacity : path.userData.style.fillOpacity,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                wireframe: innerOption.fillShapesWireframe
            });

            const shapes = SVGLoader.createShapes(path);

            for (let j = 0; j < shapes.length; j++) {
                const shape = shapes[j];

                const geometry = new THREE.ShapeGeometry(shape);
                const mesh = new THREE.Mesh(geometry, material);
                mesh.name = path.userData.node.getAttribute('name');
                group.add(mesh);
            }
        }

        const strokeColor = path.userData.style.stroke;

        if (innerOption.drawStrokes && strokeColor !== undefined && strokeColor !== 'none') {
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setStyle(strokeColor),
                opacity: path.userData.style.opacity !== undefined ? path.userData.style.opacity : path.userData.style.strokeOpacity,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                wireframe: innerOption.strokesWireframe
            });

            for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
                const subPath = path.subPaths[j];

                const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);

                if (geometry) {
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.name = path.userData.node.getAttribute('name');
                    group.add(mesh);
                }
            }
        }
    }

    return group;
};
