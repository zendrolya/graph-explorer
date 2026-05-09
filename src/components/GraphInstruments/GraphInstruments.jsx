import styles from "./GraphInstruments.module.css";

function GraphInstruments({
  onAddVertex,
  onAddEdge,
  onDeleteVertex,
  onDeleteEdge,
  onShowAdjacency,
}) {
  return (
    <div className={styles.instruments_panel}>
      <button
        className={styles.instruments_btn}
        title="Добавить вершину"
        onClick={onAddVertex}
      >
        <img
          src="/icons/add-vertex.svg"
          draggable="false"
          alt="Добавить вершину"
        />
      </button>

      <button
        className={styles.instruments_btn}
        title="Добавить ребро (дугу)"
        onClick={onAddEdge}
      >
        <img src="/icons/add-edge.svg" draggable="false" alt="Добавить ребро" />
      </button>

      <button
        className={styles.instruments_btn}
        title="Удалить вершину"
        onClick={onDeleteVertex}
      >
        <img
          src="/icons/del-vertex.svg"
          draggable="false"
          alt="Удалить вершину"
        />
      </button>

      <button
        className={styles.instruments_btn}
        title="Удалить ребро (дугу)"
        onClick={onDeleteEdge}
      >
        <img src="/icons/del-edge.svg" draggable="false" alt="Удалить ребро" />
      </button>

      <button
        className={styles.instruments_btn}
        title="Список смежности"
        onClick={onShowAdjacency}
      >
        <img
          src="/icons/adjacency-list.svg"
          draggable="false"
          alt="Список смежности"
        />
      </button>
    </div>
  );
}

export default GraphInstruments;
