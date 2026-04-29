import styles from "./GraphEditor.module.css";
import GraphHeader from "../GraphHeader/GraphHeader.jsx";
import GraphInstruments from "../GraphInstruments/GraphInstruments.jsx";
import GraphView from "../GraphView/GraphView.jsx";
import ConsoleManager from "../../core/ConsoleManager.js";
import { useState, useEffect, useRef } from "react";
import Popup from "../Popup/Popup.jsx";
import Dialog from "../Dialog/Dialog.jsx";

function GraphEditor() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [graphs, setGraphs] = useState([]);
  const [currentGraph, setCurrentGraph] = useState(null);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const containerRef = useRef(null);
  const consoleManagerRef = useRef(null);

  // функция полноэкранного режима
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // обработчик полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Инициализация консольного менеджера
  useEffect(() => {
    consoleManagerRef.current = new ConsoleManager(
      graphs,
      setGraphs,
      currentGraph,
      setCurrentGraph,
      updateGraphDataFromGraph,
    );
  }, []);

  // Обновление graphData при изменении currentGraph
  useEffect(() => {
    if (currentGraph) {
      updateGraphDataFromGraph(currentGraph);
    } else {
      setGraphData({ nodes: [], links: [] });
    }
  }, [currentGraph]);

  // Функция обновления данных для визуализации
  const updateGraphDataFromGraph = (graph) => {
    if (!graph) {
      setGraphData({ nodes: [], links: [] });
      return;
    }

    const nodes = [];
    const links = [];
    const vertices = graph.getVertices();

    vertices.forEach((vertex) => {
      nodes.push({
        id: vertex,
        name: vertex,
        val: 1,
        color: selectedVertex === vertex ? "#ff6b6b" : "#1BA0D0", // Синий для вершин
      });
    });

    const edges = graph.toEdgeList();
    edges.forEach((edge) => {
      const isSelected =
        selectedEdge &&
        ((edge.from === selectedEdge.from && edge.to === selectedEdge.to) ||
          (!graph.isDirected &&
            edge.from === selectedEdge.to &&
            edge.to === selectedEdge.from));

      links.push({
        source: edge.from,
        target: edge.to,
        weight: edge.weight,
        color: isSelected ? "#ff6b6b" : "#EF9312", // Оранжевый для рёбер
        label: graph.isWeighted ? edge.weight.toString() : "",
      });
    });

    setGraphData({
      nodes,
      links,
      isDirected: graph.isDirected,
      isWeighted: graph.isWeighted,
    });
  };

  // Обёртка для updateGraphDataFromGraph, чтобы передавать её в консольный менеджер
  const updateGraphDataWrapper = (graph) => {
    updateGraphDataFromGraph(graph);
  };

  // Обновление ссылки при изменении зависимостей
  useEffect(() => {
    if (consoleManagerRef.current) {
      consoleManagerRef.current.graphs = graphs;
      consoleManagerRef.current.currentGraph = currentGraph;
      consoleManagerRef.current.updateGraphData = updateGraphDataWrapper;
    }
  }, [graphs, currentGraph]);

  const handleVertexClick = (vertex) => {
    setSelectedVertex(vertex);
    setSelectedEdge(null);
  };

  const handleEdgeClick = (edge) => {
    setSelectedEdge({ from: edge.source.id, to: edge.target.id });
    setSelectedVertex(null);
  };

  return (
    <div ref={containerRef} className={styles.body_container}>
      <GraphHeader
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
      <main className={styles.main}>
        <GraphInstruments />
        <Dialog type="graphs_list" />
        <GraphView
          graphData={graphData}
          onVertexClick={handleVertexClick}
          onEdgeClick={handleEdgeClick}
          selectedVertex={selectedVertex}
          selectedEdge={selectedEdge}
        />
      </main>
    </div>
  );
}

export default GraphEditor;
