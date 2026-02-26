import styles from './GraphEditor.module.css'
import GraphView from './GraphView'
import { initConsoleInterface } from '../core/consoleInterface';
import {Graph} from "../core/Graph.js";
import { useState, useEffect, useRef } from 'react';


function GraphEditor() {
    const [graph, setGraph] = useState(() => new Graph({ isDirected: false, isWeighted: false }));
    const [selectedVertex, setSelectedVertex] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [graphData, setGraphData] = useState({
        nodes: [],
        links: [],
        isDirected: false,
        isWeighted: false
    });

    const graphRef = useRef(graph);
    graphRef.current = graph;

    // Инициализация консольного интерфейса
    useEffect(() => {
        const consoleInterface = initConsoleInterface(graph, setGraph);

        // Добавляем функцию для прямого доступа к графу
        window.graph = graph;

        return () => {
            // Очищаем глобальные переменные при размонтировании
            delete window.graphConsole;
            delete window.gc;
            delete window.graph;
        };
    }, []);

    // Обновление данных для визуализации
    useEffect(() => {
        updateGraphData();
    }, [graph, selectedVertex, selectedEdge]);

    const updateGraphData = () => {
        const nodes = [];
        const links = [];
        const vertices = Array.from(graph.adjacencyList.keys());

        vertices.forEach(vertex => {
            nodes.push({
                id: vertex,
                name: vertex,
                val: 1,
                color: selectedVertex === vertex ? '#ff6b6b' : '#4ecdc4'
            });
        });

        const edges = graph.toEdgeList();
        edges.forEach(edge => {
            const isSelected = selectedEdge &&
                ((edge.from === selectedEdge.from && edge.to === selectedEdge.to) ||
                    (!graph.isDirected && edge.from === selectedEdge.to && edge.to === selectedEdge.from));

            links.push({
                source: edge.from,
                target: edge.to,
                weight: edge.weight,
                color: isSelected ? '#ff6b6b' : '#999',
                label: graph.isWeighted ? edge.weight.toString() : ''
            });
        });

        setGraphData({
            nodes,
            links,
            isDirected: graph.isDirected,
            isWeighted: graph.isWeighted
        });
    };

    const handleVertexClick = (vertex) => {
        setSelectedVertex(vertex);
        setSelectedEdge(null);
    };

    const handleEdgeClick = (edge) => {
        setSelectedEdge({ from: edge.source.id, to: edge.target.id });
        setSelectedVertex(null);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.btn_container}>
                    <button className={`${styles.header_button} ${styles.add_button}`}>
                        <img src='/icons/add-graph-icon.svg' draggable="false" alt="Создать граф" />
                        Создать граф
                    </button>
                    <button className={`${styles.header_button} ${styles.delete_button}`}>
                        <img src='/icons/del-graph-icon.svg' draggable="false" alt="Удалить граф" />
                        Удалить граф
                    </button>
                    <details className={styles.header_button}>
                        <summary className={styles.header_summary}>
                            Методы
                        </summary>
                        <ul className={styles.methods_list}>
                            <li>Степень вершин графа</li>
                            <li>Все вершины графа, не смежные с данной</li>
                            <li>soon</li>
                        </ul>
                    </details>
                    <button className={`${styles.header_button} ${styles.save_button}`}>
                        <img src='/icons/save-graph.svg' draggable="false" alt="Сохранить граф" />
                        Сохранить граф
                    </button>
                    <button className={`${styles.header_button} ${styles.load_button}`}>
                        <img src='/icons/load-graph.svg' draggable="false" alt="Загрузить граф" />
                        Загрузить граф
                    </button>
                </div>
                <button className={styles.fullscreen_btn}><img src="/icons/fullscreen.svg" draggable="false" /></button>
            </header>
            <main className={styles.main}>
                <div className={styles.instruments_panel}>
                    <button className={styles.instruments_btn}><img src='/icons/add-vertex.svg' draggable="false" alt="Добавить вершину" /></button>
                    <button className={styles.instruments_btn}><img src='/icons/add-edge.svg' draggable="false" alt="Добавить ребро (дугу)" /></button>
                    <button className={styles.instruments_btn}><img src='/icons/del-vertex.svg' draggable="false" alt="Удалить вершину" /></button>
                    <button className={styles.instruments_btn}><img src='/icons/del-edge.svg' draggable="false" alt="Удалить ребро (дугу)" /></button>
                    <button className={styles.instruments_btn}><img src='/icons/adjacency-list.svg' draggable="false" alt="Вывести список смежности" /></button>
                </div>
                <div className={styles.workflow}>
                    <GraphView
                        graphData={graphData}
                        onVertexClick={handleVertexClick}
                        onEdgeClick={handleEdgeClick}
                        selectedVertex={selectedVertex}
                        selectedEdge={selectedEdge}
                    />
                </div>
            </main>
        </>
    )
}

export default GraphEditor