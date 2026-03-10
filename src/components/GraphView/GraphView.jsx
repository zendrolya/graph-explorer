import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import styles from "./GraphView.module.css";

function GraphView({
  graphData,
  onVertexClick,
  onEdgeClick,
  selectedVertex,
  selectedEdge,
}) {
  const graphRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);

      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0) {
      graphRef.current.d3Force("charge").strength(-100);
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

    // Рисуем круг (цвет #1BA0D0 - синий)
    ctx.beginPath();
    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color || "#1BA0D0";
    ctx.fill();

    if (selectedVertex === node.id) {
      ctx.strokeStyle = "#ff6b6b";
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    }

    // Текст
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, node.x, node.y);
  };

  const linkCanvasObject = (link, ctx, globalScale) => {
    const start = link.source;
    const end = link.target;

    if (!start || !end || !start.x || !end.x) return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);

    ctx.lineWidth = 2 / globalScale;

    const isSelected =
      selectedEdge &&
      ((link.source.id === selectedEdge.from &&
        link.target.id === selectedEdge.to) ||
        (!graphData.isDirected &&
          link.source.id === selectedEdge.to &&
          link.target.id === selectedEdge.from));

    // Цвет ребра #EF9312 - оранжевый
    ctx.strokeStyle = isSelected ? "#ff6b6b" : link.color || "#EF9312";
    ctx.stroke();

    if (link.source.id === link.target.id) {
      const node = link.source;

      const r = 18;

      ctx.beginPath();
      ctx.arc(node.x, node.y - r, r, 0, 2 * Math.PI);

      ctx.strokeStyle = link.color || "#EF9312";
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();

      if (graphData?.isWeighted && link.label) {
        ctx.font = `${10 / globalScale}px Sans-Serif`;
        ctx.fillStyle = "#333";
        ctx.fillText(link.label, node.x, node.y - r * 2);
      }

      return;
    }

    if (graphData?.isWeighted && link.label && globalScale > 0.5) {
      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;

      const len = Math.sqrt(dx * dx + dy * dy) || 1;

      const offset = graphData.isDirected ? 8 / globalScale : 0;

      const offsetX = (-dy / len) * offset;
      const offsetY = (dx / len) * offset;

      ctx.font = `${10 / globalScale}px Sans-Serif`;
      ctx.fillStyle = "#333";

      ctx.fillText(link.label, midX + offsetX, midY + offsetY);
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
          backgroundColor="#f5f5f5"
        />
      )}
    </div>
  );
}

export default GraphView;
