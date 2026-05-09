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
  const edgeHitboxesRef = useRef([]);
  const arrowHitboxesRef = useRef([]);
  const loopHitboxesRef = useRef([]);
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

  const distance = (x1, y1, x2, y2) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const pointNearPoint = (px, py, x, y, r) => distance(px, py, x, y) <= r;

  const linkCanvasObject = (link, ctx, globalScale) => {
    const start = link.source;
    const end = link.target;

    if (!start || !end) return;

    const isSelected = selectedEdge && selectedEdge.id === link.id;

    /*
    ==========================================
    ПЕТЛЯ
    ==========================================
  */

    if (start.id === end.id) {
      const strokeColor = isSelected ? "#ff4d4f" : "#EF9312";

      const lineWidth = isSelected ? 3 / globalScale : 2 / globalScale;

      const r = 22;

      ctx.beginPath();

      ctx.arc(start.x, start.y - r, r, 0, 2 * Math.PI);

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      loopHitboxesRef.current.push({
        id: link.id,
        from: link.from,
        to: link.to,
        x: start.x,
        y: start.y - r,
        r,
      });

      // стрелка петли
      const ax = start.x + r * 0.7;
      const ay = start.y - r * 1.7;

      ctx.beginPath();

      ctx.moveTo(ax, ay);

      ctx.lineTo(ax - 8 / globalScale, ay - 4 / globalScale);

      ctx.lineTo(ax - 2 / globalScale, ay + 6 / globalScale);

      ctx.closePath();

      ctx.fillStyle = strokeColor;
      ctx.fill();

      return;
    }

    /*
    ==========================================
    ОБЩАЯ ЛИНИЯ
    ==========================================
  */

    const pairKey = [link.from, link.to].sort().join("|");

    const shouldDrawLine = link.from < link.to || !graphData.isDirected;

    if (shouldDrawLine) {
      const lineSelected =
        !graphData.isDirected &&
        selectedEdge &&
        [selectedEdge.from, selectedEdge.to].sort().join("|") === pairKey;

      ctx.beginPath();

      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);

      ctx.strokeStyle = lineSelected ? "#ff4d4f" : "#EF9312";

      ctx.lineWidth = lineSelected ? 3 / globalScale : 2.5 / globalScale;

      ctx.globalAlpha = 1;

      ctx.stroke();

      /*
    hitbox линии
  */

      edgeHitboxesRef.current.push({
        pairKey,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        from: link.from,
        to: link.to,
      });
    }

    /*
    ==========================================
    НЕОРИЕНТИРОВАННЫЙ ГРАФ
    ==========================================
  */

    if (!graphData.isDirected) {
      return;
    }

    /*
    ==========================================
    ТРЕУГОЛЬНИК НАПРАВЛЕНИЯ
    ==========================================
  */

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const angle = Math.atan2(dy, dx);

    const nodeRadius = 8;

    // почти у вершины
    const distToNode = nodeRadius + 6;

    const arrowX = end.x - Math.cos(angle) * distToNode;

    const arrowY = end.y - Math.sin(angle) * distToNode;

    const size = isSelected ? 18 / globalScale : 15 / globalScale;

    ctx.beginPath();

    ctx.moveTo(arrowX, arrowY);

    ctx.lineTo(
      arrowX - size * Math.cos(angle - 0.55),

      arrowY - size * Math.sin(angle - 0.55),
    );

    ctx.lineTo(
      arrowX - size * Math.cos(angle + 0.55),

      arrowY - size * Math.sin(angle + 0.55),
    );

    ctx.closePath();

    ctx.fillStyle = isSelected ? "#ff4d4f" : "#EF9312";

    ctx.fill();

    /*
    hitbox стрелки
  */

    arrowHitboxesRef.current.push({
      id: link.id,
      from: link.from,
      to: link.to,
      x: arrowX,
      y: arrowY,
      r: 20 / globalScale,
    });
  };

  window.__drawnPairs = new Set();

  edgeHitboxesRef.current = [];
  arrowHitboxesRef.current = [];
  loopHitboxesRef.current = [];

  return (
    <div ref={containerRef} className={styles.graphContainer}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="name"
          nodeCanvasObject={nodeCanvasObject}
          nodeColor={(node) =>
            selectedVertex === node.id ? "#ff6b6b" : "#1BA0D0"
          }
          linkCanvasObject={linkCanvasObject}
          onNodeClick={handleNodeClick}
          onBackgroundClick={(event) => {
            const point = graphRef.current.screen2GraphCoords(
              event.offsetX,
              event.offsetY,
            );

            /*
    =====================================
    СТРЕЛКИ (ориентированный)
    =====================================
  */

            for (const arrow of arrowHitboxesRef.current) {
              if (pointNearPoint(point.x, point.y, arrow.x, arrow.y, arrow.r)) {
                onEdgeClick({
                  id: arrow.id,
                  from: arrow.from,
                  to: arrow.to,
                });

                return;
              }
            }

            /*
    =====================================
    ПЕТЛИ
    =====================================
  */

            for (const loop of loopHitboxesRef.current) {
              const d = distance(point.x, point.y, loop.x, loop.y);

              if (Math.abs(d - loop.r) < 8) {
                onEdgeClick({
                  id: loop.id,
                  from: loop.from,
                  to: loop.to,
                });

                return;
              }
            }

            /*
    =====================================
    ЛИНИИ НЕОРИЕНТИРОВАННОГО ГРАФА
    =====================================
  */

            if (!graphData.isDirected) {
              for (const edge of edgeHitboxesRef.current) {
                const A = point.x - edge.x1;
                const B = point.y - edge.y1;

                const C = edge.x2 - edge.x1;
                const D = edge.y2 - edge.y1;

                const dot = A * C + B * D;
                const lenSq = C * C + D * D;

                const param = dot / lenSq;

                if (param < 0 || param > 1) {
                  continue;
                }

                const xx = edge.x1 + param * C;
                const yy = edge.y1 + param * D;

                const dist = distance(point.x, point.y, xx, yy);

                if (dist < 8) {
                  onEdgeClick({
                    from: edge.from,
                    to: edge.to,
                  });

                  return;
                }
              }
            }

            onEdgeClick(null);
            onVertexClick(null);
          }}
          onEngineStop={() => {}}
          nodeRelSize={8}
          linkWidth={(link) => (selectedEdge?.id === link.id ? 8 : 6)}
          linkDirectionalParticles={0}
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
