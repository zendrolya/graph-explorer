import styles from "./GraphEditor.module.css";
import GraphView from "../GraphView/GraphView.jsx";
import ConsoleManager from "../../core/ConsoleManager.js";
import { useState, useEffect, useRef } from "react";

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
    <div ref={containerRef} className={styles.main_container}>
      <header className={styles.header}>
        <div className={styles.btn_container}>
          <button
            className={`${styles.header_button} ${styles.add_button}`}
            title="Создать граф"
          >
            <img
              src="/icons/add-graph-icon.svg"
              draggable="false"
              alt="Создать граф"
            />
            Создать граф
          </button>
          <button
            className={`${styles.header_button} ${styles.delete_button}`}
            title="Удалить граф"
          >
            <img
              src="/icons/del-graph-icon.svg"
              draggable="false"
              alt="Удалить граф"
            />
            Удалить граф
          </button>
          <details className={styles.header_button} title="Методы">
            <summary className={styles.header_summary}>Методы</summary>
            <ul className={styles.methods_list}>
              <li>Степень вершин графа</li>
              <li>Все вершины графа, не смежные с данной</li>
              <li>soon</li>
            </ul>
          </details>
          <details className={styles.header_button} title="Примеры">
            <summary className={styles.header_summary}>Примеры</summary>
            <ul className={styles.methods_list}>
              <li>Ориентированный невзвешенный</li>
              <li>Ориентированный взвешенный</li>
              <li>Неориентированный невзвешенный</li>
              <li>Неориентированный взвешенный</li>
            </ul>
          </details>
          <button
            className={`${styles.header_button} ${styles.save_button}`}
            title="Сохранить граф"
          >
            <img
              src="/icons/save-graph.svg"
              draggable="false"
              alt="Сохранить граф"
            />
            Сохранить граф
          </button>
          <button
            className={`${styles.header_button} ${styles.load_button}`}
            title="Загрузить граф"
          >
            <img
              src="/icons/load-graph.svg"
              draggable="false"
              alt="Загрузить граф"
            />
            Загрузить граф
          </button>
        </div>
        <button
          className={styles.fullscreen_btn}
          onClick={toggleFullscreen}
          title={
            isFullscreen
              ? "Выйти из полноэкранного режима"
              : "Полноэкранный режим"
          }
        >
          <img
            src="/icons/fullscreen.svg"
            draggable="false"
            alt={
              isFullscreen
                ? "Выйти из полноэкранного режима"
                : "Полноэкранный режим"
            }
          />
        </button>
      </header>
      <main className={styles.main}>
        <div className={styles.instruments_panel}>
          <button className={styles.instruments_btn} title="Добавить вершину">
            <img
              src="/icons/add-vertex.svg"
              draggable="false"
              alt="Добавить вершину"
            />
          </button>
          <button
            className={styles.instruments_btn}
            title="Добавить ребро (дугу)"
          >
            <img
              src="/icons/add-edge.svg"
              draggable="false"
              alt="Добавить ребро (дугу)"
            />
          </button>
          <button className={styles.instruments_btn} title="Удалить вершину">
            <img
              src="/icons/del-vertex.svg"
              draggable="false"
              alt="Удалить вершину"
            />
          </button>
          <button
            className={styles.instruments_btn}
            title="Удалить ребро (дугу)"
          >
            <img
              src="/icons/del-edge.svg"
              draggable="false"
              alt="Удалить ребро (дугу)"
            />
          </button>
          <button
            className={styles.instruments_btn}
            title="Вывести список смежности"
          >
            <img
              src="/icons/adjacency-list.svg"
              draggable="false"
              alt="Вывести список смежности"
            />
          </button>
        </div>
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
