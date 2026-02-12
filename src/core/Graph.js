export class Graph {
    constructor(options = {}) {
        this.adjacencyList = new Map(); // список смежности: Map(vertex, Map(neighbor, weight))
        this.isDirected = options.isDirected ?? false; // ориентированный граф
        this.isWeighted = options.isWeighted ?? false; // взвешенный граф
        this.vertexCount = 0;
    }
}