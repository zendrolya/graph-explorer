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
    }
  }, [graphData]);

  const handleNodeClick = (node) => {
    onVertexClick(node.id);
  };

  const handleLinkClick = (link) => {
    onEdgeClick({
      id: link.id,
      from: link.source.id,
      to: link.target.id,
    });
  };

  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;

    const isSelected = selectedVertex === node.id;

    ctx.beginPath();
    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = isSelected ? "#ff6b6b" : "#1BA0D0";
    ctx.fill();

    if (isSelected) {
      ctx.strokeStyle = "#ff6b6b";
      ctx.lineWidth = 3 / globalScale;
      ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, node.x, node.y);
  };

  const linkCanvasObject = (link, ctx, globalScale) => {
    const start = link.source;
    const end = link.target;

    if (!start || !end) return;

    /* =========================
     1. ОБЩАЯ ЛИНИЯ (A — B)
  ========================= */
    if (link.type === "line") {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);

      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 1 / globalScale;
      ctx.stroke();

      return;
    }

    /* =========================
     2. ПЕТЛЯ (A → A)
  ========================= */
    if (start.id === end.id) {
      const r = 20;

      const isSelected =
        selectedEdge &&
        selectedEdge.from === link.source.id &&
        selectedEdge.to === link.target.id;

      ctx.beginPath();
      ctx.arc(start.x, start.y - r, r, 0, 2 * Math.PI);

      ctx.strokeStyle = isSelected ? "#ff6b6b" : "#EF9312";
      ctx.lineWidth = isSelected ? 3 / globalScale : 2 / globalScale;
      ctx.stroke();

      // вес
      if (graphData?.isWeighted && link.label) {
        ctx.font = `${10 / globalScale}px Sans-Serif`;
        ctx.fillStyle = "#333";
        ctx.fillText(link.label, start.x, start.y - r * 2);
      }

      return;
    }

    /* =========================
     3. ДУГА (A → B)
  ========================= */

    const isSelected =
      selectedEdge &&
      selectedEdge.from === link.source.id &&
      selectedEdge.to === link.target.id;

    // линия
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);

    ctx.strokeStyle = isSelected ? "#ff6b6b" : "#EF9312";
    ctx.lineWidth = isSelected ? 3 / globalScale : 2 / globalScale;
    ctx.stroke();

    /* ===== стрелка ===== */
    if (graphData?.isDirected) {
      const angle = Math.atan2(end.y - start.y, end.x - start.x);

      const arrowLength = isSelected ? 14 / globalScale : 10 / globalScale;

      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle - 0.4),
        end.y - arrowLength * Math.sin(angle - 0.4),
      );
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle + 0.4),
        end.y - arrowLength * Math.sin(angle + 0.4),
      );
      ctx.closePath();

      ctx.fillStyle = isSelected ? "#ff3b3b" : "#EF9312";
      ctx.fill();
    }

    /* ===== вес ===== */
    if (graphData?.isWeighted && link.label) {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;

      ctx.font = `${10 / globalScale}px Sans-Serif`;
      ctx.fillStyle = "#333";
      ctx.fillText(link.label, midX, midY);
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
          onBackgroundClick={() => {
            onEdgeClick(null);
            onVertexClick(null);
          }}
          onEngineStop={() => {}}
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
