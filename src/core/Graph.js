/*
Как храним все виды графов:
1) Невзвешенный граф - Map(vertex, Set(neighbors))
2) Взвешенный граф - Map(vertex, Map(neighbor, weight))

+ отдельный метод, создающий список ребер на основе списка смежности
*/

export class Graph {
  constructor(options = {}) {
    // конструктор по умолчанию
    this.adjacencyList = new Map(); // список смежности
    this.isDirected = options.isDirected ?? false; // ориентированный или нет граф
    this.isWeighted = options.isWeighted ?? false; // взвешенный или нет граф
    this.name = options.name || "Новый граф"; // название графа
  }

  static fromFile(filename, options = {}) {
    // Конструктор для графов-примеров
    const graph = new Graph(options);

    // Извлекаем название из имени файла (без расширения)
    const nameFromFile = filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    graph.name = options.name || nameFromFile;

    try {
      const content = require(`../examples/${filename}`);
      const lines = content.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        if (line.startsWith("DIRECTED") || line.startsWith("UNDIRECTED"))
          continue;

        const [vertex, neighborsPart] = line.split(":").map((s) => s.trim());
        graph.addVertex(vertex);

        if (neighborsPart) {
          const neighbors = neighborsPart.split(/\s+/);
          for (const n of neighbors) {
            if (n) graph.addEdge(vertex, n);
          }
        }
      }
    } catch (error) {
      console.error(`Ошибка загрузки файла ${filename}:`, error);
    }

