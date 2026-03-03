import { Graph } from "./Graph";

class ConsoleManager {
  constructor(
    graphs,
    setGraphs,
    currentGraph,
    setCurrentGraph,
    updateGraphData,
  ) {
    this.graphs = graphs; // массив всех графов
    this.setGraphs = setGraphs;
    this.currentGraph = currentGraph;
    this.setCurrentGraph = setCurrentGraph;
    this.updateGraphData = updateGraphData;

    // Список доступных тестовых файлов
    this.testFiles = [
      { name: "Социальная сеть", file: "undirected_social.txt" },
      { name: "Карта метро", file: "directed_subway.txt" },
      { name: "Сеть дорог", file: "undirected_roads.txt" },
      { name: "HTML структура", file: "directed_html.txt" },
    ];

    this.bindCommands();
    this.printWelcomeMessage();
  }

  bindCommands() {
    window.cc = this; // глобальные команды

    // Основные команды
    window.createGraph = this.createGraph.bind(this);
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

    // Команды для работы с файлами
    window.loadExample = this.loadExample.bind(this);
    window.saveGraph = this.saveGraph.bind(this);

    // Команда помощи
    window.help = this.showHelp.bind(this);
  }

  printWelcomeMessage() {
    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║              КОНСОЛЬНЫЙ ИНТЕРФЕЙС УПРАВЛЕНИЯ ГРАФАМИ                ║
╠══════════════════════════════════════════════════════════════════════╣
║  Доступные команды:                                                  ║
║                                                                      ║
║  📋 УПРАВЛЕНИЕ ГРАФАМИ:                                              ║
║    help()                                   - показать эту справку  ║
║    createGraph(имя, directed, weighted)     - создать новый граф    ║
║    listGraphs()                              - список всех графов   ║
║    switchGraph(имя)                          - переключиться на граф║
║    deleteGraph(имя)                          - удалить граф         ║
║                                                                      ║
║  🔧 РАБОТА С ТЕКУЩИМ ГРАФОМ:                                         ║
║    addVertex(вершина)                        - добавить вершину     ║
║    addEdge(от, к, [вес])                     - добавить ребро       ║
║    removeVertex(вершина)                      - удалить вершину     ║
║    removeEdge(от, к)                          - удалить ребро       ║
║    showGraph()                               - показать граф        ║
║    showVertices()                             - показать вершины    ║
║    showEdges()                                - показать рёбра      ║
║                                                                      ║
║  📁 РАБОТА С ФАЙЛАМИ:                                                ║
║    loadExample(номер)                         - загрузить пример    ║
║    saveGraph([имя_файла])                     - сохранить в файл    ║
║                                                                      ║
║  Примеры:                                                            ║
║    createGraph('Мой граф', true, true)        - ориентир. взвешенный║
║    loadExample(1)                             - соц. сеть          ║
║    addVertex('A')                                                     ║
║    addEdge('A', 'B', 5)                                              ║
║    showGraph()                                                       ║
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

  // Создание нового графа
  createGraph(name, isDirected = false, isWeighted = false) {
    if (!name || typeof name !== "string") {
      console.error("❌ Ошибка: укажите имя графа");
      return;
    }

    if (!this.isGraphNameUnique(name)) {
      console.error(`❌ Ошибка: граф с именем "${name}" уже существует`);
      return;
    }

    const newGraph = new Graph({ isDirected, isWeighted, name });
    this.setGraphs([...this.graphs, newGraph]);
    this.setCurrentGraph(newGraph);
    this.updateGraphData(newGraph);

    console.log(`✅ Создан новый граф: "${name}"`);
    console.log(
      `   Тип: ${isDirected ? "ориентированный" : "неориентированный"}, ${isWeighted ? "взвешенный" : "невзвешенный"}`,
    );
  }

  // Копирование графа
  copyGraph(sourceName, newName) {
    const sourceGraph = this.graphs.find((g) => g.name === sourceName);

    if (!sourceGraph) {
      console.error(`❌ Ошибка: граф "${sourceName}" не найден`);
      return;
    }

    if (!this.isGraphNameUnique(newName)) {
      console.error(`❌ Ошибка: граф с именем "${newName}" уже существует`);
      return;
    }

    const newGraph = Graph.fromGraph(sourceGraph);
    newGraph.setName(newName);

    this.setGraphs([...this.graphs, newGraph]);
    this.setCurrentGraph(newGraph);
    this.updateGraphData(newGraph);

    console.log(`✅ Создана копия графа "${sourceName}" с именем "${newName}"`);
  }

  // Список всех графов
  listGraphs() {
    if (this.graphs.length === 0) {
      console.log("📭 Нет созданных графов");
      return;
    }

    console.log("\n📋 СПИСОК ГРАФОВ:");
    this.graphs.forEach((graph, index) => {
      const info = graph.getInfo();
      const current = graph === this.currentGraph ? " ▶ (текущий)" : "";
      console.log(`${index + 1}. ${graph.name}${current}`);
      console.log(
        `   Тип: ${info.isDirected ? "ориентированный" : "неориентированный"}, ${info.isWeighted ? "взвешенный" : "невзвешенный"}`,
      );
      console.log(`   Вершин: ${info.vertexCount}, Рёбер: ${info.edgeCount}`);
    });
  }

  // Переключение на другой граф
  switchGraph(name) {
    const graph = this.graphs.find((g) => g.name === name);

    if (!graph) {
      console.error(`❌ Ошибка: граф "${name}" не найден`);
      this.listGraphs();
      return;
    }

    this.setCurrentGraph(graph);
    this.updateGraphData(graph);
    console.log(`✅ Переключено на граф: "${name}"`);
    this.showGraph();
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

    // Подтверждение в консоли
    console.log(`⚠️ Вы уверены, что хотите удалить граф "${name}"?`);
    console.log("💡 Для подтверждения введите: confirmDelete()");

    window.confirmDelete = () => {
      const newGraphs = this.graphs.filter((g) => g.name !== name);
      this.setGraphs(newGraphs);

      if (this.currentGraph && this.currentGraph.name === name) {
        // Если удаляем текущий граф, переключаемся на первый доступный
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

    console.log(`\n📊 ГРАФ: ${this.currentGraph.name}`);
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
      console.log(`📭 Граф "${this.currentGraph.name}" не содержит вершин`);
    } else {
      console.log(
        `📌 Вершины графа "${this.currentGraph.name}":`,
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
      console.log(`📭 Граф "${this.currentGraph.name}" не содержит рёбер`);
    } else {
      console.log(`🔗 Рёбра графа "${this.currentGraph.name}":`);
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
      const response = await fetch(`/${this.testFiles[idx].file}`);
      const content = await response.text();

      // Определяем тип графа из содержимого
      const lines = content.split("\n");
      const firstLine = lines[0].trim();
      const isDirected = firstLine.includes("DIRECTED");
      const isWeighted = firstLine.includes("WEIGHTED");

      // Создаём уникальное имя
      let graphName = this.testFiles[idx].name;
      let counter = 1;
      while (!this.isGraphNameUnique(graphName)) {
        graphName = `${this.testFiles[idx].name} (${counter})`;
        counter++;
      }

      const newGraph = new Graph({ isDirected, isWeighted, name: graphName });
      newGraph.loadFromFileContent(content);

      this.setGraphs([...this.graphs, newGraph]);
      this.setCurrentGraph(newGraph);
      this.updateGraphData(newGraph);

      console.log(`✅ Загружен пример: "${graphName}"`);
      console.log(
        `   Тип: ${isDirected ? "ориентированный" : "неориентированный"}, ${isWeighted ? "взвешенный" : "невзвешенный"}`,
      );
      this.showGraph();
    } catch (error) {
      console.error(`❌ Ошибка загрузки файла: ${error.message}`);
    }
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
