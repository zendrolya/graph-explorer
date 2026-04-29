import styles from "./Dialog.module.css";
import { useState } from "react";

const checked_img = (
  <img
    className={styles.checked_img}
    src="/icons/choosen-graph.svg"
    draggable="false"
    alt="Выбранный граф"
  />
);

function Dialog({
  type,
  onClose,

  // Данные
  graphs = [],
  currentGraph = null,
  vertices = [],

  // Действия
  onConfirm,
  onSelectGraph,
}) {
  /* =========================
     FORM STATE
  ========================= */

  const [graphName, setGraphName] = useState("");
  const [weighted, setWeighted] = useState(false);
  const [directed, setDirected] = useState(false);

  const [fromVertex, setFromVertex] = useState(
    vertices.length ? vertices[0] : "",
  );
  const [toVertex, setToVertex] = useState(vertices.length ? vertices[0] : "");

  const [u1Vertex, setU1Vertex] = useState(vertices.length ? vertices[0] : "");
  const [u2Vertex, setU2Vertex] = useState(vertices.length ? vertices[0] : "");
  const [vVertex, setVVertex] = useState(vertices.length ? vertices[0] : "");

  const [v1Vertex, setV1Vertex] = useState(vertices.length ? vertices[0] : "");
  const [v2Vertex, setV2Vertex] = useState(vertices.length ? vertices[0] : "");

  const [weight, setWeight] = useState("");

  /* =========================
     HELPERS
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!onConfirm) {
      onClose();
      return;
    }

    let result;

    switch (type) {
      case "Создание графа":
        result = onConfirm(graphName.trim(), directed, weighted);
        break;

      case "Удаление графа":
        result = onConfirm();
        break;

      case "Добавление ребра":
        result = onConfirm(
          fromVertex,
          toVertex,
          weight === "" ? undefined : Number(weight),
        );
        break;

      case "Степень вершины графа":
        result = onConfirm(fromVertex);
        break;

      case "Вершины графа, не смежные с данной":
        result = onConfirm(fromVertex);
        break;

      case "Кратчайшие пути до вершины":
        result = onConfirm(toVertex);
        break;

      case "Кратчайшие пути u1, u2 → v":
        result = onConfirm(vVertex, u1Vertex, u2Vertex);
        break;

      case "Кратчайшие пути u → v1, v2":
        result = onConfirm(fromVertex, v1Vertex, v2Vertex);
        break;

      case "Максимальный поток":
        result = onConfirm(fromVertex, toVertex);
        break;

      default:
        result = onConfirm();
        break;
    }

    if (result?.success !== false) {
      onClose();
    }
  };

  const renderVertexOptions = () =>
    vertices.map((vertex) => (
      <option key={vertex} value={vertex}>
        {vertex}
      </option>
    ));

  /* =========================
     DIALOG CONFIG
  ========================= */

  const dialogType = {
    "Создание графа": {
      title: "Создание графа",
      content: (
        <>
          <div className={styles.form_container}>
            <label className={styles.form_label} htmlFor="name">
              Название:
            </label>
            <input
              className={styles.form_name}
              type="text"
              id="name"
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.checkbox_container}>
            <div className={styles.checkbox}>
              <label className={styles.form_checkbox_label} htmlFor="weighted">
                Взвешенный?
              </label>

              <input
                className={styles.form_checkbox}
                type="checkbox"
                id="weighted"
                checked={weighted}
                onChange={(e) => setWeighted(e.target.checked)}
              />
            </div>

            <div className={styles.checkbox}>
              <label className={styles.form_checkbox_label} htmlFor="directed">
                Ориентированный?
              </label>

              <input
                className={styles.form_checkbox}
                type="checkbox"
                id="directed"
                checked={directed}
                onChange={(e) => setDirected(e.target.checked)}
              />
            </div>
          </div>
        </>
      ),
      ok_text: "Создать",
      cancel_text: "Отмена",
    },

    "Удаление графа": {
      title: "Удаление графа",
      content: (
        <div className={styles.form_container}>
          <p className={styles.form_text}>
            Вы уверены, что хотите удалить граф?
          </p>
        </div>
      ),
      ok_text: "Удалить",
      cancel_text: "Отмена",
    },

    "Добавление вершины": {
      title: "Добавление вершины",
      content: (
        <div className={styles.form_container}>
          <p className={styles.form_text}>Добавить новую вершину в граф?</p>
        </div>
      ),
      ok_text: "Добавить",
      cancel_text: "Отмена",
    },

    "Удаление вершины": {
      title: "Удаление вершины",
      content: (
        <div className={styles.form_container}>
          <p className={styles.form_text}>
            Вы уверены, что хотите удалить вершину?
          </p>
        </div>
      ),
      ok_text: "Удалить",
      cancel_text: "Отмена",
    },

    "Добавление ребра": {
      title: "Добавление ребра (дуги)",
      content: (
        <>
          <div className={styles.form_container}>
            <label className={styles.form_label} htmlFor="from">
              Откуда:
            </label>

            <select
              className={styles.form_name}
              id="from"
              value={fromVertex}
              onChange={(e) => setFromVertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>

          <div className={styles.form_container}>
            <label className={styles.form_label} htmlFor="to">
              Куда:
            </label>

            <select
              className={styles.form_name}
              id="to"
              value={toVertex}
              onChange={(e) => setToVertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>

          <div className={styles.form_container}>
            <label className={styles.form_label} htmlFor="weight">
              Вес:
            </label>

            <input
              className={styles.form_weight}
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </>
      ),
      ok_text: "Добавить",
      cancel_text: "Отмена",
    },

    "Удаление ребра": {
      title: "Удаление ребра (дуги)",
      content: (
        <div className={styles.form_container}>
          <p className={styles.form_text}>
            Вы уверены, что хотите удалить ребро?
          </p>
        </div>
      ),
      ok_text: "Удалить",
      cancel_text: "Отмена",
    },

    "Степень вершины графа": {
      title: "Степень вершины графа",
      content: (
        <div className={styles.form_container}>
          <label className={styles.form_label}>Вершина:</label>

          <select
            className={styles.form_name}
            value={fromVertex}
            onChange={(e) => setFromVertex(e.target.value)}
          >
            {renderVertexOptions()}
          </select>
        </div>
      ),
      ok_text: "Найти",
      cancel_text: "Отмена",
    },

    "Вершины графа, не смежные с данной": {
      title: "Несмежные вершины",
      content: (
        <div className={styles.form_container}>
          <label className={styles.form_label}>Вершина:</label>

          <select
            className={styles.form_name}
            value={fromVertex}
            onChange={(e) => setFromVertex(e.target.value)}
          >
            {renderVertexOptions()}
          </select>
        </div>
      ),
      ok_text: "Найти",
      cancel_text: "Отмена",
    },

    "Кратчайшие пути до вершины": {
      title: "Кратчайшие пути",
      content: (
        <div className={styles.form_container}>
          <label className={styles.form_label}>Вершина:</label>

          <select
            className={styles.form_name}
            value={toVertex}
            onChange={(e) => setToVertex(e.target.value)}
          >
            {renderVertexOptions()}
          </select>
        </div>
      ),
      ok_text: "Найти",
      cancel_text: "Отмена",
    },

    "Кратчайшие пути u1, u2 → v": {
      title: "Пути u1, u2 → v",
      content: (
        <>
          <div className={styles.form_container}>
            <label className={styles.form_label}>u1:</label>
            <select
              className={styles.form_name}
              value={u1Vertex}
              onChange={(e) => setU1Vertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>

          <div className={styles.form_container}>
            <label className={styles.form_label}>u2:</label>
            <select
              className={styles.form_name}
              value={u2Vertex}
              onChange={(e) => setU2Vertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>

          <div className={styles.form_container}>
            <label className={styles.form_label}>v:</label>
            <select
              className={styles.form_name}
              value={vVertex}
              onChange={(e) => setVVertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>
        </>
      ),
      ok_text: "Найти",
      cancel_text: "Отмена",
    },

    "Кратчайшие пути u → v1, v2": {
      title: "Пути u → v1, v2",
      content: (
        <>
          <div className={styles.form_container}>
            <label className={styles.form_label}>u:</label>
            <select
              className={styles.form_name}
              value={fromVertex}
              onChange={(e) => setFromVertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>

          <div className={styles.form_container}>
            <label className={styles.form_label}>v1:</label>
            <select
              className={styles.form_name}
              value={v1Vertex}
              onChange={(e) => setV1Vertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>

          <div className={styles.form_container}>
            <label className={styles.form_label}>v2:</label>
            <select
              className={styles.form_name}
              value={v2Vertex}
              onChange={(e) => setV2Vertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>
        </>
      ),
      ok_text: "Найти",
      cancel_text: "Отмена",
    },

    "Список графов": {
      title: "Список графов",
      content: (
        <ol className={styles.graphs_list}>
          {graphs.map((graph, index) => (
            <li
              key={index}
              className={`${styles.graph_list_item} ${
                currentGraph === graph ? styles.checked : ""
              }`}
              onClick={() => onSelectGraph && onSelectGraph(graph)}
            >
              {currentGraph === graph && checked_img}
              {graph.name || `Граф ${index + 1}`}
            </li>
          ))}
        </ol>
      ),
    },

    "Максимальный поток": {
      title: "Максимальный поток",
      content: (
        <>
          <div className={styles.form_container}>
            <label className={styles.form_label}>Источник:</label>
            <select
              className={styles.form_name}
              value={fromVertex}
              onChange={(e) => setFromVertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>

          <div className={styles.form_container}>
            <label className={styles.form_label}>Сток:</label>
            <select
              className={styles.form_name}
              value={toVertex}
              onChange={(e) => setToVertex(e.target.value)}
            >
              {renderVertexOptions()}
            </select>
          </div>
        </>
      ),
      ok_text: "Найти",
      cancel_text: "Отмена",
    },
  };

  const currentDialog = dialogType[type];

  if (!currentDialog) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close_button} onClick={onClose} type="button">
          <img src="/icons/close.svg" draggable="false" alt="Закрыть" />
        </button>

        <h2 className={styles.title}>{currentDialog.title}</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.dialog_content}>{currentDialog.content}</div>

          {currentDialog.ok_text && (
            <div className={styles.buttons}>
              <button type="submit" className={styles.ok_button}>
                {currentDialog.ok_text}
              </button>

              <button
                type="button"
                className={styles.cancel_button}
                onClick={onClose}
              >
                {currentDialog.cancel_text}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Dialog;
