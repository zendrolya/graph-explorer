import styles from './GraphEditor.module.css'
import GraphView from './GraphView'
import { Graph } from '../core/Graph.js'


function GraphEditor() {

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
                    <GraphView />
                </div>
            </main>
        </>
    )
}

export default GraphEditor