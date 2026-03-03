import { Graph } from './Graph';

class ConsoleGraphInterface {
    constructor(graph, setGraphCallback) {
        this.graph = graph;
        this.setGraph = setGraphCallback;
        this.testFiles = [
            'undirected_unweighted.txt',
            'directed_weighted.txt',
            'undirected_weighted.txt',
            'directed_unweighted.txt'
        ];

        this.commands = {
            'help': () => this.showHelp(),
            'addVertex': (name) => this.addVertex(name),
            'addEdge': (from, to, weight) => this.addEdge(from, to, weight),
            'removeVertex': (name) => this.removeVertex(name),
            'removeEdge': (from, to) => this.removeEdge(from, to),
            'show': () => this.showGraph(),
            'showVertices': () => this.showVertices(),
            'showEdges': () => this.showEdges(),
            'showNeighbors': (vertex) => this.showNeighbors(vertex),
            'type': () => this.showType(),
            'clear': () => this.clear(),
            'newGraph': (type, weighted) => this.newGraph(type, weighted),
            'save': (filename) => this.saveToFile(filename),
            'load': (filename) => this.loadFromFile(filename),
            'test': () => this.runTests(),
            'listTests': () => this.listTestFiles(),
            'loadTest': (index) => this.loadTestFile(index),
        };

        this.execute = this.execute.bind(this);
    }

