import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import styles from './GraphView.module.css';

function GraphView({ graphData, onVertexClick, onEdgeClick, selectedVertex, selectedEdge }) {
    const graphRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const updateDimensions = () => {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            };

            updateDimensions();
            window.addEventListener('resize', updateDimensions);

            return () => window.removeEventListener('resize', updateDimensions);
        }
    }, []);

    useEffect(() => {
        if (graphRef.current && graphData.nodes.length > 0) {
            graphRef.current.d3Force('charge').strength(-100);
            graphRef.current.d3ReheatSimulation();
        }
    }, [graphData]);

    const handleNodeClick = (node) => {
        onVertexClick(node.id);
    };

    const handleLinkClick = (link) => {
        onEdgeClick(link);
    };

    const nodeCanvasObject = (node, ctx, globalScale) => {
        const label = node.name;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color || '#4ecdc4';
        ctx.fill();

        if (selectedVertex === node.id) {
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 3 / globalScale;
            ctx.stroke();
        }

        // Текст
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, node.x, node.y);
    };

    const linkCanvasObject = (link, ctx, globalScale) => {
        const start = link.source;
        const end = link.target;

        if (!start || !end || !start.x || !end.x) return;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);

        const weight = link.weight || 1;
        ctx.lineWidth = Math.max(1, weight / (2 / globalScale));

        const isSelected = selectedEdge &&
            ((link.source.id === selectedEdge.from && link.target.id === selectedEdge.to) ||
                (!graphData.isDirected && link.source.id === selectedEdge.to && link.target.id === selectedEdge.from));

        ctx.strokeStyle = isSelected ? '#ff6b6b' : link.color || '#999';
        ctx.stroke();

        // Проверяем наличие graphData.isWeighted перед использованием
        if (graphData?.isWeighted && link.label && globalScale > 0.5) {
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;

            ctx.font = `${10 / globalScale}px Sans-Serif`;
            ctx.fillStyle = '#333';
            ctx.fillText(link.label, midX, midY - 5 / globalScale);
        }
    };

    return (
        <div ref={containerRef} className={styles.graphContainer}>
            {dimensions.width > 0 && dimensions.height > 0 && (
                <ForceGraph2D
                    ref={graphRef}
                    graphData={graphData}
                    nodeLabel="name"
                    nodeCanvasObject={nodeCanvasObject}
                    linkCanvasObject={linkCanvasObject}
                    onNodeClick={handleNodeClick}
                    onLinkClick={handleLinkClick}
                    nodeRelSize={8}
                    linkDirectionalArrowLength={graphData?.isDirected ? 6 : 0}
                    linkDirectionalArrowRelPos={1}
                    cooldownTicks={100}
                    width={dimensions.width}
                    height={dimensions.height}
                    backgroundColor="#fff"
                />
            )}
        </div>
    );
}

export default GraphView;