    return graph;
  }

  static fromGraph(otherGraph) {
    const graph = new Graph({
      isDirected: otherGraph.isDirected,
      isWeighted: otherGraph.isWeighted,
      name: otherGraph.name + " (копия)",
    });

    for (const [vertex, neighbors] of otherGraph.adjacencyList) {
      if (otherGraph.isWeighted) {
        const neighborsCopy = new Map();
        for (const [neighbor, weight] of neighbors.entries()) {
          neighborsCopy.set(neighbor, weight);
        }

        graph.adjacencyList.set(vertex, neighborsCopy);
      } else {
        const neighborsCopy = new Set();
        for (const neighbor of neighbors.values()) {
          neighborsCopy.add(neighbor);
        }

        graph.adjacencyList.set(vertex, neighborsCopy);
      }
    }

    return graph;
  }

  // Метод для смены названия графа
  setName(newName) {
    if (!newName || typeof newName !== "string") {
      throw new Error("Название должно быть непустой строкой");
    }
    this.name = newName;
    return true;
  }

  // Метод для получения названия графа
  getName() {
    return this.name;
  }

  // Метод для получения краткой информации о графе
  getInfo() {
    return {
      name: this.name,
      isDirected: this.isDirected,
      isWeighted: this.isWeighted,
      vertexCount: this.adjacencyList.size,
      edgeCount: this.toEdgeList().length,
    };
  }

  /*
      МЕТОДЫ ГРАФА
  */

  toEdgeList() {
    const edges = [];

    for (const [from, neighbors] of this.adjacencyList) {
      if (this.isWeighted) {
        for (const [to, weight] of neighbors.entries()) {
          if (this.isDirected || from <= to) {
            edges.push({ from, to, weight });
          }
        }
      } else {
        for (const to of neighbors.values()) {
          if (this.isDirected || from <= to) {
            edges.push({ from, to, weight: 1 });
          }
        }
      }
    }

    return edges;
  }

  // Добавление вершины
  addVertex(vertex) {
    if (!vertex || typeof vertex !== "string") {
      throw new Error("Имя вершины должно быть непустой строкой");
    }

    if (this.adjacencyList.has(vertex)) {
      console.warn(`Вершина ${vertex} уже существует`);
      return false;
    }

    this.adjacencyList.set(vertex, this.isWeighted ? new Map() : new Set());
    return true;
  }

  // Добавление ребра/дуги
  addEdge(from, to, weight = 1) {
    // Проверка существования вершин
    if (!this.adjacencyList.has(from)) {
      throw new Error(`Вершина ${from} не существует`);
    }
    if (!this.adjacencyList.has(to)) {
      throw new Error(`Вершина ${to} не существует`);
    }

    // Проверка веса для взвешенного графа
    if (this.isWeighted) {
      if (typeof weight !== "number" || weight <= 0) {
        throw new Error("Вес ребра должен быть положительным числом");
      }
    } else {
      weight = 1; // игнор веса для невзвешенного графа
    }

    const fromNeighbors = this.adjacencyList.get(from);

    // Проверка на существующее ребро
    if (this.isWeighted) {
      if (fromNeighbors.has(to)) {
        console.warn(`Ребро ${from} -> ${to} уже существует`);
        return false;
      }
      fromNeighbors.set(to, weight);
    } else {
      if (fromNeighbors.has(to)) {
        console.warn(`Ребро ${from} -> ${to} уже существует`);
        return false;
      }
      fromNeighbors.add(to);
    }

    // Если граф неориентированный, добавляем обратное ребро
    if (!this.isDirected && from !== to) {
      const toNeighbors = this.adjacencyList.get(to);
      if (this.isWeighted) {
        toNeighbors.set(from, weight);
      } else {
        toNeighbors.add(from);
      }
    }

    return true;
  }

  // Удаление вершины
  removeVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      throw new Error(`Вершина ${vertex} не существует`);
    }

    // Удаляем все рёбра, ведущие к этой вершине
    for (const [v, neighbors] of this.adjacencyList) {
      if (v !== vertex) {
        if (this.isWeighted) {
          neighbors.delete(vertex);
        } else {
          neighbors.delete(vertex);
        }
      }
    }

    // Удаляем саму вершину
    this.adjacencyList.delete(vertex);
    return true;
  }

  // Удаление ребра/дуги
  removeEdge(from, to) {
    if (!this.adjacencyList.has(from)) {
      throw new Error(`Вершина ${from} не существует`);
    }
    if (!this.adjacencyList.has(to)) {
      throw new Error(`Вершина ${to} не существует`);
    }

    const fromNeighbors = this.adjacencyList.get(from);

    // Проверка существования ребра
    if (this.isWeighted) {
      if (!fromNeighbors.has(to)) {
        throw new Error(`Ребро ${from} -> ${to} не существует`);
      }
      fromNeighbors.delete(to);
    } else {
      if (!fromNeighbors.has(to)) {
        throw new Error(`Ребро ${from} -> ${to} не существует`);
      }
      fromNeighbors.delete(to);
    }

    // Если граф неориентированный, удаляем обратное ребро
    if (!this.isDirected && from !== to) {
      const toNeighbors = this.adjacencyList.get(to);
      if (this.isWeighted) {
        toNeighbors.delete(from);
      } else {
        toNeighbors.delete(from);
      }
    }

    return true;
  }

  // Вывод списка смежности в файл (в формате для конструктора)
  toFileString() {
    let result = "";

    // Добавляем заголовок с типом графа
    result += this.isDirected ? "DIRECTED" : "UNDIRECTED";
    result += this.isWeighted ? " WEIGHTED\n" : "\n";

    // Добавляем название графа как комментарий
    result += `# ${this.name}\n`;

    // Получаем все вершины и сортируем для удобства чтения
    const vertices = Array.from(this.adjacencyList.keys()).sort();

    for (const vertex of vertices) {
      const neighbors = this.adjacencyList.get(vertex);
      result += vertex + ":";

      if (neighbors.size > 0) {
        const neighborStrings = [];

        if (this.isWeighted) {
          // Для взвешенного графа: сортируем соседей
          const sortedNeighbors = Array.from(neighbors.entries()).sort((a, b) =>
            a[0].localeCompare(b[0]),
          );

          for (const [neighbor, weight] of sortedNeighbors) {
            neighborStrings.push(`${neighbor}(${weight})`);
          }
        } else {
          // Для невзвешенного графа
          const sortedNeighbors = Array.from(neighbors).sort();
          neighborStrings.push(...sortedNeighbors);
        }

        result += " " + neighborStrings.join(" ");
      }

      result += "\n";
    }
    return result;
  }

  // Сохранение в файл (для браузера)
  saveToFile(filename = "graph.txt") {
    const content = this.toFileString();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  // Метод для получения всех вершин
  getVertices() {
    return Array.from(this.adjacencyList.keys());
  }

  // Метод для получения соседей вершины
  getNeighbors(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      throw new Error(`Вершина ${vertex} не существует`);
    }
    const neighbors = this.adjacencyList.get(vertex);

    if (this.isWeighted) {
      return Array.from(neighbors.entries()).map(([v, w]) => `${v}(${w})`);
    } else {
      return Array.from(neighbors);
    }
  }

  // Проверка существования ребра
  hasEdge(from, to) {
    if (!this.adjacencyList.has(from) || !this.adjacencyList.has(to)) {
      return false;
    }

    const fromNeighbors = this.adjacencyList.get(from);

    if (this.isWeighted) {
      return fromNeighbors.has(to);
    } else {
      return fromNeighbors.has(to);
    }
  }

  // Получение веса ребра
  getEdgeWeight(from, to) {
    if (!this.hasEdge(from, to)) {
      return null;
    }

    if (this.isWeighted) {
      return this.adjacencyList.get(from).get(to);
    }
    return 1;
  }

  // Загрузка из строки с поддержкой комментариев
  loadFromString(content) {
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      // Пропускаем строки с опциями, если они есть в файле
      if (line.startsWith("DIRECTED") || line.startsWith("UNDIRECTED")) {
        continue;
      }

      // Проверяем, не является ли строка комментарием с названием
      if (line.startsWith("# ")) {
        this.name = line.substring(2).trim();
        continue;
      }

      const [vertexPart, neighborsPart] = line.split(":").map((s) => s.trim());
      if (!vertexPart) continue;

      const vertex = vertexPart;

      // Добавляем вершину, если её нет
      if (!this.adjacencyList.has(vertex)) {
        this.addVertex(vertex);
      }

      // Обрабатываем соседей
      if (neighborsPart && neighborsPart !== "") {
        const neighbors = neighborsPart.split(/\s+/);

        for (const neighbor of neighbors) {
          if (neighbor === "") continue;

          // Проверяем, есть ли вес (формат: вершина(вес))
          const match = neighbor.match(/(\w+)\((\d+)\)/);

          if (match && this.isWeighted) {
            const [_, neighborVertex, weight] = match;
            this.addEdge(vertex, neighborVertex, parseInt(weight));
          } else {
            this.addEdge(vertex, neighbor, 1);
          }
        }
      }
    }
  }

  // Загрузка из файла с контентом (для fetch)
  loadFromFileContent(content, graphName = null) {
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    // Сбрасываем граф
    this.adjacencyList.clear();

    if (lines.length === 0) return;

    // Определяем тип графа
    const firstLine = lines[0].trim();

    this.isDirected = firstLine.includes("DIRECTED");
    this.isWeighted = firstLine.includes("WEIGHTED");

    // Обрабатываем строки начиная со 2
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      // Комментарий с названием
      if (line.startsWith("# ")) {
        this.name = line.substring(2).trim();
        continue;
      }

      const [vertexPart, neighborsPart] = line.split(":").map((s) => s.trim());
      if (!vertexPart) continue;

      const vertex = vertexPart;

      // ✅ создаём вершину если её нет
      if (!this.adjacencyList.has(vertex)) {
        this.addVertex(vertex);
      }

      if (neighborsPart) {
        const neighbors = neighborsPart.split(/\s+/);

        for (const neighbor of neighbors) {
          if (!neighbor) continue;

          const match = neighbor.match(/(\w+)\((\d+)\)/);

          let neighborVertex;
          let weight = 1;

          if (match) {
            neighborVertex = match[1];
            weight = this.isWeighted ? parseInt(match[2]) : 1;
          } else {
            neighborVertex = neighbor;
          }

          // ✅ создаём соседа если его нет
          if (!this.adjacencyList.has(neighborVertex)) {
            this.addVertex(neighborVertex);
          }

          this.addEdge(vertex, neighborVertex, weight);
        }
      }
    }

    if (graphName) {
      this.name = graphName;
    }

    if (!this.name) {
      this.name = "Загруженный граф";
    }
  }

  // Удаление дуг без противоположных
  buildMutualEdgeGraph() {
    if (!this.isDirected) {
      throw new Error("Метод применим только к ориентированному графу");
    }

    const result = new Graph({
      isDirected: true,
      isWeighted: this.isWeighted,
      name: this.name + "_mutual",
    });

    const vertices = this.getVertices();

    for (const v of vertices) {
      result.addVertex(v);
    }

    for (const [from, neighbors] of this.adjacencyList) {
      if (this.isWeighted) {
        for (const [to, weight] of neighbors.entries()) {
          if (
            this.adjacencyList.has(to) &&
            this.adjacencyList.get(to).has(from)
          ) {
            result.addEdge(from, to, weight);
          }
        }
      } else {
        for (const to of neighbors.values()) {
          if (
            this.adjacencyList.has(to) &&
            this.adjacencyList.get(to).has(from)
          ) {
            result.addEdge(from, to);
          }
        }
      }
    }

    return result;
  }

  // Сильно связные компоненты https://habr.com/ru/articles/537290/
  findStronglyConnectedComponents() {
    if (!this.isDirected) {
      throw new Error("SCC определены только для ориентированных графов");
    }

    const visited = new Set();
    const stack = [];

    const dfs1 = (v) => {
      visited.add(v);

      const neighbors = this.adjacencyList.get(v);

      for (const n of this.isWeighted ? neighbors.keys() : neighbors.values()) {
        if (!visited.has(n)) {
          dfs1(n);
        }
      }

      stack.push(v);
    };

    for (const v of this.getVertices()) {
      if (!visited.has(v)) {
        dfs1(v);
      }
    }

    const transpose = this.getTranspose();

    const visited2 = new Set();
    const components = [];

    const dfs2 = (v, component) => {
      visited2.add(v);
      component.push(v);

      const neighbors = transpose.adjacencyList.get(v);

      for (const n of transpose.isWeighted
        ? neighbors.keys()
        : neighbors.values()) {
        if (!visited2.has(n)) {
          dfs2(n, component);
        }
      }
    };

    while (stack.length) {
      const v = stack.pop();

      if (!visited2.has(v)) {
        const component = [];
        dfs2(v, component);
        components.push(component);
      }
    }

    return components;
  }

  // транспонирование графа
  getTranspose() {
    const g = new Graph({
      isDirected: true,
      isWeighted: this.isWeighted,
    });

    for (const v of this.getVertices()) {
      g.addVertex(v);
    }

    for (const [from, neighbors] of this.adjacencyList) {
      if (this.isWeighted) {
        for (const [to, weight] of neighbors.entries()) {
          g.addEdge(to, from, weight);
        }
      } else {
        for (const to of neighbors.values()) {
          g.addEdge(to, from);
        }
      }
    }

    return g;
  }

  // Кратчайшие пути до вершины u
  shortestPathsTo(u) {
    if (!this.adjacencyList.has(u)) {
      throw new Error("Вершина не существует");
    }

    const transpose = this.getTranspose();

    const queue = [u];
    const visited = new Set([u]);
    const dist = {};
    const parent = {};

    dist[u] = 0;
    parent[u] = null;

    while (queue.length) {
      const v = queue.shift();
      const neighbors = transpose.adjacencyList.get(v);

      for (const n of transpose.isWeighted
        ? neighbors.keys()
        : neighbors.values()) {
        if (!visited.has(n)) {
          visited.add(n);
          dist[n] = dist[v] + 1;
          parent[n] = v;

          queue.push(n);
        }
      }
    }

    return { dist, parent };
  }

  buildPath(parent, start, end) {
    const path = [];
    let cur = start;

    while (cur !== null) {
      path.push(cur);
      cur = parent[cur];
    }

    path.reverse();

    if (path[0] !== end) return null;

    return path;
  }
}
