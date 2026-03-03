import styles from './GraphEditor.module.css'
import GraphView from './GraphView'
import { initConsoleInterface } from '../core/consoleInterface';
import {Graph} from "../core/Graph.js";
import { useState, useEffect, useRef } from 'react';


function GraphEditor() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);

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

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange); // ивент перехода полноэкранного режима
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div ref={containerRef} className={styles.main_container}>
            <header className={styles.header}>
                <div className={styles.btn_container}>
                    <button className={`${styles.header_button} ${styles.add_button}`} title="Создать граф">
                        <img src='/icons/add-graph-icon.svg' draggable="false" alt="Создать граф" />
                        Создать граф
                    </button>
                    <button className={`${styles.header_button} ${styles.delete_button}`} title="Удалить граф">
                        <img src='/icons/del-graph-icon.svg' draggable="false" alt="Удалить граф" />
                        Удалить граф
                    </button>
                    <details className={styles.header_button} title="Методы">
                        <summary className={styles.header_summary}>
                            Методы
                        </summary>
                        <ul className={styles.methods_list}>
                            <li>Степень вершин графа</li>
                            <li>Все вершины графа, не смежные с данной</li>
                            <li>soon</li>
                        </ul>
                    </details>
                    <details className={styles.header_button} title="Примеры">
                        <summary className={styles.header_summary}>
                            Примеры
                        </summary>
                        <ul className={styles.methods_list}>
                            <li>Ориентированный невзвешенный</li>
                            <li>Ориентированный взвешенный</li>
                            <li>Неориентированный невзвешенный</li>
                            <li>Неориентированный взвешенный</li>
                        </ul>
                    </details>
                    <button className={`${styles.header_button} ${styles.save_button}`} title="Сохранить граф">
                        <img src='/icons/save-graph.svg' draggable="false" alt="Сохранить граф" />
                        Сохранить граф
                    </button>
                    <button className={`${styles.header_button} ${styles.load_button}`} title="Загрузить граф">
                        <img src='/icons/load-graph.svg' draggable="false" alt="Загрузить граф" />
                        Загрузить граф
                    </button>
                </div>
                <button 
                    className={styles.fullscreen_btn}
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
                >
                    <img 
                        src="/icons/fullscreen.svg"
                        draggable="false" 
                        alt={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
                    />
                </button>
            </header>
            <main className={styles.main}>
                <div className={styles.instruments_panel}>
                    <button className={styles.instruments_btn} title="Добавить вершину"><img src='/icons/add-vertex.svg' draggable="false" alt="Добавить вершину" /></button>
                    <button className={styles.instruments_btn} title="Добавить ребро (дугу)"><img src='/icons/add-edge.svg' draggable="false" alt="Добавить ребро (дугу)" /></button>
                    <button className={styles.instruments_btn} title="Удалить вершину"><img src='/icons/del-vertex.svg' draggable="false" alt="Удалить вершину" /></button>
                    <button className={styles.instruments_btn} title="Удалить ребро (дугу)"><img src='/icons/del-edge.svg' draggable="false" alt="Удалить ребро (дугу)" /></button>
                    <button className={styles.instruments_btn} title="Вывести список смежности"><img src='/icons/adjacency-list.svg' draggable="false" alt="Вывести список смежности" /></button>
                </div>
                <GraphView />
            </main>
        </div>
    )
}

export default GraphEditor