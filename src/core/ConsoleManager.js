import { Graph } from "./Graph";

class ConsoleManager {
  constructor(
    graphs,
    setGraphs,
    currentGraph,
    setCurrentGraph,
    updateGraphData,
  ) {
    this.graphs = graphs;
    this.setGraphs = (newGraphs) => {
      this.graphs = newGraphs;
      setGraphs(newGraphs);
    };

    this.currentGraph = currentGraph;
    this.setCurrentGraph = (graph) => {
      this.currentGraph = graph;
      setCurrentGraph(graph);
    };

    this.updateGraphData = updateGraphData;

    this.testFiles = [
      { name: "Социальная сеть", file: "undirected_unweighted.txt" },
      { name: "Карта метро", file: "directed_weighted.txt" },
      { name: "Сеть дорог", file: "undirected_weighted.txt" },
      { name: "HTML структура", file: "directed_unweighted.txt" },
    ];

    this.bindCommands();
    this.printWelcomeMessage();
  }

  bindCommands() {
    window.cc = this; // глобальные команды

    // Основные команды
    window.createGraph = this.createGraph.bind(this);
    window.copyGraph = this.copyGraph.bind(this);
    window.listGraphs = this.listGraphs.bind(this);
    window.switchGraph = this.switchGraph.bind(this);
    window.deleteGraph = this.deleteGraph.bind(this);

    // Команды для работы с текущим графом
    window.addVertex = this.addVertex.bind(this);
    window.addEdge = this.addEdge.bind(this);
    window.removeVertex = this.removeVertex.bind(this);
    window.removeEdge = this.removeEdge.bind(this);
    window.showGraph = this.showGraph.bind(this);
    window.showVertices = this.showVertices.bind(this);
    window.showEdges = this.showEdges.bind(this);

    // НОВЫЕ МЕТОДЫ
    window.vertexDegree = this.vertexDegree.bind(this);
    window.nonAdjacentVertices = this.nonAdjacentVertices.bind(this);
    window.mutualEdgesGraph = this.mutualEdgesGraph.bind(this);

    window.stronglyConnectedComponents =
      this.stronglyConnectedComponents.bind(this);
    window.shortestPathsTo = this.shortestPathsTo.bind(this);
    window.minimumSpanningTree = this.minimumSpanningTree.bind(this);

    window.dijkstraTo = this.dijkstraTo.bind(this);
    window.bellmanFordFrom = this.bellmanFordFrom.bind(this);
    window.findNegativeInfinitePaths =
      this.findNegativeInfinitePaths.bind(this);

    window.maxFlow = this.maxFlow.bind(this);

    // Команды для работы с файлами
    window.loadExample = this.loadExample.bind(this);
    window.saveGraph = this.saveGraph.bind(this);

    // Команда помощи
    window.help = this.showHelp.bind(this);
  }

