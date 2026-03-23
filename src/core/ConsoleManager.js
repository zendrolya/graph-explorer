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
      {
        name: "Социальная сеть",
        file: "undirected_unweighted.txt",
      },
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
    /*
    window.dijkstraTo = this.dijkstraTo.bind(this);
    window.bellmanFordFrom = this.bellmanFordFrom.bind(this);
    window.findNegativeInfinitePaths =
      this.findNegativeInfinitePaths.bind(this);
    */

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
    if (!sourceName || typeof sourceName !== "string") {
      console.error("❌ Ошибка: укажите имя исходного графа");
      return;
    }

    const sourceGraph = this.graphs.find((g) => g.name === sourceName);

    if (!sourceGraph) {
      console.error(`❌ Ошибка: граф "${sourceName}" не найден`);
      this.listGraphs();
      return;
    }

    if (!newName || typeof newName !== "string") {
      console.error("❌ Ошибка: укажите имя для нового графа");
      return;
    }

    if (!this.isGraphNameUnique(newName)) {
      console.error(`❌ Ошибка: граф с именем "${newName}" уже существует`);
      this.listGraphs();
      return;
    }

    try {
      const newGraph = Graph.fromGraph(sourceGraph);
      newGraph.setName(newName);

      this.setGraphs([...this.graphs, newGraph]);

      this.setCurrentGraph(newGraph);
      this.updateGraphData(newGraph);

      console.log(`✅ Граф "${sourceName}" успешно скопирован в "${newName}"`);
      console.log(
        `   Тип: ${newGraph.isDirected ? "ориентированный" : "неориентированный"}, ${newGraph.isWeighted ? "взвешенный" : "невзвешенный"}`,
      );
      console.log(
        `   Вершин: ${newGraph.getVertices().length}, Рёбер: ${newGraph.toEdgeList().length}`,
      );
    } catch (error) {
      console.error(`❌ Ошибка при копировании графа: ${error.message}`);
    }
  }

  // Список всех графов
  listGraphs() {
    if (this.graphs.length === 0) {
      console.log("Нет созданных графов");
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
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    try {
      if (vertex) {
        if (!this.currentGraph.adjacencyList.has(vertex)) {
          console.error(`❌ Ошибка: вершина "${vertex}" не существует`);
          return;
        }

        const neighbors = this.currentGraph.adjacencyList.get(vertex);
        let degree = neighbors.size;

        if (this.currentGraph.isDirected) {
          let inDegree = 0;
          for (const [v, n] of this.currentGraph.adjacencyList) {
            if (v !== vertex) {
              if (this.currentGraph.isWeighted) {
                if (n.has(vertex)) inDegree++;
              } else {
                if (n.has(vertex)) inDegree++;
              }
            }
          }

          console.log(
            `\nСтепени вершины "${vertex}" в графе "${this.currentGraph.name}":`,
          );
          console.log(`   Полустепень исхода (out-degree): ${degree}`);
          console.log(`   Полустепень захода (in-degree): ${inDegree}`);
          console.log(`   Полная степень: ${degree + inDegree}`);
        } else {
          // Для неориентированного графа
          console.log(
            `\nСтепень вершины "${vertex}" в графе "${this.currentGraph.name}": ${degree}`,
          );
        }
      } else {
        console.log(`\nСТЕПЕНИ ВСЕХ ВЕРШИН графа "${this.currentGraph.name}":`);

        const vertices = this.currentGraph.getVertices().sort();

        if (this.currentGraph.isDirected) {
          // Для ориентированного графа
          console.log("   Вершина | Исход | Заход | Полная");
          console.log("   ---------|-------|-------|--------");

          vertices.forEach((v) => {
            const outDegree = this.currentGraph.adjacencyList.get(v).size;
            let inDegree = 0;
            for (const [u, neighbors] of this.currentGraph.adjacencyList) {
              if (u !== v) {
                if (this.currentGraph.isWeighted) {
                  if (neighbors.has(v)) inDegree++;
                } else {
                  if (neighbors.has(v)) inDegree++;
                }
              }
            }

            console.log(
              `   ${v.padEnd(7)} | ${outDegree.toString().padEnd(5)} | ${inDegree.toString().padEnd(5)} | ${outDegree + inDegree}`,
            );
          });
        } else {
          // Для неориентированного графа
          vertices.forEach((v) => {
            const degree = this.currentGraph.adjacencyList.get(v).size;
            console.log(`   ${v}: ${degree}`);
          });
        }
      }
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  // Вершины, не смежные с данной
  nonAdjacentVertices(vertex) {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    if (!vertex) {
      console.error("❌ Ошибка: укажите вершину");
      return;
    }

    try {
      if (!this.currentGraph.adjacencyList.has(vertex)) {
        console.error(`❌ Ошибка: вершина "${vertex}" не существует`);
        return;
      }

      const allVertices = this.currentGraph.getVertices();
      const neighbors = this.currentGraph.adjacencyList.get(vertex);
      const neighborSet = new Set();

      if (this.currentGraph.isWeighted) {
        for (const [v, _] of neighbors) {
          neighborSet.add(v);
        }
      } else {
        for (const v of neighbors) {
          neighborSet.add(v);
        }
      }

      const nonAdjacent = allVertices.filter(
        (v) => v !== vertex && !neighborSet.has(v),
      );

      if (nonAdjacent.length === 0) {
        console.log(
          `\nВсе вершины смежны с "${vertex}" в графе "${this.currentGraph.name}"`,
        );
      } else {
        console.log(
          `\nВершины, НЕ смежные с "${vertex}" в графе "${this.currentGraph.name}":`,
        );
        console.log(`   ${nonAdjacent.join(", ")} (${nonAdjacent.length} шт.)`);
      }

      if (neighborSet.size > 0) {
        const adjacent = Array.from(neighborSet).sort();
        console.log(
          `\n   Смежные вершины: ${adjacent.join(", ")} (${adjacent.length} шт.)`,
        );
      } else {
        console.log(`\n   Смежных вершин нет`);
      }
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  mutualEdgesGraph() {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    if (!this.currentGraph.isDirected) {
      console.error("❌ Метод применим только к ориентированным графам");
      return;
    }

    try {
      const newGraph = this.currentGraph.buildMutualEdgeGraph();

      let name = this.currentGraph.name + "_mutual";
      let counter = 1;

      while (!this.isGraphNameUnique(name)) {
        name = this.currentGraph.name + "_mutual_" + counter;
        counter++;
      }

      newGraph.name = name;

      this.setGraphs([...this.graphs, newGraph]);
      this.setCurrentGraph(newGraph);
      this.updateGraphData(newGraph);

      console.log(`✅ Создан граф взаимных дуг: "${name}"`);
      this.showGraph();
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  stronglyConnectedComponents() {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    if (!this.currentGraph.isDirected) {
      console.error("❌ SCC определены только для ориентированных графов");
      return;
    }

    try {
      const components = this.currentGraph.findStronglyConnectedComponents();

      console.log(
        `\n📊 СИЛЬНО СВЯЗНЫЕ КОМПОНЕНТЫ графа "${this.currentGraph.name}":`,
      );

      components.forEach((comp, i) => {
        console.log(`  ${i + 1}. ${comp.join(", ")}`);
      });

      console.log(`Всего компонент: ${components.length}`);
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  shortestPathsTo(vertex) {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    if (!vertex) {
      console.error("❌ Укажите вершину");
      return;
    }

    try {
      const { dist, parent } = this.currentGraph.shortestPathsTo(vertex);

      console.log(
        `\n📊 КРАТЧАЙШИЕ ПУТИ ДО ВЕРШИНЫ "${vertex}" в графе "${this.currentGraph.name}":`,
      );

      for (const v in dist) {
        const path = [];
        let cur = v;

        while (cur !== null) {
          path.push(cur);
          cur = parent[cur];
        }

        path.reverse();

        console.log(`${v} → ${vertex}: ${path.join(" → ")}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  // Алгоритм Прима
  minimumSpanningTree() {
    if (!this.currentGraph) {
      console.error("❌ Ошибка: сначала создайте или выберите граф");
      return;
    }

    if (this.currentGraph.isDirected) {
      console.error("❌ MST существует только для неориентированных графов");
      return;
    }

    if (!this.currentGraph.isWeighted) {
      console.error("❌ MST требует взвешенный граф");
      return;
    }

    try {
      const mst = this.currentGraph.findMinimumSpanningTreePrim();

      let name = this.currentGraph.name + "_mst";
      let counter = 1;

      while (!this.isGraphNameUnique(name)) {
        name = this.currentGraph.name + "_mst_" + counter;
        counter++;
      }

      mst.name = name;

      this.setGraphs([...this.graphs, mst]);
      this.setCurrentGraph(mst);
      this.updateGraphData(mst);

      console.log(`✅ Построен минимальный остов: "${name}"`);
      console.log(
        `Рёбер: ${mst.toEdgeList().length}, Вершин: ${mst.getVertices().length}`,
      );

      this.showEdges();
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
  }

  /*
  dijkstraTo(v, u1, u2) {
    if (!this.currentGraph) return console.error("Нет графа");

    try {
      const dist = this.currentGraph.dijkstraShortestPathsTo(v);

      console.log(`\nКратчайшие пути до ${v}:`);

      [u1, u2].forEach((u) => {
        if (!u) return;
        console.log(`${u} → ${v}: ${dist[u]}`);
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  bellmanFordFrom(u, v1, v2) {
    if (!this.currentGraph) return console.error("Нет графа");

    try {
      const dist = this.currentGraph.bellmanFord(u);

      console.log(`\nКратчайшие пути из ${u}:`);

      [v1, v2].forEach((v) => {
        if (!v) return;
        console.log(`${u} → ${v}: ${dist[v]}`);
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  findNegativeInfinitePaths() {
    if (!this.currentGraph) return console.error("Нет графа");

    try {
      const pairs = this.currentGraph.findInfiniteNegativePaths();

      console.log("\nПары вершин с путём бесконечно малого веса:");

      pairs.forEach(([u, v]) => {
        console.log(`${u} → ${v}`);
      });

      console.log(`Всего: ${pairs.length}`);
    } catch (e) {
      console.error(e.message);
    }
  }
  */

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
