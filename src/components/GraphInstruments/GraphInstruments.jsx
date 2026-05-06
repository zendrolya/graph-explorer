import styles from "./GraphInstruments.module.css";

function GraphInstruments({
  consoleManagerRef,
  showPopup,
  showDialog,
  currentGraph,
  selectedVertex,
  selectedEdge,
  onAddVertex,
  onAddEdge,
  onDelete,
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
        <img
          src="/icons/add-edge.svg"
          draggable="false"
          alt="Добавить ребро (дугу)"
        />
      </button>
      <button
        className={styles.instruments_btn}
        title="Удалить вершину"
        onClick={onDelete}
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
        onClick={onDelete}
      >
        <img
          src="/icons/del-edge.svg"
          draggable="false"
          alt="Удалить ребро (дугу)"
        />
      </button>
      <button
        className={styles.instruments_btn}
        title="Вывести список смежности"
        onClick={onShowAdjacency}
      >
        <img
          src="/icons/adjacency-list.svg"
          draggable="false"
          alt="Вывести список смежности"
        />
      </button>
    </div>
  );
}

export default GraphInstruments;