  printWelcomeMessage() {
    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║              КОНСОЛЬНЫЙ ИНТЕРФЕЙС УПРАВЛЕНИЯ ГРАФАМИ                 ║
╠══════════════════════════════════════════════════════════════════════╣
║  Доступные команды:                                                  ║
║                                                                      ║
║  📋 УПРАВЛЕНИЕ ГРАФАМИ:                                              ║
║    help()                                   - показать эту справку   ║
║    createGraph(имя, directed, weighted)     - создать новый граф     ║
║    copyGraph(исходное_имя, новое_имя)       - скопировать граф       ║
║    listGraphs()                              - список всех графов    ║
║    switchGraph(имя)                          - переключиться на граф ║
║    deleteGraph(имя)                          - удалить граф          ║
║                                                                      ║
║  🔧 РАБОТА С ТЕКУЩИМ ГРАФОМ:                                        ║
║    addVertex(вершина)                        - добавить вершину      ║
║    addEdge(от, к, [вес])                     - добавить ребро        ║
║    removeVertex(вершина)                      - удалить вершину      ║
║    removeEdge(от, к)                          - удалить ребро        ║
║    showGraph()                               - показать граф         ║
║    showVertices()                             - показать вершины     ║
║    showEdges()                                - показать рёбра       ║
║    vertexDegree([вершина])                    - степень вершины      ║
║    nonAdjacentVertices(вершина)               - вершины, не смежные с║
║    mutualEdgesGraph()                 - оставить только взаимные дуги║
║    stronglyConnectedComponents()      - сильно связные компоненты    ║
║    shortestPathsTo(вершина)           - кратчайшие пути до вершины   ║
║    minimumSpanningTree()              - минимальный остов (Прим)     ║
║    dijkstraTo(v, u1, u2)              - кратчайшие пути u1,u2 → v    ║
║    bellmanFordFrom(u, v1, v2)         - кратчайшие пути u → v1,v2    ║
║    findNegativeInfinitePaths()        - пары с бесконечно малым путём║
║    maxFlow(source, sink)              - максимальный поток           ║
║                                                                      ║
║  📁 РАБОТА С ФАЙЛАМИ:                                                ║
║    loadExample(номер)                         - загрузить пример     ║
║    saveGraph([имя_файла])                     - сохранить в файл     ║
╚══════════════════════════════════════════════════════════════════════╝
        `);

    if (this.currentGraph) {
      console.log(`✅ Текущий граф: ${this.currentGraph.name}`);
    } else {
      console.log("⚠️ Граф не создан. Создайте граф командой createGraph()");
    }
  }

  showHelp() {
    this.printWelcomeMessage();
  }

  // Проверка уникальности имени графа
  isGraphNameUnique(name) {
    return !this.graphs.some((g) => g.name === name);
  }

  // Вывод в логах + возврат значений
  logResult(success, message, data = null) {
    if (success) {
      console.log(message);
    } else {
      console.error(message);
    }

    return {
      success,
      message,
      data,
    };
  }

  ensureGraph() {
    if (!this.currentGraph) {
      this.logResult(false, "❌ Ошибка: сначала создайте или выберите граф");
      return false;
    }

    return true;
  }

  refreshCurrentGraph() {
    this.updateGraphData(this.currentGraph);
  }

  // Создание нового графа
  createGraph(name, isDirected = false, isWeighted = false) {
    if (!name || !name.trim()) {
      return this.logResult(false, "❌ Укажите имя графа");
    }

    const trimmedName = name.trim();

    if (!this.isGraphNameUnique(trimmedName)) {
      return this.logResult(false, `❌ Граф "${trimmedName}" уже существует`);
    }

    try {
      const newGraph = new Graph({
        name: trimmedName,
        isDirected,
        isWeighted,
      });

      const updatedGraphs = [...this.graphs, newGraph];

      this.setGraphs(updatedGraphs);
      this.setCurrentGraph(newGraph);
      this.updateGraphData(newGraph);

      return this.logResult(true, `✅ Граф "${trimmedName}" создан`, newGraph);
    } catch (error) {
      return this.logResult(
        false,
        `❌ Ошибка создания графа: ${error.message}`,
      );
    }
  }

  // Копирование графа
  copyGraph(sourceName, newName) {
    if (!sourceName || !newName) {
      return this.logResult(false, "❌ Укажите исходное имя и новое имя графа");
    }

    const sourceGraph = this.graphs.find((g) => g.name === sourceName);

    if (!sourceGraph) {
      return this.logResult(false, `❌ Граф "${sourceName}" не найден`);
    }

    if (!this.isGraphNameUnique(newName)) {
      return this.logResult(false, `❌ Граф "${newName}" уже существует`);
    }

    try {
      const copiedGraph = Graph.fromGraph(sourceGraph);
      copiedGraph.setName(newName);

      const updatedGraphs = [...this.graphs, copiedGraph];

      this.setGraphs(updatedGraphs);
      this.setCurrentGraph(copiedGraph);
      this.updateGraphData(copiedGraph);

      return this.logResult(
        true,
        `✅ Граф "${sourceName}" скопирован в "${newName}"`,
        copiedGraph,
      );
    } catch (error) {
      return this.logResult(false, `❌ Ошибка копирования: ${error.message}`);
    }
  }

  // Список всех графов
  listGraphs() {
    if (!this.graphs.length) {
      return this.logResult(false, "📭 Нет созданных графов");
    }

    console.log("📋 СПИСОК ГРАФОВ:");

    this.graphs.forEach((graph, index) => {
      const current = graph === this.currentGraph ? " (текущий)" : "";
      console.log(`${index + 1}. ${graph.name}${current}`);
    });

    return this.graphs;
  }

  // Переключение на другой граф
  switchGraph(name) {
    const graph = this.graphs.find((g) => g.name === name);

    if (!graph) {
      return this.logResult(false, `❌ Граф "${name}" не найден`);
    }

    this.setCurrentGraph(graph);
    this.updateGraphData(graph);

    return this.logResult(true, `✅ Переключено на граф "${name}"`, graph);
  }

  // Удаление графа
  deleteGraph(name) {
    if (this.graphs.length === 0) {
      console.log("📭 Нет графов для удаления");
      return;
    }

    const index = this.graphs.findIndex((g) => g.name === name);

    if (index === -1) {
      console.error(`❌ Ошибка: граф "${name}" не найден`);
      return;
    }

    console.log(`⚠️ Вы уверены, что хотите удалить граф "${name}"?`);
    console.log("💡 Для подтверждения введите: confirmDelete()");

    window.confirmDelete = () => {
      const newGraphs = this.graphs.filter((g) => g.name !== name);
      this.setGraphs(newGraphs);

      if (this.currentGraph && this.currentGraph.name === name) {
        if (newGraphs.length > 0) {
          this.setCurrentGraph(newGraphs[0]);
          this.updateGraphData(newGraphs[0]);
          console.log(`✅ Переключено на граф: "${newGraphs[0].name}"`);
        } else {
          this.setCurrentGraph(null);
          this.updateGraphData(null);
        }
      }

      console.log(`✅ Граф "${name}" удалён`);
      delete window.confirmDelete;
    };
  }

  // Удаление графа (Dialog)
  deleteGraphVisual(name) {
    if (this.graphs.length === 0) {
      return this.logResult(false, "❌ Нет графов для удаления");
    }

    const graphToDelete = name
      ? this.graphs.find((g) => g.name === name)
      : this.currentGraph;

    if (!graphToDelete) {
      return this.logResult(false, "❌ Граф не найден");
    }

    const newGraphs = this.graphs.filter((g) => g.name !== graphToDelete.name);

    this.setGraphs(newGraphs);

    if (this.currentGraph?.name === graphToDelete.name) {
      if (newGraphs.length > 0) {
        this.setCurrentGraph(newGraphs[0]);
        this.updateGraphData(newGraphs[0]);
      } else {
        this.setCurrentGraph(null);
        this.updateGraphData(null);
      }
    }

    return this.logResult(true, `✅ Граф "${graphToDelete.name}" удалён`);
  }

  // Добавление вершины
  addVertex(vertex) {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    try {
      const result = this.currentGraph.addVertex(vertex);
      if (result) {
        this.updateGraphData(this.currentGraph);
        console.log(
          `✅ Вершина "${vertex}" добавлена в граф "${this.currentGraph.name}"`,
        );
      }
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  // Добавление ребра
  addEdge(from, to, weight = 1) {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    try {
      const result = this.currentGraph.addEdge(from, to, weight);
      if (result) {
        this.updateGraphData(this.currentGraph);
        const weightStr = this.currentGraph.isWeighted
          ? ` с весом ${weight}`
          : "";
        console.log(
          `✅ Ребро ${from} → ${to} добавлено${weightStr} в граф "${this.currentGraph.name}"`,
        );
      }
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  // Удаление вершины
  removeVertex(vertex) {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    try {
      this.currentGraph.removeVertex(vertex);
      this.updateGraphData(this.currentGraph);
      console.log(
        `✅ Вершина "${vertex}" удалена из графа "${this.currentGraph.name}"`,
      );
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  // Удаление ребра
  removeEdge(from, to) {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    try {
      this.currentGraph.removeEdge(from, to);
      this.updateGraphData(this.currentGraph);
      console.log(
        `✅ Ребро ${from} → ${to} удалено из графа "${this.currentGraph.name}"`,
      );
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  // Показать граф
  showGraph() {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    console.log(`\nГРАФ: ${this.currentGraph.name}`);
    console.log(this.currentGraph.toFileString());
  }

  // Показать вершины
  showVertices() {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    const vertices = this.currentGraph.getVertices();
    if (vertices.length === 0) {
      console.log(`Граф "${this.currentGraph.name}" не содержит вершин`);
    } else {
      console.log(
        `Вершины графа "${this.currentGraph.name}":`,
        vertices.join(", "),
      );
    }
  }

  // Показать рёбра
  showEdges() {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    const edges = this.currentGraph.toEdgeList();
    if (edges.length === 0) {
      console.log(`Граф "${this.currentGraph.name}" не содержит рёбер`);
    } else {
      console.log(`Рёбра графа "${this.currentGraph.name}":`);
      edges.forEach((edge) => {
        const edgeStr = this.currentGraph.isDirected
          ? `${edge.from} → ${edge.to}`
          : `${edge.from} — ${edge.to}`;
        const weightStr = this.currentGraph.isWeighted
          ? ` (вес: ${edge.weight})`
          : "";
        console.log(`  ${edgeStr}${weightStr}`);
      });
    }
  }

  // Степень вершины
  vertexDegree(vertex) {
    if (!this.currentGraph) {
      return this.logResult(
        false,
        "❌ Ошибка: сначала создайте или выберите граф",
      );
    }

    try {
      if (!vertex) {
        return this.logResult(false, "❌ Ошибка: укажите вершину");
      }

      if (!this.currentGraph.adjacencyList.has(vertex)) {
        return this.logResult(
          false,
          `❌ Ошибка: вершина "${vertex}" не существует`,
        );
      }

      const neighbors = this.currentGraph.adjacencyList.get(vertex);
      const degree = neighbors.size;

      if (this.currentGraph.isDirected) {
        let inDegree = 0;

        for (const [, n] of this.currentGraph.adjacencyList) {
          if (n.has(vertex)) inDegree++;
        }

        return this.logResult(
          true,
          `✅ Вершина "${vertex}": исход = ${degree}, заход = ${inDegree}, полная = ${degree + inDegree}`,
          {
            outDegree: degree,
            inDegree,
            total: degree + inDegree,
          },
        );
      }

      return this.logResult(true, `✅ Степень вершины "${vertex}": ${degree}`, {
        degree,
      });
    } catch (error) {
      return this.logResult(false, `❌ Ошибка: ${error.message}`);
    }
  }

  // Вершины, не смежные с данной
  nonAdjacentVertices(vertex) {
    if (!this.currentGraph) {
      return this.logResult(
        false,
        "❌ Ошибка: сначала создайте или выберите граф",
      );
    }

    if (!vertex) {
      return this.logResult(false, "❌ Ошибка: укажите вершину");
    }

    try {
      if (!this.currentGraph.adjacencyList.has(vertex)) {
        return this.logResult(
          false,
          `❌ Ошибка: вершина "${vertex}" не существует`,
        );
      }

      const allVertices = this.currentGraph.getVertices();
      const neighbors = this.currentGraph.adjacencyList.get(vertex);

      const nonAdjacent = allVertices.filter(
        (v) => v !== vertex && !neighbors.has(v),
      );

      return this.logResult(
        true,
        `✅ Несмежные с "${vertex}": ${nonAdjacent.length ? nonAdjacent.join(", ") : "отсутствуют"}`,
        nonAdjacent,
      );
    } catch (error) {
      return this.logResult(false, `❌ Ошибка: ${error.message}`);
    }
  }

  mutualEdgesGraph() {
    if (!this.currentGraph) {
      return this.logResult(false, "❌ Ошибка: сначала создайте граф");
    }

    try {
      const newGraph = this.currentGraph.buildMutualEdgeGraph();

      let name = this.currentGraph.name + "_mutual";
      let counter = 1;

      while (!this.isGraphNameUnique(name)) {
        name = `${this.currentGraph.name}_mutual_${counter++}`;
      }

      newGraph.name = name;

      this.setGraphs([...this.graphs, newGraph]);
      this.setCurrentGraph(newGraph);
      this.updateGraphData(newGraph);

      return this.logResult(true, `Создан граф "${name}"`, newGraph);
    } catch (error) {
      return this.logResult(false, error.message);
    }
  }

  stronglyConnectedComponents() {
    if (!this.currentGraph) {
      return this.logResult(false, "❌ Нет графа");
    }

    try {
      const components = this.currentGraph.findStronglyConnectedComponents();

      return this.logResult(
        true,
        `Найдено компонент: ${components.length}`,
        components,
      );
    } catch (error) {
      return this.logResult(false, error.message);
    }
  }

  shortestPathsTo(vertex) {
    if (!this.currentGraph) {
      return this.logResult(false, "❌ Нет графа");
    }

    try {
      const { dist } = this.currentGraph.shortestPathsTo(vertex);

      const result = Object.entries(dist)
        .map(([v, d]) => `${v} → ${vertex}: ${d}`)
        .join("\n");

      return this.logResult(true, result, dist);
    } catch (error) {
      return this.logResult(false, error.message);
    }
  }

  minimumSpanningTree() {
    if (!this.currentGraph) {
      return this.logResult(false, "❌ Нет графа");
    }

    try {
      const mst = this.currentGraph.findMinimumSpanningTreePrim();

      let name = this.currentGraph.name + "_mst";
      let counter = 1;

      while (!this.isGraphNameUnique(name)) {
        name = `${this.currentGraph.name}_mst_${counter++}`;
      }

      mst.name = name;

      this.setGraphs([...this.graphs, mst]);
      this.setCurrentGraph(mst);
      this.updateGraphData(mst);

      return this.logResult(true, `Построен MST: ${name}`, mst);
    } catch (error) {
      return this.logResult(false, error.message);
    }
  }

  dijkstraTo(v, u1, u2) {
    if (!this.currentGraph) {
      return this.logResult(false, "❌ Нет графа");
    }

    try {
      const { dist } = this.currentGraph.dijkstraTo(v);

      let output = "";

      [u1, u2].forEach((u) => {
        output += `${u} → ${v}: ${
          dist[u] === Infinity ? "пути нет" : dist[u]
        }\n`;
      });

      return this.logResult(true, output.trim(), dist);
    } catch (error) {
      return this.logResult(false, error.message);
    }
  }

  bellmanFordFrom(u, v1, v2) {
    if (!this.currentGraph) {
      return this.logResult(false, "❌ Нет графа");
    }

    try {
      const { dist } = this.currentGraph.bellmanFordFrom(u);

      const output = [v1, v2]
        .map(
          (v) => `${u} → ${v}: ${dist[v] === Infinity ? "пути нет" : dist[v]}`,
        )
        .join("\n");

      return this.logResult(true, output, dist);
    } catch (error) {
      return this.logResult(false, error.message);
    }
  }

  findNegativeInfinitePaths() {
    if (!this.currentGraph) {
      return this.logResult(false, "❌ Нет графа");
    }

    try {
      const pairs = this.currentGraph.findNegativeInfinitePaths();

      if (!pairs.length) {
        return this.logResult(true, "Таких пар нет", []);
      }

      const output = pairs.map(([u, v]) => `${u} → ${v}`).join("\n");

      return this.logResult(true, output, pairs);
    } catch (error) {
      return this.logResult(false, error.message);
    }
  }

  maxFlow(source, sink) {
    if (!this.currentGraph) {
      return this.logResult(false, "❌ Нет графа");
    }

    try {
      const flow = this.currentGraph.maxFlowFordFulkerson(source, sink);

      return this.logResult(
        true,
        `Максимальный поток ${source} → ${sink}: ${flow}`,
        flow,
      );
    } catch (error) {
      return this.logResult(false, error.message);
    }
  }

  // Загрузка примера
  async loadExample(index) {
    const idx = parseInt(index) - 1;

    if (isNaN(idx) || idx < 0 || idx >= this.testFiles.length) {
      console.error(
        `❌ Ошибка: укажите номер от 1 до ${this.testFiles.length}`,
      );
      console.log("Доступные примеры:");
      this.testFiles.forEach((file, i) => {
        console.log(`  ${i + 1}. ${file.name} (${file.file})`);
      });
      return;
    }

    try {
      const response = await fetch(`/examples/${this.testFiles[idx].file}`);

      if (!response.ok) {
        throw new Error(
          `Файл не найден: /examples/${this.testFiles[idx].file}`,
        );
      }

      const content = await response.text();
      const newGraph = new Graph();

      newGraph.loadFromFileContent(content);

      let graphName = this.testFiles[idx].name;
      let counter = 1;
      while (!this.isGraphNameUnique(graphName)) {
        graphName = `${this.testFiles[idx].name} (${counter})`;
        counter++;
      }

      newGraph.name = graphName;

      this.setGraphs([...this.graphs, newGraph]);
      this.setCurrentGraph(newGraph);
      this.updateGraphData(newGraph);

      console.log(`✅ Загружен пример: "${graphName}"`);
      console.log(
        `   Тип: ${newGraph.isDirected ? "ориентированный" : "неориентированный"}, ${newGraph.isWeighted ? "взвешенный" : "невзвешенный"}`,
      );
      console.log(`   Вершин: ${newGraph.getVertices().length}`);
      this.showGraph();
    } catch (error) {
      console.error(`❌ Ошибка загрузки файла: ${error.message}`);
    }
  }

  // Загрузка графа
  async loadGraph() {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".txt";

      input.onchange = async (event) => {
        try {
          const file = event.target.files[0];
          if (!file) return reject();

          const content = await file.text();

          const newGraph = new Graph();
          newGraph.loadFromFileContent(content);

          let graphName = file.name.replace(".txt", "");
          let counter = 1;

          while (!this.isGraphNameUnique(graphName)) {
            graphName = `${file.name.replace(".txt", "")} (${counter})`;
            counter++;
          }

          newGraph.name = graphName;

          this.setGraphs([...this.graphs, newGraph]);
          this.setCurrentGraph(newGraph);
          this.updateGraphData(newGraph);

          console.log(`✅ Граф "${graphName}" загружен`);
          resolve(newGraph);
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  }

  // Сохранение графа в файл
  saveGraph(filename) {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    const defaultName =
      this.currentGraph.name.replace(/\s+/g, "_").toLowerCase() + ".txt";
    const saveFilename = filename || defaultName;

    this.currentGraph.saveToFile(saveFilename);
    console.log(
      `✅ Граф "${this.currentGraph.name}" сохранён в файл: ${saveFilename}`,
    );
  }
}

export default ConsoleManager;
