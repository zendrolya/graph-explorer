import styles from "./GraphInstruments.module.css";

function GraphInstruments() {
  return (
    <div className={styles.instruments_panel}>
      <button className={styles.instruments_btn} title="Добавить вершину">
        <img
          src="/icons/add-vertex.svg"
          draggable="false"
          alt="Добавить вершину"
        />
      </button>
      <button className={styles.instruments_btn} title="Добавить ребро (дугу)">
        <img
          src="/icons/add-edge.svg"
          draggable="false"
          alt="Добавить ребро (дугу)"
        />
      </button>
      <button className={styles.instruments_btn} title="Удалить вершину">
        <img
          src="/icons/del-vertex.svg"
          draggable="false"
          alt="Удалить вершину"
        />
      </button>
      <button className={styles.instruments_btn} title="Удалить ребро (дугу)">
        <img
          src="/icons/del-edge.svg"
          draggable="false"
          alt="Удалить ребро (дугу)"
        />
      </button>
      <button
        className={styles.instruments_btn}
        title="Вывести список смежности"
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
