import { useState, useEffect, useRef } from "react";
import styles from "./GraphEditor.module.css";
import GraphHeader from "../GraphHeader/GraphHeader.jsx";
import GraphInstruments from "../GraphInstruments/GraphInstruments.jsx";
import GraphView from "../GraphView/GraphView.jsx";
import ConsoleManager from "../../core/ConsoleManager.js";
import Popup from "../Popup/Popup.jsx";
import Dialog from "../Dialog/Dialog.jsx";

function GraphEditor() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Графы
  const [graphs, setGraphs] = useState([]);
  const [currentGraph, setCurrentGraph] = useState(null);

  // Выделение
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  // Визуализация
  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });

  // Попапы
  const [popupData, setPopupData] = useState({
    isOpen: false,
    title: "",
    text: "",
  });

  // Диалоги
  const [dialogData, setDialogData] = useState({
    isOpen: false,
    type: "",
    props: {},
  });

  const containerRef = useRef(null);
  const consoleManagerRef = useRef(null);

  /* =========================
     FULLSCREEN
  ========================= */

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      showPopup("Ошибка", "Не удалось переключить полноэкранный режим.");
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenActive = !!document.fullscreenElement;

      setIsFullscreen(fullscreenActive);

      // Убираем scrollbars
      if (fullscreenActive) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  /* =========================
     CONSOLE MANAGER
  ========================= */

  useEffect(() => {
    consoleManagerRef.current = new ConsoleManager(
      graphs,
      setGraphs,
      currentGraph,
      setCurrentGraph,
      updateGraphDataFromGraph,
    );
  }, []);

  useEffect(() => {
    if (consoleManagerRef.current) {
      consoleManagerRef.current.graphs = graphs;
      consoleManagerRef.current.currentGraph = currentGraph;
      consoleManagerRef.current.updateGraphData = updateGraphDataFromGraph;
    }
  }, [graphs, currentGraph]);

  /* =========================
     GRAPH DATA
  ========================= */

  useEffect(() => {
    if (currentGraph) {
      updateGraphDataFromGraph(currentGraph);
    } else {
      setGraphData({
        nodes: [],
        links: [],
      });
    }
  }, [currentGraph]);

  const updateGraphDataFromGraph = (graph) => {
    if (!graph) {
      setGraphData({ nodes: [], links: [] });
      return;
    }

    const nodes = [];
    const links = [];

    const vertices = graph.getVertices();

    vertices.forEach((v) => {
      nodes.push({
        id: v,
        name: v,
        val: 1,
        color: "#1BA0D0", // Убираем условное окрашивание
      });
    });

    const edges = graph.toEdgeList();

    const pairMap = new Map();

    edges.forEach((e) => {
      const key = `${e.from}|${e.to}`;

      if (!pairMap.has(key)) {
        pairMap.set(key, []);
      }

      pairMap.get(key).push(e);
    });

    edges.forEach((e, index) => {
      const reverseKey = `${e.to}|${e.from}`;
      const hasReverse = pairMap.has(reverseKey);

      let curvature = 0;

      if (e.from === e.to) {
        curvature = 0.6;
      } else if (hasReverse && e.from !== e.to) {
        curvature = 0.25;
      }

      links.push({
        id: `${e.from}->${e.to}#${index}`,
        source: e.from,
        target: e.to,
        from: e.from,
        to: e.to,
        weight: e.weight,
        curvature,
        label: graph.isWeighted ? String(e.weight) : "",
      });
    });

    setGraphData({
      nodes,
      links,
      isDirected: graph.isDirected,
      isWeighted: graph.isWeighted,
    });
  };

  /* =========================
     POPUP
  ========================= */

  const showPopup = (title, text) => {
    setPopupData({
      isOpen: true,
      title,
      text,
    });
  };

  const closePopup = () => {
    setPopupData({
      isOpen: false,
      title: "",
      text: "",
    });
  };

  /* =========================
     DIALOG
  ========================= */

  const showDialog = (type, props = {}) => {
    setDialogData({
      isOpen: true,
      type,
      props,
    });
  };

  const closeDialog = () => {
    setDialogData({
      isOpen: false,
      type: "",
      props: {},
    });
  };

  /* =========================
     GRAPH ACTIONS
  ========================= */

  const handleCreateGraph = () => {
    showDialog("Создание графа", {
      onConfirm: (name, directed, weighted) =>
        consoleManagerRef.current.createGraph(name, directed, weighted),
    });
  };

  const handleDeleteGraph = () => {
    if (!currentGraph) return;

    showDialog("Удаление графа", {
      onConfirm: () => consoleManagerRef.current.deleteGraphVisual(),
    });
  };

  const handleShowGraphsList = () => {
    showDialog("Список графов", {
      graphs,
      currentGraph,
      onSelectGraph: (graph) => {
        setCurrentGraph(graph);
        closeDialog();
      },
    });
  };

  const handleSaveGraph = () => {
    if (!currentGraph) return;

    try {
      consoleManagerRef.current.saveGraph();
      showPopup("Сохранение графа", "Граф успешно сохранён.");
    } catch {
      showPopup("Ошибка", "Не удалось сохранить граф.");
    }
  };

  const handleLoadGraph = () => {
    try {
      consoleManagerRef.current.loadGraph();
      showPopup("Загрузка графа", "Граф успешно загружен.");
    } catch {
      showPopup("Ошибка", "Не удалось загрузить граф.");
    }
  };

  const handleMethodSelect = (methodName) => {
    if (!currentGraph) return;

    switch (methodName) {
      case "Степень вершины графа":
        showDialog("Степень вершины графа", {
          vertices: currentGraph.getVertices(),
          onConfirm: (vertex) => {
            const result = consoleManagerRef.current.vertexDegree(vertex);
            showPopup("Степень вершины", result.message);
            return result;
          },
        });
        break;

      case "Вершины графа, не смежные с данной":
        showDialog("Вершины графа, не смежные с данной", {
          vertices: currentGraph.getVertices(),
          onConfirm: (vertex) => {
            const result =
              consoleManagerRef.current.nonAdjacentVertices(vertex);
            showPopup("Несмежные вершины", result.message);
            return result;
          },
        });
        break;

      case "Оставить только взаимные дуги":
        try {
          const result = consoleManagerRef.current.mutualEdgesGraph();

          if (result?.success === false) {
            showPopup("Ошибка", result.message);
            return;
          }

          showPopup("Метод выполнен", "Оставлены только взаимные дуги.");
        } catch (error) {
          showPopup("Ошибка", error.message);
        }
        break;

      case "Сильно связные компоненты":
        try {
          const result =
            consoleManagerRef.current.stronglyConnectedComponents();

          if (result?.success === false) {
            showPopup("Ошибка", result.message);
            return;
          }

          showPopup(
            "Сильно связные компоненты",
            result.data
              .map((comp, i) => `${i + 1}. ${comp.join(", ")}`)
              .join("\n"),
          );
        } catch (error) {
          showPopup("Ошибка", error.message);
        }
        break;

      case "Кратчайшие пути до вершины":
        showDialog("Кратчайшие пути до вершины", {
          vertices: currentGraph.getVertices(),
          onConfirm: (vertex) => {
            const result = consoleManagerRef.current.shortestPathsTo(vertex);

            if (result?.success === false) {
              showPopup("Ошибка", result.message);
              return result;
            }

            showPopup("Кратчайшие пути", result.message);
            return result;
          },
        });
        break;

      case "Минимальный остов":
        try {
          const result = consoleManagerRef.current.minimumSpanningTree();

          if (result?.success === false) {
            showPopup("Ошибка", result.message);
            return;
          }

          showPopup("Минимальный остов", result.message);
        } catch (error) {
          showPopup("Ошибка", error.message);
        }
        break;

      case "Кратчайшие пути u1, u2 → v":
        showDialog("Кратчайшие пути u1, u2 → v", {
          vertices: currentGraph.getVertices(),
          onConfirm: (v, u1, u2) => {
            const result = consoleManagerRef.current.dijkstraTo(v, u1, u2);

            if (result?.success === false) {
              showPopup("Ошибка", result.message);
              return result;
            }

            showPopup("Результат", result.message);
            return result;
          },
        });
        break;

      case "Кратчайшие пути u → v1, v2":
        showDialog("Кратчайшие пути u → v1, v2", {
          vertices: currentGraph.getVertices(),
          onConfirm: (u, v1, v2) => {
            const result = consoleManagerRef.current.bellmanFordFrom(u, v1, v2);

            if (result?.success === false) {
              showPopup("Ошибка", result.message);
              return result;
            }

            showPopup("Результат", result.message);
            return result;
          },
        });
        break;

      case "Пары с бесконечно малым путем":
        try {
          const result = consoleManagerRef.current.findNegativeInfinitePaths();

          if (result?.success === false) {
            showPopup("Ошибка", result.message);
            return;
          }

          showPopup("Результат", result.message);
        } catch (error) {
          showPopup("Ошибка", error.message);
        }
        break;

      case "Максимальный поток":
        showDialog("Максимальный поток", {
          vertices: currentGraph.getVertices(),
          onConfirm: (source, sink) => {
            const result = consoleManagerRef.current.maxFlow(source, sink);

            if (result?.success === false) {
              showPopup("Ошибка", result.message);
              return result;
            }

            showPopup("Максимальный поток", result.message);
            return result;
          },
        });
        break;
    }
  };

  const handleAddVertex = () => {
    if (!currentGraph) {
      showPopup("Ошибка", "Сначала создайте граф");
      return;
    }

    showDialog("Добавление вершины", {
      onConfirm: (name) => consoleManagerRef.current.addVertex(name),
    });
  };

  const handleAddEdge = () => {
    if (!currentGraph) {
      showPopup("Ошибка", "Сначала создайте граф");
      return;
    }

    showDialog("Добавление ребра", {
      vertices: currentGraph.getVertices(),
      onConfirm: (from, to, weight) => {
        consoleManagerRef.current.addEdge(from, to, weight);
        return { success: true };
      },
    });
  };

  const handleDeleteVertex = () => {
    if (!selectedVertex) {
      showPopup("Ошибка", "Сначала выберите вершину");
      return;
    }

    showDialog("Удаление вершины", {
      onConfirm: () => {
        consoleManagerRef.current.removeVertex(selectedVertex);
        setSelectedVertex(null);
        return { success: true };
      },
    });
  };

  const handleDeleteEdge = () => {
    if (!selectedEdge) {
      showPopup("Ошибка", "Сначала выберите ребро или дугу");
      return;
    }

    showDialog("Удаление ребра", {
      onConfirm: () => {
        consoleManagerRef.current.removeEdge(
          selectedEdge.from,
          selectedEdge.to,
        );

        setSelectedEdge(null);

        return { success: true };
      },
    });
  };

  const handleShowAdjacency = () => {
    if (!currentGraph) {
      showPopup("Ошибка", "Нет графа");
      return;
    }

    const result = consoleManagerRef.current.showGraph();

    if (result?.success === false) {
      showPopup("Ошибка", result.message);
      return;
    }

    showPopup("Список смежности", result.message);
  };

  /* =========================
     EXAMPLES
  ========================= */

  const handleExampleSelect = async (exampleName) => {
    const examplesMap = {
      "Ориентированный невзвешенный": 1,
      "Ориентированный взвешенный": 2,
      "Неориентированный невзвешенный": 3,
      "Неориентированный взвешенный": 4,
    };

    try {
      await consoleManagerRef.current.loadExample(examplesMap[exampleName]);
      showPopup("Пример загружен", `Загружен пример: ${exampleName}`);
    } catch {
      showPopup("Ошибка", "Не удалось загрузить пример.");
    }
  };

  /* =========================
     SELECTION
  ========================= */

  const handleVertexClick = (vertex) => {
    setSelectedVertex((prev) => (prev === vertex ? null : vertex));
    setSelectedEdge(null);
  };

  const handleEdgeClick = (edge) => {
    setSelectedEdge(edge);
    setSelectedVertex(null);
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div
      ref={containerRef}
      className={styles.body_container}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <GraphHeader
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        hasGraph={!!currentGraph}
        onCreateGraph={handleCreateGraph}
        onDeleteGraph={handleDeleteGraph}
        onShowGraphsList={handleShowGraphsList}
        onMethodSelect={handleMethodSelect}
        onExampleSelect={handleExampleSelect}
        onSaveGraph={handleSaveGraph}
        onLoadGraph={handleLoadGraph}
      />

      <main className={styles.main}>
        <GraphInstruments
          onAddVertex={handleAddVertex}
          onAddEdge={handleAddEdge}
          onDeleteVertex={handleDeleteVertex}
          onDeleteEdge={handleDeleteEdge}
          onShowAdjacency={handleShowAdjacency}
        />

        <GraphView
          graphData={graphData}
          onVertexClick={handleVertexClick}
          onEdgeClick={handleEdgeClick}
          selectedVertex={selectedVertex}
          selectedEdge={selectedEdge}
        />
      </main>

      {popupData.isOpen && (
        <Popup
          title={popupData.title}
          text={popupData.text}
          onClose={closePopup}
        />
      )}

      {dialogData.isOpen && (
        <Dialog
          type={dialogData.type}
          onClose={closeDialog}
          {...dialogData.props}
        />
      )}
    </div>
  );
}

export default GraphEditor;