    showHelp() {
        console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                     КОНСОЛЬНЫЙ ИНТЕРФЕЙС ГРАФА                      ║
╠══════════════════════════════════════════════════════════════════════╣
║ 🆕 СОЗДАНИЕ ГРАФА:                                                   ║
║  newGraph [type] [weighted]    - создать новый граф                 ║
║    type: 'directed' или 'undirected' (по умолч. undirected)         ║
║    weighted: 'weighted' или 'unweighted' (по умолч. unweighted)     ║
║  Пример: newGraph directed weighted                                 ║
║                                                                      ║
║ 🔧 РАБОТА С ВЕРШИНАМИ:                                               ║
║  addVertex <имя>               - добавить вершину                   ║
║  removeVertex <имя>            - удалить вершину                    ║
║  showVertices                  - показать все вершины               ║
║  showNeighbors <вершина>       - показать соседей вершины           ║
║                                                                      ║
║ 🔗 РАБОТА С РЁБРАМИ:                                                 ║
║  addEdge <от> <к> [вес]        - добавить ребро                     ║
║  removeEdge <от> <к>           - удалить ребро                      ║
║  showEdges                     - показать все рёбра                 ║
║                                                                      ║
║ 💾 ФАЙЛОВЫЕ ОПЕРАЦИИ:                                                ║
║  save [filename]               - сохранить граф в файл              ║
║  load <filename>               - загрузить граф из файла            ║
║                                                                      ║
║ 📁 ТЕСТОВЫЕ ФАЙЛЫ:                                                   ║
║  listTests                     - показать список тестовых файлов    ║
║  loadTest <номер>              - загрузить тестовый файл по номеру  ║
║  test                          - запустить полное тестирование      ║
║                                                                      ║
║ 📊 ПРОСМОТР:                                                         ║
║  show                          - показать список смежности          ║
║  type                          - показать тип графа                 ║
║  clear                         - очистить консоль                   ║
╚══════════════════════════════════════════════════════════════════════╝
        `);
    }

    // Новый граф
    newGraph(type = 'undirected', weighted = 'unweighted') {
        const isDirected = type.toLowerCase() === 'directed';
        const isWeighted = weighted.toLowerCase() === 'weighted';

        this.graph = new Graph({ isDirected, isWeighted });
        this.updateGraph();

        console.log(`✅ Создан новый ${isDirected ? 'ориентированный' : 'неориентированный'} ${isWeighted ? 'взвешенный' : 'невзвешенный'} граф`);
    }

    // Сохранение в файл
    saveToFile(filename = 'graph.txt') {
        this.graph.saveToFile(filename);
        console.log(`✅ Граф сохранён в файл: ${filename}`);
    }

    // Загрузка из файла
    async loadFromFile(filename) {
        try {
            const response = await fetch(`/${filename}`);
            if (!response.ok) {
                throw new Error(`Файл ${filename} не найден`);
            }

            const content = await response.text();

            // Определяем тип графа из содержимого
            const lines = content.split('\n');
            const firstLine = lines[0].trim();

            const isDirected = firstLine.includes('DIRECTED');
            const isWeighted = firstLine.includes('WEIGHTED');

            const newGraph = new Graph({ isDirected, isWeighted });
            newGraph.loadFromString(content);

            this.graph = newGraph;
            this.updateGraph();

            console.log(`✅ Граф загружен из файла: ${filename}`);
            this.showType();
        } catch (error) {
            console.error(`❌ Ошибка загрузки файла: ${error.message}`);
        }
    }

    // Загрузка строки в граф (нужно добавить в Graph.js)
    loadFromString(content) {
        const lines = content.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
            if (line.startsWith('DIRECTED') || line.startsWith('UNDIRECTED')) {
                continue;
            }

            const [vertexPart, neighborsPart] = line.split(':').map(s => s.trim());
            if (!vertexPart) continue;

            const vertex = vertexPart;

            if (!this.graph.adjacencyList.has(vertex)) {
                this.graph.addVertex(vertex);
            }

            if (neighborsPart && neighborsPart !== '') {
                const neighbors = neighborsPart.split(/\s+/);

                for (const neighbor of neighbors) {
                    if (neighbor === '') continue;

                    const match = neighbor.match(/(\w+)\((\d+)\)/);

                    if (match && this.graph.isWeighted) {
                        const [_, neighborVertex, weight] = match;
                        this.graph.addEdge(vertex, neighborVertex, parseInt(weight));
                    } else if (!this.graph.isWeighted) {
                        this.graph.addEdge(vertex, neighbor, 1);
                    }
                }
            }
        }
    }

    // Список тестовых файлов
    listTestFiles() {
        console.log('\n📁 ТЕСТОВЫЕ ФАЙЛЫ:');
        this.testFiles.forEach((file, index) => {
            console.log(`  ${index + 1}. ${file}`);
        });
        console.log('\n💡 Используйте: loadTest <номер> для загрузки файла\n');
    }

    // Загрузка тестового файла по номеру
    async loadTestFile(index) {
        const fileIndex = parseInt(index) - 1;

        if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= this.testFiles.length) {
            console.error(`❌ Укажите номер от 1 до ${this.testFiles.length}`);
            this.listTestFiles();
            return;
        }

        const filename = this.testFiles[fileIndex];
        await this.loadFromFile(filename);
    }

    // Полное тестирование всех файлов
    async runTests() {
        console.log('\n🧪 ЗАПУСК ТЕСТИРОВАНИЯ');
        console.log('════════════════════════════════════════════════\n');

        for (let i = 0; i < this.testFiles.length; i++) {
            const filename = this.testFiles[i];
            console.log(`📄 ТЕСТ ${i + 1}: ${filename}`);
            console.log('────────────────────────────────────────────');

            try {
                const response = await fetch(`/${filename}`);
                const content = await response.text();

                const lines = content.split('\n');
                const firstLine = lines[0].trim();
                const isDirected = firstLine.includes('DIRECTED');
                const isWeighted = firstLine.includes('WEIGHTED');

                console.log(`   Тип: ${isDirected ? 'Ориентированный' : 'Неориентированный'}, ${isWeighted ? 'Взвешенный' : 'Невзвешенный'}`);

                // Создаём тестовый граф
                const testGraph = new Graph({ isDirected, isWeighted });
                testGraph.loadFromString(content);

                // Сохраняем текущий граф
                const previousGraph = this.graph;
                this.graph = testGraph;
                this.updateGraph();

                // 1. Показываем исходный граф
                console.log('\n   📊 ИСХОДНЫЙ ГРАФ:');
                this.showGraph();

                // 2. Добавляем новую вершину
                const newVertex = 'TEST';
                console.log(`\n   ➕ ДОБАВЛЕНИЕ ВЕРШИНЫ ${newVertex}:`);
                this.addVertex(newVertex);

                // 3. Добавляем новое ребро
                const vertices = testGraph.getVertices();
                if (vertices.length >= 1) {
                    const from = vertices[0];
                    const weight = isWeighted ? 5 : 1;

                    console.log(`\n   ➕ ДОБАВЛЕНИЕ РЕБРА ${from} → ${newVertex}${isWeighted ? ` с весом ${weight}` : ''}:`);
                    this.addEdge(from, newVertex, weight);
                }

                // 4. Удаляем ребро (если есть)
                const edges = testGraph.toEdgeList();
                if (edges.length > 0) {
                    const edge = edges[0];
                    console.log(`\n   ➖ УДАЛЕНИЕ РЕБРА ${edge.from} → ${edge.to}:`);
                    this.removeEdge(edge.from, edge.to);
                }

                // 5. Удаляем тестовую вершину
                console.log(`\n   ➖ УДАЛЕНИЕ ВЕРШИНЫ ${newVertex}:`);
                this.removeVertex(newVertex);

                // 6. Показываем итоговый граф
                console.log('\n   📊 ИТОГОВЫЙ ГРАФ:');
                this.showGraph();

                // Восстанавливаем предыдущий граф
                this.graph = previousGraph;
                this.updateGraph();

                console.log(`\n✅ ТЕСТ ${i + 1} ПРОЙДЕН УСПЕШНО\n`);

            } catch (error) {
                console.error(`\n❌ Ошибка в тесте ${i + 1}:`, error.message);
            }
        }

        console.log('════════════════════════════════════════════════');
        console.log('✅ ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ\n');
    }

    // Добавление вершины
    addVertex(name) {
        if (!name) {
            throw new Error('Укажите имя вершины');
        }
        const result = this.graph.addVertex(name);
        if (result) {
            this.updateGraph();
            console.log(`✅ Вершина ${name} добавлена`);
        }
    }

    // Добавление ребра
    addEdge(from, to, weight) {
        if (!from || !to) {
            throw new Error('Укажите начальную и конечную вершины');
        }

        let weightNum = 1;
        if (this.graph.isWeighted) {
            if (weight === undefined) {
                throw new Error('Для взвешенного графа укажите вес ребра');
            }
            weightNum = parseInt(weight);
        }

        const result = this.graph.addEdge(from, to, weightNum);
        if (result) {
            this.updateGraph();
            const edgeStr = this.graph.isDirected ? `${from} → ${to}` : `${from} — ${to}`;
            const weightStr = this.graph.isWeighted ? ` с весом ${weightNum}` : '';
            console.log(`✅ Ребро ${edgeStr} добавлено${weightStr}`);
        }
    }

    // Удаление вершины
    removeVertex(name) {
        if (!name) {
            throw new Error('Укажите имя вершины');
        }
        this.graph.removeVertex(name);
        this.updateGraph();
        console.log(`✅ Вершина ${name} удалена`);
    }

    // Удаление ребра
    removeEdge(from, to) {
        if (!from || !to) {
            throw new Error('Укажите начальную и конечную вершины');
        }

        this.graph.removeEdge(from, to);
        this.updateGraph();

        const edgeStr = this.graph.isDirected ? `${from} → ${to}` : `${from} — ${to}`;
        console.log(`✅ Ребро ${edgeStr} удалено`);
    }

    // Показать граф
    showGraph() {
        console.log('\n' + this.graph.toFileString());
    }

    // Показать все вершины
    showVertices() {
        const vertices = this.graph.getVertices();
        if (vertices.length === 0) {
            console.log('📭 Граф не содержит вершин');
        } else {
            console.log('📌 Вершины:', vertices.join(', '));
        }
    }

    // Показать все рёбра
    showEdges() {
        const edges = this.graph.toEdgeList();
        if (edges.length === 0) {
            console.log('📭 Граф не содержит рёбер');
        } else {
            console.log('🔗 Рёбра:');
            edges.forEach(edge => {
                const edgeStr = this.graph.isDirected ?
                    `${edge.from} → ${edge.to}` :
                    `${edge.from} — ${edge.to}`;
                const weightStr = this.graph.isWeighted ? ` (вес: ${edge.weight})` : '';
                console.log(`  ${edgeStr}${weightStr}`);
            });
        }
    }

    // Показать соседей вершины
    showNeighbors(vertex) {
        if (!vertex) {
            throw new Error('Укажите вершину');
        }

        try {
            const neighbors = this.graph.getNeighbors(vertex);
            if (neighbors.length === 0) {
                console.log(`📭 У вершины ${vertex} нет соседей`);
            } else {
                console.log(`🌐 Соседи вершины ${vertex}:`, neighbors.join(', '));
            }
        } catch (error) {
            console.error(`❌ ${error.message}`);
        }
    }

    // Показать тип графа
    showType() {
        const directed = this.graph.isDirected ? 'ориентированный' : 'неориентированный';
        const weighted = this.graph.isWeighted ? 'взвешенный' : 'невзвешенный';
        console.log(`📊 Тип графа: ${directed}, ${weighted}`);
    }

    // Очистить консоль
    clear() {
        console.clear();
        console.log('🧹 Консоль очищена. Используйте gc.execute("help") для справки');
    }

    // Обновить граф в React
    updateGraph() {
        if (this.setGraph) {
            this.setGraph(Graph.fromGraph(this.graph));
        }
    }
}

export function initConsoleInterface(graph, setGraph) {
    const consoleInterface = new ConsoleGraphInterface(graph, setGraph);

    // Добавляем в глобальную область видимости
    window.graphConsole = consoleInterface;
    window.gc = consoleInterface;
    window.graph = graph; // прямой доступ к графу

    console.log(`
╔══════════════════════════════════════════════════════════╗
║  🔧 КОНСОЛЬНЫЙ ИНТЕРФЕЙС ГРАФА ЗАГРУЖЕН                 ║
╠══════════════════════════════════════════════════════════╣
║  📝 КОМАНДЫ:                                            ║
║    gc.execute('help')    - показать справку              ║
║    gc.execute('команда') - выполнить команду             ║
║                                                          ║
║  🚀 БЫСТРЫЕ ПРИМЕРЫ:                                    ║
║    gc.execute('newGraph directed weighted')              ║
║    gc.execute('addVertex A')                             ║
║    gc.execute('addEdge A B 5')                           ║
║    gc.execute('show')                                    ║
║    gc.execute('save mygraph.txt')                        ║
║    gc.execute('listTests')                               ║
║    gc.execute('test')                                    ║
║                                                          ║
║  💡 ПРЯМОЙ ДОСТУП:                                       ║
║    window.graph         - текущий граф                   ║
║    window.graph.getVertices()                            ║
║    window.graph.toEdgeList()                             ║
╚══════════════════════════════════════════════════════════╝
    `);

    return consoleInterface;
}